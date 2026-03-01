import { NextRequest } from "next/server";
import { z } from "zod";
import {
  getSaunaBySlug,
  type AcuityBookingProviderConfig,
  type WixBookingProviderConfig,
  type GlofoxBookingProviderConfig,
  type PeriodeBookingProviderConfig,
  type MarianaTekBookingProviderConfig,
  type FareHarborBookingProviderConfig,
  type ZenotiBookingProviderConfig,
  type BookerBookingProviderConfig,
  type SimplyBookBookingProviderConfig,
  type ZettlorBookingProviderConfig,
  type TrybeBookingProviderConfig,
  type VagaroBookingProviderConfig,
  type CheckfrontBookingProviderConfig,
  type PeekBookingProviderConfig,
  type SquareBookingProviderConfig,
  type MindbodyBookingProviderConfig,
  type ClinicSenseBookingProviderConfig,
  type MangomintBookingProviderConfig,
  type RollerBookingProviderConfig,
  type BoulevardBookingProviderConfig,
  type SojoBookingProviderConfig,
} from "@/data/saunas/saunas";

export interface AvailabilitySlot {
  time: string;
  slotsAvailable: number | null;
}

export interface AppointmentTypeAvailability {
  appointmentTypeId: string;
  name: string;
  price?: number;
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

  // Filter events to this facility, excluding name patterns
  const facilityEvents = allEvents.filter(
    (e) =>
      e.facility === provider.facilityId &&
      !(provider.excludeNamePatterns ?? []).some((p) => e.name.includes(p))
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

const PERIODE_API_KEY = "AIzaSyDmV1nOZSBcpndV1SwLFNUFFPQbpTEl4AI";
const PERIODE_PROJECT = "periode-prod";

function parseFirestoreValue(val: Record<string, unknown>): unknown {
  if ("stringValue" in val) return val.stringValue;
  if ("integerValue" in val) return Number(val.integerValue);
  if ("doubleValue" in val) return val.doubleValue;
  if ("booleanValue" in val) return val.booleanValue;
  if ("nullValue" in val) return null;
  if ("arrayValue" in val) {
    const arr = val.arrayValue as { values?: Record<string, unknown>[] };
    return (arr.values ?? []).map(parseFirestoreValue);
  }
  if ("mapValue" in val) {
    const map = val.mapValue as {
      fields?: Record<string, Record<string, unknown>>;
    };
    const obj: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(map.fields ?? {})) {
      obj[k] = parseFirestoreValue(v);
    }
    return obj;
  }
  return null;
}

interface PeriodeSlot {
  time: number;
  length: number;
  available: number;
  reserved: number;
  cancelled: number;
  deleted: number;
  onlyMembers: boolean;
}

async function fetchPeriodeAvailability(
  provider: PeriodeBookingProviderConfig,
  startDate: string
): Promise<AppointmentTypeAvailability[]> {
  // Build list of 7 date strings
  const dates: string[] = [];
  const start = new Date(startDate);
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    dates.push(d.toISOString().split("T")[0]);
  }

  const results = await Promise.all(
    provider.manifests.map(async (manifest) => {
      // Fetch all 7 dates in parallel for this manifest
      const slotDocs = await Promise.all(
        dates.map(async (date) => {
          const url = `https://firestore.googleapis.com/v1/projects/${PERIODE_PROJECT}/databases/(default)/documents/dateSlots/${provider.merchantId}/manifests/${manifest.manifestId}/slots/${date}?key=${PERIODE_API_KEY}`;
          const res = await fetch(url, { next: { revalidate: 300 } });
          if (res.status === 404) return null;
          if (!res.ok) {
            throw new Error(
              `Periode API returned ${res.status} for manifest ${manifest.manifestId} date ${date}`
            );
          }
          return res.json();
        })
      );

      const dateSlots: Record<string, AvailabilitySlot[]> = {};

      for (const doc of slotDocs) {
        if (!doc?.fields) continue;
        const dateStr = parseFirestoreValue(doc.fields.date) as string;
        const rawSlots = parseFirestoreValue(doc.fields.slots) as PeriodeSlot[];

        dateSlots[dateStr] = rawSlots
          .filter((s) => !s.onlyMembers)
          .map((s) => {
            const hours = Math.floor(s.time);
            const minutes = Math.round((s.time - hours) * 60);
            const timeStr = `${dateStr} ${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`;
            const effectiveAvailable =
              s.available - s.reserved + s.cancelled + s.deleted;
            return {
              time: timeStr,
              slotsAvailable: Math.max(0, effectiveAvailable),
            };
          });
      }

      return {
        appointmentTypeId: manifest.manifestId,
        name: manifest.name,
        price: manifest.price,
        durationMinutes: manifest.durationMinutes,
        dates: dateSlots,
      };
    })
  );

  return results;
}

interface MarianaTekClass {
  id: string;
  name: string;
  start_date: string;
  start_time: string;
  start_datetime: string;
  capacity: number;
  available_spot_count: number;
  is_cancelled: boolean;
  class_type: {
    id: string;
    name: string;
    duration: number;
  };
}

