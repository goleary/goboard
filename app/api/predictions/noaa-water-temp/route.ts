const NOAA_API_BASE =
  "https://api.tidesandcurrents.noaa.gov/api/prod/datagetter";

// NOAA CO-OPS stations with water temperature sensors in the Salish Sea / Puget Sound region
// Source: https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations.json?type=watertemp
const NOAA_WATER_TEMP_STATIONS = [
  { id: "9442396", name: "La Push, Quillayute River", lat: 47.9128, lng: -124.6357 },
  { id: "9443090", name: "Neah Bay", lat: 48.3707, lng: -124.6016 },
  { id: "9444090", name: "Port Angeles", lat: 48.125, lng: -123.44 },
  { id: "9444900", name: "Port Townsend", lat: 48.1112, lng: -122.7597 },
  { id: "9446484", name: "Tacoma", lat: 47.2667, lng: -122.4133 },
  { id: "9447130", name: "Seattle", lat: 47.6026, lng: -122.3393 },
  { id: "9449424", name: "Cherry Point", lat: 48.8627, lng: -122.7586 },
  { id: "9449880", name: "Friday Harbor", lat: 48.5453, lng: -123.0125 },
];

interface NoaaDataPoint {
  t: string; // "YYYY-MM-DD HH:MM"
  v: string; // temperature value in °F
  f: string; // flags
}

interface NoaaResponse {
  metadata?: { id: string; name: string };
  data?: NoaaDataPoint[];
  error?: { message: string };
}

type WaterTempStation = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  source: "noaa-temp";
  waterTempF: number;
  measuredAt: string;
  sourceUrl: string;
};

const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

const GET = async () => {
  const stations: WaterTempStation[] = [];

  const BATCH_SIZE = 6;
  const BATCH_DELAY_MS = 200;

  for (let i = 0; i < NOAA_WATER_TEMP_STATIONS.length; i += BATCH_SIZE) {
    const batch = NOAA_WATER_TEMP_STATIONS.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.allSettled(
      batch.map(async (station) => {
        const params = new URLSearchParams({
          station: station.id,
          date: "latest",
          product: "water_temperature",
          time_zone: "gmt",
          units: "english",
          format: "json",
          application: "goboard",
        });

        const response = await fetch(`${NOAA_API_BASE}?${params}`, {
          next: { revalidate: 900 },
        });

        if (!response.ok) {
          console.warn(
            `NOAA water temp API error for station ${station.id}: ${response.status}`
          );
          return null;
        }

        const data: NoaaResponse = await response.json();

        if (data.error || !data.data?.length) {
          return null;
        }

        const reading = data.data[0];
        const measuredAt = new Date(
          reading.t.replace(" ", "T") + "Z"
        );

        // Skip stale readings older than 24 hours
        if (Date.now() - measuredAt.getTime() > TWENTY_FOUR_HOURS_MS) {
          console.warn(
            `NOAA water temp station ${station.id} has stale reading from ${measuredAt.toISOString()}`
          );
          return null;
        }

        return {
          id: `noaa-temp-${station.id}`,
          name: data.metadata?.name ?? station.name,
          lat: station.lat,
          lng: station.lng,
          source: "noaa-temp" as const,
          waterTempF: parseFloat(reading.v),
          measuredAt: measuredAt.toISOString(),
          sourceUrl: `https://tidesandcurrents.noaa.gov/stationhome.html?id=${station.id}`,
        };
      })
    );

    for (const result of batchResults) {
      if (result.status === "fulfilled" && result.value) {
        stations.push(result.value);
      }
    }

    if (i + BATCH_SIZE < NOAA_WATER_TEMP_STATIONS.length) {
      await new Promise((r) => setTimeout(r, BATCH_DELAY_MS));
    }
  }

  return Response.json(stations);
};

export { GET };
