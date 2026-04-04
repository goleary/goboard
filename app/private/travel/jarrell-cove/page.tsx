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
import type { DailyWeather } from "@/app/api/travel/weather/route";
import { weatherCodeLabel } from "@/app/api/travel/weather/route";

interface WeatherResponse {
  days: DailyWeather[];
  checkedAt: string;
  location: { name: string; lat: number; lon: number };
}

const TARGET_START = "2026-07-16";
const TARGET_END = "2026-07-19";
// Jarrell Cove State Park coordinates
const LAT = 47.2753;
const LON = -122.8822;

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

export default function JarrellCovePage() {
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/travel/weather?start_date=${TARGET_START}&end_date=${TARGET_END}&lat=${LAT}&lon=${LON}`
      );
      if (res.ok) setWeather(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="space-y-6 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Jarrell Cove</h1>
          <p className="text-muted-foreground text-sm">
            Car camping — Jul 16 – 19, 2026
          </p>
        </div>
        <Button onClick={fetchData} variant="outline" size="sm" disabled={loading}>
          {loading ? "Checking..." : "Refresh"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Location</CardTitle>
        </CardHeader>
        <CardContent>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d10880!2d-122.8822!3d47.2753!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x549174a4a4b4f5b1%3A0x7c3e8e2e4c0b1b0a!2sJarrell%20Cove%20State%20Park!5e0!3m2!1sen!2sus!4v1"
            width="100%"
            height="350"
            style={{ border: 0, borderRadius: "0.5rem" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Weather</CardTitle>
          <CardDescription>
            Jarrell Cove, WA — {weather?.days[0]?.source === "historical" ? "historical averages (2020-2025)" : "forecast"} — temps in °F
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
