"use client";

import { TimeSlotBadge } from "@/app/tools/saunas/components/TimeSlotBadge";
import { useCallback, useEffect, useState } from "react";

interface SlotData {
  time: string;
  slotsAvailable: number | null;
}

interface TypeData {
  name: string;
  price?: number;
  durationMinutes: number;
  private?: boolean;
  seats?: number;
  dates: Record<string, SlotData[]>;
}

interface HealthResult {
  slug: string;
  status: "pending" | "ok" | "warn" | "error";
  responseMs?: number;
  slotCount?: number;
  appointmentTypes?: number;
  error?: string;
  data?: TypeData[];
}

export interface PlatformSauna {
  slug: string;
  name: string;
  providerType: string | null;
  bookingUrl?: string;
}

export interface PlatformGroup {
  platform: string;
  saunas: PlatformSauna[];
}

const MAX_CONCURRENT = 3;

export default function ProviderHealth({
  platforms,
}: {
  platforms: PlatformGroup[];
}) {
  const [results, setResults] = useState<Map<string, HealthResult>>(new Map());
  const [running, setRunning] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [expandedSaunas, setExpandedSaunas] = useState<Set<string>>(new Set());

  const today = new Date().toISOString().split("T")[0];

  const configuredSaunas = platforms.flatMap((p) =>
    p.saunas.filter((s) => s.providerType)
  );

  const toggle = (platform: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(platform)) next.delete(platform);
      else next.add(platform);
      return next;
    });
  };

  const toggleSauna = (slug: string) => {
    setExpandedSaunas((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  const runChecks = useCallback(async () => {
    setRunning(true);

    const initial = new Map<string, HealthResult>();
    for (const s of configuredSaunas) {
      initial.set(s.slug, { slug: s.slug, status: "pending" });
    }
    setResults(new Map(initial));

    const queue = [...configuredSaunas];
    const inFlight = new Set<Promise<void>>();

    const checkOne = async (sauna: PlatformSauna) => {
      const start = performance.now();
      try {
        const res = await fetch(
          `/api/saunas/availability?slug=${encodeURIComponent(sauna.slug)}&startDate=${today}`
        );
        const elapsed = Math.round(performance.now() - start);

        if (!res.ok) {
          const body = await res.text();
          setResults((prev) => {
            const next = new Map(prev);
            next.set(sauna.slug, {
              slug: sauna.slug,
              status: "error",
              responseMs: elapsed,
              error: `HTTP ${res.status}: ${body.slice(0, 120)}`,
            });
            return next;
          });
          return;
        }

        const data = await res.json();
        const types = data.appointmentTypes ?? [];
        let slotCount = 0;
        for (const t of types) {
          for (const slots of Object.values(t.dates ?? {})) {
            slotCount += (slots as unknown[]).length;
          }
        }

        setResults((prev) => {
          const next = new Map(prev);
          next.set(sauna.slug, {
            slug: sauna.slug,
            status:
              types.length === 0 || slotCount === 0 ? "warn" : "ok",
            responseMs: elapsed,
            slotCount,
            appointmentTypes: types.length,
            data: types,
          });
          return next;
        });
      } catch (err) {
        const elapsed = Math.round(performance.now() - start);
        setResults((prev) => {
          const next = new Map(prev);
          next.set(sauna.slug, {
            slug: sauna.slug,
            status: "error",
            responseMs: elapsed,
            error: err instanceof Error ? err.message : "Unknown error",
          });
          return next;
        });
      }
    };

    while (queue.length > 0 || inFlight.size > 0) {
      while (queue.length > 0 && inFlight.size < MAX_CONCURRENT) {
        const sauna = queue.shift()!;
        const p = checkOne(sauna).then(() => {
          inFlight.delete(p);
        });
        inFlight.add(p);
      }
      if (inFlight.size > 0) {
        await Promise.race(inFlight);
      }
    }

    setRunning(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [today]);

  useEffect(() => {
    runChecks();
  }, [runChecks]);

  const done = results.size > 0 && ![...results.values()].some((r) => r.status === "pending");
  const okCount = [...results.values()].filter((r) => r.status === "ok").length;
  const warnCount = [...results.values()].filter((r) => r.status === "warn").length;
  const errorCount = [...results.values()].filter((r) => r.status === "error").length;

  return (
    <section>
      <div className="flex items-center gap-3 mb-1">
        <h2 className="text-lg font-semibold">Platforms</h2>
        <button
          onClick={runChecks}
          disabled={running}
          className="text-xs px-2 py-1 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
        >
          {running ? "Checking..." : "Re-check"}
        </button>
        {done && (
          <span className="text-xs text-gray-500">
            <span className="text-green-700">{okCount} healthy</span>
            {warnCount > 0 && (
              <>
                {" / "}
                <span className="text-amber-600">{warnCount} warn</span>
              </>
            )}
            {errorCount > 0 && (
              <>
                {" / "}
                <span className="text-red-700">{errorCount} error</span>
              </>
            )}
          </span>
        )}
      </div>
      <p className="text-xs text-gray-400 mb-4">
        Health checks hit the availability API with today&apos;s date ({today}).
      </p>

      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b text-left">
            <th className="py-2 pr-4">Platform</th>
            <th className="py-2 pr-4 text-right">Total</th>
            <th className="py-2 pr-4 text-right">Configured</th>
            <th className="py-2 pr-4 text-right">Healthy</th>
          </tr>
        </thead>
        <tbody>
          {platforms.map((p) => {
            const configured = p.saunas.filter((s) => s.providerType);
            const healthy = configured.filter(
              (s) => results.get(s.slug)?.status === "ok"
            ).length;
            const warns = configured.filter(
              (s) => results.get(s.slug)?.status === "warn"
            ).length;
            const errors = configured.filter(
              (s) => results.get(s.slug)?.status === "error"
            ).length;
            const isExpanded = expanded.has(p.platform);

            return (
              <PlatformRow
                key={p.platform}
                platform={p}
                configured={configured.length}
                healthy={healthy}
                warns={warns}
                errors={errors}
                done={done}
                isExpanded={isExpanded}
                onToggle={() => toggle(p.platform)}
                results={results}
                expandedSaunas={expandedSaunas}
                onToggleSauna={toggleSauna}
              />
            );
          })}
        </tbody>
      </table>
    </section>
  );
}

const toggleColorClass: Record<string, string> = {
  ok: "text-green-600",
  warn: "text-amber-500",
  error: "text-red-600",
  pending: "text-gray-400 animate-pulse",
};

function platformToggleColor(
  configured: number,
  done: boolean,
  errors: number,
  warns: number
): string {
  if (configured === 0) return "text-gray-400";
  if (!done) return "text-gray-400 animate-pulse";
  if (errors > 0) return "text-red-600";
  if (warns > 0) return "text-amber-500";
  return "text-green-600";
}

function PlatformRow({
  platform,
  configured,
  healthy,
  warns,
  errors,
  done,
  isExpanded,
  onToggle,
  results,
  expandedSaunas,
  onToggleSauna,
}: {
  platform: PlatformGroup;
  configured: number;
  healthy: number;
  warns: number;
  errors: number;
  done: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  results: Map<string, HealthResult>;
  expandedSaunas: Set<string>;
  onToggleSauna: (slug: string) => void;
}) {
  const arrowColor = platformToggleColor(configured, done, errors, warns);

  return (
    <>
      <tr
        className="border-b cursor-pointer hover:bg-gray-50"
        onClick={onToggle}
      >
        <td className="py-2 pr-4 font-mono">
          <span className={`inline-block w-4 text-xs ${arrowColor}`}>
            {isExpanded ? "▼" : "▶"}
          </span>
          {platform.platform}
        </td>
        <td className="py-2 pr-4 text-right">{platform.saunas.length}</td>
        <td className="py-2 pr-4 text-right">
          {configured > 0 ? (
            <span className="text-green-700">
              {configured}/{platform.saunas.length}
            </span>
          ) : (
            <span className="text-gray-400">0</span>
          )}
        </td>
        <td className="py-2 pr-4 text-right">
          {configured === 0 ? (
            <span className="text-gray-400">&mdash;</span>
          ) : !done ? (
            <span className="text-gray-400 animate-pulse">...</span>
          ) : errors > 0 ? (
            <span className="text-red-700">
              {healthy}/{configured}
            </span>
          ) : warns > 0 ? (
            <span className="text-amber-600">
              {healthy}/{configured}
            </span>
          ) : (
            <span className="text-green-700">
              {healthy}/{configured}
            </span>
          )}
        </td>
      </tr>
      {isExpanded &&
        platform.saunas.map((s) => {
          const r = results.get(s.slug);
          const saunaExpanded = expandedSaunas.has(s.slug);
          const saunaArrowColor = s.providerType
            ? (toggleColorClass[r?.status ?? ""] ?? "text-gray-400")
            : "text-gray-300";

          return (
            <SaunaRow
              key={s.slug}
              sauna={s}
              result={r}
              isExpanded={saunaExpanded}
              arrowColor={saunaArrowColor}
              onToggle={() => s.providerType && onToggleSauna(s.slug)}
            />
          );
        })}
    </>
  );
}

function SaunaRow({
  sauna,
  result,
  isExpanded,
  arrowColor,
  onToggle,
}: {
  sauna: PlatformSauna;
  result: HealthResult | undefined;
  isExpanded: boolean;
  arrowColor: string;
  onToggle: () => void;
}) {
  return (
    <>
      <tr
        className={`border-b bg-gray-50/50 ${sauna.providerType ? "cursor-pointer hover:bg-gray-100/50" : ""}`}
        onClick={onToggle}
      >
        <td className="py-1.5 pr-4 pl-6 text-xs" colSpan={sauna.providerType ? 1 : 4}>
          {sauna.providerType && (
            <span className={`inline-block w-4 text-xs ${arrowColor}`}>
              {isExpanded ? "▼" : "▶"}
            </span>
          )}
          {!sauna.providerType && <span className="inline-block w-4" />}
          <StatusDot status={result?.status ?? null} />
          <a
            href={`/tools/saunas?sauna=${encodeURIComponent(sauna.slug)}`}
            className="ml-2 hover:text-blue-600 hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {sauna.name}
          </a>
          {!sauna.providerType && (
            <span className="ml-2 text-gray-400">not configured</span>
          )}
        </td>
        {sauna.providerType && (
          <>
            <td className="py-1.5 pr-4 text-right font-mono text-xs text-gray-500">
              {result?.responseMs != null ? `${result.responseMs}ms` : "—"}
            </td>
            <td className="py-1.5 pr-4 text-right text-xs text-gray-500">
              {result?.appointmentTypes != null
                ? `${result.appointmentTypes} types`
                : "—"}
            </td>
            <td className="py-1.5 pr-4 text-right text-xs text-gray-500">
              {result?.slotCount != null ? `${result.slotCount} slots` : "—"}
              {result?.error && (
                <span className="ml-2 text-red-600 truncate max-w-xs inline-block align-bottom">
                  {result.error}
                </span>
              )}
            </td>
          </>
        )}
      </tr>
      {isExpanded && result?.data && (
        <tr className="border-b bg-gray-100/50">
          <td colSpan={4} className="py-2 pl-14 pr-4">
            <SlotDetails types={result.data} />
          </td>
        </tr>
      )}
    </>
  );
}

function SlotDetails({ types }: { types: TypeData[] }) {
  if (types.length === 0) {
    return <p className="text-xs text-gray-400 italic">No appointment types returned</p>;
  }

  return (
    <div className="space-y-3">
      {types.map((t, i) => {
        const allDates = Object.keys(t.dates).sort();
        const totalSlots = allDates.reduce(
          (sum, d) => sum + t.dates[d].length,
          0
        );

        return (
          <div key={i} className="text-xs">
            <div className="font-medium text-gray-700 mb-1">
              {t.name}
              <span className="ml-2 font-normal text-gray-400">
                {t.price != null && `$${t.price} / `}{t.durationMinutes}min
                {t.private && " / private"}
                {t.seats && ` / ${t.seats} seats`}
                {" — "}
                {totalSlots} slot{totalSlots !== 1 ? "s" : ""}
              </span>
            </div>
            {allDates.length === 0 ? (
              <p className="text-gray-400 italic pl-2">No dates with availability</p>
            ) : (
              <div className="pl-2 space-y-1">
                {allDates.map((date) => (
                  <div key={date} className="flex gap-2 items-start">
                    <span className="text-gray-500 font-mono w-20 shrink-0 pt-0.5">
                      {date}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {t.dates[date].map((slot, j) => (
                        <TimeSlotBadge
                          key={j}
                          time={slot.time}
                          slotsAvailable={slot.slotsAvailable}
                          className="text-xs gap-1"
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

const statusStyles: Record<string, string> = {
  ok: "bg-green-500",
  warn: "bg-amber-500",
  error: "bg-red-500",
  pending: "bg-gray-300 animate-pulse",
};

function StatusDot({ status }: { status: string | null }) {
  return (
    <span
      className={`inline-block w-1.5 h-1.5 rounded-full ${statusStyles[status ?? ""] ?? "bg-gray-200"}`}
    />
  );
}
