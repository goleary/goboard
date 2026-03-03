import type { SweatpalsBookingProviderConfig } from "@/data/saunas/saunas";
import type { AppointmentTypeAvailability, AvailabilitySlot } from "../types";

interface SweatpalsEvent {
  id: string;
  baseId: string;
  name: string;
  instance: string;
  instanceEndDate: string;
  shortLocalInstance: string;
  eventInstanceId: string;
  addressName: string;
  addressLat: number;
  addressLng: number;
  isPaid: boolean;
  tzid: string;
  attendeesLimit: number | null;
  participantsCount: number;
  prices: {
    priceAmount: number;
    currency: string;
    tierName: string;
    basePriceId: string;
    maxTickets: number | null;
  }[];
}

export async function fetchSweatpalsAvailability(
  provider: SweatpalsBookingProviderConfig,
  startDate: string
): Promise<AppointmentTypeAvailability[]> {
  const from = new Date(startDate);
  const to = new Date(from);
  to.setDate(to.getDate() + 6);

  const res = await fetch(
    "https://ilove.sweatpals.com/api/events/public/search",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        limit: 20,
        onlyBusinessAuthors: false,
        withEventTypes: ["EVENT", "CLASS", "RETREAT"],
        creatorsIds: [provider.creatorId],
        withUnverifiedEvents: true,
        sort: "instance",
        periodFrom: `${startDate}T00:00:00.000Z`,
        periodTo: `${to.toISOString().split("T")[0]}T23:59:59.000Z`,
      }),
      next: { revalidate: 300 },
    }
  );

  if (!res.ok) {
    throw new Error(`Sweatpals API returned ${res.status}`);
  }

  const events: SweatpalsEvent[] = await res.json();

  // Build a set of base IDs we care about
  const trackedBaseIds = new Set(provider.events.map((e) => e.baseEventId));

  // Group matching event instances by baseId → date → slots
  const byBase = new Map<string, Record<string, AvailabilitySlot[]>>();

  for (const ev of events) {
    if (!trackedBaseIds.has(ev.baseId)) continue;

    // Convert UTC instance to local date in provider timezone
    const localDate = new Date(ev.instance).toLocaleDateString("en-CA", {
      timeZone: provider.timezone,
    });

    const localTime = new Date(ev.instance).toLocaleString("sv-SE", {
      timeZone: provider.timezone,
    });

    if (!byBase.has(ev.baseId)) {
      byBase.set(ev.baseId, {});
    }
    const dates = byBase.get(ev.baseId)!;
    if (!dates[localDate]) {
      dates[localDate] = [];
    }

    // Compute remaining spots
    const limit = ev.attendeesLimit;
    const slotsAvailable =
      limit != null && limit < Number.MAX_SAFE_INTEGER
        ? Math.max(0, limit - ev.participantsCount)
        : null;

    dates[localDate].push({
      time: localTime,
      slotsAvailable,
    });
  }

  return provider.events
    .filter((evt) => byBase.has(evt.baseEventId))
    .map((evt) => ({
      appointmentTypeId: evt.baseEventId,
      name: evt.name,
      price: evt.price,
      durationMinutes: evt.durationMinutes,
      dates: byBase.get(evt.baseEventId) ?? {},
    }));
}
