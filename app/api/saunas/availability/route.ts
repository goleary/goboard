import { NextRequest } from "next/server";
import { z } from "zod";
import {
  getSaunaBySlug,
  type AcuityBookingProviderConfig,
  type WixBookingProviderConfig,
  type GlofoxBookingProviderConfig,
  type MarianaTekBookingProviderConfig,
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
      case "mariana-tek":
        appointmentTypes = await fetchMarianaTekAvailability(provider, startDate);
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
