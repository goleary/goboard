import type { SquareBookingProviderConfig } from "@/data/saunas/saunas";
import type { AppointmentTypeAvailability, AvailabilitySlot } from "../types";

interface SquareWidgetService {
  id: string;
  name: string;
  description: string;
  variations: {
    id: string;
    name: string;
    price_cents: number;
    service_time: number; // seconds
    staff_ids: string[];
  }[];
}

interface SquareWidgetStaff {
  id: string;
  employee_token: string;
  display_name: string;
}

interface SquareWidgetData {
  id: string;
  unit_token: string;
  business: {
    name: string;
    timezone: string;
    merchant_token: string;
  };
  services: SquareWidgetService[];
  staff: SquareWidgetStaff[];
}

async function fetchSquareWidgetData(
  widgetId: string,
  locationToken: string
): Promise<SquareWidgetData> {
  const url = `https://book.squareup.com/appointments/${widgetId}/location/${locationToken}/services`;
  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) {
    throw new Error(`Square booking page returned ${res.status}`);
  }
  const html = await res.text();

  // Extract <meta name="widget" content="..."> tag
  const metaMatch = html.match(
    /<meta\s+name="widget"\s+content="([^"]*)"/
  );
  if (!metaMatch) {
    throw new Error("Could not find widget meta tag in Square booking page");
  }

  // HTML-unescape the content attribute
  const escaped = metaMatch[1];
  const unescaped = escaped
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/");

  return JSON.parse(unescaped);
}

interface SquareAvailabilitySlot {
  start: number; // unix timestamp (seconds)
  end: number;
  available: boolean;
  staff_id: string;
}

export async function fetchSquareAvailability(
  provider: SquareBookingProviderConfig,
  startDate: string
): Promise<AppointmentTypeAvailability[]> {
  const widget = await fetchSquareWidgetData(
    provider.widgetId,
    provider.locationToken
  );

  // Build staff employee_token lookup
  const staffTokenMap = new Map<string, string>();
  for (const s of widget.staff) {
    staffTokenMap.set(s.id, s.employee_token);
  }

  const from = new Date(startDate);
  const to = new Date(from);
  to.setDate(to.getDate() + 7);

  // Filter to requested services if configured
  const filteredServices = provider.serviceNames
    ? widget.services.filter((svc) => provider.serviceNames!.includes(svc.name))
    : widget.services;

  // Serialize requests to avoid Square's rate limiting (429s)
  const variations = filteredServices
    .filter((svc) => svc.variations.length > 0)
    .flatMap((svc) => {
      const eligible = svc.variations.filter((v) => v.service_time > 0);
      if (provider.oneVariationPerService) {
        // Only take the first variation with staff to represent the service
        const first = eligible[0];
        return first ? [{ svc, variation: first }] : [];
      }
      return eligible.map((variation) => ({ svc, variation }));
    });

  const results: (AppointmentTypeAvailability | null)[] = [];
  for (const { svc, variation } of variations) {
    const employeeTokens = variation.staff_ids
      .map((id) => staffTokenMap.get(id))
      .filter((t): t is string => !!t);

    if (employeeTokens.length === 0) {
      results.push(null);
      continue;
    }

    const res = await fetch(
      "https://app.squareup.com/appointments/api/buyer/availability",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Origin: "https://book.squareup.com",
        },
        body: JSON.stringify({
          search_availability_request: {
            query: {
              filter: {
                start_at_range: {
                  start_at: `${startDate}T00:00:00Z`,
                  end_at: to.toISOString().split("T")[0] + "T00:00:00Z",
                },
                location_id: provider.locationToken,
                segment_filters: [
                  {
                    service_variation_id: variation.id,
                    team_member_id_filter: {
                      any: employeeTokens,
                    },
                  },
                ],
              },
            },
          },
        }),
        next: { revalidate: 300 },
      }
    );

    if (!res.ok) {
      console.error(
        `Square availability API returned ${res.status} for variation ${variation.id}`
      );
      results.push(null);
      continue;
    }

    const data = await res.json();
    const slots: SquareAvailabilitySlot[] = data.availability ?? [];

    // Group by date in the provider's timezone
    const dates: Record<string, AvailabilitySlot[]> = {};
    for (const slot of slots) {
      if (!slot.available) continue;
      const slotDate = new Date(slot.start * 1000);
      const dateKey = slotDate.toLocaleDateString("en-CA", {
        timeZone: provider.timezone,
      });
      const timeStr = slotDate.toLocaleString("sv-SE", {
        timeZone: provider.timezone,
      });

      if (!dates[dateKey]) {
        dates[dateKey] = [];
      }
      dates[dateKey].push({
        time: timeStr,
        slotsAvailable: null,
      });
    }

    results.push({
      appointmentTypeId: variation.id,
      name:
        variation.name !== "Regular" && variation.name !== svc.name
          ? `${svc.name} - ${variation.name}`
          : svc.name,
      ...(variation.price_cents > 0 && {
        price: variation.price_cents / 100,
      }),
      durationMinutes: Math.round(variation.service_time / 60),
      dates,
    });
  }

  return results.filter(
    (r): r is NonNullable<typeof r> =>
      r !== null && Object.keys(r.dates).length > 0
  ) as AppointmentTypeAvailability[];
}
