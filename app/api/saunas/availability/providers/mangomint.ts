import type { MangomintBookingProviderConfig } from "@/data/saunas/saunas";
import type { AppointmentTypeAvailability, AvailabilitySlot } from "../types";

interface MangomintStartupResponse {
  appInstanceId: string;
  companyId: number;
  timezoneId: string;
}

interface MangomintAvailabilityDay {
  morningAvailableSlots: { startAtLocal: string }[];
  afternoonAvailableSlots: { startAtLocal: string }[];
  eveningAvailableSlots: { startAtLocal: string }[];
}

export async function fetchMangomintAvailability(
  provider: MangomintBookingProviderConfig,
  startDate: string
): Promise<AppointmentTypeAvailability[]> {
  // Step 1: Get appInstanceId from startup
  const startupRes = await fetch(
    "https://booking.mangomint.com/api/v1/booking/app/startup",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Mt-Booking-CompanyId": String(provider.companyId),
      },
      body: "{}",
      next: { revalidate: 300 },
    }
  );

  if (!startupRes.ok) {
    throw new Error(`Mangomint startup API returned ${startupRes.status}`);
  }

  const startup: MangomintStartupResponse = await startupRes.json();

  // Step 2: Fetch availability for each service
  const results = await Promise.all(
    provider.services.map(async (svc) => {
      const res = await fetch(
        "https://booking.mangomint.com/api/v1/booking/service-providers/availability",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-Mt-Booking-CompanyId": String(provider.companyId),
            "X-Mt-App-Instance-Id": startup.appInstanceId,
          },
          body: JSON.stringify({
            startDate,
            numDays: 7,
            initialLoad: true,
            services: [
              {
                serviceId: svc.serviceId,
                staffId: null,
                staffCategory: "Any",
                additionalStaffId: null,
                additionalStaffCategory: null,
                serviceOptionIds: [],
                guestIndex: 0,
              },
            ],
          }),
          next: { revalidate: 300 },
        }
      );

      if (!res.ok) {
        throw new Error(
          `Mangomint availability API returned ${res.status} for service ${svc.serviceId}`
        );
      }

      const data = await res.json();
      const daysByDate: Record<string, MangomintAvailabilityDay> =
        data.availabilityByDays ?? {};

      const dates: Record<string, AvailabilitySlot[]> = {};

      for (const [dateKey, day] of Object.entries(daysByDate)) {
        const dayData = day as MangomintAvailabilityDay;
        const allSlots = [
          ...dayData.morningAvailableSlots,
          ...dayData.afternoonAvailableSlots,
          ...dayData.eveningAvailableSlots,
        ];

        if (allSlots.length === 0) continue;

        dates[dateKey] = allSlots.map((slot) => ({
          time: slot.startAtLocal,
          slotsAvailable: null,
        }));
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
