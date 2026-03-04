import type { GlofoxBookingProviderConfig } from "@/data/saunas/saunas";
import type { AppointmentTypeAvailability, AvailabilitySlot } from "../types";

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

export async function fetchGlofoxAvailability(
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
