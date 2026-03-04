import type { ZenotiBookingProviderConfig } from "@/data/saunas/saunas";
import type { AppointmentTypeAvailability, AvailabilitySlot } from "../types";

async function fetchZenotiWebstoreToken(
  subdomain: string,
  centerId: string
): Promise<{ webApiUrl: string; webApiToken: string }> {
  const res = await fetch(
    `https://${subdomain}.zenoti.com/webstoreNew/services/${centerId}`,
    { next: { revalidate: 300 } }
  );
  if (!res.ok) {
    throw new Error(`Zenoti webstore page returned ${res.status}`);
  }
  const html = await res.text();

  // Extract specific fields from globalJson in inline script.
  // The globalJson object is very large with nested braces, so we extract
  // individual fields via targeted regex rather than parsing the full object.
  const webApiUrlMatch = html.match(/"webApiUrl"\s*:\s*"([^"]+)"/);
  const webApiTokenMatch = html.match(/"webApiToken"\s*:\s*"([^"]+)"/);
  if (!webApiUrlMatch || !webApiTokenMatch) {
    throw new Error("Could not find webApiUrl/webApiToken in Zenoti webstore page");
  }
  const webApiUrl = webApiUrlMatch[1];
  const webApiToken = webApiTokenMatch[1];
  if (!webApiUrl || !webApiToken) {
    throw new Error("Zenoti webstore page missing webApiUrl or webApiToken");
  }
  return { webApiUrl, webApiToken };
}

interface ZenotiSlot {
  Time: string;
  Available: boolean;
}

export async function fetchZenotiAvailability(
  provider: ZenotiBookingProviderConfig,
  startDate: string
): Promise<AppointmentTypeAvailability[]> {
  const { webApiUrl, webApiToken } = await fetchZenotiWebstoreToken(
    provider.subdomain,
    provider.centerId
  );

  // Build 7 days of dates
  const dates: string[] = [];
  const from = new Date(startDate);
  for (let i = 0; i < 7; i++) {
    const d = new Date(from);
    d.setDate(d.getDate() + i);
    dates.push(d.toISOString().split("T")[0]);
  }

  // Fetch availability for each service across all 7 days in parallel
  const results = await Promise.all(
    provider.services.map(async (svc) => {
      const dayResults = await Promise.all(
        dates.map(async (date) => {
          const res = await fetch(
            `${webApiUrl}api/Catalog/Appointments/Availabletimes`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `bearer ${webApiToken}`,
              },
              body: JSON.stringify({
                CenterId: provider.centerId,
                CenterDate: date,
                SlotBookings: [
                  {
                    Services: [{ Service: { Id: svc.serviceId } }],
                    TherapistId: "00000000-0000-0000-0000-000000000000",
                  },
                ],
              }),
              next: { revalidate: 300 },
            }
          );

          if (!res.ok) {
            throw new Error(
              `Zenoti availability API returned ${res.status} for ${date}`
            );
          }

          const data = await res.json();
          const openSlots: ZenotiSlot[] = data.OpenSlots ?? [];
          return {
            date,
            slots: openSlots
              .filter((s: ZenotiSlot) => s.Available)
              .map((s: ZenotiSlot) => ({
                time: s.Time,
                slotsAvailable: null as number | null,
              })),
          };
        })
      );

      const dateMap: Record<string, AvailabilitySlot[]> = {};
      for (const { date, slots } of dayResults) {
        if (slots.length > 0) {
          dateMap[date] = slots;
        }
      }

      return {
        appointmentTypeId: svc.serviceId,
        name: svc.name,
        price: svc.price,
        durationMinutes: svc.durationMinutes,
        dates: dateMap,
      };
    })
  );

  return results;
}
