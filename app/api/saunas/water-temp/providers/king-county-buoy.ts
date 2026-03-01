import type { KingCountyBuoyWaterTempProviderConfig } from "@/data/saunas/saunas";
import type { WaterTempResponse } from "./types";
import { celsiusToFahrenheit } from "@/lib/utils";

const BUOY_API_URL =
  "https://green2.kingcounty.gov/lake-buoy/GenerateMapData.aspx";

export async function fetchKingCountyBuoyWaterTemp(
  config: KingCountyBuoyWaterTempProviderConfig
): Promise<WaterTempResponse> {
  const res = await fetch(BUOY_API_URL, {
    next: { revalidate: 900 },
  });

  if (!res.ok) {
    throw new Error(`King County buoy API returned ${res.status}`);
  }

  const data = await res.text();

  const pattern = new RegExp(
    config.lakeName +
      `(?:\\|(?<weatherDateTime>[^|]+))(?:\\|\\s*(?<air>\\d+\\.\\d+))(?:\\|\\s*(?<windSpeed>\\d+\\.\\d+))(?:\\|(?<windDirection>[^|]+))(?:\\|\\s*(?<water>\\d+\\.\\d+)?)(?:\\|(?<waterDateTime>[^|]*))`,
    "i"
  );

  const match = data.match(pattern);
  if (!match?.groups) {
    throw new Error(`Failed to parse buoy data for lake: ${config.lakeName}`);
  }

  const waterStr = match.groups.water?.trim();
  if (!waterStr) {
    throw new Error(
      `No water temperature data available for lake: ${config.lakeName}`
    );
  }

  const waterTempCelsius = parseFloat(waterStr);
  const waterDateTimeStr = match.groups.waterDateTime?.trim();
  const dateStr = waterDateTimeStr || match.groups.weatherDateTime;

  // The buoy API returns timestamps in Pacific time (America/Los_Angeles).
  // Determine whether PST or PDT applies at this date so the UTC conversion is correct.
  const approxDate = new Date(dateStr);
  const tzAbbr =
    new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Los_Angeles",
      timeZoneName: "short",
    })
      .formatToParts(approxDate)
      .find((p) => p.type === "timeZoneName")?.value ?? "PST";
  const measuredAt = new Date(`${dateStr} ${tzAbbr}`).toISOString();

  return {
    waterTempF:
      Math.round(celsiusToFahrenheit(waterTempCelsius) * 10) / 10,
    measuredAt,
    source: "King County Lake Buoy",
    sourceUrl: "https://green2.kingcounty.gov/lake-buoy/default.aspx",
  };
}
