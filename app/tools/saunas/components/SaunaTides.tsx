"use client";

import { useState, useEffect, useRef } from "react";
import { type Sauna } from "@/data/saunas/saunas";
import type {
  TidesResponse,
  TidePrediction,
  TideDataPoint,
} from "@/app/api/saunas/tides/route";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Area, AreaChart, XAxis, YAxis, ReferenceLine, Tooltip } from "recharts";
import { ArrowUp, ArrowDown, ChevronRight } from "lucide-react";

interface SaunaTidesProps {
  sauna: Sauna;
  /** YYYY-MM-DD date to show tides for. Defaults to today. */
  date?: string | null;
  /** When true, wait for date to be provided before fetching. */
  waitForDate?: boolean;
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

function formatTideLabel(dateStr: string): string {
  const today = localDateStr(new Date());
  if (dateStr === today) return "Tides Today";
  const d = new Date(dateStr + "T00:00:00");
  const label = d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  return `Tides ${label}`;
}

function formatChartTime(timeStr: string): string {
  const d = new Date(timeStr.replace(" ", "T"));
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    hour12: true,
  });
}

const CHART_HEIGHT = 120;
const STROKE_COLOR = "hsl(210, 79%, 56%)";

function TideChart({
  hourly,
  predictions,
}: {
  hourly: TideDataPoint[];
  predictions: TidePrediction[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width);
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full">
      {width > 0 && (
        <AreaChart
          data={hourly}
          width={width}
          height={CHART_HEIGHT}
          margin={{ top: 4, right: 4, bottom: 0, left: -20 }}
        >
          <defs>
            <linearGradient id="tideGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={STROKE_COLOR} stopOpacity={0.3} />
              <stop offset="95%" stopColor={STROKE_COLOR} stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="time"
            tickFormatter={formatChartTime}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
            minTickGap={40}
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
              return formatTideTime(payload[0].payload.time);
            }}
            formatter={(value: number) => [`${value.toFixed(1)} ft`, "Height"]}
          />
          {predictions.map((p) => (
            <ReferenceLine
              key={p.time}
              x={p.time}
              stroke="hsl(var(--muted-foreground))"
              strokeDasharray="3 3"
              strokeOpacity={0.4}
            />
          ))}
          <Area
            type="natural"
            dataKey="height"
            stroke={STROKE_COLOR}
            fill="url(#tideGradient)"
            strokeWidth={2}
          />
        </AreaChart>
      )}
    </div>
  );
}

export function SaunaTides({ sauna, date, waitForDate }: SaunaTidesProps) {
  const [predictions, setPredictions] = useState<TidePrediction[] | null>(null);
  const [hourly, setHourly] = useState<TideDataPoint[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const fetchDate = date || (waitForDate ? null : localDateStr(new Date()));

  useEffect(() => {
    if (!sauna.noaaTideStation || !fetchDate) return;

    setLoading(true);
    setError(null);

    fetch(
      `/api/saunas/tides?station=${encodeURIComponent(sauna.noaaTideStation)}&date=${fetchDate}`
    )
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
  }, [sauna.noaaTideStation, fetchDate]);

  if (!sauna.tidal || !sauna.noaaTideStation) return null;
  if (!fetchDate) return null;

  if (loading) {
    return (
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
          {formatTideLabel(fetchDate)}
        </p>
        <div className="flex gap-1.5">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-24" />
        </div>
      </div>
    );
  }

  if (error || !predictions || predictions.length === 0) {
    return null;
  }

  const noaaUrl = `https://tidesandcurrents.noaa.gov/noaatidepredictions.html?id=${sauna.noaaTideStation}`;

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 text-xs text-muted-foreground uppercase tracking-wide"
      >
        <ChevronRight className={`h-3 w-3 transition-transform ${open ? "rotate-90" : ""}`} />
        {formatTideLabel(fetchDate)}
      </button>
      {open && (
        <div className="mt-2 space-y-2">
          <div className="flex flex-wrap gap-1.5">
            {predictions.map((p) => (
              <Badge key={p.time} variant="outline" className="text-xs gap-1">
                {p.type === "H" ? (
                  <ArrowUp className="h-3 w-3 text-blue-500" />
                ) : (
                  <ArrowDown className="h-3 w-3 text-blue-300" />
                )}
                {formatTideTime(p.time)}
                <span className="text-muted-foreground">
                  {parseFloat(p.height).toFixed(1)} ft
                </span>
              </Badge>
            ))}
          </div>
          {hourly && hourly.length > 0 && (
            <TideChart hourly={hourly} predictions={predictions} />
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
