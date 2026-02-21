"use client";

import { useState, useEffect } from "react";
import { type Sauna } from "@/data/saunas/saunas";
import type {
  AvailabilityResponse,
  AppointmentTypeAvailability,
} from "@/app/api/saunas/availability/route";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";


interface SaunaAvailabilityProps {
  sauna: Sauna;
  onHasAvailability?: (hasAvailability: boolean) => void;
}

function formatTime(isoString: string): string {
  const d = new Date(isoString);
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    ...(d.getMinutes() !== 0 && { minute: "2-digit" }),
    hour12: true,
  });
}

function localDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatDateLabel(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayStr = localDateStr(today);
  const tomorrowStr = localDateStr(tomorrow);

  if (dateStr === todayStr) return "Today";
  if (dateStr === tomorrowStr) return "Tomorrow";

  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function filterPastSlots(
  dates: AppointmentTypeAvailability["dates"]
): AppointmentTypeAvailability["dates"] {
  const now = Date.now();
  const filtered: AppointmentTypeAvailability["dates"] = {};
  for (const [dateStr, slots] of Object.entries(dates)) {
    const futureSlots = slots.filter(
      (slot) => new Date(slot.time).getTime() > now
    );
    if (futureSlots.length > 0) {
      filtered[dateStr] = futureSlots;
    }
  }
  return filtered;
}

/** Collect all dates across appointment types, then group slots by date → appointment type */
function groupByDate(appointmentTypes: AppointmentTypeAvailability[]) {
  const byDate: Record<
    string,
    { appointmentType: AppointmentTypeAvailability; slots: { time: string; slotsAvailable: number | null }[] }[]
  > = {};

  for (const apt of appointmentTypes) {
    const filteredDates = filterPastSlots(apt.dates);
    for (const [dateStr, slots] of Object.entries(filteredDates)) {
      const available = slots.filter((s) => s.slotsAvailable === null || s.slotsAvailable > 0);
      if (available.length === 0) continue;
      if (!byDate[dateStr]) byDate[dateStr] = [];
      byDate[dateStr].push({ appointmentType: apt, slots: available });
    }
  }

  return byDate;
}

export function SaunaAvailability({ sauna, onHasAvailability }: SaunaAvailabilityProps) {
  const [data, setData] = useState<AvailabilityResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sauna.bookingProvider) return;

    setLoading(true);
    setError(null);

    const startDate = localDateStr(new Date());
    fetch(
      `/api/saunas/availability?slug=${encodeURIComponent(sauna.slug)}&startDate=${startDate}`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load availability");
        return res.json();
      })
      .then((json: AvailabilityResponse) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [sauna.slug, sauna.bookingProvider]);

  useEffect(() => {
    if (!onHasAvailability || loading) return;
    const hasSlots =
      !!data &&
      Object.keys(groupByDate(data.appointmentTypes)).length > 0;
    onHasAvailability(hasSlots);
  }, [data, loading, onHasAvailability]);

  if (!sauna.bookingProvider) return null;

  if (loading) {
    return (
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
          Availability
        </p>
        <div className="space-y-3">
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <div className="flex gap-1.5">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
          Availability
        </p>
        <p className="text-sm text-muted-foreground">
          Unable to load availability
        </p>
      </div>
    );
  }

  const byDate = data ? groupByDate(data.appointmentTypes) : {};
  const sortedDates = Object.keys(byDate).sort();

  if (!data || sortedDates.length === 0) {
    return (
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
          Availability
        </p>
        <p className="text-sm text-muted-foreground">
          No upcoming availability found
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
        Upcoming Availability
      </p>
      <div className="space-y-4">
        {sortedDates.map((dateStr) => (
          <div key={dateStr}>
            <p className="text-sm font-medium mb-2">
              {formatDateLabel(dateStr)}
            </p>
            <div className="space-y-2">
              {byDate[dateStr].map(({ appointmentType, slots }) => (
                <div key={appointmentType.appointmentTypeId}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-muted-foreground">
                      {appointmentType.name}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      ${appointmentType.price} / {appointmentType.durationMinutes}min
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {slots.map((slot) => (
                      <Badge key={slot.time} variant="outline" className="text-xs gap-1">
                        {formatTime(slot.time)}
                        {slot.slotsAvailable !== null && (
                          <span className="text-muted-foreground">
                            ({slot.slotsAvailable} seats)
                          </span>
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
