import { NextRequest } from "next/server";
import { z } from "zod";
import {
  getSaunaBySlug,
  type AcuityBookingProviderConfig,
  type WixBookingProviderConfig,
  type GlofoxBookingProviderConfig,
  type FareHarborBookingProviderConfig,
} from "@/data/saunas/saunas";

export interface AvailabilitySlot {
  time: string;
  slotsAvailable: number | null;
}

export interface AppointmentTypeAvailability {
  appointmentTypeId: string;
  name: string;
  price: number;
  durationMinutes: number;
  private?: boolean;
  seats?: number;
  dates: Record<string, AvailabilitySlot[]>;
}

export interface AvailabilityResponse {
  appointmentTypes: AppointmentTypeAvailability[];
}

const querySchema = z.object({
  slug: z.string().min(1),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

async function fetchAcuityAvailability(
  provider: AcuityBookingProviderConfig,
  startDate: string
): Promise<AppointmentTypeAvailability[]> {
  const results = await Promise.all(
    provider.appointmentTypes.map(async (apt) => {
      const url = new URL(
        "https://app.squarespacescheduling.com/api/scheduling/v1/availability/times"
      );
      url.searchParams.set("owner", provider.owner);
      url.searchParams.set("appointmentTypeId", String(apt.acuityAppointmentId));
      url.searchParams.set("calendarId", String(apt.acuityCalendarId));
      url.searchParams.set("startDate", startDate);
      url.searchParams.set("timezone", provider.timezone);

      const res = await fetch(url.toString(), {
        next: { revalidate: 300 },
      });

      if (!res.ok) {
        throw new Error(`Acuity API returned ${res.status} for type ${apt.acuityAppointmentId}`);
      }

      const raw: Record<
        string,
        Array<{ time: string; slotsAvailable: number }>
      > = await res.json();

      const dates: Record<string, AvailabilitySlot[]> = {};
      for (const [date, slots] of Object.entries(raw)) {
        dates[date] = slots.map((s) => ({
          time: s.time,
          slotsAvailable: s.slotsAvailable,
        }));
      }

      return {
        appointmentTypeId: String(apt.acuityAppointmentId),
        name: apt.name,
        price: apt.price,
        durationMinutes: apt.durationMinutes,
        ...(apt.private && { private: apt.private }),
        ...(apt.seats != null && { seats: apt.seats }),
        dates,
      };
    })
  );

  return results;
}

const WIX_BOOKINGS_APP_ID = "13d21c63-b5ec-5912-8397-c3a5ddb27a97";

async function fetchWixInstanceToken(siteUrl: string): Promise<string> {
  const res = await fetch(`https://${siteUrl}/_api/v2/dynamicmodel`, {
    headers: { Accept: "application/json" },
    next: { revalidate: 300 },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch Wix dynamic model: ${res.status}`);
  }
  const data = await res.json();
  const token = data?.apps?.[WIX_BOOKINGS_APP_ID]?.instance;
  if (!token) {
    throw new Error("Wix bookings instance token not found");
  }
  return token;
}

interface WixTimeSlot {
  serviceId: string;
  localStartDate: string;
  localEndDate: string;
  bookable: boolean;
  totalCapacity: number;
  remainingCapacity: number;
}

async function fetchWixAvailability(
  provider: WixBookingProviderConfig,
  startDate: string
): Promise<AppointmentTypeAvailability[]> {
  const token = await fetchWixInstanceToken(provider.siteUrl);

  const from = new Date(startDate);
  const to = new Date(from);
  to.setDate(to.getDate() + 6);

  const fromLocal = `${startDate}T00:00:00`;
  const toLocal = `${to.toISOString().split("T")[0]}T23:59:59`;

  const res = await fetch(
    `https://${provider.siteUrl}/_api/service-availability/v2/time-slots/event`,
    {
      method: "POST",
      headers: {
        authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        timeZone: provider.timezone,
        fromLocalDate: fromLocal,
        toLocalDate: toLocal,
        serviceIds: provider.services.map((s) => s.serviceId),
        includeNonBookable: true,
        eventFilter: {},
        cursorPaging: { limit: 1000 },
      }),
      next: { revalidate: 300 },
    }
  );

  if (!res.ok) {
    throw new Error(`Wix availability API returned ${res.status}`);
  }

  const data = await res.json();
  const timeSlots: WixTimeSlot[] = data.timeSlots ?? [];

  // Group slots by serviceId, then by date
  const serviceMap = new Map<string, Record<string, AvailabilitySlot[]>>();
  for (const slot of timeSlots) {
    const dateKey = slot.localStartDate.split("T")[0];
    if (!serviceMap.has(slot.serviceId)) {
      serviceMap.set(slot.serviceId, {});
    }
    const dates = serviceMap.get(slot.serviceId)!;
    if (!dates[dateKey]) {
      dates[dateKey] = [];
    }
    dates[dateKey].push({
      time: slot.localStartDate,
      slotsAvailable: slot.remainingCapacity,
    });
  }

  return provider.services
    .filter((svc) => serviceMap.has(svc.serviceId))
    .map((svc) => ({
      appointmentTypeId: svc.serviceId,
      name: svc.name,
      price: svc.price,
      durationMinutes: svc.durationMinutes,
      ...(svc.private && { private: svc.private }),
      ...(svc.seats != null && { seats: svc.seats }),
      dates: serviceMap.get(svc.serviceId) ?? {},
    }));
}

async function fetchGlofoxGuestToken(branchId: string): Promise<string> {
  const res = await fetch("https://api.glofox.com/2.0/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      branch_id: branchId,
      login: "guest",
      password: "guest",
    }),
    next: { revalidate: 300 },
  });
  if (!res.ok) {
    throw new Error(`Glofox guest login failed: ${res.status}`);
  }
  const data = await res.json();
  if (!data.token) {
    throw new Error("Glofox guest login did not return a token");
  }
  return data.token;
}

