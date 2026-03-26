import { NextRequest } from "next/server";

const CHS_API_BASE = "https://api-iwls.dfo-mpo.gc.ca/api/v1";

// Tide stations across the Salish Sea (curated for coverage)
const CHS_TIDE_STATIONS = [
  // Juan de Fuca / Victoria
  { id: "5cebf1df3d0f4a073c4bbd1e", code: "07120", name: "Victoria Harbour", lat: 48.424363, lng: -123.370828 },
  { id: "5cebf1df3d0f4a073c4bbd0d", code: "07013", name: "Sheringham Point", lat: 48.377, lng: -123.921 },
  { id: "5cebf1df3d0f4a073c4bbd0f", code: "07020", name: "Sooke", lat: 48.3695, lng: -123.726 },
  // Gulf Islands
  { id: "5cebf1df3d0f4a073c4bbd35", code: "07330", name: "Fulford Harbour", lat: 48.769, lng: -123.451 },
  { id: "5cebf1e03d0f4a073c4bbd3d", code: "07407", name: "Ganges", lat: 48.8534, lng: -123.4973 },
  // Nanaimo / Mid-Island
  { id: "5cebf1de3d0f4a073c4bb96d", code: "07917", name: "Nanaimo Harbour", lat: 49.1628, lng: -123.9235 },
  // Vancouver / Fraser
  { id: "5cebf1de3d0f4a073c4bb943", code: "07735", name: "Vancouver", lat: 49.2863, lng: -123.0997 },
  { id: "5cebf1de3d0f4a073c4bb94c", code: "07795", name: "Point Atkinson", lat: 49.3375, lng: -123.2536 },
  { id: "5cebf1de3d0f4a073c4bb935", code: "07590", name: "Tsawwassen", lat: 49.0068, lng: -123.1293 },
  // Sunshine Coast
  { id: "5cebf1de3d0f4a073c4bb950", code: "07820", name: "Gibsons", lat: 49.402, lng: -123.505 },
  { id: "5cebf1de3d0f4a073c4bb952", code: "07830", name: "Halfmoon Bay", lat: 49.511, lng: -123.912 },
  // Comox / Denman
  { id: "5cebf1de3d0f4a073c4bb979", code: "07965", name: "Comox", lat: 49.67, lng: -124.928 },
  // Powell River / Desolation Sound
  { id: "5cebf1de3d0f4a073c4bb960", code: "07880", name: "Powell River", lat: 49.8667, lng: -124.55 },
  { id: "5dd3064ee0fdc4b9b4be688e", code: "08006", name: "Okeover Inlet", lat: 49.98, lng: -124.7 },
  { id: "5cebf1de3d0f4a073c4bb962", code: "07885", name: "Lund", lat: 49.9833, lng: -124.7667 },
  { id: "5cebf1e23d0f4a073c4bbfbd", code: "08008", name: "Prideaux Haven", lat: 50.15, lng: -124.67 },
  { id: "5cebf1de3d0f4a073c4bb985", code: "08037", name: "Gorge Harbour", lat: 50.092, lng: -124.989 },
  { id: "5cebf1de3d0f4a073c4bb983", code: "08025", name: "Redonda Bay", lat: 50.2605, lng: -124.9553 },
  { id: "5cebf1de3d0f4a073c4bb981", code: "08015", name: "Channel Island", lat: 50.3167, lng: -124.75 },
  // Discovery Islands / Campbell River
  { id: "5cebf1de3d0f4a073c4bb996", code: "08074", name: "Campbell River", lat: 50.042, lng: -125.247 },
  { id: "5cebf1de3d0f4a073c4bb989", code: "08045", name: "Surge Narrows", lat: 50.2272, lng: -125.112 },
  { id: "5cebf1de3d0f4a073c4bb99a", code: "08120", name: "Owen Bay", lat: 50.3105, lng: -125.2234 },
  // Howe Sound
  { id: "5cebf1de3d0f4a073c4bb94e", code: "07811", name: "Squamish", lat: 49.695, lng: -123.155 },
];

interface CHSDataPoint {
  eventDate: string;
  value: number;
}

export interface TideStationWithPrediction {
  id: string;
  name: string;
  lat: number;
  lng: number;
  source: "chs-tide";
  predictions: {
    Time: string;
    waterLevel: number; // meters
  }[];
}

async function fetchWaterLevel(
  stationId: string,
  from: string,
  to: string
): Promise<CHSDataPoint[]> {
  const url = `${CHS_API_BASE}/stations/${stationId}/data?time-series-code=wlp&from=${from}&to=${to}&resolution=FIFTEEN_MINUTES`;
  const response = await fetch(url, { next: { revalidate: 3600 } });
  if (!response.ok) {
    console.warn(`CHS tide API error for station ${stationId}: ${response.status}`);
    return [];
  }
  return response.json();
}

function roundTo30Min(date: Date): string {
  const d = new Date(date);
  const minutes = d.getMinutes();
  d.setMinutes(minutes < 30 ? 0 : 30, 0, 0);
  return d.toISOString();
}

const GET = async (request: NextRequest) => {
  const beginDate = request.nextUrl.searchParams.get("begin_date");
  const endDate = request.nextUrl.searchParams.get("end_date");

  if (!beginDate || !endDate) {
    return Response.json(
      { error: "begin_date and end_date required" },
      { status: 400 }
    );
  }

  const from = `${beginDate.slice(0, 4)}-${beginDate.slice(4, 6)}-${beginDate.slice(6, 8)}T00:00:00Z`;
  const to = `${endDate.slice(0, 4)}-${endDate.slice(4, 6)}-${endDate.slice(6, 8)}T00:00:00Z`;

  // Process stations in batches to avoid CHS API rate limits (429)
  const BATCH_SIZE = 3;
  const BATCH_DELAY_MS = 300;
  const results: PromiseSettledResult<TideStationWithPrediction | null>[] = [];

  for (let i = 0; i < CHS_TIDE_STATIONS.length; i += BATCH_SIZE) {
    const batch = CHS_TIDE_STATIONS.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.allSettled(
      batch.map(async (station) => {
        const data = await fetchWaterLevel(station.id, from, to);
        if (!data.length) return null;

        const seen = new Set<string>();
        const predictions: TideStationWithPrediction["predictions"] = [];

        for (const dp of data) {
          const rounded = roundTo30Min(new Date(dp.eventDate));
          if (seen.has(rounded)) continue;
          seen.add(rounded);

          predictions.push({
            Time: rounded.replace("Z", "").replace(".000", ""),
            waterLevel: dp.value,
          });
        }

        return {
          id: `chs-tide-${station.code}`,
          name: station.name,
          lat: station.lat,
          lng: station.lng,
          source: "chs-tide" as const,
          predictions,
        };
      })
    );
    results.push(...batchResults);
    if (i + BATCH_SIZE < CHS_TIDE_STATIONS.length) {
      await new Promise((r) => setTimeout(r, BATCH_DELAY_MS));
    }
  }

  const stations: TideStationWithPrediction[] = [];
  let expectedLen: number | undefined;

  for (const result of results) {
    if (result.status === "rejected") continue;
    const station = result.value;
    if (!station || !station.predictions.length) continue;

    if (!expectedLen) {
      expectedLen = station.predictions.length;
    } else if (station.predictions.length !== expectedLen) {
      console.warn(
        `CHS tide station ${station.id} has ${station.predictions.length} predictions, expected ${expectedLen}`
      );
      continue;
    }

    stations.push(station);
  }

  return Response.json(stations);
};

export { GET };
