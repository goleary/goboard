"use server";

import { fetchAvailability } from "@/app/api/saunas/availability";
import type { AvailabilityResponse } from "@/app/api/saunas/availability/types";

export async function getAvailability(
  slug: string,
  startDate: string
): Promise<AvailabilityResponse> {
  return fetchAvailability(slug, startDate);
}