interface MarianaTekResponse {
  count: number;
  next: string | null;
  results: MarianaTekClass[];
}

async function fetchMarianaTekAvailability(
  provider: MarianaTekBookingProviderConfig,
  startDate: string
): Promise<AppointmentTypeAvailability[]> {
  const from = new Date(startDate);
  const to = new Date(from);
  to.setDate(to.getDate() + 6);
  const endDate = to.toISOString().split("T")[0];

  let allClasses: MarianaTekClass[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const url = new URL(
      `https://${provider.tenant}.marianatek.com/api/customer/v1/classes`
    );
    url.searchParams.set("min_start_date", startDate);
    url.searchParams.set("max_start_date", endDate);
    url.searchParams.set("ordering", "start_datetime");
    url.searchParams.set("page_size", "100");
    url.searchParams.set("page", String(page));
    if (provider.locationId) {
      url.searchParams.set("location", provider.locationId);
    }

    const res = await fetch(url.toString(), {
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      throw new Error(
        `Mariana Tek API returned ${res.status} for ${provider.tenant}`
      );
    }

    const data: MarianaTekResponse = await res.json();
    allClasses = allClasses.concat(data.results ?? []);
    hasMore = data.next !== null;
    page++;
  }

  const classTypeIds = new Set(provider.classTypes.map((ct) => ct.classTypeId));
  const filteredClasses = allClasses.filter(
    (c) => !c.is_cancelled && classTypeIds.has(c.class_type.id)
  );

  const typeMap = new Map<string, Record<string, AvailabilitySlot[]>>();

  for (const cls of filteredClasses) {
    const typeId = cls.class_type.id;
    if (!typeMap.has(typeId)) {
      typeMap.set(typeId, {});
    }
    const dates = typeMap.get(typeId)!;
    const dateKey = cls.start_date;

    if (!dates[dateKey]) {
      dates[dateKey] = [];
    }
    dates[dateKey].push({
      time: `${cls.start_date}T${cls.start_time}`,
      slotsAvailable: cls.available_spot_count,
    });
  }

  return provider.classTypes
    .filter((ct) => typeMap.has(ct.classTypeId))
    .map((ct) => ({
      appointmentTypeId: ct.classTypeId,
      name: ct.name,
      price: ct.price,
      durationMinutes: ct.durationMinutes,
      ...(ct.private && { private: ct.private }),
      ...(ct.seats != null && { seats: ct.seats }),
      dates: typeMap.get(ct.classTypeId) ?? {},
    }));
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

async function fetchZenotiAvailability(
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

async function fetchBookerAvailability(
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

interface SimplyBookSlot {
  id: string;
  date: string;
  time: string;
  type: "free" | "busy";
  slots_count: number;
}

async function fetchSimplyBookAvailability(
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

interface ZettlorSession {
  id: string;
  datetime: string;
  time: string;
  availability: number;
  slotsAvailable: number;
  maxCapacity: number;
  scheduled: number;
  price: number;
  duration: number;
  label: string;
  location: string;
  timezone: string;
  category: string;
  bookingUrl: string;
}

async function fetchZettlorAvailability(
  provider: ZettlorBookingProviderConfig,
  startDate: string
): Promise<AppointmentTypeAvailability[]> {
  const from = new Date(startDate);
  const to = new Date(from);
  to.setDate(to.getDate() + 6);
  const endDate = to.toISOString().split("T")[0];

  const url = new URL("https://www.zettlor.com/api/momence/sessions");
  url.searchParams.set("handle", provider.handle);
  url.searchParams.set("startDate", startDate);
  url.searchParams.set("endDate", endDate);
  url.searchParams.set("includeWaitlist", "true");
  url.searchParams.set("windowType", "critical");

  const res = await fetch(url.toString(), {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`Zettlor API returned ${res.status} for ${provider.handle}`);
  }

  const data = await res.json();
  const sessions: ZettlorSession[] = data.sessions ?? [];

  // Group sessions by label (session type)
  const labelMap = new Map<
    string,
    { price: number; duration: number; sessions: ZettlorSession[] }
  >();

  for (const session of sessions) {
    if (!labelMap.has(session.label)) {
      labelMap.set(session.label, {
        price: session.price,
        duration: session.duration,
        sessions: [],
      });
    }
    labelMap.get(session.label)!.sessions.push(session);
  }

  return Array.from(labelMap.entries()).map(([label, group]) => {
    const dates: Record<string, AvailabilitySlot[]> = {};

    for (const session of group.sessions) {
      const dateObj = new Date(session.datetime);
      const dateKey = dateObj.toLocaleDateString("en-CA", {
        timeZone: provider.timezone,
      });
      const localTime = dateObj.toLocaleString("sv-SE", {
        timeZone: provider.timezone,
      });

      if (!dates[dateKey]) {
        dates[dateKey] = [];
      }
      dates[dateKey].push({
        time: localTime,
        slotsAvailable: session.slotsAvailable,
      });
    }

    const isPrivate = label.toLowerCase().includes("private");
    return {
      appointmentTypeId: label,
      name: label,
      price: group.price,
      durationMinutes: group.duration,
      ...(isPrivate && { private: true, seats: 1 }),
      dates,
    };
  });
}

interface TrybeSession {
  id: string;
  start_time: string;
  end_time: string;
  duration: number;
  capacity: string;
  remaining_capacity: number;
  is_valid: boolean;
  price: number;
  currency: string;
  room?: {
    id: string;
    name: string;
    capacity: number;
  };
}

async function fetchTrybeAvailability(
  provider: TrybeBookingProviderConfig,
  startDate: string
): Promise<AppointmentTypeAvailability[]> {
  const from = new Date(startDate);
  const to = new Date(from);
  to.setDate(to.getDate() + 6);
  const endDate = to.toISOString().split("T")[0];

  const url = `https://api.try.be/shop/item-availability/sessions/${provider.siteId}/${provider.sessionTypeId}?date_from=${startDate}&date_to=${endDate}`;

  const res = await fetch(url, {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(
      `Trybe API returned ${res.status} for ${provider.sessionTypeId}`
    );
  }

  const data = await res.json();
  const sessions: TrybeSession[] = data.data ?? data;

  // Group sessions by date
  const dates: Record<string, AvailabilitySlot[]> = {};

  for (const session of sessions) {
    const dateObj = new Date(session.start_time);
    const dateKey = dateObj.toLocaleDateString("en-CA", {
      timeZone: provider.timezone,
    });
    const localTime = dateObj.toLocaleString("sv-SE", {
      timeZone: provider.timezone,
    });

    if (!dates[dateKey]) {
      dates[dateKey] = [];
    }
    dates[dateKey].push({
      time: localTime,
      slotsAvailable: session.remaining_capacity,
    });
  }

  return [
    {
      appointmentTypeId: provider.sessionTypeId,
      name: provider.name,
      price: sessions[0] ? sessions[0].price / 100 : undefined,
      durationMinutes: provider.durationMinutes,
      dates,
    },
  ];
}

const VAGARO_USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

interface VagaroBookingGroup {
  BookingGroup: number;
  AppDate: string;
  AvailableTime: string;
  ServicepPoviderData: {
    AvailableTime: string;
    ServiceProviderName: string;
    ServiceID: number;
    Duration: number;
    SerivcePrice: number;
    ServiceName: string;
    AppDate: string;
  }[];
}

async function fetchVagaroAvailability(
  provider: VagaroBookingProviderConfig,
  startDate: string
): Promise<AppointmentTypeAvailability[]> {
  // Build 7 days of dates
  const from = new Date(startDate);
  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(from);
    d.setDate(d.getDate() + i);
    // Format as M/D/YYYY which is what Vagaro expects
    dates.push(
      `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`
    );
  }

  // Fetch availability for each service x date in parallel
  const results = await Promise.all(
    provider.services.map(async (svc) => {
      const dayResults = await Promise.all(
        dates.map(async (dateStr) => {
          const res = await fetch(
            `https://www.vagaro.com/${provider.region}/websiteapi/homepage/getavailablemultiappointments`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "User-Agent": VAGARO_USER_AGENT,
              },
              body: JSON.stringify({
                lAppointmentID: 0,
                businessID: provider.businessId,
                csvServiceID: String(svc.serviceId),
                csvSPID: "",
                AppDate: dateStr,
                StyleID: null,
                isPublic: true,
                isOutcallAppointment: false,
                strCurrencySymbol: "$",
                IsFromWidgetPage: false,
                isFromShopAdmin: false,
                isMoveBack: false,
                BusinessPackageID: 0,
                PromotionID: "",
              }),
              next: { revalidate: 300 },
            }
          );

          if (!res.ok) {
            console.error(
              `Vagaro API returned ${res.status} for service ${svc.serviceId} date ${dateStr}`
            );
            return { date: dateStr, groups: [] as VagaroBookingGroup[] };
          }

          const data = await res.json();
          return {
            date: dateStr,
            groups: (data.d ?? []) as VagaroBookingGroup[],
          };
        })
      );

      // Merge all provider time slots across all days into a single set of
      // unique times per date. Each booking group represents one provider/room
      // for the same service; we union the available times across all providers
      // to get the overall availability for the service.
      const dateMap: Record<string, AvailabilitySlot[]> = {};

      for (const { groups } of dayResults) {
        if (groups.length === 0) continue;

        // Use the AppDate from the first group (format "DD Mon YYYY")
        const appDateRaw = groups[0].AppDate;
        // Parse "27 Feb 2026" -> Date -> YYYY-MM-DD
        const parsedDate = new Date(appDateRaw);
        const dateKey = parsedDate.toISOString().split("T")[0];

        // Collect all unique time slots across all providers for this date
        const timeSet = new Set<string>();
        for (const group of groups) {
          if (group.AvailableTime) {
            for (const time of group.AvailableTime.split(",")) {
              timeSet.add(time.trim());
            }
          }
        }

        if (timeSet.size === 0) continue;

        // Sort times chronologically
        const sortedTimes = Array.from(timeSet).sort((a, b) => {
          const toMinutes = (t: string) => {
            const match = t.match(/(\d+):(\d+)\s*(AM|PM)/i);
            if (!match) return 0;
            let h = parseInt(match[1], 10);
            const m = parseInt(match[2], 10);
            const period = match[3].toUpperCase();
            if (period === "PM" && h !== 12) h += 12;
            if (period === "AM" && h === 12) h = 0;
            return h * 60 + m;
          };
          return toMinutes(a) - toMinutes(b);
        });

        // Convert time strings to full datetime strings and count available providers
        dateMap[dateKey] = sortedTimes.map((time) => {
          // Count how many providers/rooms have this time available
          let providerCount = 0;
          for (const group of groups) {
            if (
              group.AvailableTime &&
              group.AvailableTime.split(",")
                .map((t) => t.trim())
                .includes(time)
            ) {
              providerCount++;
            }
          }

          // Convert "02:30 PM" to 24h format for the time string
          const match = time.match(/(\d+):(\d+)\s*(AM|PM)/i);
          let hours = 0;
          let minutes = 0;
          if (match) {
            hours = parseInt(match[1], 10);
            minutes = parseInt(match[2], 10);
            const period = match[3].toUpperCase();
            if (period === "PM" && hours !== 12) hours += 12;
            if (period === "AM" && hours === 12) hours = 0;
          }

          return {
            time: `${dateKey} ${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`,
            slotsAvailable: providerCount,
          };
        });
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

interface VagaroClassEvent {
  className: string;
  availableTime: string;
  availableEndTime: string;
  strStartTime: string;
  duration: number;
  noOfAttendees: number;
  eventCapacity: number;
  sessionDetail: string; // "serviceId-qty-price-discount-finalPrice-tax"
}

async function fetchVagaroClassAvailability(
  provider: VagaroBookingProviderConfig,
  startDate: string
): Promise<AppointmentTypeAvailability[]> {
  const from = new Date(startDate);

  // Build 7 days of dates in "Ddd Mmm-DD-YYYY" format
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const dates: { formatted: string; isoDate: string }[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(from);
    d.setDate(d.getDate() + i);
    const dayName = dayNames[d.getDay()];
    const monthName = monthNames[d.getMonth()];
    const dd = String(d.getDate()).padStart(2, "0");
    const yyyy = d.getFullYear();
    dates.push({
      formatted: `${dayName} ${monthName}-${dd}-${yyyy}`,
      isoDate: d.toISOString().split("T")[0],
    });
  }

  // Service IDs we care about (filter out non-sauna classes)
  const serviceIdSet = new Set(provider.services.map((s) => s.serviceId));

  // Fetch each day in parallel
  const dayResults = await Promise.all(
    dates.map(async ({ formatted, isoDate }) => {
      const res = await fetch(
        `https://www.vagaro.com/${provider.region}/websiteapi/homepage/getavailablemultievents`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "User-Agent": VAGARO_USER_AGENT,
            grouptoken: provider.region.toUpperCase(),
          },
          body: JSON.stringify({
            businessID: provider.businessId,
            sSatrtDate: formatted,
            sEndDate: formatted,
            Bus_TimeZone: -8,
            Bus_CountryID: 1,
            Bus_DayLightSaving: true,
            DAY_LIGHT_SAVING: "Y",
            Cust_Timezone: -8,
            Cust_CountryID: "1",
            Cust_IsDayLightSaving: true,
            searchdetails:
              "<searchdetails><searchdetail><serviceid>-2</serviceid><spid>-2</spid><streamingstatus>2</streamingstatus></searchdetail></searchdetails>",
            userID: "0",
            promotionID: 0,
            isFromOffline: false,
            IsNewWebsiteBuilder: false,
            IncludededClassId: "",
            ExcludededClassId: "",
            IsAllowAllLocation: false,
          }),
          next: { revalidate: 300 },
        }
      );

      if (!res.ok) {
        console.error(
          `Vagaro class API returned ${res.status} for date ${formatted}`
        );
        return { isoDate, events: [] as VagaroClassEvent[] };
      }

      const events = (await res.json()) as VagaroClassEvent[];
      return { isoDate, events };
    })
  );

  // Group events by service ID, mapping to our configured services
  const serviceMap = new Map<
    number,
    { svc: (typeof provider.services)[0]; dates: Record<string, AvailabilitySlot[]> }
  >();

  for (const svc of provider.services) {
    serviceMap.set(svc.serviceId, { svc, dates: {} });
  }

  for (const { isoDate, events } of dayResults) {
    for (const event of events) {
      // Parse serviceId from sessionDetail ("serviceId-qty-price-...")
      const sessionServiceId = parseInt(event.sessionDetail.split("-")[0], 10);
      if (!serviceIdSet.has(sessionServiceId)) continue;

      const entry = serviceMap.get(sessionServiceId);
      if (!entry) continue;

      const spotsAvailable = event.eventCapacity - event.noOfAttendees;
      if (spotsAvailable <= 0) continue;

      // Convert time to 24h format
      const match = event.availableTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
      let hours = 0;
      let minutes = 0;
      if (match) {
        hours = parseInt(match[1], 10);
        minutes = parseInt(match[2], 10);
        const period = match[3].toUpperCase();
        if (period === "PM" && hours !== 12) hours += 12;
        if (period === "AM" && hours === 12) hours = 0;
      }

      if (!entry.dates[isoDate]) entry.dates[isoDate] = [];
      entry.dates[isoDate].push({
        time: `${isoDate} ${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`,
        slotsAvailable: spotsAvailable,
      });
    }
  }

  return Array.from(serviceMap.values()).map(({ svc, dates }) => ({
    appointmentTypeId: String(svc.serviceId),
    name: svc.name,
    price: svc.price,
    durationMinutes: svc.durationMinutes,
    dates,
  }));
}

// --- Checkfront types (rate API response shapes) ---

interface CheckfrontTimeslot {
  A: number; // available
  B: number; // booked
  start_time: string; // "09:00"
  end_time: string; // "10:30"
  status: string; // "A" = available
  days_span: number;
  start_date: number; // unix timestamp
  end_date: number; // unix timestamp
}

interface CheckfrontDateData {
  timeslots: CheckfrontTimeslot[];
  status: string;
  stock: { A: number; B: number; T: number };
}

interface CheckfrontRateResponse {
  item: {
    item_id: number;
    name: string;
    stock: number;
    rate: {
      status: string;
      available: number;
      dates: Record<string, CheckfrontDateData>;
    };
  };
}

async function fetchCheckfrontAvailability(
  provider: CheckfrontBookingProviderConfig,
  startDate: string
): Promise<AppointmentTypeAvailability[]> {
  const from = new Date(startDate);
  const to = new Date(from);
  to.setDate(to.getDate() + 6);
  const endDate = to.toISOString().split("T")[0];

  const results = await Promise.all(
    provider.items.map(async (item) => {
      const url = `${provider.baseUrl}/reserve/api/?call=rate`;

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "X-Requested-With": "XMLHttpRequest",
          Referer: `${provider.baseUrl}/reserve/`,
        },
        body: new URLSearchParams({
          item_id: String(item.itemId),
          start_date: startDate,
          end_date: endDate,
          timeslot: "0",
          "param[adult]": "1",
        }).toString(),
        next: { revalidate: 300 },
      });

      if (!res.ok) {
        throw new Error(
          `Checkfront rate API returned ${res.status} for item ${item.itemId}`
        );
      }

      const data: CheckfrontRateResponse = await res.json();
      const rateDates = data.item?.rate?.dates ?? {};

      const dates: Record<string, AvailabilitySlot[]> = {};

      for (const [dateKey, dateData] of Object.entries(rateDates)) {
        // dateKey is YYYYMMDD format, convert to YYYY-MM-DD
        const isoDate = `${dateKey.slice(0, 4)}-${dateKey.slice(4, 6)}-${dateKey.slice(6, 8)}`;
        const timeslots = dateData.timeslots ?? [];

        // Filter to timeslots that have availability
        const availableSlots = timeslots.filter((ts) => ts.A > 0);
        if (availableSlots.length === 0) continue;

        dates[isoDate] = availableSlots.map((ts) => ({
          time: `${isoDate} ${ts.start_time}:00`,
          slotsAvailable: ts.A,
        }));
      }

      return {
        appointmentTypeId: String(item.itemId),
        name: item.name,
        price: item.price,
        durationMinutes: item.durationMinutes,
        ...(item.private && { private: item.private }),
        ...(item.seats != null && { seats: item.seats }),
        dates,
      };
    })
  );

  return results;
}

// --- Peek types (REST API response shapes) ---

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

async function fetchPeekAvailability(
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

// --- Square types and fetch function ---

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

async function fetchSquareAvailability(
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

  // Serialize requests to avoid Square's rate limiting (429s)
  const variations = widget.services
    .filter((svc) => svc.variations.length > 0)
    .flatMap((svc) =>
      svc.variations
        .filter((v) => v.service_time > 0)
        .map((variation) => ({ svc, variation }))
    );

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

// --- Mindbody types and fetch function ---

interface MindbodyScheduleAttributes {
  startTime: string; // ISO 8601 UTC
  endTime: string;
  duration: number;
  capacity: number;
  openings: number;
  webOpenings: number;
  isCancelled: boolean;
  course: {
    name: string;
    description?: string;
    category?: string;
  };
  status?: {
    id: number;
    status: string;
  };
  contentFormats?: string[];
}

interface MindbodyScheduleEntry {
  id: string;
  type: string;
  attributes: {
    subType: string;
    attributes: MindbodyScheduleAttributes;
  };
}

async function fetchMindbodyAvailability(
  provider: MindbodyBookingProviderConfig,
  startDate: string
): Promise<AppointmentTypeAvailability[]> {
  const locationRefJson = JSON.stringify({
    mb_site_id: provider.siteId,
    mb_location_id: provider.locationId,
    inventory_source: "MB",
  });

  const res = await fetch(
    "https://prod-mkt-gateway.mindbody.io/v1/location/schedules",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location_ref_json: locationRefJson,
        start_time_from: `${startDate}T00:00:00`,
        start_time_to: `${(() => { const d = new Date(startDate); d.setDate(d.getDate() + 7); return d.toISOString().split("T")[0]; })()}T00:00:00`,
        location_timezone: provider.timezone,
      }),
      next: { revalidate: 300 },
    }
  );

  if (!res.ok) {
    throw new Error(`Mindbody schedules API returned ${res.status}`);
  }

  const data = await res.json();
  const entries: MindbodyScheduleEntry[] = data.data ?? [];

  // Group by course name, filtering out cancelled classes
  const courseMap = new Map<
    string,
    {
      duration: number;
      capacity: number;
      entries: { startTime: string; openings: number }[];
    }
  >();

  // Only include classes within the 7-day window
  const from = new Date(startDate);
  const to = new Date(from);
  to.setDate(to.getDate() + 7);

  for (const entry of entries) {
    const attrs = entry.attributes?.attributes;
    if (!attrs || attrs.isCancelled) continue;

    const entryDate = new Date(attrs.startTime);
    if (entryDate < from || entryDate >= to) continue;

    const courseName = attrs.course?.name ?? "Session";
    if (!courseMap.has(courseName)) {
      courseMap.set(courseName, {
        duration: attrs.duration,
        capacity: attrs.capacity,
        entries: [],
      });
    }
    courseMap.get(courseName)!.entries.push({
      startTime: attrs.startTime,
      openings: attrs.openings,
    });
  }

  return Array.from(courseMap.entries()).map(([courseName, course]) => {
    const dates: Record<string, AvailabilitySlot[]> = {};

    for (const entry of course.entries) {
      const entryDate = new Date(entry.startTime);
      const dateKey = entryDate.toLocaleDateString("en-CA", {
        timeZone: provider.timezone,
      });
      const timeStr = entryDate.toLocaleString("sv-SE", {
        timeZone: provider.timezone,
      });

      if (!dates[dateKey]) {
        dates[dateKey] = [];
      }
      dates[dateKey].push({
        time: timeStr,
        slotsAvailable: entry.openings,
      });
    }

    return {
      appointmentTypeId: courseName,
      name: courseName,
      durationMinutes: course.duration,
      dates,
    };
  });
}

// --- ClinicSense types and fetch function ---

async function fetchClinicSenseAvailability(
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

// --- Mangomint types and fetch function ---

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

async function fetchMangomintAvailability(
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

// --- Roller types and fetch function ---

interface RollerProduct {
  id: string;
  name: string;
  type: string;
  products: {
    id: string;
    name: string;
    cost: number;
  }[];
}

interface RollerSession {
  date: string;
  startTime: string;
  endTime: string;
  capacityRemaining: number;
  ticketCapacityRemaining: number;
  onlineSalesOpen: boolean;
}

interface RollerProductAvailability {
  id: string;
  name: string;
  type: string;
  sessions: RollerSession[] | null;
}

async function fetchRollerAvailability(
  provider: RollerBookingProviderConfig,
  startDate: string
): Promise<AppointmentTypeAvailability[]> {
  const headers = {
    "X-Api-Key": provider.venueSlug,
    "X-Cell-Id": "a",
    "X-Checkout": provider.checkoutSlug,
    Accept: "application/json",
  };

  // Fetch products to get names and prices
  const productsRes = await fetch(
    `https://api.roller.app/api/checkout/${provider.checkoutSlug}/products`,
    { headers, next: { revalidate: 300 } }
  );
  if (!productsRes.ok) {
    throw new Error(`Roller products API returned ${productsRes.status}`);
  }
  const productGroups: RollerProduct[] = await productsRes.json();

  // Build a flat map of product ID -> product info
  const productMap = new Map<string, { name: string; price: number }>();
  for (const group of productGroups) {
    for (const prod of group.products) {
      productMap.set(prod.id, { name: prod.name, price: prod.cost });
    }
  }

  // Fetch availability for each day in the 7-day window
  const from = new Date(startDate);
  const dayPromises = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(from);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split("T")[0];
    dayPromises.push(
      fetch(
        `https://api.roller.app/api/checkout/${provider.checkoutSlug}/product-availability?date=${dateStr}`,
        { headers, next: { revalidate: 300 } }
      ).then(async (res) => {
        if (!res.ok) return [];
        return (await res.json()) as RollerProductAvailability[];
      })
    );
  }

  const dailyAvailability = await Promise.all(dayPromises);

  // Group sessions by product name across all days
  const productSessions = new Map<
    string,
    {
      name: string;
      price: number;
      durationMinutes: number;
      dates: Record<string, AvailabilitySlot[]>;
    }
  >();

  for (const dayProducts of dailyAvailability) {
    for (const product of dayProducts) {
      if (product.type !== "sessionpass") continue;
      const key = product.id;
      if (!productSessions.has(key)) {
        const info = productMap.get(product.id);
        productSessions.set(key, {
          name: info?.name ?? product.name,
          price: info?.price ?? 0,
          durationMinutes: 60,
          dates: {},
        });
      }

      const entry = productSessions.get(key)!;
      for (const session of product.sessions ?? []) {
        if (!session.onlineSalesOpen || session.capacityRemaining <= 0)
          continue;

        const dateKey = session.date;
        if (!entry.dates[dateKey]) {
          entry.dates[dateKey] = [];
        }
        entry.dates[dateKey].push({
          time: `${session.date} ${session.startTime}`,
          slotsAvailable: session.capacityRemaining,
        });

        // Infer duration from start/end time
        if (session.startTime && session.endTime) {
          const [sh, sm] = session.startTime.split(":").map(Number);
          const [eh, em] = session.endTime.split(":").map(Number);
          const dur = (eh * 60 + em) - (sh * 60 + sm);
          if (dur > 0) entry.durationMinutes = dur;
        }
      }
    }
  }

  return Array.from(productSessions.entries()).map(([id, product]) => ({
    appointmentTypeId: id,
    name: product.name,
    price: product.price,
    durationMinutes: product.durationMinutes,
    dates: product.dates,
  }));
}

// --- Boulevard types and fetch function ---

const BOULEVARD_API_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
  "x-blvd-app-name": "booking-widget",
};

async function fetchBoulevardAvailability(
  provider: BoulevardBookingProviderConfig,
  startDate: string
): Promise<AppointmentTypeAvailability[]> {
  const apiUrl = `https://www.joinblvd.com/b/.api/graph`;
  const headers = {
    ...BOULEVARD_API_HEADERS,
    "x-blvd-bid": provider.businessId,
  };

  const results = await Promise.all(
    provider.services.map(async (svc) => {
      // Step 1: Create a cart
      const createCartRes = await fetch(apiUrl, {
        method: "POST",
        headers,
        body: JSON.stringify({
          query: `mutation { createCart(locationId: "${provider.locationId}") { cartToken cart { id } } }`,
        }),
        next: { revalidate: 300 },
      });

      if (!createCartRes.ok) {
        throw new Error(
          `Boulevard createCart returned ${createCartRes.status}`
        );
      }

      const createCartData = await createCartRes.json();
      const cartId = createCartData.data?.createCart?.cart?.id;
      const cartToken = createCartData.data?.createCart?.cartToken;
      if (!cartId) {
        throw new Error("Boulevard createCart did not return cart ID");
      }

      // Step 2: Add the service to the cart
      const addItemRes = await fetch(apiUrl, {
        method: "POST",
        headers,
        body: JSON.stringify({
          query: `mutation { cartAddSelectedBookableItem(input: { idOrToken: "${cartToken}", itemId: "${svc.serviceId}" }) { cart { id } } }`,
        }),
        next: { revalidate: 300 },
      });

      if (!addItemRes.ok) {
        throw new Error(
          `Boulevard addItem returned ${addItemRes.status}`
        );
      }

      // Step 3: Query available dates
      const datesRes = await fetch(apiUrl, {
        method: "POST",
        headers,
        body: JSON.stringify({
          query: `query { cartBookableDates(idOrToken: "${cartId}", limit: 14, tz: "${provider.timezone}") { date } }`,
        }),
        next: { revalidate: 300 },
      });

      if (!datesRes.ok) {
        throw new Error(`Boulevard cartBookableDates returned ${datesRes.status}`);
      }

      const datesData = await datesRes.json();
      const availableDates: { date: string }[] =
        datesData.data?.cartBookableDates ?? [];

      // Filter to 7-day window
      const from = new Date(startDate);
      const to = new Date(from);
      to.setDate(to.getDate() + 7);
      const filteredDates = availableDates.filter((d) => {
        const dt = new Date(d.date);
        return dt >= from && dt < to;
      });

      // Step 4: Query available times for each date
      const dates: Record<string, AvailabilitySlot[]> = {};
      const timePromises = filteredDates.map(async (d) => {
        const timesRes = await fetch(apiUrl, {
          method: "POST",
          headers,
          body: JSON.stringify({
            query: `query { cartBookableTimes(idOrToken: "${cartId}", searchDate: "${d.date}", tz: "${provider.timezone}") { id startTime } }`,
          }),
          next: { revalidate: 300 },
        });

        if (!timesRes.ok) return;

        const timesData = await timesRes.json();
        const times: { id: string; startTime: string }[] =
          timesData.data?.cartBookableTimes ?? [];

        if (times.length > 0) {
          dates[d.date] = times.map((t) => {
            const dt = new Date(t.startTime);
            const timeStr = dt.toLocaleString("sv-SE", {
              timeZone: provider.timezone,
            });
            return {
              time: timeStr,
              slotsAvailable: null,
            };
          });
        }
      });

      await Promise.all(timePromises);

      return {
        appointmentTypeId: svc.serviceId,
        name: svc.name,
        price: svc.price,
        durationMinutes: svc.durationMinutes,
        dates,
      };
    })
  );

  return results;
}

// --- SoJo Spa Club (Edge reservation system) ---

interface SojoTimeslot {
  id: string;
  date: string; // "03/01/2026"
  time: string; // "9:00 AM"
  status: string;
  price: number; // cents
  totalAmount: number;
  capacity: number;
  available: number;
  hasLowerPrice: boolean;
}

interface SojoDateslot {
  id: string;
  available: number;
  capacity: number;
  price: number; // cents
  date: string; // "03/01/2026"
  status: string;
  timeslots: SojoTimeslot[];
}

interface SojoAvailabilityResponse {
  code: number;
  result: {
    productId: string;
    dateslots: SojoDateslot[];
  };
}

function sojoTimeTo24h(time12: string): string {
  const match = time12.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return time12;
  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  const period = match[3].toUpperCase();
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return `${String(hours).padStart(2, "0")}:${minutes}:00`;
}

async function fetchSojoAvailability(
  provider: SojoBookingProviderConfig,
  startDate: string
): Promise<AppointmentTypeAvailability[]> {
  const from = new Date(startDate);
  const to = new Date(from);
  to.setDate(to.getDate() + 6);
  const dateTo = to.toISOString().split("T")[0];

  const url = new URL(
    `${provider.baseUrl}/api/public/reservation/admission/availableTimeslots`
  );
  url.searchParams.set("dateFrom", startDate);
  url.searchParams.set("dateTo", dateTo);
  url.searchParams.set("numberOfGuest", "1");

  const res = await fetch(url.toString(), {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`SoJo API returned ${res.status}`);
  }

  const data: SojoAvailabilityResponse = await res.json();

  if (data.code !== 1 || !data.result?.dateslots) {
    return [];
  }

  const dates: Record<string, AvailabilitySlot[]> = {};
  let lowestPrice: number | undefined;

  for (const dateslot of data.result.dateslots) {
    if (dateslot.status !== "open") continue;

    // Convert "03/01/2026" to "2026-03-01"
    const [month, day, year] = dateslot.date.split("/");
    const dateKey = `${year}-${month}-${day}`;

    const slots: AvailabilitySlot[] = [];

    for (const ts of dateslot.timeslots) {
      if (ts.status !== "open" || ts.available <= 0) continue;

      const time24 = sojoTimeTo24h(ts.time);
      slots.push({
        time: `${dateKey} ${time24}`,
        slotsAvailable: ts.available,
      });

      const priceInDollars = ts.price / 100;
      if (lowestPrice === undefined || priceInDollars < lowestPrice) {
        lowestPrice = priceInDollars;
      }
    }

    if (slots.length > 0) {
      dates[dateKey] = slots;
    }
  }

  return [
    {
      appointmentTypeId: "DA_RESERVATION",
      name: "Daily Admission",
      price: lowestPrice,
      durationMinutes: 600,
      dates,
    },
  ];
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
      case "periode":
        appointmentTypes = await fetchPeriodeAvailability(provider, startDate);
        break;
      case "mariana-tek":
        appointmentTypes = await fetchMarianaTekAvailability(provider, startDate);
        break;
      case "fareharbor":
        appointmentTypes = await fetchFareHarborAvailability(
          provider,
          startDate
        );
        break;
      case "zenoti":
        appointmentTypes = await fetchZenotiAvailability(provider, startDate);
        break;
      case "booker":
        appointmentTypes = await fetchBookerAvailability(provider, startDate);
        break;
      case "simplybook":
        appointmentTypes = await fetchSimplyBookAvailability(
          provider,
          startDate
        );
        break;
      case "zettlor":
        appointmentTypes = await fetchZettlorAvailability(provider, startDate);
        break;
      case "trybe":
        appointmentTypes = await fetchTrybeAvailability(provider, startDate);
        break;
      case "vagaro":
        appointmentTypes = provider.isClassBased
          ? await fetchVagaroClassAvailability(provider, startDate)
          : await fetchVagaroAvailability(provider, startDate);
        break;
      case "checkfront":
        appointmentTypes = await fetchCheckfrontAvailability(
          provider,
          startDate
        );
        break;
      case "peek":
        appointmentTypes = await fetchPeekAvailability(provider, startDate);
        break;
      case "square":
        appointmentTypes = await fetchSquareAvailability(provider, startDate);
        break;
      case "mindbody":
        appointmentTypes = await fetchMindbodyAvailability(provider, startDate);
        break;
      case "clinicsense":
        appointmentTypes = await fetchClinicSenseAvailability(
          provider,
          startDate
        );
        break;
      case "mangomint":
        appointmentTypes = await fetchMangomintAvailability(
          provider,
          startDate
        );
        break;
      case "roller":
        appointmentTypes = await fetchRollerAvailability(provider, startDate);
        break;
      case "boulevard":
        appointmentTypes = await fetchBoulevardAvailability(
          provider,
          startDate
        );
        break;
      case "sojo":
        appointmentTypes = await fetchSojoAvailability(provider, startDate);
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
