import type { FareHarborBookingProviderConfig } from "@/data/saunas/saunas";
import type { AppointmentTypeAvailability, AvailabilitySlot } from "../types";

interface FareHarborItemResponse {
  pk: number;
  name: string;
  headline: string;
  is_archived: boolean;
  is_private: boolean;
  is_retail: boolean;
}

interface FareHarborAvailabilityResponse {
  pk: number;
  start_at: string;
  end_at: string;
  approximate_available_capacity: number;
  is_bookable: boolean;
  is_waitlist: boolean;
  is_sold_out: boolean;
}

const FAREHARBOR_API_BASE = "https://fareharbor.com/api/v1";

/**
 * Parse duration and price from a FareHarbor item headline.
 * Examples:
 *   "75 minutes . Starting at $56.29 per person"
 *   "2 Hours . Starting at $75.02 per person"
 *   "45 Mins . Starting at $28.72 per person"
 */
function parseFareHarborHeadline(headline: string): {
  durationMinutes: number | null;
  price: number | null;
} {
  let durationMinutes: number | null = null;
  let price: number | null = null;

  // Match numeric durations: "75 minutes", "2 Hours", "45 Mins"
  const numDurMatch = headline.match(/(\d+)\s*(minutes?|mins?|hours?)/i);
  if (numDurMatch) {
    const value = parseInt(numDurMatch[1], 10);
    const unit = numDurMatch[2].toLowerCase();
    durationMinutes = unit.startsWith("hour") ? value * 60 : value;
  } else {
    // Match word-form hours: "Four hours", "Five hours"
    const wordHours: Record<string, number> = {
      one: 1, two: 2, three: 3, four: 4, five: 5,
      six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
    };
    const wordDurMatch = headline.match(
      /\b(one|two|three|four|five|six|seven|eight|nine|ten)\s+hours?\b/i
    );
    if (wordDurMatch) {
      const hours = wordHours[wordDurMatch[1].toLowerCase()];
      if (hours) durationMinutes = hours * 60;
    }
  }

  const priceMatch = headline.match(/\$(\d+(?:\.\d+)?)/);
  if (priceMatch) {
    price = parseFloat(priceMatch[1]);
  }

  return { durationMinutes, price };
}

export async function fetchFareHarborAvailability(
  provider: FareHarborBookingProviderConfig,
  startDate: string
): Promise<AppointmentTypeAvailability[]> {
  // Fetch items list from the API
  const itemsRes = await fetch(
    `${FAREHARBOR_API_BASE}/companies/${provider.shortname}/items/`,
    { next: { revalidate: 300 } }
  );
  if (!itemsRes.ok) {
    throw new Error(`FareHarbor items API returned ${itemsRes.status}`);
  }
  const itemsData = await itemsRes.json();
  const apiItems: FareHarborItemResponse[] = itemsData.items ?? [];
  const apiItemMap = new Map(apiItems.map((i) => [i.pk, i]));

  // Determine which items to fetch availability for
  let itemsToFetch: Array<{
    pk: number;
    name: string;
    price?: number;
    durationMinutes: number;
    private?: boolean;
    seats?: number;
  }>;

  if (provider.items && provider.items.length > 0) {
    // Use explicitly configured items with overrides
    itemsToFetch = provider.items.map((configured) => {
      const apiItem = apiItemMap.get(configured.itemPk);
      const parsed = apiItem
        ? parseFareHarborHeadline(apiItem.headline)
        : { durationMinutes: null, price: null };
      return {
        pk: configured.itemPk,
        name: configured.name ?? apiItem?.name ?? `Item ${configured.itemPk}`,
        price: configured.price ?? parsed.price ?? undefined,
        durationMinutes:
          configured.durationMinutes ?? parsed.durationMinutes ?? 60,
        private: configured.private,
        seats: configured.seats,
      };
    });
  } else {
    // Auto-discover: filter out archived, private, retail items (gift cards,
    // memberships, session packs), and explicitly excluded items
    const excludeSet = new Set(provider.excludeItemPks ?? []);
    itemsToFetch = apiItems
      .filter(
        (item) =>
          !item.is_archived &&
          !item.is_private &&
          !item.is_retail &&
          !excludeSet.has(item.pk)
      )
      .map((item) => {
        const parsed = parseFareHarborHeadline(item.headline);
        return {
          pk: item.pk,
          name: item.name,
          price: parsed.price ?? undefined,
          durationMinutes: parsed.durationMinutes ?? 60,
        };
      });
  }

  if (itemsToFetch.length === 0) {
    return [];
  }

  // Generate date strings for the 7-day window
  const from = new Date(startDate);
  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(from);
    d.setDate(d.getDate() + i);
    dates.push(d.toISOString().split("T")[0]);
  }

  // Fetch availability for each item x date in parallel
  const results = await Promise.all(
    itemsToFetch.map(async (item) => {
      const dateResults = await Promise.all(
        dates.map(async (date) => {
          const url = `${FAREHARBOR_API_BASE}/companies/${provider.shortname}/items/${item.pk}/availabilities/date/${date}/`;
          const res = await fetch(url, { next: { revalidate: 300 } });
          if (!res.ok) {
            console.error(
              `FareHarbor availability API returned ${res.status} for item ${item.pk} date ${date}`
            );
            return {
              date,
              availabilities: [] as FareHarborAvailabilityResponse[],
            };
          }
          const data = await res.json();
          return {
            date,
            availabilities: (data.availabilities ??
              []) as FareHarborAvailabilityResponse[],
          };
        })
      );

      // Normalize to AppointmentTypeAvailability format
      const slotDates: Record<string, AvailabilitySlot[]> = {};
      for (const { date, availabilities } of dateResults) {
        const bookableSlots = availabilities.filter(
          (a) => a.is_bookable && !a.is_sold_out && !a.is_waitlist
        );
        if (bookableSlots.length === 0) continue;

        slotDates[date] = bookableSlots.map((a) => ({
          time: a.start_at,
          slotsAvailable:
            a.approximate_available_capacity > 0
              ? a.approximate_available_capacity
              : null,
        }));
      }

      return {
        appointmentTypeId: String(item.pk),
        name: item.name,
        price: item.price,
        durationMinutes: item.durationMinutes,
        ...(item.private && { private: item.private }),
        ...(item.seats != null && { seats: item.seats }),
        dates: slotDates,
      };
    })
  );

  // Filter out items with no availability
  return results.filter((r) => Object.keys(r.dates).length > 0);
}
