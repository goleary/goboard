import { NextRequest } from "next/server";
import { z } from "zod";
import { getSaunaBySlug } from "@/data/saunas/saunas";
import type { WaterTempResponse } from "./providers/types";
import { fetchCioosErddapWaterTemp } from "./providers/cioos-erddap";
import { fetchKingCountyBuoyWaterTemp } from "./providers/king-county-buoy";
import { fetchNoaaWaterTemp } from "./providers/noaa";

export type { WaterTempResponse };

const querySchema = z.object({
  slug: z.string().min(1),
});

export async function GET(request: NextRequest) {
  const parsed = querySchema.safeParse({
    slug: request.nextUrl.searchParams.get("slug"),
  });

  if (!parsed.success) {
    return Response.json(
      { error: "Invalid parameters", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { slug } = parsed.data;
  const sauna = getSaunaBySlug(slug);

  if (!sauna?.waterTempProvider) {
    return Response.json(
      { error: "Sauna not found or has no water temperature provider" },
      { status: 404 }
    );
  }

  try {
    const provider = sauna.waterTempProvider;
    let result: WaterTempResponse;

    switch (provider.type) {
      case "cioos-erddap":
        result = await fetchCioosErddapWaterTemp(provider);
        break;
      case "king-county-buoy":
        result = await fetchKingCountyBuoyWaterTemp(provider);
        break;
      case "noaa":
        result = await fetchNoaaWaterTemp(provider);
        break;
      default:
        return Response.json(
          { error: "Unknown water temp provider type" },
          { status: 400 }
        );
    }

    return Response.json(result);
  } catch (err) {
    console.error("Water temp fetch error:", err);
    return Response.json(
      { error: "Failed to fetch water temperature data" },
      { status: 502 }
    );
  }
}
