import type { AcuityBookingProviderConfig } from "@/data/saunas/saunas";
import type { AppointmentTypeAvailability, AvailabilitySlot } from "../types";

export async function fetchAcuityAvailability(
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
