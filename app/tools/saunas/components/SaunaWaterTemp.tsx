"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
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
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const openTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);
  const closeTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);
  const badgeRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

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

  // Position the tooltip when it opens
  useEffect(() => {
    if (open && badgeRef.current) {
      const rect = badgeRef.current.getBoundingClientRect();
      setPos({
        top: rect.bottom + 6,
        left: rect.left + rect.width / 2,
      });
    }
  }, [open]);

  // Close on click outside (for mobile tap-to-open)
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      const target = e.target as Node;
      if (
        badgeRef.current?.contains(target) ||
        tooltipRef.current?.contains(target)
      )
        return;
      setOpen(false);
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [open]);

  const handleMouseEnter = useCallback(() => {
    const wasPendingClose = closeTimeout.current !== undefined;
    clearTimeout(closeTimeout.current);
    closeTimeout.current = undefined;
    clearTimeout(openTimeout.current);
    if (wasPendingClose) return;
    openTimeout.current = setTimeout(() => {
      setOpen(true);
      openTimeout.current = undefined;
    }, 300);
  }, []);

  const handleMouseLeave = useCallback(() => {
    clearTimeout(openTimeout.current);
    openTimeout.current = undefined;
    closeTimeout.current = setTimeout(() => {
      setOpen(false);
      closeTimeout.current = undefined;
    }, 200);
  }, []);

  const handleTap = useCallback(() => {
    setOpen((o) => !o);
  }, []);

  if (!sauna.naturalPlunge) return null;

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
    <>
      <div
        ref={badgeRef}
        className="inline-flex"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Badge
          variant="secondary"
          className="gap-1 cursor-pointer"
          onClick={handleTap}
        >
          <Waves className="h-3 w-3 text-blue-500" />
          Waterfront ·
          <span
            className={`font-medium ${getWaterTempColor(data.waterTempF)}`}
          >
            {Math.round(data.waterTempF)}°F
          </span>
        </Badge>
      </div>
      {open &&
        createPortal(
          <div
            ref={tooltipRef}
            className="fixed z-50 rounded-md bg-foreground px-3 py-1.5 shadow-md"
            style={{
              top: pos.top,
              left: pos.left,
              transform: "translateX(-50%)",
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <a
              href={data.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-background hover:underline text-sm whitespace-nowrap"
            >
              {data.waterTempF.toFixed(1)}°F · {data.source} · {formatRelativeTime(data.measuredAt)}
            </a>
          </div>,
          document.body
        )}
    </>
  );
}
