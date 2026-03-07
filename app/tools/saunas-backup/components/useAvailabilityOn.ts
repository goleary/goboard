"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { AvailabilityResponse } from "@/app/api/saunas/availability/route";

export interface SlotInfo {
  time: string;
  appointmentType: string;
  slotsAvailable: number | null;
  private?: boolean;
  seats?: number;
}

function localDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function extractSlots(
  data: AvailabilityResponse,
  date: string,
  guests: number | null
): SlotInfo[] {
  const isToday = date === localDateStr(new Date());
  const now = Date.now();
  const minGuests = guests ?? 1;
  const slots: SlotInfo[] = [];

  for (const apt of data.appointmentTypes) {
    // For private sessions, check if guest count fits within seats
    if (apt.private && apt.seats != null && minGuests > apt.seats) continue;

    const dateSlots = apt.dates[date];
    if (!dateSlots) continue;

    for (const slot of dateSlots) {
      const hasCapacity =
        slot.slotsAvailable === null || slot.slotsAvailable >= minGuests;
      if (!hasCapacity) continue;

      if (isToday && new Date(slot.time).getTime() <= now) continue;

      slots.push({
        time: slot.time,
        appointmentType: apt.name,
        slotsAvailable: apt.private ? (apt.seats ?? null) : slot.slotsAvailable,
        ...(apt.private && { private: true }),
        ...(apt.seats != null && { seats: apt.seats }),
      });
    }
  }

  slots.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
  return slots;
}

const MAX_CONCURRENT = 5;

interface AvailabilityResult {
  hasAvailability: boolean;
  slots: SlotInfo[];
}

/**
 * Hook that checks availability for multiple saunas on a given date.
 * Returns a map of slug → { hasAvailability, slots }, plus loading state.
 */
export function useAvailabilityOn(
  slugs: string[],
  date: string | null,
  guests?: number | null
): {
  availability: Record<string, boolean>;
  slots: Record<string, SlotInfo[]>;
  loading: boolean;
} {
  const [rawData, setRawData] = useState<Record<string, AvailabilityResponse | null>>({});
  const [loading, setLoading] = useState(false);
  const [prevDate, setPrevDate] = useState(date);
  const cacheRef = useRef<Map<string, AvailabilityResponse | null>>(new Map());
  const abortRef = useRef<AbortController | null>(null);

  // Clear cache synchronously when date changes so we re-fetch,
  // but keep old results visible until new data arrives
  if (date !== prevDate) {
    setPrevDate(date);
    cacheRef.current.clear();
  }

  // Stable slug list key to avoid re-fetching on every render
  const slugKey = slugs.slice().sort().join(",");

  const fetchAvailability = useCallback(async () => {
    if (!date || slugs.length === 0) {
      setRawData({});

      setLoading(false);
      return;
    }

    // Cancel any in-flight requests
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);

    // Check cache for already-fetched results
    const result: Record<string, AvailabilityResponse | null> = {};
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
      setRawData(result);

      setLoading(false);
      return;
    }

    // Fetch in batches with concurrency limit
    for (let i = 0; i < toFetch.length; i += MAX_CONCURRENT) {
      if (controller.signal.aborted) return;

      const batch = toFetch.slice(i, i + MAX_CONCURRENT);
      const batchResults = await Promise.allSettled(
        batch.map(async (slug) => {
          const res = await fetch(
            `/api/saunas/availability?slug=${encodeURIComponent(slug)}&startDate=${date}`,
            { signal: controller.signal }
          );
          if (!res.ok) return { slug, data: null as AvailabilityResponse | null };
          const data: AvailabilityResponse = await res.json();
          return { slug, data };
        })
      );

      if (controller.signal.aborted) return;

      for (const r of batchResults) {
        if (r.status === "fulfilled") {
          const { slug, data } = r.value;
          result[slug] = data;
          cacheRef.current.set(`${slug}:${date}`, data);
        }
      }
    }

    if (!controller.signal.aborted) {
      setRawData(result);

      setLoading(false);
    }
  }, [slugKey, date]);

  useEffect(() => {
    fetchAvailability();
    return () => {
      abortRef.current?.abort();
    };
  }, [fetchAvailability]);

  // Derive filtered availability from raw data + guests filter
  const availability: Record<string, boolean> = {};
  const slots: Record<string, SlotInfo[]> = {};
  for (const [slug, data] of Object.entries(rawData)) {
    if (!data || !date) {
      availability[slug] = false;
      slots[slug] = [];
    } else {
      const filtered = extractSlots(data, date, guests ?? null);
      availability[slug] = filtered.length > 0;
      slots[slug] = filtered;
    }
  }

  return { availability, slots, loading };
}
