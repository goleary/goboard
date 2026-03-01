"use client";

import { useState, useEffect } from "react";
import { type Sauna } from "@/data/saunas/saunas";
import type { WaterTempResponse } from "@/app/api/saunas/water-temp/route";
import { Skeleton } from "@/components/ui/skeleton";
import { Waves } from "lucide-react";

function getWaterTempColor(tempF: number): string {
  if (tempF < 45) return "text-blue-500";
  if (tempF <= 50) return "text-sky-500";
  if (tempF <= 55) return "text-cyan-500";
  if (tempF <= 60) return "text-teal-500";
  if (tempF <= 65) return "text-emerald-500";
  if (tempF <= 70) return "text-green-500";
  if (tempF <= 75) return "text-yellow-500";
  if (tempF <= 80) return "text-amber-500";
  return "text-orange-500";
}

function formatRelativeTime(isoString: string): string {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffMin = Math.round(diffMs / 60_000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.round(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.round(diffHours / 24)}d ago`;
}

interface SaunaWaterTempProps {
  sauna: Sauna;
}

export function SaunaWaterTemp({ sauna }: SaunaWaterTempProps) {
  const [data, setData] = useState<WaterTempResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sauna.waterTempProvider) return;

    setData(null);
    setLoading(true);

    fetch(`/api/saunas/water-temp?slug=${encodeURIComponent(sauna.slug)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load water temp");
        return res.json();
      })
      .then((json: WaterTempResponse) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [sauna.slug, sauna.waterTempProvider]);

  if (!sauna.waterTempProvider) return null;

  if (loading) {
    return (
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
          Plunge Temperature
        </p>
        <Skeleton className="h-6 w-24" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div>
      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
        Plunge Temperature
      </p>
      <div className="flex items-center gap-2">
        <Waves className="h-4 w-4 text-blue-500" />
        <span
          className={`text-sm font-medium ${getWaterTempColor(data.waterTempF)}`}
        >
          {data.waterTempF.toFixed(1)}°F
        </span>
        <span className="text-xs text-muted-foreground">
          {formatRelativeTime(data.measuredAt)}
        </span>
      </div>
      <a
        href={data.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-muted-foreground hover:text-foreground mt-0.5 inline-block"
      >
        {data.source}
      </a>
    </div>
  );
}
