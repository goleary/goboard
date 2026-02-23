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

const querySchema = z.object({
  station: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export async function GET(request: NextRequest) {
  const parsed = querySchema.safeParse({
    station: request.nextUrl.searchParams.get("station"),
    date: request.nextUrl.searchParams.get("date"),
  });

  if (!parsed.success) {
    return Response.json(
      { error: "Invalid parameters", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { station, date } = parsed.data;
  const noaaDate = date.replace(/-/g, "");

  const baseParams = new URLSearchParams({
    station,
    begin_date: noaaDate,
    end_date: noaaDate,
    product: "predictions",
    datum: "MLLW",
    time_zone: "lst_ldt",
    units: "english",
    format: "json",
    application: "goboard",
  });

  const hiloUrl = `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?${baseParams}&interval=hilo`;
  const hourlyUrl = `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?${baseParams}&interval=h`;

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

    const predictions: TidePrediction[] = (
      hiloData.predictions ?? []
    ).map((p: { t: string; v: string; type: "H" | "L" }) => ({
      time: p.t,
      height: p.v,
      type: p.type,
    }));

    const hourly: TideDataPoint[] = (
      hourlyData.predictions ?? []
    ).map((p: { t: string; v: string }) => ({
      time: p.t,
      height: parseFloat(p.v),
    }));

    return Response.json({ predictions, hourly } satisfies TidesResponse);
  } catch (err) {
    console.error("Tide fetch error:", err);
    return Response.json(
      { error: "Failed to fetch tide data" },
      { status: 502 }
    );
  }
}
