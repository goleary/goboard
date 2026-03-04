import type { ClinicSenseBookingProviderConfig } from "@/data/saunas/saunas";
import type { AppointmentTypeAvailability, AvailabilitySlot } from "../types";

export async function fetchClinicSenseAvailability(
  provider: ClinicSenseBookingProviderConfig,
  startDate: string
): Promise<AppointmentTypeAvailability[]> {
  const results = await Promise.all(
    provider.services.map(async (svc) => {
      const url = `https://${provider.slug}.clinicsense.com/api/2/appointment-booker/calendar/?service_duration_id=${svc.serviceDurationId}&date=${startDate}`;

      const res = await fetch(url, { next: { revalidate: 300 } });
      if (!res.ok) {
        throw new Error(
          `ClinicSense calendar API returned ${res.status} for service ${svc.serviceDurationId}`
        );
      }

      // Response format: { "YYYY-MM-DD": [["HH:MM:SS", [practitioner_ids]], ...], ... }
      const data: Record<string, [string, number[]][]> = await res.json();

      const dates: Record<string, AvailabilitySlot[]> = {};
      for (const [dateStr, timeEntries] of Object.entries(data)) {
        if (!timeEntries || timeEntries.length === 0) continue;

        dates[dateStr] = timeEntries.map(([time, practitioners]) => ({
          time: `${dateStr} ${time}`,
          slotsAvailable: practitioners.length,
        }));
      }

      return {
        appointmentTypeId: String(svc.serviceDurationId),
        name: svc.name,
        price: svc.price,
        durationMinutes: svc.durationMinutes,
        dates,
      };
    })
  );

  return results;
}
