"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { type Sauna } from "@/data/saunas/saunas";
import type {
  AvailabilityResponse,
  AppointmentTypeAvailability,
} from "@/app/api/saunas/availability/route";
import type { TideDataPoint, TidesResponse } from "@/app/api/saunas/tides/route";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ArrowUpRight, Minus, ArrowDownRight, CalendarIcon, X, Loader2 } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { getTideLevelForSlot, type TideLevel } from "./tideUtils";
import { TimeSlotBadge } from "./TimeSlotBadge";


const DEFAULT_MAX_DAYS = 3;

interface SaunaAvailabilityProps {
  sauna: Sauna;
  availabilityDate?: string | null;
  onAvailabilityDateChange?: (date: string | null) => void;
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

function formatDateButton(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (dateStr === localDateStr(today)) return "Today";
  if (dateStr === localDateStr(tomorrow)) return "Tomorrow";

  return date.toLocaleDateString("en-US", {
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

export function SaunaAvailability({ sauna, availabilityDate, onAvailabilityDateChange, onHasAvailability, onFirstAvailableDate, onLastAvailableDate, onTideTimeClick }: SaunaAvailabilityProps) {
  const [data, setData] = useState<AvailabilityResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tideDataByDate, setTideDataByDate] = useState<Record<string, TideDataPoint[]>>({});
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const today = new Date();

  const handleDateSelect = useCallback(
    (date: Date | undefined) => {
      if (date) {
        onAvailabilityDateChange?.(localDateStr(date));
        setCalendarOpen(false);
      }
    },
    [onAvailabilityDateChange]
  );

  const selectedCalendarDate = availabilityDate
    ? new Date(availabilityDate + "T00:00:00")
    : undefined;

  // Track whether we're refreshing (have stale data) vs initial loading (no data yet)
  const [refreshing, setRefreshing] = useState(false);
  const prevSlugRef = useRef(sauna.slug);

  useEffect(() => {
    if (!sauna.bookingProvider) return;

    // Clear data and show skeletons when switching saunas; keep stale data when changing dates
    const isNewSauna = prevSlugRef.current !== sauna.slug;
    prevSlugRef.current = sauna.slug;
    if (isNewSauna || !data) {
      setData(null);
      setTideDataByDate({});
      setLoading(true);
      setRefreshing(false);
    } else {
      setRefreshing(true);
    }
    setError(null);

    const startDate = availabilityDate || localDateStr(new Date());
    fetch(
      `/api/saunas/availability?slug=${encodeURIComponent(sauna.slug)}&startDate=${startDate}`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load availability");
        return res.json();
      })
      .then((json: AvailabilityResponse) => {
        setData(json);
        setTideDataByDate({});
        setLoading(false);
        setRefreshing(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
        setRefreshing(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sauna.slug, sauna.bookingProvider, availabilityDate]);

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
  const allSortedDates = Object.keys(byDate).sort();
  const isSingleType = data ? data.appointmentTypes.length <= 1 : false;

  // Filter displayed dates: specific date when set, otherwise limit to DEFAULT_MAX_DAYS (unless expanded)
  const displayDates = availabilityDate
    ? allSortedDates.filter((d) => d === availabilityDate)
    : expanded
      ? allSortedDates
      : allSortedDates.slice(0, DEFAULT_MAX_DAYS);
  const hasMoreDates = !availabilityDate && !expanded && allSortedDates.length > displayDates.length;

  if (!data || allSortedDates.length === 0) {
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

  const datePicker = onAvailabilityDateChange ? (
    <div className="flex items-center gap-1">
      <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-6 gap-1.5 text-xs">
            {refreshing ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <CalendarIcon className="h-3 w-3" />
            )}
            {availabilityDate ? formatDateButton(availabilityDate) : "Pick date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedCalendarDate}
            onSelect={handleDateSelect}
            disabled={{ before: today }}
            defaultMonth={selectedCalendarDate}
          />
        </PopoverContent>
      </Popover>
      {availabilityDate && (
        <button
          type="button"
          onClick={() => onAvailabilityDateChange(null)}
          className="h-6 w-6 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  ) : null;

  if (displayDates.length === 0) {
    return (
      <div>
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">
            Availability
          </p>
          {datePicker}
        </div>
        <p className="text-sm text-muted-foreground">
          No availability on this date
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">
          Upcoming Availability
        </p>
        {datePicker}
      </div>
      <div className="space-y-4">
        {displayDates.map((dateStr) => (
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
        {hasMoreDates && (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            + {allSortedDates.length - displayDates.length} more day{allSortedDates.length - displayDates.length > 1 ? "s" : ""} available
          </button>
        )}
      </div>
    </div>
  );
}
