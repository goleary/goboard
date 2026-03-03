import type { BookerBookingProviderConfig } from "@/data/saunas/saunas";
import type { AppointmentTypeAvailability, AvailabilitySlot } from "../types";

const BOOKER_SUBSCRIPTION_KEY = "b8c686e771ac4e4a8173d8177e4e1c8c";

async function fetchBookerToken(): Promise<string> {
  const res = await fetch(
    "https://api.booker.com/cf2/v5/auth/connect/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Ocp-Apim-Subscription-Key": BOOKER_SUBSCRIPTION_KEY,
      },
      body: "",
      next: { revalidate: 3600 },
    }
  );
  if (!res.ok) {
    throw new Error(`Booker token endpoint returned ${res.status}`);
  }
  const data = await res.json();
  return data.access_token;
}

interface BookerAvailabilitySlot {
  startDateTime: string;
  endDateTime: string;
  employees: string[];
}

interface BookerServiceAvailability {
  serviceId: number;
  duration: number;
  price: number;
  requiresStaff: boolean;
  availability: BookerAvailabilitySlot[];
}

interface BookerServiceCategory {
  serviceCategoryId: number;
  serviceCategoryName: string;
  services: BookerServiceAvailability[];
}

interface BookerAvailabilityResponse {
  locationId: number;
  serviceCategories: BookerServiceCategory[];
}

export async function fetchBookerAvailability(
  provider: BookerBookingProviderConfig,
  startDate: string
): Promise<AppointmentTypeAvailability[]> {
  const token = await fetchBookerToken();

  // Build 7-day date range
  const from = new Date(startDate);
  const to = new Date(from);
  to.setDate(to.getDate() + 6);

  const fromISO = from.toISOString().split("T")[0];
  const toISO = to.toISOString().split("T")[0];

  // Fetch availability for each service in parallel
  const results = await Promise.all(
    provider.services.map(async (svc) => {
      const url = new URL(
        "https://api.booker.com/cf2/v5/availability/availability"
      );
      url.searchParams.set("IncludeEmployees", "true");
      url.searchParams.append("locationIds[]", String(provider.locationId));
      url.searchParams.set("serviceId", String(svc.serviceId));
      url.searchParams.set(
        "fromDateTime",
        `${fromISO}T00:00:00`
      );
      url.searchParams.set(
        "toDateTime",
        `${toISO}T23:59:00`
      );

      const res = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
          "Ocp-Apim-Subscription-Key": BOOKER_SUBSCRIPTION_KEY,
        },
        next: { revalidate: 300 },
      });

      if (!res.ok) {
        throw new Error(
          `Booker availability API returned ${res.status} for service ${svc.serviceId}`
        );
      }

      const data: BookerAvailabilityResponse[] = await res.json();

      // Group slots by date
      const dateMap: Record<string, AvailabilitySlot[]> = {};
      for (const location of data) {
        for (const cat of location.serviceCategories) {
          for (const service of cat.services) {
            for (const slot of service.availability) {
              const date = slot.startDateTime.split("T")[0];
              if (!dateMap[date]) {
                dateMap[date] = [];
              }
              dateMap[date].push({
                time: slot.startDateTime,
                slotsAvailable: null,
              });
            }
          }
        }
      }

      return {
        appointmentTypeId: String(svc.serviceId),
        name: svc.name,
        price: svc.price,
        durationMinutes: svc.durationMinutes,
        dates: dateMap,
      };
    })
  );

  return results;
}
