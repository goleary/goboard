import type { NoaaWaterTempProviderConfig } from "@/data/saunas/saunas";
import type { WaterTempResponse } from "./types";

const NOAA_API_BASE =
  "https://api.tidesandcurrents.noaa.gov/api/prod/datagetter";

interface NoaaDataPoint {
  t: string; // "YYYY-MM-DD HH:MM"
  v: string; // temperature value
  f: string; // flags
}

interface NoaaResponse {
  metadata?: { id: string; name: string };
  data?: NoaaDataPoint[];
  error?: { message: string };
}

async function fetchStationWaterTemp(
  stationId: string
): Promise<WaterTempResponse | null> {
  const params = new URLSearchParams({
    station: stationId,
    date: "latest",
    product: "water_temperature",
    // Use GMT so the timestamp is unambiguous — no timezone conversion needed.
    time_zone: "gmt",
    units: "english",
    format: "json",
    application: "goboard",
  });

  const res = await fetch(`${NOAA_API_BASE}?${params}`, {
    next: { revalidate: 900 },
  });

  if (!res.ok) {
    throw new Error(`NOAA API returned ${res.status} for station ${stationId}`);
  }

  const data: NoaaResponse = await res.json();

  if (data.error || !data.data?.length) {
    return null;
  }

  const reading = data.data[0];
  const stationName = data.metadata?.name ?? stationId;
  // Timestamp is in GMT (e.g. "2026-03-01 17:48"), append Z for valid ISO.
  const measuredAt = new Date(reading.t.replace(" ", "T") + "Z").toISOString();

  return {
    waterTempF: parseFloat(reading.v),
    measuredAt,
    source: `NOAA ${stationName}`,
    sourceUrl: `https://tidesandcurrents.noaa.gov/stationhome.html?id=${stationId}`,
  };
}

export async function fetchNoaaWaterTemp(
  config: NoaaWaterTempProviderConfig
): Promise<WaterTempResponse> {
  const stationIds = [
    config.stationId,
    ...(config.fallbackStationIds ?? []),
  ];

  for (const stationId of stationIds) {
    const result = await fetchStationWaterTemp(stationId);
    if (result) return result;
  }

  throw new Error(
    `No water temperature data available from any station: ${stationIds.join(", ")}`
  );
}
