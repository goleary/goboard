"use client";

import { useState, useEffect } from "react";
import { type Sauna } from "@/data/saunas/saunas";
import type {
  AvailabilityResponse,
  AppointmentTypeAvailability,
} from "@/app/api/saunas/availability/route";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock } from "lucide-react";

interface SaunaAvailabilityProps {
  sauna: Sauna;
}

function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDateLabel(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayStr = today.toISOString().slice(0, 10);
  const tomorrowStr = tomorrow.toISOString().slice(0, 10);

  if (dateStr === todayStr) return "Today";
  if (dateStr === tomorrowStr) return "Tomorrow";

  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function DateSlots({
  dateStr,
  slots,
}: {
  dateStr: string;
  slots: { time: string; slotsAvailable: number | null }[];
}) {
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-1">
        {formatDateLabel(dateStr)}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {slots.map((slot) => (
          <Badge key={slot.time} variant="outline" className="gap-1 text-xs">
            <Clock className="h-3 w-3" />
            {formatTime(slot.time)}
            {slot.slotsAvailable !== null && (
              <span className="text-muted-foreground">
                ({slot.slotsAvailable} left)
              </span>
            )}
          </Badge>
        ))}
      </div>
    </div>
  );
}

function AppointmentTypeSection({
  appointmentType,
}: {
  appointmentType: AppointmentTypeAvailability;
}) {
  const sortedDates = Object.keys(appointmentType.dates).sort();

  if (sortedDates.length === 0) {
    return (
      <div>
        <p className="text-sm font-medium mb-1">{appointmentType.name}</p>
        <p className="text-xs text-muted-foreground">No upcoming slots</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <p className="text-sm font-medium">{appointmentType.name}</p>
        <span className="text-xs text-muted-foreground">
          ${appointmentType.price} / {appointmentType.durationMinutes}min
        </span>
      </div>
      <div className="space-y-2">
        {sortedDates.map((date) => (
          <DateSlots
            key={date}
            dateStr={date}
            slots={appointmentType.dates[date]}
          />
        ))}
      </div>
    </div>
  );
}

export function SaunaAvailability({ sauna }: SaunaAvailabilityProps) {
  const [data, setData] = useState<AvailabilityResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sauna.bookingProvider) return;

    setLoading(true);
    setError(null);

    const startDate = new Date().toISOString().slice(0, 10);
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

  if (!data || data.appointmentTypes.length === 0) {
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
        {data.appointmentTypes.map((apt) => (
          <AppointmentTypeSection
            key={apt.appointmentTypeId}
            appointmentType={apt}
          />
        ))}
      </div>
    </div>
  );
}
