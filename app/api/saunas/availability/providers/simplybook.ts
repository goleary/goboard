import type { SimplyBookBookingProviderConfig } from "@/data/saunas/saunas";
import type { AppointmentTypeAvailability, AvailabilitySlot } from "../types";

interface SimplyBookSlot {
  id: string;
  date: string;
  time: string;
  type: "free" | "busy";
  slots_count: number;
}

export async function fetchSimplyBookAvailability(
  provider: SimplyBookBookingProviderConfig,
  startDate: string
): Promise<AppointmentTypeAvailability[]> {
  const from = new Date(startDate);
  const to = new Date(from);
  to.setDate(to.getDate() + 6);
  const toDate = to.toISOString().split("T")[0];

  const results = await Promise.all(
    provider.services.map(async (svc) => {
      const url = new URL(
        `https://${provider.companySlug}.simplybook.me/v2/booking/time-slots/`
      );
      url.searchParams.set("from", startDate);
      url.searchParams.set("to", toDate);
      url.searchParams.set("provider", "any");
      url.searchParams.set("service", String(svc.serviceId));
      url.searchParams.set("count", "1");

      const res = await fetch(url.toString(), {
        next: { revalidate: 300 },
      });

      if (!res.ok) {
        throw new Error(
          `SimplyBook API returned ${res.status} for service ${svc.serviceId}`
        );
      }

      const slots: SimplyBookSlot[] = await res.json();

      // Group free slots by date
      const dates: Record<string, AvailabilitySlot[]> = {};
      for (const slot of slots) {
        if (slot.type !== "free") continue;
        if (!dates[slot.date]) {
          dates[slot.date] = [];
        }
        dates[slot.date].push({
          time: `${slot.date} ${slot.time}`,
          slotsAvailable: slot.slots_count,
        });
      }

      return {
        appointmentTypeId: String(svc.serviceId),
        name: svc.name,
        price: svc.price,
        durationMinutes: svc.durationMinutes,
        dates,
      };
    })
  );

  return results;
}
