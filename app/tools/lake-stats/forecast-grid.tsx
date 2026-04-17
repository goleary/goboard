"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Area, AreaChart, CartesianGrid, ReferenceArea, Tooltip as RechartsTooltip, XAxis, YAxis } from "recharts";
import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow, CloudSun, Droplets, Sun, Sunrise, Sunset, Wind } from "lucide-react";

export type HourlyWind = {
  hour: number;
  windMph: number;
  gustMph: number;
};

export type PeriodRating = {
  label: string;
  level: ConditionLevel;
  maxSustainedMph: number;
  precipProbability: number;
};

export type DayForecast = {
  date: string;
  tempMax: number;
  tempMin: number;
  precipProbability: number;
  precipSum: number;
  windSpeedMean: number;
  windSpeedMax: number;
  windGustsMax: number;
  windDirection: number;
  cloudCover: number;
  sunrise: string;
  sunset: string;
  weatherCode: number;
  periods?: PeriodRating[];
  hourlyWind?: HourlyWind[];
};

type ConditionLevel = "excellent" | "great" | "good" | "fair" | "poor";

function rateDay(day: DayForecast): ConditionLevel {
  const mph = Math.round(day.windSpeedMax * 0.621371);
  if (mph >= 15) return "poor";
  if (mph >= 10) return "fair";
  if (mph >= 5) return "good";
  if (mph >= 3) return "great";
  return "excellent";
}

const conditionStyles: Record<ConditionLevel, { bg: string; border: string; pill: string; pillText: string }> = {
  excellent: { bg: "bg-blue-50", border: "border-blue-300", pill: "bg-blue-500", pillText: "text-white" },
  great: { bg: "bg-green-50", border: "border-green-300", pill: "bg-green-500", pillText: "text-white" },
  good: { bg: "bg-yellow-50", border: "border-yellow-300", pill: "bg-yellow-400", pillText: "text-yellow-900" },
  fair: { bg: "bg-orange-50", border: "border-orange-300", pill: "bg-orange-400", pillText: "text-white" },
  poor: { bg: "bg-red-50", border: "border-red-300", pill: "bg-red-500", pillText: "text-white" },
};

function WeatherIcon({ code }: { code: number }) {
  const cls = "w-5 h-5";
  if (code === 0) return <Sun className={`${cls} text-amber-500`} />;
  if (code <= 2) return <CloudSun className={`${cls} text-amber-400`} />;
  if (code === 3) return <Cloud className={`${cls} text-gray-400`} />;
  if (code <= 48) return <CloudFog className={`${cls} text-gray-400`} />;
  if (code <= 55) return <CloudDrizzle className={`${cls} text-blue-400`} />;
  if (code <= 67) return <CloudRain className={`${cls} text-blue-500`} />;
  if (code <= 77) return <CloudSnow className={`${cls} text-sky-300`} />;
  if (code <= 82) return <CloudRain className={`${cls} text-blue-400`} />;
  if (code <= 99) return <CloudLightning className={`${cls} text-purple-500`} />;
  return <Cloud className={`${cls} text-gray-400`} />;
}

const WIND_COLOR_STOPS: Array<{ mph: number; rgb: [number, number, number] }> = [
  { mph: 1.5, rgb: [59, 130, 246] },
  { mph: 4, rgb: [34, 197, 94] },
  { mph: 7.5, rgb: [234, 179, 8] },
  { mph: 12.5, rgb: [249, 115, 22] },
  { mph: 17.5, rgb: [239, 68, 68] },
];

function mphToColor(mph: number): string {
  const s = WIND_COLOR_STOPS;
  if (mph <= s[0].mph) return `rgb(${s[0].rgb.join(",")})`;
  if (mph >= s[s.length - 1].mph) return `rgb(${s[s.length - 1].rgb.join(",")})`;
  for (let i = 0; i < s.length - 1; i++) {
    if (mph <= s[i + 1].mph) {
      const t = (mph - s[i].mph) / (s[i + 1].mph - s[i].mph);
      const r = Math.round(s[i].rgb[0] + (s[i + 1].rgb[0] - s[i].rgb[0]) * t);
      const g = Math.round(s[i].rgb[1] + (s[i + 1].rgb[1] - s[i].rgb[1]) * t);
      const b = Math.round(s[i].rgb[2] + (s[i + 1].rgb[2] - s[i].rgb[2]) * t);
      return `rgb(${r},${g},${b})`;
    }
  }
  return `rgb(${s[0].rgb.join(",")})`;
}

