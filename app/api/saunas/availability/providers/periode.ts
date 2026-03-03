import type { PeriodeBookingProviderConfig } from "@/data/saunas/saunas";
import type { AppointmentTypeAvailability, AvailabilitySlot } from "../types";

const PERIODE_API_KEY = "AIzaSyDmV1nOZSBcpndV1SwLFNUFFPQbpTEl4AI";
const PERIODE_PROJECT = "periode-prod";

function parseFirestoreValue(val: Record<string, unknown>): unknown {
  if ("stringValue" in val) return val.stringValue;
  if ("integerValue" in val) return Number(val.integerValue);
  if ("doubleValue" in val) return val.doubleValue;
  if ("booleanValue" in val) return val.booleanValue;
  if ("nullValue" in val) return null;
  if ("arrayValue" in val) {
    const arr = val.arrayValue as { values?: Record<string, unknown>[] };
    return (arr.values ?? []).map(parseFirestoreValue);
  }
  if ("mapValue" in val) {
    const map = val.mapValue as {
      fields?: Record<string, Record<string, unknown>>;
    };
    const obj: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(map.fields ?? {})) {
      obj[k] = parseFirestoreValue(v);
    }
    return obj;
  }
  return null;
}

interface PeriodeSlot {
  time: number;
  length: number;
  available: number;
  reserved: number;
  cancelled: number;
  deleted: number;
  onlyMembers: boolean;
}

export async function fetchPeriodeAvailability(
  provider: PeriodeBookingProviderConfig,
  startDate: string
): Promise<AppointmentTypeAvailability[]> {
  // Build list of 7 date strings
  const dates: string[] = [];
  const start = new Date(startDate);
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    dates.push(d.toISOString().split("T")[0]);
  }

  const results = await Promise.all(
    provider.manifests.map(async (manifest) => {
      // Fetch all 7 dates in parallel for this manifest
      const slotDocs = await Promise.all(
        dates.map(async (date) => {
          const url = `https://firestore.googleapis.com/v1/projects/${PERIODE_PROJECT}/databases/(default)/documents/dateSlots/${provider.merchantId}/manifests/${manifest.manifestId}/slots/${date}?key=${PERIODE_API_KEY}`;
          const res = await fetch(url, { next: { revalidate: 300 } });
          if (res.status === 404) return null;
          if (!res.ok) {
            throw new Error(
              `Periode API returned ${res.status} for manifest ${manifest.manifestId} date ${date}`
            );
          }
          return res.json();
        })
      );

      const dateSlots: Record<string, AvailabilitySlot[]> = {};

      for (const doc of slotDocs) {
        if (!doc?.fields) continue;
        const dateStr = parseFirestoreValue(doc.fields.date) as string;
        const rawSlots = parseFirestoreValue(doc.fields.slots) as PeriodeSlot[];

        dateSlots[dateStr] = rawSlots
          .filter((s) => !s.onlyMembers)
          .map((s) => {
            const hours = Math.floor(s.time);
            const minutes = Math.round((s.time - hours) * 60);
            const timeStr = `${dateStr} ${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`;
            const effectiveAvailable =
              s.available - s.reserved + s.cancelled + s.deleted;
            return {
              time: timeStr,
              slotsAvailable: Math.max(0, effectiveAvailable),
            };
          });
      }

      return {
        appointmentTypeId: manifest.manifestId,
        name: manifest.name,
        price: manifest.price,
        durationMinutes: manifest.durationMinutes,
        dates: dateSlots,
      };
    })
  );

  return results;
}