interface GlofoxEvent {
  _id: string;
  name: string;
  time_start: number;
  duration: number;
  size: number;
  booked: number;
  facility: string;
  program_id: string;
  program_obj?: {
    pricing?: Array<{ price: number; type: string }>;
  };
}

async function fetchGlofoxAvailability(
  provider: GlofoxBookingProviderConfig,
  startDate: string
): Promise<AppointmentTypeAvailability[]> {
  const token = await fetchGlofoxGuestToken(provider.branchId);

  const from = new Date(startDate);
  const to = new Date(from);
  to.setDate(to.getDate() + 6);

  const startUnix = Math.floor(from.getTime() / 1000);
  const endUnix = Math.floor(to.getTime() / 1000) + 86400 - 1;

  // Fetch all pages of events
  let allEvents: GlofoxEvent[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const url = new URL("https://api.glofox.com/2.0/events");
    url.searchParams.set("start", String(startUnix));
    url.searchParams.set("end", String(endUnix));
    url.searchParams.set("include", "program,users_booked");
    url.searchParams.set("page", String(page));
    url.searchParams.set("private", "false");
    url.searchParams.set("sort_by", "time_start");

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      throw new Error(`Glofox events API returned ${res.status}`);
    }

    const data = await res.json();
    allEvents = allEvents.concat(data.data ?? []);
    hasMore = data.has_more === true;
    page++;
  }

  // Filter events to this facility
  const facilityEvents = allEvents.filter(
    (e) => e.facility === provider.facilityId
  );

  // Group by program_id
  const programMap = new Map<
    string,
    { name: string; price: number; duration: number; events: GlofoxEvent[] }
  >();

  for (const event of facilityEvents) {
    if (!programMap.has(event.program_id)) {
      const apiPrice =
        event.program_obj?.pricing?.find((p) => p.type === "payg")?.price ?? 0;
      const price = provider.priceOverrides?.[event.program_id] ?? apiPrice;
      programMap.set(event.program_id, {
        name: event.name,
        price: price,
        duration: event.duration,
        events: [],
      });
    }
    programMap.get(event.program_id)!.events.push(event);
  }

  // Convert to AppointmentTypeAvailability format
  return Array.from(programMap.entries()).map(([programId, program]) => {
    const dates: Record<string, AvailabilitySlot[]> = {};

    for (const event of program.events) {
      // Convert unix timestamp to local time in the configured timezone
      const eventDate = new Date(event.time_start * 1000);
      const localDateStr = eventDate.toLocaleDateString("en-CA", {
        timeZone: provider.timezone,
      });
      const localTimeStr = eventDate.toLocaleString("sv-SE", {
        timeZone: provider.timezone,
      });

      if (!dates[localDateStr]) {
        dates[localDateStr] = [];
      }
      dates[localDateStr].push({
        time: localTimeStr,
        slotsAvailable: Math.max(0, event.size - event.booked),
      });
    }

    const privateSeats = provider.privatePrograms?.[programId];
    return {
      appointmentTypeId: programId,
      name: program.name,
      price: program.price,
      durationMinutes: program.duration,
      ...(privateSeats != null && { private: true, seats: privateSeats }),
      dates,
    };
  });
}

// --- FareHarbor types (public API response shapes) ---

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

async function fetchFareHarborAvailability(
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
    price: number;
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
        price: configured.price ?? parsed.price ?? 0,
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
          price: parsed.price ?? 0,
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

export async function GET(request: NextRequest) {
  const parsed = querySchema.safeParse({
    slug: request.nextUrl.searchParams.get("slug"),
    startDate: request.nextUrl.searchParams.get("startDate"),
  });

  if (!parsed.success) {
    return Response.json(
      { error: "Invalid parameters", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { slug, startDate } = parsed.data;
  const sauna = getSaunaBySlug(slug);

  if (!sauna?.bookingProvider) {
    return Response.json(
      { error: "Sauna not found or has no availability provider" },
      { status: 404 }
    );
  }

  try {
    const provider = sauna.bookingProvider;
    let appointmentTypes: AppointmentTypeAvailability[];

    switch (provider.type) {
      case "acuity":
        appointmentTypes = await fetchAcuityAvailability(provider, startDate);
        break;
      case "wix":
        appointmentTypes = await fetchWixAvailability(provider, startDate);
        break;
      case "glofox":
        appointmentTypes = await fetchGlofoxAvailability(provider, startDate);
        break;
      case "fareharbor":
        appointmentTypes = await fetchFareHarborAvailability(
          provider,
          startDate
        );
        break;
    }

    return Response.json({ appointmentTypes } satisfies AvailabilityResponse);
  } catch (err) {
    console.error("Availability fetch error:", err);
    return Response.json(
      { error: "Failed to fetch availability" },
      { status: 502 }
    );
  }
}
