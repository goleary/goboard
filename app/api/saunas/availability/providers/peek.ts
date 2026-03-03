import type { PeekBookingProviderConfig } from "@/data/saunas/saunas";
import type { AppointmentTypeAvailability, AvailabilitySlot } from "../types";

interface PeekAvailabilityTime {
  id: string;
  type: "availability-time";
  attributes: {
    date: string; // "2026-03-01"
    time: string; // "3:00PM" or "12:15PM" (12h format)
    end: string; // "4:30PM"
    spots: number;
    price: { amount: string; currency: string };
    duration: { amount: number; unit: string }; // { amount: 90, unit: "minute" }
    "availability-mode": string; // "available" | "sold_out"
  };
}

/**
 * Convert Peek 12h time format (e.g. "3:00PM", "12:15AM") to 24h format "HH:MM:00"
 */
function peekTimeTo24h(time12: string): string {
  const match = time12.match(/^(\d{1,2}):(\d{2})(AM|PM)$/i);
  if (!match) return time12;
  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  const period = match[3].toUpperCase();
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return `${String(hours).padStart(2, "0")}:${minutes}:00`;
}

interface PeekAvailabilityDate {
  id: string;
  type: "availability-date";
  attributes: {
    date: string; // "2026-03-01"
    "num-start-times": number;
  };
  relationships?: {
    "availability-times"?: {
      data: Array<{ id: string; type: string }>;
    };
  };
}

interface PeekAvailabilityResponse {
  data: PeekAvailabilityDate[];
  included?: PeekAvailabilityTime[];
}

export async function fetchPeekAvailability(
  provider: PeekBookingProviderConfig,
  startDate: string
): Promise<AppointmentTypeAvailability[]> {
  const from = new Date(startDate);
  const to = new Date(from);
  to.setDate(to.getDate() + 6);
  const endDate = to.toISOString().split("T")[0];

  const results = await Promise.all(
    provider.activities.map(async (activity) => {
      const url = new URL(
        "https://book.peek.com/services/api/availability-dates"
      );
      url.searchParams.set("activity-id", activity.activityId);
      url.searchParams.set("start-date", startDate);
      url.searchParams.set("end-date", endDate);
      url.searchParams.set("include", "availability-times");

      const res = await fetch(url.toString(), {
        headers: {
          Authorization: `Key ${provider.key}`,
          Accept: "application/vnd.api+json",
        },
        next: { revalidate: 300 },
      });

      if (!res.ok) {
        throw new Error(
          `Peek availability API returned ${res.status} for activity ${activity.activityId}`
        );
      }

      const data: PeekAvailabilityResponse = await res.json();

      // Build a lookup of included availability-times by ID
      const timeMap = new Map<string, PeekAvailabilityTime>();
      for (const included of data.included ?? []) {
        if (included.type === "availability-time") {
          timeMap.set(included.id, included);
        }
      }

      const dates: Record<string, AvailabilitySlot[]> = {};
      let inferredDuration = activity.durationMinutes;
      let inferredPrice = activity.price;

      for (const dateEntry of data.data) {
        const dateStr = dateEntry.attributes.date;
        const timeRefs =
          dateEntry.relationships?.["availability-times"]?.data ?? [];

        const slots: AvailabilitySlot[] = [];
        for (const ref of timeRefs) {
          const timeData = timeMap.get(ref.id);
          if (!timeData) continue;

          const attrs = timeData.attributes;
          if (attrs["availability-mode"] === "sold_out") continue;

          // Convert 12h time (e.g. "3:00PM") to 24h format
          const time24 = peekTimeTo24h(attrs.time);

          slots.push({
            time: `${dateStr} ${time24}`,
            slotsAvailable: attrs.spots > 0 ? attrs.spots : null,
          });

          // Infer duration and price from API if not configured
          if (!inferredDuration && attrs.duration?.amount) {
            inferredDuration = attrs.duration.amount;
          }
          if (inferredPrice == null && attrs.price?.amount) {
            const parsed = parseFloat(attrs.price.amount);
            if (parsed > 0) inferredPrice = parsed;
          }
        }

        if (slots.length > 0) {
          dates[dateStr] = slots;
        }
      }

      return {
        appointmentTypeId: activity.activityId,
        name: activity.name,
        price: inferredPrice,
        durationMinutes: inferredDuration ?? 60,
        ...(activity.private && { private: activity.private }),
        ...(activity.seats != null && { seats: activity.seats }),
        dates,
      };
    })
  );

  return results;
}