function windDirLabel(deg: number): string {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(deg / 45) % 8];
}

function formatTime12h(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, "0")} ${ampm}`;
}

export function DaylightCard({ sunrise, sunset }: { sunrise: string; sunset: string }) {
  const [sh, sm] = sunrise.split(":").map(Number);
  const [eh, em] = sunset.split(":").map(Number);
  const mins = (eh * 60 + em) - (sh * 60 + sm);

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 space-y-3">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <Sunrise className="w-4 h-4 text-amber-500 shrink-0" />
          <div>
            <div className="text-[10px] uppercase text-muted-foreground">Sunrise</div>
            <div className="font-semibold">{formatTime12h(sunrise)}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Sunset className="w-4 h-4 text-orange-400 shrink-0" />
          <div>
            <div className="text-[10px] uppercase text-muted-foreground">Sunset</div>
            <div className="font-semibold">{formatTime12h(sunset)}</div>
          </div>
        </div>
      </div>
      <div className="text-xs text-center text-muted-foreground border-t border-amber-200 pt-2">
        {Math.floor(mins / 60)}h {mins % 60}m
      </div>
    </div>
  );
}

function DayDetail({ day }: { day: DayForecast }) {
  const kphToMph = (v: number) => Math.round(v * 0.621371);
  const mmToIn = (v: number) => (v / 25.4).toFixed(1);
  const d = new Date(day.date + "T12:00:00");
  const dateLabel = d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const level = rateDay(day);
  const styles = conditionStyles[level];

  const chartRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState(0);
  useEffect(() => {
    const el = chartRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? 0;
      setChartWidth(Math.floor(w));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

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
      <div className={`p-4 ${styles.bg}`}>
        <div className="flex items-center gap-3">
          <WeatherIcon code={day.weatherCode} />
          <div>
            <div className="font-semibold">{dateLabel}</div>
            <div className={`text-sm font-medium ${
              level === "excellent" ? "text-blue-600" : level === "great" ? "text-green-600" : level === "good" ? "text-yellow-600" : level === "fair" ? "text-orange-500" : "text-red-600"
            }`}>
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </div>
          </div>
        </div>
      </div>
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg bg-gray-50 p-3 text-center">
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">High</div>
            <div className="text-lg font-bold">{Math.round(day.tempMax)}°F</div>
          </div>
          <div className="rounded-lg bg-gray-50 p-3 text-center">
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">Low</div>
            <div className="text-lg font-bold">{Math.round(day.tempMin)}°F</div>
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

        {day.hourlyWind && day.hourlyWind.length > 0 && (() => {
          const sunriseHour = day.sunrise ? parseInt(day.sunrise.split(":")[0]) : null;
          const sunsetHour = day.sunset ? parseInt(day.sunset.split(":")[0]) : null;
          const maxData = Math.max(...day.hourlyWind.map((h) => Math.max(h.windMph, h.gustMph)));
          const maxY = Math.max(16, Math.ceil(maxData / 4) * 4);
          const sortedHours = [...day.hourlyWind].sort((a, b) => a.hour - b.hour);
          const minHour = sortedHours[0]?.hour ?? 0;
          const maxHour = sortedHours[sortedHours.length - 1]?.hour ?? 23;
          const hourSpan = Math.max(1, maxHour - minHour);
          const gradId = `windGrad-${day.date}`;
          return (
          <div ref={chartRef}>
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium mb-1">Wind Speed (mph)</div>
            {chartWidth > 0 && (
              <AreaChart width={chartWidth} height={120} data={day.hourlyWind} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
                    {sortedHours.map((h) => (
                      <stop
                        key={h.hour}
                        offset={`${((h.hour - minHour) / hourSpan) * 100}%`}
                        stopColor={mphToColor(h.windMph)}
                      />
                    ))}
                  </linearGradient>
                </defs>
                {sunriseHour != null && <ReferenceArea x1={0} x2={sunriseHour - 1} fill="#1e293b" fillOpacity={0.1} />}
                {sunriseHour != null && <ReferenceArea x1={sunriseHour - 1} x2={sunriseHour} fill="#1e293b" fillOpacity={0.04} />}
                {sunsetHour != null && <ReferenceArea x1={sunsetHour} x2={sunsetHour + 1} fill="#1e293b" fillOpacity={0.04} />}
                {sunsetHour != null && <ReferenceArea x1={sunsetHour + 1} x2={23} fill="#1e293b" fillOpacity={0.1} />}
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="hour"
                  tick={{ fontSize: 10 }}
                  tickFormatter={(h) => `${h % 12 || 12}${h < 12 ? "a" : "p"}`}
                  interval={3}
                />
                <YAxis tick={{ fontSize: 10 }} domain={[0, maxY]} />
                <RechartsTooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8 }}
                  labelFormatter={(h) => `${Number(h) % 12 || 12}:00 ${Number(h) < 12 ? "AM" : "PM"}`}
                  formatter={(value: number, name: string) => [`${value} mph`, name === "windMph" ? "Wind" : "Gusts"]}
                />
                <Area type="monotone" dataKey="gustMph" stroke={`url(#${gradId})`} strokeOpacity={0.35} fill="none" strokeWidth={1.5} dot={false} name="gustMph" />
                <Area type="monotone" dataKey="windMph" stroke={`url(#${gradId})`} fill={`url(#${gradId})`} fillOpacity={0.25} strokeWidth={2.5} dot={false} name="windMph" />
              </AreaChart>
            )}
          </div>
          );
        })()}

        {day.periods && day.periods.length === 3 && (
          <div>
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium mb-1">Conditions by Period</div>
            <div className="space-y-1">
              {day.periods.map((p) => (
                <div key={p.label} className="flex items-center gap-2 text-xs">
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${conditionStyles[p.level].pill}`} />
                  <span className="w-24 text-muted-foreground">{p.label}</span>
                  <span className="font-medium capitalize">{p.level}</span>
                  <span className="text-muted-foreground ml-auto">{p.maxSustainedMph} mph · {p.precipProbability}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {day.sunrise && day.sunset && (
          <div className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 px-4 py-2">
            <span className="flex items-center gap-1.5 text-sm">
              <Sunrise className="w-4 h-4 text-amber-500" />
              <span className="font-semibold">{formatTime12h(day.sunrise)}</span>
            </span>
            <Sun className="w-4 h-4 text-amber-400" />
            <span className="flex items-center gap-1.5 text-sm">
              <span className="font-semibold">{formatTime12h(day.sunset)}</span>
              <Sunset className="w-4 h-4 text-orange-400" />
            </span>
          </div>
        )}

        {daylightLabel && (
          <div className="text-xs text-center text-muted-foreground">{daylightLabel} of daylight</div>
        )}
      </div>
    </div>
  );
}

export function ForecastGrid({ days }: { days: DayForecast[] }) {
  const [expanded, setExpanded] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(days[0]?.date ?? null);
  const visibleDays = expanded ? days.slice(0, 14) : days.slice(0, 7);
  const selectedDay = days.find((d) => d.date === selectedDate) ?? null;
  const cols = 7;
  const kphToMph = (v: number) => Math.round(v * 0.621371);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold text-slate-800">
          {expanded ? "14" : "7"}-Day Paddle Forecast
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Show 7 days" : "Show 14 days"}
        </Button>
      </div>
      <div className="text-sm text-muted-foreground -mt-2">Lake Washington area — temps in °F</div>

      <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1 min-w-0 order-2 md:order-1">
      <TooltipProvider delayDuration={100}>
      {Array.from({ length: Math.ceil(visibleDays.length / 7) }, (_, wi) => {
        const week = visibleDays.slice(wi * 7, wi * 7 + 7);
        const weekOffset = wi * 7;
        return (
          <div
            key={wi}
            className={`gap-0 divide-x divide-gray-200 flex overflow-x-auto md:grid md:overflow-visible -mx-4 px-4 md:mx-0 md:px-0 ${wi > 0 ? "mt-4 pt-4 border-t border-gray-200" : ""}`}
            style={{ gridTemplateColumns: `repeat(${week.length}, 1fr)` }}
          >
            {week.map((day, i) => {
              const globalIdx = weekOffset + i;
              const d = new Date(day.date + "T12:00:00");
              const dayLabel = globalIdx === 0 ? "Today" : globalIdx === 1 ? "Tomorrow" : d.toLocaleDateString("en-US", { weekday: "short", month: "numeric", day: "numeric" });
              const isSelected = selectedDate === day.date;
              const periods = day.periods;

              return (
                <div
                  key={day.date}
                  className={`cursor-pointer transition-colors shrink-0 basis-[72px] md:basis-auto md:shrink ${isSelected ? "bg-blue-50" : "hover:bg-gray-50"}`}
                  onClick={() => setSelectedDate(isSelected ? null : day.date)}
                >
                  <div className={`text-center text-xs font-medium py-2 whitespace-nowrap ${isSelected ? "text-blue-600 font-bold" : "text-muted-foreground"}`}>
                    {dayLabel}
                  </div>
                  <div className="flex justify-center py-1">
                    <WeatherIcon code={day.weatherCode} />
                  </div>
                  <div className="text-center py-1 whitespace-nowrap">
                    <span className="text-lg font-bold">{Math.round(day.tempMax)}°</span>
                    <span className="text-xs text-muted-foreground"> / {Math.round(day.tempMin)}°</span>
                  </div>
                  <div className={`text-center text-xs py-1 whitespace-nowrap ${day.precipProbability >= 50 ? "text-blue-600" : "text-muted-foreground"}`}>
                    {day.precipProbability > 0 ? (
                      <span className="flex items-center justify-center gap-0.5">
                        <Droplets className="w-3 h-3 shrink-0" />
                        {day.precipProbability}%{day.precipSum > 0 ? ` · ${(day.precipSum / 25.4).toFixed(1)}"` : ""}
                      </span>
                    ) : <span className="text-muted-foreground">—</span>}
                  </div>
                  <div className="text-center text-xs text-muted-foreground py-1 whitespace-nowrap">
                    <span className="flex items-center justify-center gap-0.5">
                      <Wind className="w-3 h-3 shrink-0" />
                      {kphToMph(day.windSpeedMax)}{day.windGustsMax > 0 ? `/${kphToMph(day.windGustsMax)}` : ""} {windDirLabel(day.windDirection)}
                    </span>
                  </div>
                  {periods && periods.length === 3 ? (
                    <div className="flex gap-0.5 py-1.5 px-1" onClick={(e) => e.stopPropagation()}>
                      {periods.map((p) => (
                        <Tooltip key={p.label}>
                          <TooltipTrigger asChild>
                            <button type="button" className={`h-2 flex-1 first:rounded-l-full last:rounded-r-full cursor-help ${conditionStyles[p.level].pill}`} />
                          </TooltipTrigger>
                          <TooltipContent side="bottom" className="text-xs">
                            <div className="flex items-center gap-1.5">
                              <span className={`w-2 h-2 rounded-full ${conditionStyles[p.level].pill}`} />
                              <span className="font-semibold capitalize">{p.level}</span>
                            </div>
                            <div className="text-muted-foreground mt-1">{p.label}</div>
                            <div className="flex gap-3 mt-1">
                              <span className="flex items-center gap-1"><Wind className="w-3 h-3" />{p.maxSustainedMph} mph</span>
                              <span className="flex items-center gap-1"><Droplets className="w-3 h-3" />{p.precipProbability}%</span>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  ) : (
                    <div className="flex py-1.5 px-1">
                      <div className={`h-2 w-full rounded-full ${conditionStyles[rateDay(day)].pill}`} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
      </TooltipProvider>
      </div>
      {selectedDay ? (
        <div className="w-full md:w-80 md:shrink-0 order-1 md:order-2">
          <div className="sticky top-6">
            <DayDetail day={selectedDay} />
          </div>
        </div>
      ) : (
        <div className="w-full md:w-80 md:shrink-0 order-1 md:order-2">
          <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-muted-foreground">
            Select a day to see details
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
