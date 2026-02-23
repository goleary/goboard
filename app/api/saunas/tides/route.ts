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
}

const dateRe = /^\d{4}-\d{2}-\d{2}$/;

const querySchema = z.object({
  station: z.string().min(1),
  date: z.string().regex(dateRe),
  endDate: z.string().regex(dateRe).optional(),
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

export async function GET(request: NextRequest) {
  const parsed = querySchema.safeParse({
    station: request.nextUrl.searchParams.get("station"),
    date: request.nextUrl.searchParams.get("date"),
    endDate: request.nextUrl.searchParams.get("endDate") ?? undefined,
  });

  if (!parsed.success) {
    return Response.json(
      { error: "Invalid parameters", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { station, date, endDate: rawEndDate } = parsed.data;
  const startDate = date;
  const endDate = rawEndDate ?? date;

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

  try {
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

    // Predictions span the buffered range (for chart reference dots)
    // but we only return predictions within the requested date range
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

    return Response.json({ predictions, hourly } satisfies TidesResponse);
  } catch (err) {
    console.error("Tide fetch error:", err);
    return Response.json(
      { error: "Failed to fetch tide data" },
      { status: 502 }
    );
  }
}
