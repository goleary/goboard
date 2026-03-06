import type { NdbcWaterTempProviderConfig } from "@/data/saunas/saunas";
import { celsiusToFahrenheit } from "@/lib/utils";
import type { WaterTempResponse } from "./types";

/**
 * NDBC realtime2 standard meteorological data is a space-delimited text file.
 * Header row starts with #YY; column names are in the first header line.
 * WTMP column contains water temperature in °C; "MM" means missing.
 * All timestamps are UTC.
 */

async function fetchStationWaterTemp(
  stationId: string
): Promise<WaterTempResponse | null> {
  const url = `https://www.ndbc.noaa.gov/data/realtime2/${stationId}.txt`;

  const res = await fetch(url, { next: { revalidate: 900 } });

  // 404 means the buoy is not deployed (e.g. recovered for winter)
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`NDBC returned ${res.status} for station ${stationId}`);
  }

  const text = await res.text();
  const lines = text.trim().split("\n");

  // First line is the header with column names (starts with #YY)
  const headerLine = lines[0];
  if (!headerLine) return null;

  const headers = headerLine.replace(/^#/, "").trim().split(/\s+/);
  const wtmpIdx = headers.indexOf("WTMP");
  if (wtmpIdx === -1) return null;

  // Data rows start after the 2 header lines
  for (let i = 2; i < lines.length; i++) {
    const cols = lines[i].trim().split(/\s+/);
    const wtmpStr = cols[wtmpIdx];

    if (!wtmpStr || wtmpStr === "MM") continue;

    const tempC = parseFloat(wtmpStr);
    if (isNaN(tempC)) continue;

    // Build UTC timestamp from YY MM DD hh mm columns
    const [yy, mm, dd, hh, min] = cols;
    const measuredAt = new Date(
      Date.UTC(parseInt(yy), parseInt(mm) - 1, parseInt(dd), parseInt(hh), parseInt(min))
    ).toISOString();

    return {
      waterTempF: Math.round(celsiusToFahrenheit(tempC) * 10) / 10,
      measuredAt,
      source: `NDBC Station ${stationId}`,
      sourceUrl: `https://www.ndbc.noaa.gov/station_page.php?station=${stationId}`,
    };
  }

  // File exists but no rows have valid WTMP
  return null;
}

export async function fetchNdbcWaterTemp(
  config: NdbcWaterTempProviderConfig
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
    `No water temperature data available from any NDBC station: ${stationIds.join(", ")}`
  );
}
