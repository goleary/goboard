"use client";

import { useState, useEffect } from "react";
import { type Sauna } from "@/data/saunas/saunas";
import type { WaterTempResponse } from "@/app/api/saunas/water-temp/route";
import { Badge } from "@/components/ui/badge";
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

interface SaunaWaterTempProps {
  sauna: Sauna;
}

export function SaunaWaterTemp({ sauna }: SaunaWaterTempProps) {
  const [data, setData] = useState<WaterTempResponse | null>(null);

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
    <a
      href={data.sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      title={data.source}
    >
      <Badge variant="secondary" className="gap-1">
        <Waves className="h-3 w-3 text-blue-500" />
        Waterfront
        <span className={`font-medium ${getWaterTempColor(data.waterTempF)}`}>
          {data.waterTempF.toFixed(1)}°F
        </span>
      </Badge>
    </a>
  );
}
