"use client";

import { useState, useEffect } from "react";
import { type Sauna } from "@/data/saunas/saunas";
import type {
  AvailabilityResponse,
  AppointmentTypeAvailability,
} from "@/app/api/saunas/availability/route";
import type { TideDataPoint, TidesResponse } from "@/app/api/saunas/tides/route";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpRight, Minus, ArrowDownRight } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { getTideLevelForSlot, type TideLevel } from "./tideUtils";
import { TimeSlotBadge } from "./TimeSlotBadge";


interface SaunaAvailabilityProps {
  sauna: Sauna;
  onHasAvailability?: (hasAvailability: boolean) => void;
  onFirstAvailableDate?: (date: string | null) => void;
  onLastAvailableDate?: (date: string | null) => void;
  onTideTimeClick?: (slotTime: string, color: string) => void;
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

function TideLevelIndicator({ level }: { level: TideLevel }) {
  switch (level) {
    case "great":
      return <ArrowUpRight className="h-3 w-3 text-green-500" />;
    case "ok":
      return <Minus className="h-3 w-3 text-yellow-500" />;
    case "low":
      return <ArrowDownRight className="h-3 w-3 text-red-300" />;
  }
}

const TIDE_LEVEL_LABELS: Record<TideLevel, string> = {
  great: "High tide",
  ok: "Mid tide",
  low: "Low tide",
};

const TIDE_LEVEL_COLORS: Record<TideLevel, string> = {
  great: "rgb(34, 197, 94)",   // green-500
  ok: "rgb(234, 179, 8)",      // yellow-500
  low: "rgb(252, 165, 165)",   // red-300
};

export function SaunaAvailability({ sauna, onHasAvailability, onFirstAvailableDate, onLastAvailableDate, onTideTimeClick }: SaunaAvailabilityProps) {
  const [data, setData] = useState<AvailabilityResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tideDataByDate, setTideDataByDate] = useState<Record<string, TideDataPoint[]>>({});

  useEffect(() => {
    if (!sauna.bookingProvider) return;

    setData(null);
    setTideDataByDate({});
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
    if (loading) return;
    const byDate = data ? groupByDate(data.appointmentTypes) : {};
    const sortedDates = Object.keys(byDate).sort();
    const hasSlots = sortedDates.length > 0;
    onHasAvailability?.(hasSlots);
    onFirstAvailableDate?.(hasSlots ? sortedDates[0] : null);
    onLastAvailableDate?.(hasSlots ? sortedDates[sortedDates.length - 1] : null);
  }, [data, loading, onHasAvailability, onFirstAvailableDate, onLastAvailableDate]);

  useEffect(() => {
    if (!data || !sauna.tidal || !sauna.noaaTideStation) return;

    const byDate = groupByDate(data.appointmentTypes);
    const dates = Object.keys(byDate);
    if (dates.length === 0) return;

    Promise.all(
      dates.map((dateStr) =>
        fetch(
          `/api/saunas/tides?station=${encodeURIComponent(sauna.noaaTideStation!)}&date=${dateStr}`
        )
          .then((res) => (res.ok ? res.json() : null))
          .then((json: TidesResponse | null) => ({
            dateStr,
            hourly: json?.hourly ?? [],
          }))
          .catch(() => ({ dateStr, hourly: [] as TideDataPoint[] }))
      )
    ).then((results) => {
      const map: Record<string, TideDataPoint[]> = {};
      for (const { dateStr, hourly } of results) {
        if (hourly.length > 0) map[dateStr] = hourly;
      }
      setTideDataByDate(map);
    });
  }, [data, sauna.tidal, sauna.noaaTideStation]);

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
  const isSingleType = data ? data.appointmentTypes.length <= 1 : false;

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
                  {(!isSingleType || appointmentType.private) && (
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p
                        className="text-xs text-muted-foreground truncate min-w-0"
                        title={`${appointmentType.name}${appointmentType.private ? ` · Private${appointmentType.seats != null ? ` · up to ${appointmentType.seats}` : ""}` : ""}`}
                      >
                        {appointmentType.name}
                        {appointmentType.private && (
                          <span className="ml-1 text-xs text-muted-foreground">
                            · Private{appointmentType.seats != null && ` · up to ${appointmentType.seats}`}
                          </span>
                        )}
                      </p>
                      <span className="text-xs text-muted-foreground shrink-0 whitespace-nowrap">
                        {appointmentType.price != null && `$${appointmentType.price} / `}{appointmentType.durationMinutes}min
                      </span>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-1.5">
                    {slots.map((slot) => {
                      const hourly = tideDataByDate[dateStr];
                      const tideLevel = hourly ? getTideLevelForSlot(slot.time, hourly) : null;
                      return (
                        <TimeSlotBadge
                          key={slot.time}
                          time={slot.time}
                          slotsAvailable={appointmentType.private ? (appointmentType.seats ?? null) : slot.slotsAvailable}
                          className="text-xs gap-1"
                        >
                          {tideLevel && (
                            <TooltipProvider delayDuration={300}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    type="button"
                                    className="inline-flex p-1 -m-1"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onTideTimeClick?.(slot.time, TIDE_LEVEL_COLORS[tideLevel]);
                                    }}
                                  >
                                    <TideLevelIndicator level={tideLevel} />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent>{TIDE_LEVEL_LABELS[tideLevel]}</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </TimeSlotBadge>
                      );
                    })}
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
