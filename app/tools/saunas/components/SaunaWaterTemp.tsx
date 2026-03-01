"use client";

import { useState, useEffect, useCallback } from "react";
import { type Sauna } from "@/data/saunas/saunas";
import type { WaterTempResponse } from "@/app/api/saunas/water-temp/route";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
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
  const [open, setOpen] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!sauna.waterTempProvider) return;

    setData(null);

    fetch(`/api/saunas/water-temp?slug=${encodeURIComponent(sauna.slug)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load water temp");
        return res.json();
      })
      .then((json: WaterTempResponse) => setData(json))
      .catch(() => {});
  }, [sauna.slug, sauna.waterTempProvider]);

  const handleMouseEnter = useCallback(() => {
    const id = setTimeout(() => setOpen(true), 300);
    setHoverTimeout(id);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    setOpen(false);
  }, [hoverTimeout]);

  if (!sauna.waterfront) return null;

  // No provider or still loading/errored — show plain Waterfront badge
  if (!sauna.waterTempProvider || !data) {
    return (
      <Badge variant="secondary" className="gap-1">
        <Waves className="h-3 w-3 text-blue-500" />
        Waterfront
      </Badge>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <PopoverTrigger asChild>
          <Badge variant="secondary" className="gap-1 cursor-pointer">
            <Waves className="h-3 w-3 text-blue-500" />
            Waterfront
            <span
              className={`font-medium ${getWaterTempColor(data.waterTempF)}`}
            >
              {data.waterTempF.toFixed(1)}°F
            </span>
          </Badge>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto bg-foreground text-background border-0 px-3 py-1.5"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <a
            href={data.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-background hover:underline text-sm"
          >
            {data.source} · {formatRelativeTime(data.measuredAt)}
          </a>
        </PopoverContent>
      </div>
    </Popover>
  );
}
