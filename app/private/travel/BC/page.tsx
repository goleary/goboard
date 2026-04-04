"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { KayakAvailability } from "@/app/api/travel/kayak-availability/route";
import type { DailyWeather } from "@/app/api/travel/weather/route";
import { weatherCodeLabel } from "@/app/api/travel/weather/route";

interface AvailabilityResponse {
  dailyAvailability: KayakAvailability[];
  calendarDays: Record<string, number>;
  checkedAt: string;
  bookingUrl: string;
}

interface WeatherResponse {
  days: DailyWeather[];
  checkedAt: string;
  location: { name: string; lat: number; lon: number };
}

const TRIP_START = "2026-05-16";
const TRIP_END = "2026-05-31";
const KAYAK_START = "2026-05-17";
const KAYAK_END = "2026-06-06";
const RENTAL_DURATION = 5;

function daysBetween(a: string, b: string) {
  const msPerDay = 86400000;
  return Math.round(
    (new Date(b + "T12:00:00").getTime() -
      new Date(a + "T12:00:00").getTime()) /
      msPerDay
  ) + 1;
}

function formatDate(dateStr: string, opts?: Intl.DateTimeFormatOptions) {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", opts ?? {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function StatusBadge({ status }: { status: KayakAvailability["status"] }) {
  switch (status) {
    case "available":
      return <Badge className="bg-green-600">Available</Badge>;
    case "sold_out":
      return <Badge variant="destructive">Sold Out</Badge>;
    case "unavailable":
      return <Badge variant="secondary">Unavailable</Badge>;
    case "error":
      return <Badge variant="outline">Error</Badge>;
  }
}

function overallStatus(days: KayakAvailability[]): KayakAvailability["status"] {
  if (days.some((d) => d.status === "error")) return "error";
  if (days.some((d) => d.status === "sold_out")) return "sold_out";
  if (days.some((d) => d.status === "unavailable")) return "unavailable";
  return "available";
}

