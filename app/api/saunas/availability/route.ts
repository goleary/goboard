import { NextRequest } from "next/server";
import { z } from "zod";
import {
  getSaunaBySlug,
  type AcuityBookingProviderConfig,
} from "@/data/saunas/saunas";

export interface AvailabilitySlot {
  time: string;
  slotsAvailable: number | null;
}

export interface AppointmentTypeAvailability {
  appointmentTypeId: string;
  name: string;
  price: number;
  durationMinutes: number;
  dates: Record<string, AvailabilitySlot[]>;
}

export interface AvailabilityResponse {
  appointmentTypes: AppointmentTypeAvailability[];
}

const querySchema = z.object({
  slug: z.string().min(1),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

async function fetchAcuityAvailability(
  provider: AcuityBookingProviderConfig,
  startDate: string
): Promise<AppointmentTypeAvailability[]> {
  const results = await Promise.all(
    provider.appointmentTypes.map(async (apt) => {
      const url = new URL(
        "https://app.squarespacescheduling.com/api/scheduling/v1/availability/times"
      );
      url.searchParams.set("owner", provider.owner);
      url.searchParams.set("appointmentTypeId", String(apt.acuityAppointmentId));
      if (apt.acuityCalendarId) {
        url.searchParams.set("calendarId", String(apt.acuityCalendarId));
      }
      url.searchParams.set("startDate", startDate);
      url.searchParams.set("timezone", provider.timezone);

      const res = await fetch(url.toString(), {
        next: { revalidate: 300 },
      });

      if (!res.ok) {
        throw new Error(`Acuity API returned ${res.status} for type ${apt.acuityAppointmentId}`);
      }

      const raw: Record<
        string,
        Array<{ time: string; slotsAvailable: number }>
      > = await res.json();

      const dates: Record<string, AvailabilitySlot[]> = {};
      for (const [date, slots] of Object.entries(raw)) {
        dates[date] = slots.map((s) => ({
          time: s.time,
          slotsAvailable: s.slotsAvailable,
        }));
      }

      return {
        appointmentTypeId: String(apt.acuityAppointmentId),
        name: apt.name,
        price: apt.price,
        durationMinutes: apt.durationMinutes,
        dates,
      };
    })
  );

  return results;
}

export async function GET(request: NextRequest) {
  const parsed = querySchema.safeParse({
    slug: request.nextUrl.searchParams.get("slug"),
    startDate: request.nextUrl.searchParams.get("startDate"),
  });

  if (!parsed.success) {
    return Response.json(
      { error: "Invalid parameters", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { slug, startDate } = parsed.data;
  const sauna = getSaunaBySlug(slug);

  if (!sauna?.bookingProvider) {
    return Response.json(
      { error: "Sauna not found or has no availability provider" },
      { status: 404 }
    );
  }

  try {
    const provider = sauna.bookingProvider;
    let appointmentTypes: AppointmentTypeAvailability[];

    switch (provider.type) {
      case "acuity":
        appointmentTypes = await fetchAcuityAvailability(provider, startDate);
        break;
      // When adding a new provider, add a case here.
      // TypeScript will enforce this via the BookingProviderConfig union.
    }

    return Response.json({ appointmentTypes } satisfies AvailabilityResponse);
  } catch (err) {
    console.error("Availability fetch error:", err);
    return Response.json(
      { error: "Failed to fetch availability" },
      { status: 502 }
    );
  }
}
