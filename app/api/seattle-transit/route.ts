import { NextRequest } from "next/server";
import { getStationBySlug, DEFAULT_STATION } from "@/app/tools/seattle-transit/stations";

const OBA_BASE = "https://api.pugetsound.onebusaway.org/api/where";
const API_KEY = "TEST";

export interface Arrival {
  scheduledTime: number;
  predictedTime: number | null;
  headsign: string;
  routeName: string;
  isRealtime: boolean;
}

export interface TransitResponse {
  northbound: Arrival[];
  southbound: Arrival[];
  stationName: string;
}

async function fetchArrivals(stopId: string): Promise<Arrival[]> {
  const url = `${OBA_BASE}/arrivals-and-departures-for-stop/${stopId}.json?key=${API_KEY}&minutesAfter=60`;
  const res = await fetch(url, { next: { revalidate: 30 } });

  if (!res.ok) {
    throw new Error(`OBA API returned ${res.status} for stop ${stopId}`);
  }

  const json = await res.json();
  const entries = json?.data?.entry?.arrivalsAndDepartures ?? [];

  return entries
    .map(
      (e: {
        scheduledArrivalTime: number;
        predictedArrivalTime: number;
        predicted: boolean;
        tripHeadsign: string;
        routeShortName: string;
      }) => ({
        scheduledTime: e.scheduledArrivalTime,
        predictedTime: e.predicted && e.predictedArrivalTime > 0 ? e.predictedArrivalTime : null,
        headsign: e.tripHeadsign,
        routeName: e.routeShortName,
        isRealtime: e.predicted && e.predictedArrivalTime > 0,
      })
    )
    .filter((a: Arrival) => {
      const arrivalTime = a.predictedTime ?? a.scheduledTime;
      return arrivalTime > Date.now() - 60_000;
    })
    .sort(
      (a: Arrival, b: Arrival) =>
        (a.predictedTime ?? a.scheduledTime) - (b.predictedTime ?? b.scheduledTime)
    )
    .slice(0, 5);
}

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("station") ?? DEFAULT_STATION;
  const station = getStationBySlug(slug);

  if (!station) {
    return Response.json({ error: "Unknown station" }, { status: 400 });
  }

  try {
    const [northbound, southbound] = await Promise.all([
      fetchArrivals(station.northboundStopId),
      fetchArrivals(station.southboundStopId),
    ]);

    return Response.json({
      northbound,
      southbound,
      stationName: station.name,
    } satisfies TransitResponse);
  } catch (err) {
    console.error("Transit fetch error:", err);
    return Response.json(
      { error: "Failed to fetch transit data" },
      { status: 502 }
    );
  }
}
