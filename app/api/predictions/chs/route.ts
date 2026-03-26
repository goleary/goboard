import { NextRequest } from "next/server";
import { SECONDARY_CURRENT_STATIONS, SecondaryCurrentStation } from "./secondary-stations";

const CHS_API_BASE = "https://api-iwls.dfo-mpo.gc.ca/api/v1";

// Current stations across the Salish Sea
const CHS_CURRENT_STATIONS = [
  // Juan de Fuca / Victoria
  { id: "63aeee1d84e5432cd3b6c500", code: "07100", name: "Juan de Fuca - East", lat: 48.2317, lng: -123.53 },
  { id: "63aeee896a2b9417c034d337", code: "07090", name: "Race Passage", lat: 48.3067, lng: -123.5367 },
  // Gulf Islands
  { id: "63aef09f84e5432cd3b6c509", code: "07527", name: "Active Pass", lat: 48.8604, lng: -123.3128 },
  { id: "63aef0ed84e5432cd3b6c50b", code: "07438", name: "Porlier Pass", lat: 49.015, lng: -123.585 },
  { id: "63aef12e84e5432cd3b6db8d", code: "07545", name: "Gabriola Passage", lat: 49.129, lng: -123.704 },
  { id: "63aef1866a2b9417c035030f", code: "07487", name: "Dodd Narrows", lat: 49.1344, lng: -123.817 },
  // Vancouver / Burrard Inlet
  { id: "5dd30650e0fdc4b9b4be6c2d", code: "07745", name: "Second Narrows", lat: 49.2947, lng: -123.0245 },
  { id: "5cebf1e43d0f4a073c4bc434", code: "07724", name: "Calamity Point", lat: 49.3126, lng: -123.1277 },
  { id: "5dd30650e0fdc4b9b4be6d24", code: "07721", name: "First Narrows", lat: 49.316, lng: -123.14 },
  // Sunshine Coast
  { id: "63aef40a6a2b9417c0350313", code: "07845", name: "Sechelt Rapids", lat: 49.7383, lng: -123.8983 },
  // Discovery Islands / Desolation Sound
  { id: "63aefc7784e5432cd3b6eb1e", code: "08108", name: "Seymour Narrows", lat: 50.1333, lng: -125.35 },
  { id: "63aefe506a2b9417c0350720", code: "07840", name: "Beazley Passage", lat: 50.2263, lng: -125.142 },
  { id: "63aefcb26a2b9417c035071e", code: "08052", name: "Hole in the Wall", lat: 50.3001, lng: -125.208 },
  { id: "5dd3064fe0fdc4b9b4be6978", code: "08059", name: "Gillard Passage", lat: 50.3933, lng: -125.157 },
  { id: "63aeff5884e5432cd3b71283", code: "08064", name: "Arran Rapids", lat: 50.42, lng: -125.14 },
  { id: "63af06d56a2b9417c0353451", code: "08138", name: "Dent Rapids", lat: 50.41, lng: -125.212 },
  // Victoria harbour
  { id: "64960066ebd87908f1fcb787", code: "07129", name: "Tillicum Bridge", lat: 48.4464, lng: -123.4002 },
];

interface CHSDataPoint {
  eventDate: string;
  value: number;
}

type StationWithPrediction = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  source: "chs";
  predictions: {
    meanFloodDir: number;
    Bin: string;
    meanEbbDir: number;
    Time: string;
    Depth: string;
    Velocity_Major: number;
  }[];
};

async function fetchTimeSeries(
  stationId: string,
  code: string,
  from: string,
  to: string
): Promise<CHSDataPoint[]> {
  const url = `${CHS_API_BASE}/stations/${stationId}/data?time-series-code=${code}&from=${from}&to=${to}&resolution=FIFTEEN_MINUTES`;
  const response = await fetch(url, { next: { revalidate: 3600 } });
  if (!response.ok) {
    console.warn(
      `CHS API error for station ${stationId}, code ${code}: ${response.status}`
    );
    return [];
  }
  return response.json();
}

// Round a date down to the nearest 30-minute mark
function roundTo30Min(date: Date): string {
  const d = new Date(date);
  const minutes = d.getMinutes();
  d.setMinutes(minutes < 30 ? 0 : 30, 0, 0);
  return d.toISOString();
}

