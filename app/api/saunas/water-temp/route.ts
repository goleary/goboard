import { NextRequest } from "next/server";
import { z } from "zod";
import { getSaunaBySlug, type WaterTempProviderConfig } from "@/data/saunas/saunas";
import type { WaterTempResponse } from "./providers/types";
import { fetchCioosErddapWaterTemp } from "./providers/cioos-erddap";
import { fetchKingCountyBuoyWaterTemp } from "./providers/king-county-buoy";
import { fetchNoaaWaterTemp } from "./providers/noaa";
import { fetchUsgsWaterTemp } from "./providers/usgs";
import { fetchNdbcWaterTemp } from "./providers/ndbc";

export type { WaterTempResponse };

const querySchema = z.object({
  slug: z.string().min(1),
});

function fetchProvider(provider: WaterTempProviderConfig): Promise<WaterTempResponse> {
  switch (provider.type) {
    case "cioos-erddap":
      return fetchCioosErddapWaterTemp(provider);
    case "king-county-buoy":
      return fetchKingCountyBuoyWaterTemp(provider);
    case "noaa":
      return fetchNoaaWaterTemp(provider);
    case "usgs":
      return fetchUsgsWaterTemp(provider);
    case "ndbc":
      return fetchNdbcWaterTemp(provider);
  }
}

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
    const providers = [
      sauna.waterTempProvider,
      ...(sauna.fallbackWaterTempProvider ? [sauna.fallbackWaterTempProvider] : []),
    ];

    for (const provider of providers) {
      try {
        const result = await fetchProvider(provider);
        return Response.json(result);
      } catch {
        // If there's a fallback provider, try it next
        if (provider !== providers[providers.length - 1]) continue;
        throw new Error("All providers exhausted");
      }
    }

    return Response.json(
      { error: "Failed to fetch water temperature data" },
      { status: 502 }
    );
  } catch (err) {
    console.error("Water temp fetch error:", err);
    return Response.json(
      { error: "Failed to fetch water temperature data" },
      { status: 502 }
    );
  }
}
