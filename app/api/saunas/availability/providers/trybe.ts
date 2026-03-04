import type { TrybeBookingProviderConfig } from "@/data/saunas/saunas";
import type { AppointmentTypeAvailability, AvailabilitySlot } from "../types";

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

export async function fetchTrybeAvailability(
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
