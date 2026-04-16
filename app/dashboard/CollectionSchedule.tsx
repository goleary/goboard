"use client";

import { useEffect, useState } from "react";
import { Trash2, Recycle, Leaf } from "lucide-react";
import type { CollectionSchedule as CollectionScheduleType } from "@/app/api/collection-calendar/route";
import type { ReactNode } from "react";

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  const [month, day, year] = dateStr.split("/");
  const date = new Date(+year, +month - 1, +day);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function daysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null;
  const [month, day, year] = dateStr.split("/");
  const target = new Date(+year, +month - 1, +day);
  target.setHours(0, 0, 0, 0);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function DaysLabel({ dateStr }: { dateStr: string | null }) {
  const days = daysUntil(dateStr);
  if (days === null) return null;
  if (days === 0)
    return (
      <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">
        Today
      </span>
    );
  if (days === 1)
    return (
      <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">
        Tomorrow
      </span>
    );
  return (
    <span className="text-sm text-slate-500 dark:text-slate-400">
      in {days} days
    </span>
  );
}

type ScheduleKey = "garbage" | "recycling" | "foodYard";

interface CollectionCard {
  keys: ScheduleKey[];
  label: string;
  icons: ReactNode;
}

const COLLECTION_CARDS: CollectionCard[] = [
  {
    keys: ["garbage", "foodYard"],
    label: "Garbage & Food/Yard",
    icons: (
      <div className="flex -space-x-2">
        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-800 text-white z-10">
          <Trash2 size={18} />
        </div>
        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-green-700 text-white">
          <Leaf size={18} />
        </div>
      </div>
    ),
  },
  {
    keys: ["recycling"],
    label: "Recycling",
    icons: (
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white">
        <Recycle size={20} />
      </div>
    ),
  },
];

export default function CollectionSchedule() {
  const [schedule, setSchedule] = useState<CollectionScheduleType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/collection-calendar")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch");
        return r.json();
      })
      .then(setSchedule)
      .catch(() => setError("Could not load collection schedule"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="h-20 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4 text-red-700 dark:text-red-300 text-sm">
        {error}
      </div>
    );
  }

  if (!schedule) return null;

  const sortedCards = [...COLLECTION_CARDS].sort((a, b) => {
    const aNext = a.keys
      .map((k) => schedule[k].next)
      .filter(Boolean)
      .sort()[0];
    const bNext = b.keys
      .map((k) => schedule[k].next)
      .filter(Boolean)
      .sort()[0];
    if (!aNext) return 1;
    if (!bNext) return -1;
    return aNext.localeCompare(bNext);
  });

  return (
    <div className="space-y-3">
      {sortedCards.map(({ keys, label, icons }) => {
        const nextDates = keys.map((k) => schedule[k].next);
        const earliestNext = nextDates
          .filter(Boolean)
          .sort()
          [0] as string | undefined;
        const isToday = daysUntil(earliestNext ?? null) === 0;

        return (
          <div
            key={label}
            className={`flex items-center gap-4 rounded-lg border p-4 ${
              isToday
                ? "border-amber-400 bg-amber-50 dark:bg-amber-900/20"
                : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            }`}
          >
            {icons}
            <div className="flex-1 min-w-0">
              <div className="font-medium text-slate-900 dark:text-slate-100">
                {label}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-300">
                {formatDate(earliestNext ?? null)}
              </div>
            </div>
            <DaysLabel dateStr={earliestNext ?? null} />
          </div>
        );
      })}

      <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
        Pickup day: {schedule.pickupDay}s (weekly)
      </p>
    </div>
  );
}
