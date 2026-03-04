import type { ArketaBookingProviderConfig } from "@/data/saunas/saunas";
import type { AppointmentTypeAvailability, AvailabilitySlot } from "../types";

interface ArketaClass {
  id: string;
  class_name: string;
  name: string;
  start_time: number;
  end_time: number;
  duration: number;
  capacity: number;
  max_capacity: number;
  total_booked: number;
  price: number;
  canceled: boolean;
  deleted: boolean;
  isBookable: boolean;
  display: string;
  service_id: string;
}

interface ArketaWidgetResponse {
  data: {
    classes: ArketaClass[];
  };
}

export async function fetchArketaAvailability(
  provider: ArketaBookingProviderConfig,
  startDate: string
): Promise<AppointmentTypeAvailability[]> {
  const from = new Date(startDate);
  const startTimestamp = Math.floor(from.getTime() / 1000);

  const res = await fetch(
    `https://app.arketa.co/api/widget/data?widgetName=${provider.widgetName}&type=classes&start_time=${startTimestamp}`,
    { next: { revalidate: 300 } }
  );

  if (!res.ok) {
    throw new Error(`Arketa widget API returned ${res.status}`);
  }

  const data: ArketaWidgetResponse = await res.json();
  const classes = data.data?.classes ?? [];

  const to = new Date(from);
  to.setDate(to.getDate() + 7);

  // Group by class name, filtering out cancelled/deleted/hidden classes
  const classMap = new Map<
    string,
    {
      duration: number;
      price: number;
      entries: { startTime: number; slotsAvailable: number }[];
    }
  >();

  for (const cls of classes) {
    if (cls.canceled || cls.deleted || cls.display !== "public" || !cls.isBookable) continue;

    const startMs = cls.start_time * 1000;
    if (startMs < from.getTime() || startMs >= to.getTime()) continue;

    const className = cls.class_name || cls.name;
    if (!classMap.has(className)) {
      classMap.set(className, {
        duration: cls.duration,
        price: cls.price,
        entries: [],
      });
    }
    classMap.get(className)!.entries.push({
      startTime: cls.start_time,
      slotsAvailable: Math.max(0, cls.capacity - (cls.total_booked ?? 0)),
    });
  }

  return Array.from(classMap.entries()).map(([className, info]) => {
    const dates: Record<string, AvailabilitySlot[]> = {};

    for (const entry of info.entries) {
      const entryDate = new Date(entry.startTime * 1000);
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
        slotsAvailable: entry.slotsAvailable,
      });
    }

    return {
      appointmentTypeId: className,
      name: className,
      price: info.price,
      durationMinutes: info.duration,
      dates,
    };
  });
}