const GET = async (request: NextRequest) => {
  const beginDate = request.nextUrl.searchParams.get("begin_date");
  const endDate = request.nextUrl.searchParams.get("end_date");

  if (!beginDate || !endDate) {
    return Response.json({ error: "begin_date and end_date required" }, { status: 400 });
  }

  // Convert yyyymmdd to ISO 8601
  const from = `${beginDate.slice(0, 4)}-${beginDate.slice(4, 6)}-${beginDate.slice(6, 8)}T00:00:00Z`;
  const to = `${endDate.slice(0, 4)}-${endDate.slice(4, 6)}-${endDate.slice(6, 8)}T00:00:00Z`;

  const stationsWithPredictions: StationWithPrediction[] = [];

  const filteredStations = CHS_CURRENT_STATIONS;

  // Process stations in batches to avoid CHS API rate limits (429)
  const BATCH_SIZE = 3;
  const BATCH_DELAY_MS = 300;
  const results: PromiseSettledResult<StationWithPrediction | null>[] = [];

  for (let i = 0; i < filteredStations.length; i += BATCH_SIZE) {
    const batch = filteredStations.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.allSettled(
      batch.map(async (station) => {
        const [speedData, directionData] = await Promise.all([
          fetchTimeSeries(station.id, "wcsp1", from, to),
          fetchTimeSeries(station.id, "wcdp1", from, to),
        ]);

        if (!speedData.length || !directionData.length) {
          return null;
        }

        // Index direction data by rounded time for quick lookup
        const dirByTime = new Map<string, number>();
        for (const d of directionData) {
          dirByTime.set(roundTo30Min(new Date(d.eventDate)), d.value);
        }

        // Determine flood vs ebb direction.
        // CHS gives speed (always positive) + direction. Direction alternates
        // between two ~opposite bearings. We identify the two clusters and
        // pick the one associated with the first speed peak as "flood".
        const allDirs = directionData.map((d) => d.value);
        // Find two dominant direction clusters using the first direction as seed
        if (!allDirs.length) return null;
        const ref = allDirs[0];
        const cluster1: number[] = [];
        const cluster2: number[] = [];
        for (const dir of allDirs) {
          // Angular difference
          let diff = Math.abs(dir - ref);
          if (diff > 180) diff = 360 - diff;
          if (diff < 90) {
            cluster1.push(dir);
          } else {
            cluster2.push(dir);
          }
        }
        // Circular mean for each cluster
        const circularMean = (angles: number[]) => {
          if (!angles.length) return 0;
          let sinSum = 0, cosSum = 0;
          for (const a of angles) {
            sinSum += Math.sin((a * Math.PI) / 180);
            cosSum += Math.cos((a * Math.PI) / 180);
          }
          let mean = (Math.atan2(sinSum, cosSum) * 180) / Math.PI;
          if (mean < 0) mean += 360;
          return mean;
        };
        const dir1 = circularMean(cluster1);
        const dir2 = circularMean(cluster2.length ? cluster2 : cluster1);

        // Find first speed peak to determine which direction is flood
        let maxSpeedIdx = 0;
        for (let si = 1; si < speedData.length && si < speedData.length / 2; si++) {
          if (speedData[si].value > speedData[maxSpeedIdx].value) {
            maxSpeedIdx = si;
          }
        }
        const peakTime = roundTo30Min(new Date(speedData[maxSpeedIdx].eventDate));
        const peakDir = dirByTime.get(peakTime) ?? dir1;
        let diffToDir1 = Math.abs(peakDir - dir1);
        if (diffToDir1 > 180) diffToDir1 = 360 - diffToDir1;
        const floodDir = diffToDir1 < 90 ? dir1 : dir2;
        const ebbDir = diffToDir1 < 90 ? dir2 : dir1;

        // Filter speed data to 30-minute intervals and pair with direction
        const seen = new Set<string>();
        const predictions: StationWithPrediction["predictions"] = [];

        for (const sp of speedData) {
          const rounded = roundTo30Min(new Date(sp.eventDate));
          if (seen.has(rounded)) continue;
          seen.add(rounded);

          const direction = dirByTime.get(rounded);
          if (direction === undefined) continue;

          // Determine if this is flood or ebb based on direction
          let diffToFlood = Math.abs(direction - floodDir);
          if (diffToFlood > 180) diffToFlood = 360 - diffToFlood;
          const isFlood = diffToFlood < 90;

          predictions.push({
            Time: rounded.replace("Z", "").replace(".000", ""),
            Velocity_Major: isFlood ? sp.value : -sp.value,
            meanFloodDir: floodDir,
            meanEbbDir: ebbDir,
            Bin: "1",
            Depth: "0",
          });
        }

        return {
          id: `chs-${station.code}`,
          name: station.name,
          lat: station.lat,
          lng: station.lng,
          source: "chs" as const,
          predictions,
        };
      })
    );
    results.push(...batchResults);
    if (i + BATCH_SIZE < filteredStations.length) {
      await new Promise((r) => setTimeout(r, BATCH_DELAY_MS));
    }
  }

  let expectedLen: number | undefined;
  for (const result of results) {
    if (result.status === "rejected") continue;
    const station = result.value;
    if (!station || !station.predictions.length) continue;

    if (!expectedLen) {
      expectedLen = station.predictions.length;
    } else if (station.predictions.length !== expectedLen) {
      console.warn(
        `CHS station ${station.id} has ${station.predictions.length} predictions, expected ${expectedLen}`
      );
      continue;
    }

    stationsWithPredictions.push(station);
  }

  // Compute secondary station predictions from reference stations
  const refByCode = new Map<string, StationWithPrediction>();
  for (const s of stationsWithPredictions) {
    // id is "chs-{code}"
    const code = s.id.replace("chs-", "");
    refByCode.set(code, s);
  }

  for (const sec of SECONDARY_CURRENT_STATIONS) {
    const ref = refByCode.get(sec.referenceStation);
    if (!ref || !ref.predictions.length) continue;

    // Average time shift in 30-min intervals (negative = secondary leads reference)
    const td = sec.timeDifferences;
    const avgShiftMin =
      (td.turnToFlood + td.maxFlood + td.turnToEbb + td.maxEbb) / 4;
    // Convert to index offset (predictions are at 30-min intervals)
    const indexOffset = Math.round(avgShiftMin / 30);

    const ebbDir = (sec.floodDir + 180) % 360;

    // Precompute ref max for absolute rate stations
    const refMax = sec.speed.percentRate
      ? 0
      : Math.max(...ref.predictions.map((rp) => Math.abs(rp.Velocity_Major)));

    // For each output time slot, sample the reference at the shifted index
    const predictions: StationWithPrediction["predictions"] = ref.predictions.map((p, i) => {
      // The secondary station's event at time T corresponds to the reference
      // station's event at time T - offset. So to find the secondary's value
      // at index i, we look at the reference at index i - offset.
      const srcIdx = Math.max(0, Math.min(ref.predictions.length - 1, i - indexOffset));
      const srcPred = ref.predictions[srcIdx];

      // Scale velocity
      let velocity: number;
      const isFlood = srcPred.Velocity_Major >= 0;
      if (sec.speed.percentRate) {
        const pct = isFlood ? sec.speed.flood : sec.speed.ebb;
        velocity = srcPred.Velocity_Major * (pct / 100);
      } else {
        const maxRate = isFlood ? sec.speed.flood : sec.speed.ebb;
        velocity =
          refMax > 0
            ? srcPred.Velocity_Major * (maxRate / refMax)
            : 0;
      }

      return {
        Time: p.Time, // Keep same timestamps as reference
        Velocity_Major: velocity,
        meanFloodDir: sec.floodDir,
        meanEbbDir: ebbDir,
        Bin: "1",
        Depth: "0",
      };
    });

    if (predictions.length === expectedLen) {
      stationsWithPredictions.push({
        id: `chs-${sec.code}`,
        name: sec.name,
        lat: sec.lat,
        lng: sec.lng,
        source: "chs",
        predictions,
      });
    }
  }

  return Response.json(stationsWithPredictions);
};

export { GET };
