import { NextRequest } from "next/server";

const CHS_API_BASE = "https://api-iwls.dfo-mpo.gc.ca/api/v1";

// Tide stations near Desolation Sound / Copeland Islands / Okeover Arm / Curme Islands
const CHS_TIDE_STATIONS = [
  {
    id: "5dd3064ee0fdc4b9b4be688e",
    code: "08006",
    name: "Okeover Inlet",
    lat: 49.98,
    lng: -124.7,
  },
  {
    id: "5cebf1de3d0f4a073c4bb962",
    code: "07885",
    name: "Lund",
    lat: 49.9833,
    lng: -124.7667,
  },
  {
    id: "5cebf1e23d0f4a073c4bbfbd",
    code: "08008",
    name: "Prideaux Haven",
    lat: 50.15,
    lng: -124.67,
  },
  {
    id: "5cebf1de3d0f4a073c4bb964",
    code: "07892",
    name: "Twin Islands",
    lat: 50.03,
    lng: -124.93,
  },
  {
    id: "5cebf1de3d0f4a073c4bb985",
    code: "08037",
    name: "Gorge Harbour",
    lat: 50.092,
    lng: -124.989,
  },
  {
    id: "5cebf1de3d0f4a073c4bb983",
    code: "08025",
    name: "Redonda Bay",
    lat: 50.2605,
    lng: -124.9553,
  },
  {
    id: "5cebf1de3d0f4a073c4bb981",
    code: "08015",
    name: "Channel Island",
    lat: 50.3167,
    lng: -124.75,
  },
  {
    id: "5cebf1de3d0f4a073c4bb960",
    code: "07880",
    name: "Powell River",
    lat: 49.8667,
    lng: -124.55,
  },
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

  const results = await Promise.allSettled(
    CHS_TIDE_STATIONS.map(async (station) => {
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
