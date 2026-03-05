import { NextRequest } from "next/server";
import { z } from "zod";

export interface TidePrediction {
  time: string;
  height: string;
  type: "H" | "L";
}

export interface TideDataPoint {
  time: string;
  height: number;
}

export interface TidesResponse {
  predictions: TidePrediction[];
  hourly: TideDataPoint[];
  unit: "ft" | "m";
}

const dateRe = /^\d{4}-\d{2}-\d{2}$/;

const querySchema = z.object({
  station: z.string().min(1),
  date: z.string().regex(dateRe),
  endDate: z.string().regex(dateRe).optional(),
  provider: z.enum(["noaa", "dfo"]).default("noaa"),
});

function addDays(dateStr: string, n: number): string {
  const d = new Date(`${dateStr}T00:00:00`);
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function noaaDate(dateStr: string): string {
  return dateStr.replace(/-/g, "");
}

/**
 * Cosine-interpolate tide heights from hi/lo predictions.
 * Generates a point every 30 minutes for the requested date range.
 * Uses buffered hilo data (from adjacent days) for smooth edges.
 */
function interpolateFromHilo(
  predictions: TidePrediction[],
  startDate: string,
  endDate: string
): TideDataPoint[] {
  if (predictions.length < 2) return [];

  const points = predictions.map((p) => ({
    t: new Date(p.time.replace(" ", "T")).getTime(),
    h: parseFloat(p.height),
  }));

  const rangeStart = new Date(`${startDate}T00:00:00`).getTime();
  const rangeEnd = new Date(`${endDate}T23:30:00`).getTime();
  const hourly: TideDataPoint[] = [];

  for (let t = rangeStart; t <= rangeEnd; t += 30 * 60_000) {
    let height: number;
    if (t <= points[0].t) {
      height = points[0].h;
    } else if (t >= points[points.length - 1].t) {
      height = points[points.length - 1].h;
    } else {
      let i = 0;
      while (i < points.length - 1 && points[i + 1].t < t) i++;
      const p0 = points[i];
      const p1 = points[i + 1];
      const fraction = (t - p0.t) / (p1.t - p0.t);
      height = p0.h + (p1.h - p0.h) * (1 - Math.cos(Math.PI * fraction)) / 2;
    }

    const d = new Date(t);
    const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const timeStr = `${ds} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
    hourly.push({ time: timeStr, height: Math.round(height * 1000) / 1000 });
  }

  return hourly;
}

/** Format a UTC date string to "YYYY-MM-DD HH:MM" in the given timezone. */
function utcToLocalTimeStr(utcDateStr: string, tz: string): string {
  // toLocaleString with sv-SE gives ISO-like "YYYY-MM-DD HH:MM:SS" format
  const s = new Date(utcDateStr).toLocaleString("sv-SE", { timeZone: tz });
  // "2026-03-04 00:00:00" → "2026-03-04 00:00"
  return s.slice(0, 16);
}

/**
 * Fetch tide data from DFO (Canadian Hydrographic Service) IWLS API.
 * Returns data in the same format as NOAA, with heights converted to feet
 * and times in the station's local timezone (Pacific).
 */
async function fetchDfo(
  station: string,
  startDate: string,
  endDate: string
): Promise<TidesResponse> {
  // DFO API uses UTC — request a wider window to cover Pacific time offset
  // Buffer by extra hours to catch tides near day boundaries
  const from = `${startDate}T08:00:00Z`; // midnight Pacific = 8am UTC
  const to = `${addDays(endDate, 1)}T09:00:00Z`;
  const tz = "America/Vancouver";

  const hiloUrl = `https://api-iwls.dfo-mpo.gc.ca/api/v1/stations/${station}/data?time-series-code=wlp-hilo&from=${from}&to=${to}`;
  const wlpUrl = `https://api-iwls.dfo-mpo.gc.ca/api/v1/stations/${station}/data?time-series-code=wlp&from=${from}&to=${to}`;

  const [hiloRes, wlpRes] = await Promise.all([
    fetch(hiloUrl, { next: { revalidate: 300 } }),
    fetch(wlpUrl, { next: { revalidate: 300 } }),
  ]);

  if (!hiloRes.ok) {
    throw new Error(`DFO hilo API returned ${hiloRes.status}`);
  }

  const hiloData = await hiloRes.json() as { eventDate: string; value: number }[];

  // Determine H/L by checking if each point is higher or lower than neighbors
  const predictions: TidePrediction[] = hiloData.map((p, i) => {
    const prev = hiloData[i - 1];
    const next = hiloData[i + 1];
    let type: "H" | "L" = "H";
    if (prev && p.value < prev.value) type = "L";
    else if (next && p.value < next.value) type = "L";

    return {
      time: utcToLocalTimeStr(p.eventDate, tz),
      height: String(Math.round(p.value * 1000) / 1000),
      type,
    };
  }).filter((p) => {
    const d = p.time.split(" ")[0];
    return d >= startDate && d <= endDate;
  });

  let hourly: TideDataPoint[] = [];

  if (wlpRes.ok) {
    const wlpData = await wlpRes.json() as { eventDate: string; value: number }[];
    // Sample every 30 minutes (the API returns 1-min data)
    let lastTime = 0;
    for (const p of wlpData) {
      const t = new Date(p.eventDate).getTime();
      if (t - lastTime >= 29 * 60_000) {
        const timeStr = utcToLocalTimeStr(p.eventDate, tz);
        const d = timeStr.split(" ")[0];
        if (d >= startDate && d <= endDate) {
          hourly.push({ time: timeStr, height: Math.round(p.value * 1000) / 1000 });
        }
        lastTime = t;
      }
    }
  }

  // Fall back to interpolation if hourly data unavailable
  if (hourly.length === 0 && predictions.length >= 2) {
    hourly = interpolateFromHilo(predictions, startDate, endDate);
  }

  return { predictions, hourly, unit: "m" as const };
}

async function fetchNoaa(
  station: string,
  startDate: string,
  endDate: string
): Promise<TidesResponse> {
  // Buffer hilo by 1 day on each side so interpolation is smooth at edges
  const hiloStart = noaaDate(addDays(startDate, -1));
  const hiloEnd = noaaDate(addDays(endDate, 1));

  const baseHilo = new URLSearchParams({
    station,
    begin_date: hiloStart,
    end_date: hiloEnd,
    product: "predictions",
    datum: "MLLW",
    time_zone: "lst_ldt",
    units: "english",
    format: "json",
    application: "goboard",
  });

  const baseHourly = new URLSearchParams({
    station,
    begin_date: noaaDate(startDate),
    end_date: noaaDate(endDate),
    product: "predictions",
    datum: "MLLW",
    time_zone: "lst_ldt",
    units: "english",
    format: "json",
    application: "goboard",
  });

  const hiloUrl = `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?${baseHilo}&interval=hilo`;
  const hourlyUrl = `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?${baseHourly}&interval=h`;

  const [hiloRes, hourlyRes] = await Promise.all([
    fetch(hiloUrl, { next: { revalidate: 300 } }),
    fetch(hourlyUrl, { next: { revalidate: 300 } }),
  ]);

  if (!hiloRes.ok || !hourlyRes.ok) {
    throw new Error(
      `NOAA API returned ${hiloRes.status}/${hourlyRes.status}`
    );
  }

  const [hiloData, hourlyData] = await Promise.all([
    hiloRes.json(),
    hourlyRes.json(),
  ]);

  const allPredictions: TidePrediction[] = (
    hiloData.predictions ?? []
  ).map((p: { t: string; v: string; type: "H" | "L" }) => ({
    time: p.t,
    height: p.v,
    type: p.type,
  }));

  const predictions = allPredictions.filter((p) => {
    const d = p.time.split(" ")[0];
    return d >= startDate && d <= endDate;
  });

  let hourly: TideDataPoint[] = (
    hourlyData.predictions ?? []
  ).map((p: { t: string; v: string }) => ({
    time: p.t,
    height: parseFloat(p.v),
  }));

  // Subordinate stations only support hilo, not hourly.
  // Synthesize data via cosine interpolation using buffered hilo points.
  if (hourly.length === 0 && allPredictions.length >= 2) {
    hourly = interpolateFromHilo(allPredictions, startDate, endDate);
  }

  return { predictions, hourly, unit: "ft" as const };
}

export async function GET(request: NextRequest) {
  const parsed = querySchema.safeParse({
    station: request.nextUrl.searchParams.get("station"),
    date: request.nextUrl.searchParams.get("date"),
    endDate: request.nextUrl.searchParams.get("endDate") ?? undefined,
    provider: request.nextUrl.searchParams.get("provider") ?? undefined,
  });

  if (!parsed.success) {
    return Response.json(
      { error: "Invalid parameters", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { station, date, endDate: rawEndDate, provider } = parsed.data;
  const startDate = date;
  const endDate = rawEndDate ?? date;

  try {
    const data =
      provider === "dfo"
        ? await fetchDfo(station, startDate, endDate)
        : await fetchNoaa(station, startDate, endDate);

    return Response.json(data satisfies TidesResponse);
  } catch (err) {
    console.error("Tide fetch error:", err);
    return Response.json(
      { error: "Failed to fetch tide data" },
      { status: 502 }
    );
  }
}
