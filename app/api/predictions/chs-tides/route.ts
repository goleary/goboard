import { NextRequest } from "next/server";

const CHS_API_BASE = "https://api-iwls.dfo-mpo.gc.ca/api/v1";

// Tide stations across the Salish Sea (curated for coverage)
const CHS_TIDE_STATIONS = [
  // Juan de Fuca / Victoria
  { id: "5cebf1df3d0f4a073c4bbd1e", code: "07120", name: "Victoria Harbour", lat: 48.4244, lng: -123.3708 },
  { id: "5cebf1df3d0f4a073c4bbd0d", code: "07013", name: "Sheringham Point", lat: 48.3771, lng: -123.9212 },
  { id: "5cebf1df3d0f4a073c4bbd0f", code: "07020", name: "Sooke", lat: 48.3695, lng: -123.726 },
  { id: "5dd30650e0fdc4b9b4be6c25", code: "07010", name: "Point No Point", lat: 48.3951, lng: -123.9709 },
  { id: "5cebf1df3d0f4a073c4bbd13", code: "07030", name: "Becher Bay", lat: 48.3349, lng: -123.6038 },
  { id: "5cebf1df3d0f4a073c4bbd15", code: "07080", name: "Pedder Bay", lat: 48.3317, lng: -123.5501 },
  { id: "5dd3064de0fdc4b9b4be66e0", code: "07082", name: "William Head", lat: 48.341, lng: -123.5369 },
  { id: "5cebf1e13d0f4a073c4bbf81", code: "07109", name: "Esquimalt Harbour", lat: 48.4404, lng: -123.4498 },
  { id: "5cebf1df3d0f4a073c4bbd22", code: "07130", name: "Oak Bay", lat: 48.4237, lng: -123.3027 },
  { id: "5cebf1df3d0f4a073c4bbd24", code: "07140", name: "Finnerty Cove", lat: 48.4736, lng: -123.2961 },
  // Saanich / Sidney
  { id: "5dd30650e0fdc4b9b4be6b74", code: "07280", name: "Brentwood Bay", lat: 48.578, lng: -123.467 },
  { id: "5cebf1df3d0f4a073c4bbd2f", code: "07284", name: "Finlayson Arm", lat: 48.4966, lng: -123.5529 },
  { id: "5cebf1df3d0f4a073c4bbd26", code: "07260", name: "Sidney", lat: 48.6492, lng: -123.3929 },
  { id: "5dd3064de0fdc4b9b4be66e4", code: "07255", name: "Saanichton Bay", lat: 48.5989, lng: -123.3885 },
  // Gulf Islands
  { id: "5cebf1df3d0f4a073c4bbd35", code: "07330", name: "Fulford Harbour", lat: 48.769, lng: -123.451 },
  { id: "5cebf1e03d0f4a073c4bbd3d", code: "07407", name: "Ganges", lat: 48.8534, lng: -123.4973 },
  { id: "5cebf1df3d0f4a073c4bbd31", code: "07310", name: "Cowichan Bay", lat: 48.7404, lng: -123.6184 },
  { id: "5cebf1df3d0f4a073c4bbd33", code: "07315", name: "Maple Bay", lat: 48.8157, lng: -123.6096 },
  { id: "5cebf1df3d0f4a073c4bbd39", code: "07350", name: "Bedwell Harbour", lat: 48.7478, lng: -123.2273 },
  { id: "5cebf1e03d0f4a073c4bbd3b", code: "07360", name: "Hope Bay", lat: 48.8034, lng: -123.2759 },
  { id: "5cebf1e03d0f4a073c4bbd41", code: "07420", name: "Montague Harbour", lat: 48.8927, lng: -123.3922 },
  { id: "5cebf1e03d0f4a073c4bbd43", code: "07450", name: "Crofton", lat: 48.8746, lng: -123.6435 },
  { id: "5cebf1e03d0f4a073c4bbd45", code: "07455", name: "Chemainus", lat: 48.9256, lng: -123.7144 },
  { id: "5cebf1e03d0f4a073c4bbd47", code: "07460", name: "Ladysmith", lat: 48.999, lng: -123.8153 },
  { id: "5cebf1de3d0f4a073c4bb9d3", code: "07550", name: "Silva Bay", lat: 49.15, lng: -123.7 },
  // Nanaimo / Mid-Island
  { id: "5cebf1de3d0f4a073c4bb96d", code: "07917", name: "Nanaimo Harbour", lat: 49.1628, lng: -123.9235 },
  // Vancouver / Fraser
  { id: "5cebf1de3d0f4a073c4bb943", code: "07735", name: "Vancouver", lat: 49.2863, lng: -123.0997 },
  { id: "5cebf1de3d0f4a073c4bb94c", code: "07795", name: "Point Atkinson", lat: 49.3375, lng: -123.2536 },
  { id: "5cebf1de3d0f4a073c4bb935", code: "07590", name: "Tsawwassen", lat: 49.0068, lng: -123.1293 },
  { id: "5cebf1de3d0f4a073c4bb933", code: "07577", name: "White Rock", lat: 49.0167, lng: -122.8 },
  { id: "5cebf1de3d0f4a073c4bb93c", code: "07594", name: "Sand Heads", lat: 49.1052, lng: -123.3042 },
  { id: "5dd3064ee0fdc4b9b4be66ff", code: "07710", name: "False Creek", lat: 49.271, lng: -123.12 },
  { id: "5cebf1de3d0f4a073c4bb94a", code: "07755", name: "Port Moody", lat: 49.2877, lng: -122.8658 },
  { id: "5dd3064ee0fdc4b9b4be6707", code: "07765", name: "Deep Cove", lat: 49.3268, lng: -122.9485 },
  // Howe Sound
  { id: "5cebf1de3d0f4a073c4bb94e", code: "07811", name: "Squamish", lat: 49.695, lng: -123.155 },
  // Sunshine Coast
  { id: "5cebf1de3d0f4a073c4bb950", code: "07820", name: "Gibsons", lat: 49.402, lng: -123.505 },
  { id: "5cebf1de3d0f4a073c4bb952", code: "07830", name: "Halfmoon Bay", lat: 49.511, lng: -123.912 },
  { id: "5cebf1de3d0f4a073c4bb954", code: "07836", name: "Irvines Landing", lat: 49.633, lng: -124.058 },
  { id: "5cebf1de3d0f4a073c4bb958", code: "07852", name: "Porpoise Bay", lat: 49.482, lng: -123.759 },
  // Comox / Denman
  { id: "5cebf1de3d0f4a073c4bb975", code: "07953", name: "Hornby Island", lat: 49.4962, lng: -124.676 },
  { id: "5cebf1de3d0f4a073c4bb977", code: "07955", name: "Denman Island", lat: 49.5345, lng: -124.8209 },
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

  const filteredStations = CHS_TIDE_STATIONS;

  // Process stations in batches to avoid CHS API rate limits (429)
  const BATCH_SIZE = 3;
  const BATCH_DELAY_MS = 300;
  const results: PromiseSettledResult<TideStationWithPrediction | null>[] = [];

  for (let i = 0; i < filteredStations.length; i += BATCH_SIZE) {
    const batch = filteredStations.slice(i, i + BATCH_SIZE);
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
    if (i + BATCH_SIZE < filteredStations.length) {
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
