import { NextRequest } from "next/server";

const CHS_API_BASE = "https://api-iwls.dfo-mpo.gc.ca/api/v1";

// Current stations across the Salish Sea
const CHS_CURRENT_STATIONS = [
  // Juan de Fuca / Victoria
  { id: "63aeee1d84e5432cd3b6c500", code: "07100", name: "Juan de Fuca - East", lat: 48.2317, lng: -123.53 },
  { id: "63aeee896a2b9417c034d337", code: "07090", name: "Race Passage", lat: 48.3067, lng: -123.5367 },
  // Gulf Islands
  { id: "63aef09f84e5432cd3b6c509", code: "07527", name: "Active Pass", lat: 48.8604, lng: -123.3128 },
  { id: "63aef0ed84e5432cd3b6c50b", code: "07438", name: "Porlier Pass", lat: 49.015, lng: -123.585 },
  { id: "63aef12e84e5432cd3b6db8d", code: "07545", name: "Gabriola Passage", lat: 49.129, lng: -123.704 },
  { id: "63aef1866a2b9417c035030f", code: "07487", name: "Dodd Narrows", lat: 49.1344, lng: -123.817 },
  // Vancouver / Burrard Inlet
  { id: "5dd30650e0fdc4b9b4be6c2d", code: "07745", name: "Second Narrows", lat: 49.2947, lng: -123.0245 },
  { id: "5cebf1e43d0f4a073c4bc434", code: "07724", name: "Calamity Point", lat: 49.3126, lng: -123.1277 },
  { id: "5dd30650e0fdc4b9b4be6d24", code: "07721", name: "First Narrows", lat: 49.316, lng: -123.14 },
  // Sunshine Coast
  { id: "63aef40a6a2b9417c0350313", code: "07845", name: "Sechelt Rapids", lat: 49.7383, lng: -123.8983 },
  // Discovery Islands / Desolation Sound
  { id: "63aefc7784e5432cd3b6eb1e", code: "08108", name: "Seymour Narrows", lat: 50.1333, lng: -125.35 },
  { id: "63aefe506a2b9417c0350720", code: "07840", name: "Beazley Passage", lat: 50.2263, lng: -125.142 },
  { id: "63aefcb26a2b9417c035071e", code: "08052", name: "Hole in the Wall", lat: 50.3001, lng: -125.208 },
  { id: "5dd3064fe0fdc4b9b4be6978", code: "08059", name: "Gillard Passage", lat: 50.3933, lng: -125.157 },
  { id: "63aeff5884e5432cd3b71283", code: "08064", name: "Arran Rapids", lat: 50.42, lng: -125.14 },
  { id: "63af06d56a2b9417c0353451", code: "08138", name: "Dent Rapids", lat: 50.41, lng: -125.212 },
  // Victoria harbour
  { id: "64960066ebd87908f1fcb787", code: "07129", name: "Tillicum Bridge", lat: 48.4464, lng: -123.4002 },
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
