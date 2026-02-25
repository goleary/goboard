"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUp, ArrowDown, TrainFront, RefreshCw } from "lucide-react";
import { stations, DEFAULT_STATION } from "./stations";
import type { Arrival, TransitResponse } from "@/app/api/seattle-transit/route";

const LS_KEY = "seattle-transit-station";

function getSavedStation(): string {
  if (typeof window === "undefined") return DEFAULT_STATION;
  return localStorage.getItem(LS_KEY) ?? DEFAULT_STATION;
}

function formatMinutes(arrivalTime: number, now: number): string {
  const diffMs = arrivalTime - now;
  const diffMin = Math.round(diffMs / 60_000);
  if (diffMin <= 0) return "Now";
  if (diffMin === 1) return "1 min";
  return `${diffMin} min`;
}

function formatTime(epochMs: number): string {
  const d = new Date(epochMs);
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function ArrivalRow({ arrival, now }: { arrival: Arrival; now: number }) {
  const time = arrival.predictedTime ?? arrival.scheduledTime;
  const minutes = formatMinutes(time, now);
  const isNow = time - now <= 30_000;

  return (
    <div className="flex items-center justify-between py-2.5 border-b last:border-b-0 border-slate-100">
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-medium text-slate-800 truncate">
            {arrival.headsign}
          </span>
          <span className="text-xs text-slate-500">{arrival.routeName}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {arrival.isRealtime ? (
          <Badge variant="default" className="bg-green-600 hover:bg-green-600 text-[10px] px-1.5 py-0">
            Live
          </Badge>
        ) : (
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
            Sched
          </Badge>
        )}
        <span className="text-xs text-slate-400 tabular-nums">
          {formatTime(time)}
        </span>
        <span
          className={`text-lg font-semibold tabular-nums min-w-[4rem] text-right ${
            isNow ? "text-green-600" : "text-slate-800"
          }`}
        >
          {minutes}
        </span>
      </div>
    </div>
  );
}

function DirectionCard({
  title,
  subtitle,
  arrivals,
  now,
  icon,
}: {
  title: string;
  subtitle: string;
  arrivals: Arrival[];
  now: number;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          {icon}
          <div>
            <CardTitle className="text-slate-800 text-lg">{title}</CardTitle>
            <p className="text-xs text-slate-500">{subtitle}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {arrivals.length === 0 ? (
          <p className="text-sm text-slate-400 py-2">No upcoming arrivals</p>
        ) : (
          arrivals.map((arrival, i) => (
            <ArrivalRow key={i} arrival={arrival} now={now} />
          ))
        )}
      </CardContent>
    </Card>
  );
}

export default function SeattleTransitClient() {
  const [stationSlug, setStationSlug] = useState(getSavedStation);
  const [data, setData] = useState<TransitResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async (slug: string) => {
    try {
      const res = await fetch(`/api/seattle-transit?station=${slug}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const json: TransitResponse = await res.json();
      setData(json);
      setError(null);
    } catch {
      setError("Could not load transit data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchData(stationSlug);
    const dataInterval = setInterval(() => fetchData(stationSlug), 30_000);
    const clockInterval = setInterval(() => setNow(Date.now()), 15_000);
    return () => {
      clearInterval(dataInterval);
      clearInterval(clockInterval);
    };
  }, [fetchData, stationSlug]);

  function handleStationChange(slug: string) {
    setStationSlug(slug);
    localStorage.setItem(LS_KEY, slug);
  }

  return (
    <main className="flex flex-col items-center py-4 px-4">
      <div className="w-full max-w-[440px]">
        <div className="flex items-center gap-3 mb-1">
          <TrainFront className="w-8 h-8 text-slate-700 shrink-0" />
          <Select value={stationSlug} onValueChange={handleStationChange}>
            <SelectTrigger className="text-3xl font-bold text-slate-800 bg-transparent border-none shadow-none h-auto p-0 focus:ring-0 focus:ring-offset-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {stations.map((s) => (
                <SelectItem key={s.slug} value={s.slug}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <p className="text-sm text-slate-500 mb-6">
          Link Light Rail &middot; Real-time arrivals
        </p>

        {error && (
          <div className="text-red-600 text-sm mb-4 p-3 bg-red-50 rounded-md">
            {error}
          </div>
        )}

        {loading && !data ? (
          <div className="flex items-center justify-center py-12 text-slate-400">
            <RefreshCw className="w-5 h-5 animate-spin mr-2" />
            Loading...
          </div>
        ) : data ? (
          <div className="flex flex-col gap-4">
            <DirectionCard
              title="Northbound"
              subtitle="Toward Lynnwood City Center"
              arrivals={data.northbound}
              now={now}
              icon={<ArrowUp className="w-5 h-5 text-blue-600" />}
            />
            <DirectionCard
              title="Southbound"
              subtitle="Toward Federal Way Downtown"
              arrivals={data.southbound}
              now={now}
              icon={<ArrowDown className="w-5 h-5 text-orange-600" />}
            />
          </div>
        ) : null}

        <p className="text-xs text-slate-400 mt-6 text-center">
          Data from{" "}
          <a
            href="https://pugetsound.onebusaway.org"
            className="text-blue-500 hover:text-blue-400"
            target="_blank"
            rel="noopener noreferrer"
          >
            OneBusAway Puget Sound
          </a>
          {" "}&middot; Updates every 30s
        </p>
      </div>
    </main>
  );
}
