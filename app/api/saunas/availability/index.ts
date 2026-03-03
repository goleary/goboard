import { z } from "zod";
import { getSaunaBySlug } from "@/data/saunas/saunas";
import { fetchForProvider } from "./providers";

export type {
  AvailabilitySlot,
  AppointmentTypeAvailability,
  AvailabilityResponse,
} from "./types";

import type { AvailabilityResponse } from "./types";

const querySchema = z.object({
  slug: z.string().min(1),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export async function fetchAvailability(
  slug: string,
  startDate: string
): Promise<AvailabilityResponse> {
  const parsed = querySchema.safeParse({ slug, startDate });
  if (!parsed.success) {
    throw new Error(`Invalid parameters: ${parsed.error.message}`);
  }

  const sauna = getSaunaBySlug(slug);
  if (!sauna?.bookingProvider) {
    throw new Error("Sauna not found or has no availability provider");
  }

  const appointmentTypes = await fetchForProvider(
    sauna.bookingProvider,
    startDate
  );

  return { appointmentTypes };
}
