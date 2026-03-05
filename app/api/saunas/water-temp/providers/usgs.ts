import type { UsgsWaterTempProviderConfig } from "@/data/saunas/saunas";
import { celsiusToFahrenheit } from "@/lib/utils";
import type { WaterTempResponse } from "./types";

const USGS_IV_API = "https://waterservices.usgs.gov/nwis/iv/";

/** USGS parameter code for water temperature */
const PARAM_WATER_TEMP = "00010";

interface UsgsValue {
  value: string;
  dateTime: string;
}

interface UsgsTimeSeries {
  sourceInfo: {
    siteName: string;
    siteCode: { value: string }[];
  };
  values: { value: UsgsValue[] }[];
}

interface UsgsResponse {
  value: {
    timeSeries: UsgsTimeSeries[];
  };
}

async function fetchSiteWaterTemp(
  siteId: string
): Promise<WaterTempResponse | null> {
  const params = new URLSearchParams({
    sites: siteId,
    parameterCd: PARAM_WATER_TEMP,
    format: "json",
    period: "P1D",
  });

  const res = await fetch(`${USGS_IV_API}?${params}`, {
    next: { revalidate: 900 },
  });

  if (!res.ok) {
    throw new Error(`USGS API returned ${res.status} for site ${siteId}`);
  }

  const data: UsgsResponse = await res.json();
  const timeSeries = data.value.timeSeries;

  if (!timeSeries?.length) {
    return null;
  }

  const series = timeSeries[0];
  const values = series.values[0]?.value;

  if (!values?.length) {
    return null;
  }

  // Get the most recent reading (last in array)
  const reading = values[values.length - 1];
  const tempC = parseFloat(reading.value);

  if (isNaN(tempC)) {
    return null;
  }

  const siteName = series.sourceInfo.siteName;

  return {
    waterTempF: celsiusToFahrenheit(tempC),
    measuredAt: new Date(reading.dateTime).toISOString(),
    source: `USGS ${siteName}`,
    sourceUrl: `https://waterdata.usgs.gov/monitoring-location/${siteId}/`,
  };
}

export async function fetchUsgsWaterTemp(
  config: UsgsWaterTempProviderConfig
): Promise<WaterTempResponse> {
  const siteIds = [config.siteId, ...(config.fallbackSiteIds ?? [])];

  for (const siteId of siteIds) {
    const result = await fetchSiteWaterTemp(siteId);
    if (result) return result;
  }

  throw new Error(
    `No water temperature data available from any USGS site: ${siteIds.join(", ")}`
  );
}
