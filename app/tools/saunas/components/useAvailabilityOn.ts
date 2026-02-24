"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { AvailabilityResponse } from "@/app/api/saunas/availability/route";

function localDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function hasAvailableSlots(
  data: AvailabilityResponse,
  date: string
): boolean {
  const isToday = date === localDateStr(new Date());
  const now = Date.now();

  for (const apt of data.appointmentTypes) {
    const slots = apt.dates[date];
    if (!slots) continue;

    for (const slot of slots) {
      const hasCapacity =
        slot.slotsAvailable === null || slot.slotsAvailable > 0;
      if (!hasCapacity) continue;

      // For today, only count future slots
      if (isToday) {
        if (new Date(slot.time).getTime() > now) return true;
      } else {
        return true;
      }
    }
  }
  return false;
}

const MAX_CONCURRENT = 5;

/**
 * Hook that checks availability for multiple saunas on a given date.
 * Returns a map of slug → hasAvailability, plus loading state.
 */
export function useAvailabilityOn(
  slugs: string[],
  date: string | null
): { availability: Record<string, boolean>; loading: boolean } {
  const [availability, setAvailability] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const cacheRef = useRef<Map<string, boolean>>(new Map());
  const abortRef = useRef<AbortController | null>(null);

  // Stable slug list key to avoid re-fetching on every render
  const slugKey = slugs.slice().sort().join(",");

  const fetchAvailability = useCallback(async () => {
    if (!date || slugs.length === 0) {
      setAvailability({});
      setLoading(false);
      return;
    }

    // Cancel any in-flight requests
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);

    // Check cache for already-fetched results
    const result: Record<string, boolean> = {};
    const toFetch: string[] = [];

    for (const slug of slugs) {
      const cacheKey = `${slug}:${date}`;
      if (cacheRef.current.has(cacheKey)) {
        result[slug] = cacheRef.current.get(cacheKey)!;
      } else {
        toFetch.push(slug);
      }
    }

    // If everything is cached, return immediately
    if (toFetch.length === 0) {
      setAvailability(result);
      setLoading(false);
      return;
    }

    // Fetch in batches with concurrency limit
    for (let i = 0; i < toFetch.length; i += MAX_CONCURRENT) {
      if (controller.signal.aborted) return;

      const batch = toFetch.slice(i, i + MAX_CONCURRENT);
      const results = await Promise.allSettled(
        batch.map(async (slug) => {
          const res = await fetch(
            `/api/saunas/availability?slug=${encodeURIComponent(slug)}&startDate=${date}`,
            { signal: controller.signal }
          );
          if (!res.ok) return { slug, hasAvailability: false };
          const data: AvailabilityResponse = await res.json();
          return { slug, hasAvailability: hasAvailableSlots(data, date) };
        })
      );

      if (controller.signal.aborted) return;

      for (const r of results) {
        if (r.status === "fulfilled") {
          const { slug, hasAvailability } = r.value;
          result[slug] = hasAvailability;
          cacheRef.current.set(`${slug}:${date}`, hasAvailability);
        }
      }
    }

    if (!controller.signal.aborted) {
      setAvailability(result);
      setLoading(false);
    }
  }, [slugKey, date]);

  useEffect(() => {
    fetchAvailability();
    return () => {
      abortRef.current?.abort();
    };
  }, [fetchAvailability]);

  // Clear cache when date changes
  useEffect(() => {
    cacheRef.current.clear();
  }, [date]);

  return { availability, loading };
}
