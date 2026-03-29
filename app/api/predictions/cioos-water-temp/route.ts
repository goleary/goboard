const ERDDAP_BASE =
  "https://data.cioospacific.ca/erddap/tabledap/ECCC_MSC_BUOYS.json";

// ECCC MSC buoy stations in the Strait of Georgia / Salish Sea region
// Source: CIOOS ERDDAP distinct query filtered to lat 48-51, lng -126 to -122
const CIOOS_WATER_TEMP_STATIONS = [
  { id: "46131", name: "Sentry Shoal", lat: 49.906, lng: -124.985 },
  { id: "46146", name: "Halibut Bank", lat: 49.34, lng: -123.727 },
  { id: "46206", name: "La Perouse Bank", lat: 48.835, lng: -125.998 },
  { id: "46303", name: "Southern Georgia Strait", lat: 49.025, lng: -123.43 },
  { id: "46304", name: "Entrance to English Bay", lat: 49.30167, lng: -123.357 },
];

interface ErddapResponse {
  table: {
    columnNames: string[];
    rows: (string | number | null)[][];
  };
}

type WaterTempStation = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  source: "cioos-temp";
  waterTempF: number;
  measuredAt: string;
  sourceUrl: string;
};

const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

async function fetchStationTemp(
  stationId: string
): Promise<{ tempC: number; time: string; name: string } | null> {
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
    console.warn(
      `CIOOS ERDDAP API error for station ${stationId}: ${res.status}`
    );
    return null;
  }

  const data: ErddapResponse = await res.json();

  if (!data.table?.rows?.length) return null;

  const cols = data.table.columnNames;
  const row = data.table.rows[0];

  const nameIdx = cols.indexOf("stn_nam");
  const timeIdx = cols.indexOf("time");
  const tempIdx = cols.indexOf("avg_sea_sfc_temp_pst10mts");

  const tempC = row[tempIdx];
  if (tempC == null) return null;

  return {
    tempC: tempC as number,
    time: row[timeIdx] as string,
    name: (row[nameIdx] as string) ?? stationId,
  };
}

const GET = async () => {
  const stations: WaterTempStation[] = [];

  const BATCH_SIZE = 3;
  const BATCH_DELAY_MS = 300;

  for (let i = 0; i < CIOOS_WATER_TEMP_STATIONS.length; i += BATCH_SIZE) {
    const batch = CIOOS_WATER_TEMP_STATIONS.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.allSettled(
      batch.map(async (station) => {
        const result = await fetchStationTemp(station.id);
        if (!result) return null;

        const measuredAt = new Date(result.time);

        // Skip stale readings older than 24 hours
        if (Date.now() - measuredAt.getTime() > TWENTY_FOUR_HOURS_MS) {
          console.warn(
            `CIOOS water temp station ${station.id} has stale reading from ${measuredAt.toISOString()}`
          );
          return null;
        }

        const waterTempF =
          Math.round(result.tempC * (9 / 5) * 10 + 320) / 10;

        return {
          id: `cioos-temp-${station.id}`,
          name: station.name,
          lat: station.lat,
          lng: station.lng,
          source: "cioos-temp" as const,
          waterTempF,
          measuredAt: measuredAt.toISOString(),
          sourceUrl:
            "https://data.cioospacific.ca/erddap/info/ECCC_MSC_BUOYS/index.html",
        };
      })
    );

    for (const result of batchResults) {
      if (result.status === "fulfilled" && result.value) {
        stations.push(result.value);
      }
    }

    if (i + BATCH_SIZE < CIOOS_WATER_TEMP_STATIONS.length) {
      await new Promise((r) => setTimeout(r, BATCH_DELAY_MS));
    }
  }

  return Response.json(stations);
};

export { GET };
