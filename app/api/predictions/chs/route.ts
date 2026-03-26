import { NextRequest } from "next/server";

const CHS_API_BASE = "https://api-iwls.dfo-mpo.gc.ca/api/v1";

// Current stations near Desolation Sound / Discovery Islands
const CHS_CURRENT_STATIONS = [
  {
    id: "63aefe506a2b9417c0350720",
    code: "07840",
    name: "Beazley Passage",
    lat: 50.2263,
    lng: -125.142,
  },
  {
    id: "63aefc7784e5432cd3b6eb1e",
    code: "08108",
    name: "Seymour Narrows",
    lat: 50.1333,
    lng: -125.35,
  },
  {
    id: "63aefcb26a2b9417c035071e",
    code: "08052",
    name: "Hole in the Wall",
    lat: 50.3001,
    lng: -125.208,
  },
  {
    id: "5dd3064fe0fdc4b9b4be6978",
    code: "08059",
    name: "Gillard Passage",
    lat: 50.3933,
    lng: -125.157,
  },
  {
    id: "63aeff5884e5432cd3b71283",
    code: "08064",
    name: "Arran Rapids",
    lat: 50.42,
    lng: -125.14,
  },
  {
    id: "63af06d56a2b9417c0353451",
    code: "08138",
    name: "Dent Rapids",
    lat: 50.41,
    lng: -125.212,
  },
];

interface CHSDataPoint {
  eventDate: string;
  value: number;
}

type StationWithPrediction = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  source: "chs";
  predictions: {
    meanFloodDir: number;
    Bin: string;
    meanEbbDir: number;
    Time: string;
    Depth: string;
    Velocity_Major: number;
  }[];
};

async function fetchTimeSeries(
  stationId: string,
  code: string,
  from: string,
  to: string
): Promise<CHSDataPoint[]> {
  const url = `${CHS_API_BASE}/stations/${stationId}/data?time-series-code=${code}&from=${from}&to=${to}&resolution=FIFTEEN_MINUTES`;
  const response = await fetch(url, { next: { revalidate: 3600 } });
  if (!response.ok) {
    console.warn(
      `CHS API error for station ${stationId}, code ${code}: ${response.status}`
    );
    return [];
  }
  return response.json();
}

// Round a date down to the nearest 30-minute mark
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
    return Response.json({ error: "begin_date and end_date required" }, { status: 400 });
  }

  // Convert yyyymmdd to ISO 8601
  const from = `${beginDate.slice(0, 4)}-${beginDate.slice(4, 6)}-${beginDate.slice(6, 8)}T00:00:00Z`;
  const to = `${endDate.slice(0, 4)}-${endDate.slice(4, 6)}-${endDate.slice(6, 8)}T00:00:00Z`;

  const stationsWithPredictions: StationWithPrediction[] = [];

  const results = await Promise.allSettled(
    CHS_CURRENT_STATIONS.map(async (station) => {
      const [speedData, directionData] = await Promise.all([
        fetchTimeSeries(station.id, "wcsp1", from, to),
        fetchTimeSeries(station.id, "wcdp1", from, to),
      ]);

      if (!speedData.length || !directionData.length) {
        return null;
      }

      // Index direction data by rounded time for quick lookup
      const dirByTime = new Map<string, number>();
      for (const d of directionData) {
        dirByTime.set(roundTo30Min(new Date(d.eventDate)), d.value);
      }

      // Filter speed data to 30-minute intervals and pair with direction
      const seen = new Set<string>();
      const predictions: StationWithPrediction["predictions"] = [];

      for (const sp of speedData) {
        const rounded = roundTo30Min(new Date(sp.eventDate));
        if (seen.has(rounded)) continue;
        seen.add(rounded);

        const direction = dirByTime.get(rounded);
        if (direction === undefined) continue;

        predictions.push({
          Time: rounded.replace("Z", "").replace(".000", ""),
          Velocity_Major: sp.value,
          meanFloodDir: direction,
          meanEbbDir: direction,
          Bin: "1",
          Depth: "0",
        });
      }

      return {
        id: `chs-${station.code}`,
        name: station.name,
        lat: station.lat,
        lng: station.lng,
        source: "chs" as const,
        predictions,
      };
    })
  );

  let expectedLen: number | undefined;
  for (const result of results) {
    if (result.status === "rejected") continue;
    const station = result.value;
    if (!station || !station.predictions.length) continue;

    if (!expectedLen) {
      expectedLen = station.predictions.length;
    } else if (station.predictions.length !== expectedLen) {
      console.warn(
        `CHS station ${station.id} has ${station.predictions.length} predictions, expected ${expectedLen}`
      );
      continue;
    }

    stationsWithPredictions.push(station);
  }

  return Response.json(stationsWithPredictions);
};

export { GET };
