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
import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow, CloudSun, Droplets, Sunrise, Sunset, Sun, Thermometer, Wind } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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

function formatTime12h(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, "0")} ${ampm}`;
}

function windDirLabel(deg: number): string {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(deg / 45) % 8];
}

function WeatherIcon({ code }: { code: number }) {
  const cls = "w-5 h-5";
  if (code === 0) return <Sun className={`${cls} text-amber-500`} />;
  if (code <= 3) return <CloudSun className={`${cls} text-amber-400`} />;
  if (code <= 48) return <CloudFog className={`${cls} text-gray-400`} />;
  if (code <= 55) return <CloudDrizzle className={`${cls} text-blue-400`} />;
  if (code <= 67) return <CloudRain className={`${cls} text-blue-500`} />;
  if (code <= 77) return <CloudSnow className={`${cls} text-sky-300`} />;
  if (code <= 82) return <CloudRain className={`${cls} text-blue-400`} />;
  if (code <= 99) return <CloudLightning className={`${cls} text-purple-500`} />;
  return <Cloud className={`${cls} text-gray-400`} />;
}

interface WeatherThresholds {
  maxWindGust: number | null; // mph
  maxRain: number | null; // probability %
  minTemp: number | null; // °F
}

type ConditionLevel = "excellent" | "great" | "good" | "fair" | "poor";


function rateDay(day: DailyWeather, thresholds: WeatherThresholds): ConditionLevel {
  let score = 0; // 0 = best, higher = worse

  const maxSustainedMph = Math.round(day.windSpeedMax * 0.621371);
  const gustMph = Math.round(day.windGustsMax * 0.621371);
  const rain = day.precipProbability;
  const tempMin = Math.round(day.tempMin);

  // Sustained wind tiers (based on sea kayaking guidelines)
  // > 20 mph: dangerous for all paddlers
  // 15-20 mph: challenging, experienced only
  // 10-15 mph: manageable, some chop
  // < 10 mph: calm, ideal
  if (maxSustainedMph > 20) return "poor";
  if (maxSustainedMph > 15) score += 3;
  else if (maxSustainedMph > 10) score += 1;


  // Rain scoring
  if (thresholds.maxRain != null) {
    if (rain > thresholds.maxRain) score += 2;
    else if (rain > thresholds.maxRain * 0.75) score += 1;
  }

  // Temp scoring
  if (thresholds.minTemp != null) {
    if (tempMin < thresholds.minTemp - 10) score += 2;
    else if (tempMin < thresholds.minTemp) score += 1;
  }

  if (score >= 5) return "poor";
  if (score >= 3) return "fair";
  if (score >= 1) return "good";
  if (maxSustainedMph <= 5 && rain <= 20) return "excellent";
  return "great";
}

const conditionShortDesc: Record<ConditionLevel, string> = {
  excellent: "Winds < 5 mph, glassy water",
  great: "5–10 mph, calm & easy",
  good: "10–15 mph, some chop",
  fair: "15–20 mph, experienced only",
  poor: "Over 20 mph, stay off water",
};

function conditionTooltip(level: ConditionLevel, thresholds: WeatherThresholds): string {
  const gust = thresholds.maxWindGust;
  const rain = thresholds.maxRain;
  const temp = thresholds.minTemp;
  switch (level) {
    case "excellent":
      return "Sustained < 5 mph · Rain < 20%";
    case "great":
      return [
        "Sustained < 10 mph",
        rain != null ? `Rain < ${Math.round(rain * 0.75)}%` : null,
        temp != null ? `Low > ${temp + 5}°F` : null,
      ].filter(Boolean).join(" · ");
    case "good":
      return [
        "Sustained 10–15 mph",
        rain != null ? `Rain < ${rain}%` : null,
        temp != null ? `Low > ${temp}°F` : null,
      ].filter(Boolean).join(" · ");
    case "fair":
      return [
        "Sustained 15–20 mph",
        rain != null ? `Rain ${rain}–${Math.round(rain * 1.5)}%` : null,
        temp != null ? `Low ${temp - 10}–${temp}°F` : null,
      ].filter(Boolean).join(" · ");
    case "poor":
      return [
        "Sustained > 20 mph",
        rain != null ? `Rain > ${Math.round(rain * 1.5)}%` : null,
        temp != null ? `Low < ${temp - 10}°F` : null,
      ].filter(Boolean).join(" · ");
  }
}

const conditionColors: Record<ConditionLevel, { bg: string; border: string; pill: string; pillText: string }> = {
  excellent: { bg: "bg-blue-50", border: "border-blue-300", pill: "bg-blue-500", pillText: "text-white" },
  great: { bg: "bg-green-50", border: "border-green-300", pill: "bg-green-500", pillText: "text-white" },
  good: { bg: "bg-yellow-50", border: "border-yellow-300", pill: "bg-yellow-400", pillText: "text-yellow-900" },
  fair: { bg: "bg-orange-50", border: "border-orange-300", pill: "bg-orange-400", pillText: "text-white" },
  poor: { bg: "bg-red-50", border: "border-red-300", pill: "bg-red-500", pillText: "text-white" },
};

function hasAnyThreshold(t: WeatherThresholds): boolean {
  return t.maxWindGust != null || t.maxRain != null || t.minTemp != null;
}

function DayDetail({ day, thresholds }: { day: DailyWeather; thresholds: WeatherThresholds }) {
  const level = hasAnyThreshold(thresholds) ? rateDay(day, thresholds) : null;
  const colors = level ? conditionColors[level] : null;
  const d = new Date(day.date + "T12:00:00");
  const dateLabel = d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  const kphToMph = (v: number) => Math.round(v * 0.621371);
  const mmToIn = (v: number) => (v / 25.4).toFixed(1);

  const daylightMinutes = day.sunrise && day.sunset
    ? (() => {
        const [sh, sm] = day.sunrise.split(":").map(Number);
        const [eh, em] = day.sunset.split(":").map(Number);
        return (eh * 60 + em) - (sh * 60 + sm);
      })()
    : null;
  const daylightLabel = daylightMinutes
    ? `${Math.floor(daylightMinutes / 60)}h ${daylightMinutes % 60}m`
    : null;

  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden">
      {/* Colored header */}
      <div className={`p-4 ${colors ? `${colors.bg} ${colors.border}` : "bg-gray-50"}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <WeatherIcon code={day.weatherCode} />
            <div>
              <div className="font-semibold">{dateLabel}</div>
              {level && (
                <div className={`text-sm font-medium ${
                  level === "excellent" ? "text-green-600" : level === "good" ? "text-yellow-600" : level === "fair" ? "text-orange-500" : "text-red-600"
                }`}>
                  {level.charAt(0).toUpperCase() + level.slice(1)} for Kayaking
                </div>
              )}
            </div>
          </div>
          <div className="text-xs text-muted-foreground capitalize">
            {day.source === "forecast" ? "forecast" : day.source === "seasonal_forecast" ? "seasonal" : "historical"}
          </div>
        </div>
      </div>

      {/* White body */}
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg bg-gray-50 p-3 text-center">
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">High</div>
            <div className="flex items-center justify-center gap-1">
              <Thermometer className="w-4 h-4 text-orange-500" />
              <span className="text-lg font-bold">{Math.round(day.tempMax)}°F</span>
            </div>
          </div>
          <div className="rounded-lg bg-gray-50 p-3 text-center">
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">Low</div>
            <div className="flex items-center justify-center gap-1">
              <Thermometer className="w-4 h-4 text-blue-400" />
              <span className="text-lg font-bold">{Math.round(day.tempMin)}°F</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-blue-500" />
            <div>
              <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">Precipitation</div>
              <div className="font-medium">{day.precipProbability}%{day.precipSum > 0 ? ` — ${mmToIn(day.precipSum)}"` : ""}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Cloud className="w-4 h-4 text-gray-400" />
            <div>
              <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">Cloud Cover</div>
              <div className="font-medium">{Math.round(day.cloudCover)}%</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Wind className="w-4 h-4 text-gray-500" />
          <div>
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">Wind</div>
            <div className="font-medium">{kphToMph(day.windSpeedMean)} / {kphToMph(day.windSpeedMax)}{day.windGustsMax > 0 ? ` / ${kphToMph(day.windGustsMax)}` : ""} mph {windDirLabel(day.windDirection)}</div>
            <div className="text-xs text-muted-foreground">avg / max{day.windGustsMax > 0 ? " / gusts" : ""}</div>
          </div>
        </div>

        {day.sunrise && day.sunset && (
          <div className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 px-4 py-2">
            <div className="flex items-center gap-2">
              <Sunrise className="w-5 h-5 text-amber-500" />
              <div className="text-center">
                <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">Sunrise</div>
                <div className="text-sm font-semibold">{formatTime12h(day.sunrise)}</div>
              </div>
            </div>
            <Sun className="w-5 h-5 text-amber-400" />
            <div className="flex items-center gap-2">
              <div className="text-center">
                <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">Sunset</div>
                <div className="text-sm font-semibold">{formatTime12h(day.sunset)}</div>
              </div>
              <Sunset className="w-5 h-5 text-orange-400" />
            </div>
          </div>
        )}

        {daylightLabel && (
          <div className="text-xs text-center text-muted-foreground">{daylightLabel} of daylight</div>
        )}
      </div>
    </div>
  );
}

