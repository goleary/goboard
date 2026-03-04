import type { MindbodyBookingProviderConfig } from "@/data/saunas/saunas";
import type { AppointmentTypeAvailability, AvailabilitySlot } from "../types";

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

export async function fetchMindbodyAvailability(
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