function AvailabilityCalendar({
  dailyAvailability,
}: {
  dailyAvailability: KayakAvailability[];
}) {
  if (dailyAvailability.length === 0) return null;

  // Group days into weeks (Sun-Sat)
  const weeks: (KayakAvailability | null)[][] = [];
  let currentWeek: (KayakAvailability | null)[] = [];

  // Pad the start of the first week
  const firstDow = new Date(dailyAvailability[0].date + "T12:00:00").getDay();
  for (let i = 0; i < firstDow; i++) {
    currentWeek.push(null);
  }

  for (const day of dailyAvailability) {
    const dow = new Date(day.date + "T12:00:00").getDay();
    if (dow === 0 && currentWeek.length > 0) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentWeek.push(day);
  }
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) currentWeek.push(null);
    weeks.push(currentWeek);
  }

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div
            key={d}
            className="text-center text-xs text-muted-foreground font-medium py-1"
          >
            {d}
          </div>
        ))}
      </div>
      {weeks.map((week, wi) => (
        <div key={wi} className="grid grid-cols-7 gap-1 mb-1">
          {week.map((day, di) => {
            if (!day) return <div key={di} />;

            const d = new Date(day.date + "T12:00:00");
            const dayNum = d.getDate();
            const monthStr = d.toLocaleDateString("en-US", { month: "short" });
            const isFirstOfMonth = dayNum === 1;
            const isLow = day.available !== null && day.available <= 3;

            return (
              <div
                key={day.date}
                className={`rounded-lg border p-2 text-center ${
                  day.status === "sold_out"
                    ? "bg-red-50 border-red-200"
                    : day.status === "available"
                      ? isLow
                        ? "bg-amber-50 border-amber-200"
                        : "bg-green-50 border-green-200"
                      : "bg-muted border-border"
                }`}
              >
                <div className="text-xs text-muted-foreground">
                  {isFirstOfMonth || di === 0 && wi === 0 ? monthStr + " " : ""}
                  {dayNum}
                </div>
                <div
                  className={`text-lg font-bold ${
                    day.status === "sold_out"
                      ? "text-red-600"
                      : isLow
                        ? "text-amber-600"
                        : "text-green-700"
                  }`}
                >
                  {day.available !== null ? day.available : "?"}
                </div>
                <div className="text-[10px] text-muted-foreground leading-tight">
                  {day.status === "sold_out" ? "sold out" : "kayaks"}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function weatherIcon(code: number) {
  if (code === 0) return "\u2600\uFE0F";
  if (code <= 3) return "\u26C5";
  if (code <= 48) return "\uD83C\uDF2B\uFE0F";
  if (code <= 67) return "\uD83C\uDF27\uFE0F";
  if (code <= 77) return "\u2744\uFE0F";
  if (code <= 82) return "\uD83C\uDF26\uFE0F";
  if (code <= 99) return "\u26C8\uFE0F";
  return "?";
}

function WeatherCalendar({ days }: { days: DailyWeather[] }) {
  if (days.length === 0) return null;

  const weeks: (DailyWeather | null)[][] = [];
  let currentWeek: (DailyWeather | null)[] = [];

  const firstDow = new Date(days[0].date + "T12:00:00").getDay();
  for (let i = 0; i < firstDow; i++) currentWeek.push(null);

  for (const day of days) {
    const dow = new Date(day.date + "T12:00:00").getDay();
    if (dow === 0 && currentWeek.length > 0) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentWeek.push(day);
  }
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) currentWeek.push(null);
    weeks.push(currentWeek);
  }

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="text-center text-xs text-muted-foreground font-medium py-1">
            {d}
          </div>
        ))}
      </div>
      {weeks.map((week, wi) => (
        <div key={wi} className="grid grid-cols-7 gap-1 mb-1">
          {week.map((day, di) => {
            if (!day) return <div key={di} />;

            const d = new Date(day.date + "T12:00:00");
            const dayNum = d.getDate();
            const monthStr = d.toLocaleDateString("en-US", { month: "short" });
            const isFirstOfMonth = dayNum === 1;
            const isRainy = day.precipProbability >= 50;

            return (
              <div
                key={day.date}
                className={`rounded-lg border p-2 text-center ${
                  isRainy ? "bg-blue-50 border-blue-200" : "bg-amber-50 border-amber-200"
                }`}
                title={`${weatherCodeLabel(day.weatherCode)} | Wind: ${day.windSpeedMax} km/h`}
              >
                <div className="text-xs text-muted-foreground">
                  {isFirstOfMonth || (di === 0 && wi === 0) ? monthStr + " " : ""}
                  {dayNum}
                </div>
                <div className="text-lg leading-tight">{weatherIcon(day.weatherCode)}</div>
                <div className="text-xs font-medium">
                  {Math.round(day.tempMax)}° / {Math.round(day.tempMin)}°
                </div>
                <div className={`text-[10px] leading-tight ${isRainy ? "text-blue-600" : "text-muted-foreground"}`}>
                  {day.precipProbability}% rain
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default function TravelDashboard() {
  const [data, setData] = useState<AvailabilityResponse | null>(null);
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const kayakDays = daysBetween(KAYAK_START, KAYAK_END);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [kayakRes, weatherRes] = await Promise.all([
        fetch(`/api/travel/kayak-availability?start_date=${KAYAK_START}&days=${kayakDays}`),
        fetch(`/api/travel/weather?start_date=${TRIP_START}&end_date=${TRIP_END}`),
      ]);
      if (!kayakRes.ok) throw new Error(`Kayak API failed: ${kayakRes.status}`);
      setData(await kayakRes.json());
      if (weatherRes.ok) setWeather(await weatherRes.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [kayakDays]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="space-y-6 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">British Columbia</h1>
          <p className="text-muted-foreground text-sm">
            Vancouver Island & Desolation Sound — May 2026
          </p>
        </div>
        <Button onClick={fetchData} variant="outline" size="sm" disabled={loading}>
          {loading ? "Checking..." : "Refresh"}
        </Button>
      </div>

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-4">
            <p className="text-destructive text-sm">Error: {error}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">
                Double Kayak Availability
              </CardTitle>
              <CardDescription>
                Terracentric Coastal Adventures - Lund, BC
                {" | "}
                {formatDate(KAYAK_START, { month: "short", day: "numeric" })}
                {" - "}
                {formatDate(KAYAK_END, { month: "short", day: "numeric", year: "numeric" })}
                {" | "}
                {RENTAL_DURATION}-day rental: $460 CAD
              </CardDescription>
            </div>
            {data && <StatusBadge status={overallStatus(data.dailyAvailability)} />}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading && !data ? (
            <div className="text-sm text-muted-foreground animate-pulse">
              Checking availability for {kayakDays} days...
            </div>
          ) : data ? (
            <>
              <AvailabilityCalendar
                dailyAvailability={data.dailyAvailability}
              />

              <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                <span>
                  Last checked:{" "}
                  {new Date(data.checkedAt).toLocaleString()}
                </span>
                <a
                  href={data.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Book on website
                </a>
              </div>
            </>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Weather</CardTitle>
          <CardDescription>
            Lund, BC — {weather?.days[0]?.source === "historical" ? "historical averages (2020-2025)" : "forecast"} — temps in °F
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading && !weather ? (
            <div className="text-sm text-muted-foreground animate-pulse">
              Loading weather...
            </div>
          ) : weather ? (
            <WeatherCalendar days={weather.days} />
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
