import type { ZettlorBookingProviderConfig } from "@/data/saunas/saunas";
import type { AppointmentTypeAvailability, AvailabilitySlot } from "../types";

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

export async function fetchZettlorAvailability(
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
