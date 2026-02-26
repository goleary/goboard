"use client";

import { useCallback, useEffect, useState } from "react";

interface HealthResult {
  slug: string;
  status: "pending" | "ok" | "error";
  responseMs?: number;
  slotCount?: number;
  appointmentTypes?: number;
  error?: string;
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
            status: "ok",
            responseMs: elapsed,
            slotCount,
            appointmentTypes: types.length,
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
                errors={errors}
                done={done}
                isExpanded={isExpanded}
                onToggle={() => toggle(p.platform)}
                results={results}
              />
            );
          })}
        </tbody>
      </table>
    </section>
  );
}

function PlatformRow({
  platform,
  configured,
  healthy,
  errors,
  done,
  isExpanded,
  onToggle,
  results,
}: {
  platform: PlatformGroup;
  configured: number;
  healthy: number;
  errors: number;
  done: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  results: Map<string, HealthResult>;
}) {
  return (
    <>
      <tr
        className="border-b cursor-pointer hover:bg-gray-50"
        onClick={onToggle}
      >
        <td className="py-2 pr-4 font-mono">
          <span className="inline-block w-4 text-gray-400 text-xs">
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
          return (
            <tr key={s.slug} className="border-b bg-gray-50/50">
              <td className="py-1.5 pr-4 pl-8 text-xs" colSpan={s.providerType ? 1 : 4}>
                <StatusDot status={r?.status ?? null} />
                <a
                  href={`/tools/saunas?sauna=${encodeURIComponent(s.slug)}`}
                  className="ml-2 hover:text-blue-600 hover:underline"
                >
                  {s.name}
                </a>
                {!s.providerType && (
                  <span className="ml-2 text-gray-400">not configured</span>
                )}
              </td>
              {s.providerType && (
                <>
                  <td className="py-1.5 pr-4 text-right font-mono text-xs text-gray-500">
                    {r?.responseMs != null ? `${r.responseMs}ms` : "—"}
                  </td>
                  <td className="py-1.5 pr-4 text-right text-xs text-gray-500">
                    {r?.appointmentTypes != null
                      ? `${r.appointmentTypes} types`
                      : "—"}
                  </td>
                  <td className="py-1.5 pr-4 text-right text-xs text-gray-500">
                    {r?.slotCount != null ? `${r.slotCount} slots` : "—"}
                    {r?.error && (
                      <span className="ml-2 text-red-600 truncate max-w-xs inline-block align-bottom">
                        {r.error}
                      </span>
                    )}
                  </td>
                </>
              )}
            </tr>
          );
        })}
    </>
  );
}

const statusStyles: Record<string, string> = {
  ok: "bg-green-500",
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
