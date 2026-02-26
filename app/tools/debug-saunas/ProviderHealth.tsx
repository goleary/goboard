"use client";

import { useCallback, useEffect, useState } from "react";

interface HealthResult {
  slug: string;
  name: string;
  providerType: string;
  status: "pending" | "ok" | "error";
  responseMs?: number;
  slotCount?: number;
  appointmentTypes?: number;
  error?: string;
}

interface SaunaInfo {
  slug: string;
  name: string;
  providerType: string;
}

const MAX_CONCURRENT = 3;

export default function ProviderHealth({ saunas }: { saunas: SaunaInfo[] }) {
  const [results, setResults] = useState<Map<string, HealthResult>>(new Map());
  const [running, setRunning] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const runChecks = useCallback(async () => {
    setRunning(true);

    // Initialize all as pending
    const initial = new Map<string, HealthResult>();
    for (const s of saunas) {
      initial.set(s.slug, {
        slug: s.slug,
        name: s.name,
        providerType: s.providerType,
        status: "pending",
      });
    }
    setResults(new Map(initial));

    // Process in batches
    const queue = [...saunas];
    const inFlight = new Set<Promise<void>>();

    const checkOne = async (sauna: SaunaInfo) => {
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
              ...next.get(sauna.slug)!,
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
            ...next.get(sauna.slug)!,
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
            ...next.get(sauna.slug)!,
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
  }, [saunas, today]);

  useEffect(() => {
    runChecks();
  }, [runChecks]);

  const sorted = [...results.values()].sort((a, b) => {
    const statusOrder = { error: 0, pending: 1, ok: 2 };
    return statusOrder[a.status] - statusOrder[b.status];
  });

  const okCount = sorted.filter((r) => r.status === "ok").length;
  const errorCount = sorted.filter((r) => r.status === "error").length;
  const pendingCount = sorted.filter((r) => r.status === "pending").length;

  return (
    <section>
      <div className="flex items-center gap-3 mb-3">
        <h2 className="text-lg font-semibold">Provider Health</h2>
        <button
          onClick={runChecks}
          disabled={running}
          className="text-xs px-2 py-1 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
        >
          {running ? "Checking..." : "Re-check"}
        </button>
      </div>
      <p className="text-sm text-gray-500 mb-3">
        Hits the availability API for each configured provider with
        today&apos;s date ({today}).
        {results.size > 0 && (
          <>
            {" "}
            {okCount > 0 && (
              <span className="text-green-700">{okCount} ok</span>
            )}
            {errorCount > 0 && (
              <>
                {" / "}
                <span className="text-red-700">{errorCount} error</span>
              </>
            )}
            {pendingCount > 0 && (
              <>
                {" / "}
                <span className="text-gray-400">{pendingCount} pending</span>
              </>
            )}
          </>
        )}
      </p>
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b text-left">
            <th className="py-2 pr-4">Status</th>
            <th className="py-2 pr-4">Sauna</th>
            <th className="py-2 pr-4">Provider</th>
            <th className="py-2 pr-4 text-right">Time</th>
            <th className="py-2 pr-4 text-right">Types</th>
            <th className="py-2 pr-4 text-right">Slots</th>
            <th className="py-2">Details</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((r) => (
            <tr key={r.slug} className="border-b">
              <td className="py-2 pr-4">
                {r.status === "ok" && (
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
                )}
                {r.status === "error" && (
                  <span className="inline-block w-2 h-2 rounded-full bg-red-500" />
                )}
                {r.status === "pending" && (
                  <span className="inline-block w-2 h-2 rounded-full bg-gray-300 animate-pulse" />
                )}
              </td>
              <td className="py-2 pr-4">{r.name}</td>
              <td className="py-2 pr-4 font-mono text-xs">{r.providerType}</td>
              <td className="py-2 pr-4 text-right font-mono text-xs">
                {r.responseMs != null ? `${r.responseMs}ms` : "—"}
              </td>
              <td className="py-2 pr-4 text-right">
                {r.appointmentTypes ?? "—"}
              </td>
              <td className="py-2 pr-4 text-right">
                {r.slotCount ?? "—"}
              </td>
              <td className="py-2 text-xs text-gray-500 truncate max-w-xs">
                {r.error ?? ""}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
