import type { CioosErddapWaterTempProviderConfig } from "@/data/saunas/saunas";
import type { WaterTempResponse } from "./types";
import { celsiusToFahrenheit } from "@/lib/utils";

const ERDDAP_BASE =
  "https://data.cioospacific.ca/erddap/tabledap/ECCC_MSC_BUOYS.json";

interface ErddapRow {
  wmo_synop_id: string;
  stn_nam: string;
  time: string; // ISO 8601
  avg_sea_sfc_temp_pst10mts: number | null;
}

interface ErddapResponse {
  table: {
    columnNames: string[];
    rows: (string | number | null)[][];
  };
}

async function fetchStationWaterTemp(
  stationId: string
): Promise<WaterTempResponse | null> {
  const query = [
    "wmo_synop_id",
    "stn_nam",
    "time",
    "avg_sea_sfc_temp_pst10mts",
  ].join(",");

  const constraint = `&wmo_synop_id=%22${stationId}%22&orderByMax(%22time%22)`;
  const url = `${ERDDAP_BASE}?${query}${constraint}`;

  const res = await fetch(url, { next: { revalidate: 900 } });

  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(
      `CIOOS ERDDAP returned ${res.status} for station ${stationId}`
    );
  }

  const data: ErddapResponse = await res.json();

  if (!data.table?.rows?.length) return null;

  const cols = data.table.columnNames;
  const row = data.table.rows[0];

  const idx = {
    name: cols.indexOf("stn_nam"),
    time: cols.indexOf("time"),
    temp: cols.indexOf("avg_sea_sfc_temp_pst10mts"),
  };

  const tempC = row[idx.temp];
  if (tempC == null) return null;

  const stationName = (row[idx.name] as string) ?? stationId;
  const measuredAt = new Date(row[idx.time] as string).toISOString();

  return {
    waterTempF:
      Math.round(celsiusToFahrenheit(tempC as number) * 10) / 10,
    measuredAt,
    source: `ECCC ${stationName}`,
    sourceUrl: `https://data.cioospacific.ca/erddap/info/ECCC_MSC_BUOYS/index.html`,
  };
}

export async function fetchCioosErddapWaterTemp(
  config: CioosErddapWaterTempProviderConfig
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
    `No water temperature data available from any CIOOS station: ${stationIds.join(", ")}`
  );
}
