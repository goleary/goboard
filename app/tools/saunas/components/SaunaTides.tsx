"use client";

import { useState, useEffect, useRef } from "react";
import { type Sauna } from "@/data/saunas/saunas";
import type {
  TidesResponse,
  TidePrediction,
  TideDataPoint,
} from "@/app/api/saunas/tides/route";
import { Skeleton } from "@/components/ui/skeleton";
import { Area, AreaChart, XAxis, YAxis, ReferenceLine, Tooltip, ReferenceDot } from "recharts";
import { ChevronRight } from "lucide-react";

interface SaunaTidesProps {
  sauna: Sauna;
  /** YYYY-MM-DD start date. Defaults to today. */
  date?: string | null;
  /** YYYY-MM-DD end date. Defaults to date. */
  endDate?: string | null;
  /** When true, wait for date to be provided before fetching. */
  waitForDate?: boolean;
  /** Controlled open state for the collapsible section. */
  open?: boolean;
  /** Callback when open state changes. */
  onOpenChange?: (open: boolean) => void;
  /** ISO time string to highlight on the chart. */
  highlightTime?: string | null;
  /** Color for the highlight line. */
  highlightColor?: string | null;
  /** Incrementing counter to force scroll-into-view on repeated clicks. */
  scrollNonce?: number;
}

function localDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatTideTime(timeStr: string): string {
  const d = new Date(timeStr.replace(" ", "T"));
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatTideLabel(startDate: string, endDate: string): string {
  const today = localDateStr(new Date());
  if (startDate === endDate) {
    if (startDate === today) return "Tides Today";
    const d = new Date(startDate + "T00:00:00");
    return `Tides ${d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}`;
  }
  const s = new Date(startDate + "T00:00:00");
  const e = new Date(endDate + "T00:00:00");
  const fmt = (d: Date) => d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  return `Tides ${fmt(s)} – ${fmt(e)}`;
}

function formatChartTime(timeStr: string, multiDay: boolean): string {
  const d = new Date(timeStr.replace(" ", "T"));
  if (multiDay) {
    const day = d.toLocaleDateString("en-US", { weekday: "short" });
    const hour = d.toLocaleTimeString("en-US", { hour: "numeric", hour12: true });
    return `${day} ${hour}`;
  }
  return d.toLocaleTimeString("en-US", { hour: "numeric", hour12: true });
}

const STROKE_COLOR = "hsl(210, 79%, 56%)";

/** Trim to 6am on the first day and 9pm on the last day, but keep interior days continuous. */
function filterHourlyToWindow(hourly: TideDataPoint[]): TideDataPoint[] {
  if (hourly.length === 0) return hourly;
  const firstDate = hourly[0].time.split(" ")[0];
  const lastDate = hourly[hourly.length - 1].time.split(" ")[0];
  return hourly.filter((p) => {
    const [date] = p.time.split(" ");
    const h = new Date(p.time.replace(" ", "T")).getHours();
    if (date === firstDate && h < 6) return false;
    if (date === lastDate && h > 21) return false;
    return true;
  });
}

function TideChart({
  hourly: rawHourly,
  predictions,
  highlightTime,
  highlightColor,
  multiDay,
}: {
  hourly: TideDataPoint[];
  predictions: TidePrediction[];
  highlightTime?: string | null;
  highlightColor?: string | null;
  multiDay: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const hourly = filterHourlyToWindow(rawHourly);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width);
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const predictionDots = predictions
    .map((p) => {
      const pMs = new Date(p.time.replace(" ", "T")).getTime();
      const nearest = hourly.reduce<{ time: string; height: number; d: number }>(
        (best, h) => {
          const d = Math.abs(new Date(h.time.replace(" ", "T")).getTime() - pMs);
          return d < best.d ? { time: h.time, height: h.height, d } : best;
        },
        { time: "", height: 0, d: Infinity }
      );
      if (!nearest.time) return null;
      return { ...nearest, type: p.type, rawHeight: p.height };
    })
    .filter(Boolean) as { time: string; height: number; type: "H" | "L"; rawHeight: string }[];

  const chartHeight = multiDay ? 150 : 120;

  return (
    <div ref={containerRef} className="w-full">
      {width > 0 && hourly.length > 0 && (
        <AreaChart
          data={hourly}
          width={width}
          height={chartHeight}
          margin={{ top: 16, right: 4, bottom: 0, left: -20 }}
        >
          <defs>
            <linearGradient id="tideGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={STROKE_COLOR} stopOpacity={0.3} />
              <stop offset="95%" stopColor={STROKE_COLOR} stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="time"
            tickFormatter={(t) => formatChartTime(t, multiDay)}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
            minTickGap={multiDay ? 60 : 40}
            fontSize={10}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${v}ft`}
            fontSize={10}
            width={40}
          />
          <Tooltip
            labelFormatter={(_, payload) => {
              if (!payload?.[0]?.payload?.time) return "";
              const t = payload[0].payload.time;
              if (multiDay) {
                const d = new Date(t.replace(" ", "T"));
                const day = d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
                return `${day} ${formatTideTime(t)}`;
              }
              return formatTideTime(t);
            }}
            formatter={(value: number) => [`${value.toFixed(1)} ft`, "Height"]}
          />
          <Area
            type="natural"
            dataKey="height"
            stroke={STROKE_COLOR}
            fill="url(#tideGradient)"
            strokeWidth={2}
          />
          {predictionDots.map((p, i) => (
            <ReferenceDot
              key={`${p.time}-${p.type}-${i}`}
              x={p.time}
              y={p.height}
              r={3}
              fill={p.type === "H" ? "hsl(210, 79%, 56%)" : "hsl(210, 79%, 76%)"}
              stroke="white"
              strokeWidth={1}
              label={{
                value: `${p.type === "H" ? "H" : "L"} ${parseFloat(p.rawHeight).toFixed(1)}ft`,
                position: p.type === "H" ? "top" : "bottom",
                fontSize: 9,
                fill: "hsl(var(--muted-foreground))",
              }}
            />
          ))}
          {highlightTime && (() => {
            const slotMs = new Date(highlightTime.replace(" ", "T")).getTime();
            const nearest = hourly.reduce((best, p) => {
              const d = Math.abs(new Date(p.time.replace(" ", "T")).getTime() - slotMs);
              return d < best.d ? { time: p.time, d } : best;
            }, { time: hourly[0].time, d: Infinity });
            const color = highlightColor || "hsl(25, 95%, 53%)";
            return (
              <ReferenceLine
                x={nearest.time}
                stroke={color}
                strokeWidth={2}
                label={{ value: formatTideTime(highlightTime), position: "top", fontSize: 10, fill: color }}
              />
            );
          })()}
        </AreaChart>
      )}
    </div>
  );
}

export function SaunaTides({ sauna, date, endDate: endDateProp, waitForDate, open: controlledOpen, onOpenChange, highlightTime, highlightColor, scrollNonce }: SaunaTidesProps) {
  const [predictions, setPredictions] = useState<TidePrediction[] | null>(null);
  const [hourly, setHourly] = useState<TideDataPoint[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [internalOpen, setInternalOpen] = useState(false);

  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;
  const sectionRef = useRef<HTMLDivElement>(null);

  // Scroll into view when a tide indicator is clicked.
  // We use a ResizeObserver because the chart renders asynchronously
  // (it measures its container width first), so the section height
  // isn't final until the chart appears.
  useEffect(() => {
    if (!highlightTime || !open || !sectionRef.current) return;

    const el = sectionRef.current;
    const scrollParent = el.closest("[class*='overflow-auto']") as HTMLElement | null;
    if (!scrollParent) return;

    const scrollIntoView = () => {
      const parentRect = scrollParent.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      const visibleBottom = parentRect.bottom;
      if (elRect.top >= parentRect.top && elRect.bottom <= visibleBottom) return;
      if (elRect.bottom > visibleBottom) {
        scrollParent.scrollBy({ top: elRect.bottom - visibleBottom, behavior: "smooth" });
      } else if (elRect.top < parentRect.top) {
        scrollParent.scrollBy({ top: elRect.top - parentRect.top, behavior: "smooth" });
      }
    };

    const observer = new ResizeObserver(() => {
      scrollIntoView();
    });
    observer.observe(el);

    return () => observer.disconnect();
  }, [highlightTime, open, scrollNonce]);

  const today = localDateStr(new Date());
  const fetchStartDate = date || (waitForDate ? null : today);
  const fetchEndDate = endDateProp || fetchStartDate;

  useEffect(() => {
    if (!sauna.noaaTideStation || !fetchStartDate) return;

    setPredictions(null);
    setHourly(null);
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({
      station: sauna.noaaTideStation,
      date: fetchStartDate,
    });
    if (fetchEndDate && fetchEndDate !== fetchStartDate) {
      params.set("endDate", fetchEndDate);
    }

    fetch(`/api/saunas/tides?${params}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load tide data");
        return res.json();
      })
      .then((json: TidesResponse) => {
        setPredictions(json.predictions);
        setHourly(json.hourly);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [sauna.noaaTideStation, fetchStartDate, fetchEndDate]);

  if (!sauna.tidal || !sauna.noaaTideStation) return null;
  if (!fetchStartDate) return null;

  const multiDay = fetchEndDate !== fetchStartDate;
  const label = formatTideLabel(fetchStartDate, fetchEndDate || fetchStartDate);

  if (loading) {
    return (
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
          {label}
        </p>
        <Skeleton className={multiDay ? "h-[150px] w-full" : "h-[120px] w-full"} />
      </div>
    );
  }

  if (error || !predictions || predictions.length === 0) {
    return null;
  }

  const noaaUrl = `https://tidesandcurrents.noaa.gov/noaatidepredictions.html?id=${sauna.noaaTideStation}`;

  return (
    <div ref={sectionRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-xs text-muted-foreground uppercase tracking-wide"
      >
        <ChevronRight className={`h-3 w-3 transition-transform ${open ? "rotate-90" : ""}`} />
        {label}
      </button>
      {open && (
        <div className="mt-2 space-y-2">
          {hourly && hourly.length > 0 && (
            <TideChart hourly={hourly} predictions={predictions} highlightTime={highlightTime} highlightColor={highlightColor} multiDay={multiDay} />
          )}
          <a
            href={noaaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground hover:text-foreground inline-block"
          >
            View full forecast on NOAA
          </a>
        </div>
      )}
    </div>
  );
}