function WeatherCalendar({ days, thresholds, selectedDate, onSelectDate }: { days: DailyWeather[]; thresholds: WeatherThresholds; selectedDate: string | null; onSelectDate: (date: string) => void }) {
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
            const isFirstInRow = di === 0 || week.slice(0, di).every((c) => c === null);
            const rated = hasAnyThreshold(thresholds);
            const level = rated ? rateDay(day, thresholds) : null;
            const colors = level ? conditionColors[level] : null;

            const sourceLabel =
              day.source === "forecast"
                ? null
                : day.source === "seasonal_forecast"
                  ? "seasonal"
                  : "avg";

            const isSelected = selectedDate === day.date;

            return (
              <div
                key={day.date}
                onClick={() => onSelectDate(day.date)}
                className={`relative rounded-lg border p-2 text-center cursor-pointer transition-shadow ${
                  isSelected ? "ring-2 ring-blue-500 " : ""
                }${
                  colors
                    ? `${colors.bg} ${colors.border}`
                    : "bg-white border-gray-200"
                } hover:shadow-md`}
                title={`${weatherCodeLabel(day.weatherCode)} | Wind: avg ${Math.round(day.windSpeedMean * 0.621371)} / max ${Math.round(day.windSpeedMax * 0.621371)} / gusts ${Math.round(day.windGustsMax * 0.621371)} mph ${windDirLabel(day.windDirection)} | Cloud: ${Math.round(day.cloudCover)}% | Source: ${day.source}`}
              >
                {level && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className={`absolute -top-2 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide cursor-help ${colors!.pill} ${colors!.pillText}`}>
                        {level}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-64 text-xs">
                      {conditionTooltip(level!, thresholds)}
                    </TooltipContent>
                  </Tooltip>
                )}
                <div className="flex items-start justify-between mt-1">
                  <div className="text-xs text-muted-foreground text-left">
                    {isFirstOfMonth || isFirstInRow ? monthStr + " " : ""}
                    {dayNum}
                  </div>
                  <WeatherIcon code={day.weatherCode} />
                </div>
                <div className="text-xs font-medium">
                  {Math.round(day.tempMax)}° / {Math.round(day.tempMin)}°
                </div>
                {day.precipProbability > 0 && (
                  <div className={`text-[10px] leading-tight flex items-center justify-center gap-0.5 ${day.precipProbability >= 50 ? "text-blue-600" : "text-muted-foreground"}`}>
                    <Droplets className="w-2.5 h-2.5 shrink-0" />
                    {day.precipProbability}%{day.precipSum > 0 ? ` | ${(day.precipSum / 25.4).toFixed(1)}"` : ""}
                  </div>
                )}
                <div className="text-[10px] leading-tight flex items-center justify-center gap-0.5 text-muted-foreground">
                  <Cloud className="w-2.5 h-2.5 shrink-0" />
                  {Math.round(day.cloudCover)}%
                </div>
                <div className="text-[10px] leading-tight flex items-center justify-center gap-0.5 text-muted-foreground">
                  <Wind className="w-2.5 h-2.5 shrink-0" />
                  {Math.round(day.windSpeedMean * 0.621371)}/{Math.round(day.windSpeedMax * 0.621371)}{day.windGustsMax > 0 ? `/${Math.round(day.windGustsMax * 0.621371)}` : ""} {windDirLabel(day.windDirection)}
                </div>
                {sourceLabel && (
                  <div className={`text-[9px] leading-tight mt-0.5 ${
                    day.source === "seasonal_forecast" ? "text-purple-500" : "text-gray-400"
                  }`}>
                    {sourceLabel}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

const LOCATIONS = [
  { name: "Desolation Sound", lat: 50.09847377690354, lon: -124.74442448664045 },
  { name: "Clayoquot Sound", lat: 49.15596909246189, lon: -125.89069319013379 },
] as const;

function WeatherSection({ location, thresholds }: { location: typeof LOCATIONS[number]; thresholds: WeatherThresholds }) {
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const selectedDay = weather?.days.find((d) => d.date === selectedDate) ?? null;

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    fetch(`/api/travel/weather?start_date=${today}&end_date=${TRIP_END}&lat=${location.lat}&lon=${location.lon}`)
      .then((res) => res.ok ? res.json() : null)
      .then((data) => { if (data) setWeather(data); })
      .finally(() => setLoading(false));
  }, [location.lat, location.lon]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{location.name}</CardTitle>
            <CardDescription>
              Temps in °F
              {weather && (() => {
                const sources = new Set(weather.days.map((d) => d.source));
                const parts: string[] = [];
                if (sources.has("forecast")) parts.push("forecast");
                if (sources.has("seasonal_forecast")) parts.push("seasonal forecast");
                if (sources.has("historical")) parts.push("historical avg");
                return parts.length > 0 ? ` — ${parts.join(" + ")}` : "";
              })()}
            </CardDescription>
          </div>
          <TooltipProvider delayDuration={200}>
            <div className="rounded-lg border border-gray-200 p-2.5 max-w-lg">
              <div className="flex items-center gap-1.5 mb-1.5 text-xs font-semibold">
                <span>🛶</span> Kayaking Conditions
              </div>
              <div className="grid grid-cols-5 gap-2 text-[10px]">
                {(["excellent", "great", "good", "fair", "poor"] as const).map((l) => (
                  <Tooltip key={l}>
                    <TooltipTrigger asChild>
                      <div className="cursor-help">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${conditionColors[l].pill}`} />
                          <span className="font-semibold capitalize">{l}</span>
                        </div>
                        <div className="text-muted-foreground leading-tight">
                          {conditionShortDesc[l]}
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="max-w-64 text-xs">
                      {conditionTooltip(l, thresholds)}
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </div>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <TooltipProvider delayDuration={200}>
        {loading && !weather ? (
          <div className="text-sm text-muted-foreground animate-pulse">
            Loading weather...
          </div>
        ) : weather ? (
          <div className="flex gap-4">
            <div className="flex-1 min-w-0">
              <WeatherCalendar days={weather.days} thresholds={thresholds} selectedDate={selectedDate} onSelectDate={setSelectedDate} />
            </div>
            <div className="w-72 shrink-0">
              {selectedDay ? (
                <div className="sticky top-6">
                  <DayDetail day={selectedDay} thresholds={thresholds} />
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-muted-foreground">
                  Select a day to see detailed weather
                </div>
              )}
            </div>
          </div>
        ) : null}
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}

export default function TravelDashboard() {
  const [data, setData] = useState<AvailabilityResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [thresholds] = useState<WeatherThresholds>({
    maxWindGust: 20,
    maxRain: 50,
    minTemp: 40,
  });

  const kayakDays = daysBetween(KAYAK_START, KAYAK_END);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const kayakRes = await fetch(`/api/travel/kayak-availability?start_date=${KAYAK_START}&days=${kayakDays}`);
      if (!kayakRes.ok) throw new Error(`Kayak API failed: ${kayakRes.status}`);
      setData(await kayakRes.json());
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

      {LOCATIONS.map((loc) => (
        <WeatherSection key={loc.name} location={loc} thresholds={thresholds} />
      ))}
    </div>
  );
}
