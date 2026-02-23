import { NextRequest } from "next/server";
import { z } from "zod";
import {
  getSaunaBySlug,
  type AcuityBookingProviderConfig,
  type WixBookingProviderConfig,
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
      url.searchParams.set("calendarId", String(apt.acuityCalendarId));
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

const WIX_BOOKINGS_APP_ID = "13d21c63-b5ec-5912-8397-c3a5ddb27a97";

async function fetchWixInstanceToken(siteUrl: string): Promise<string> {
  const res = await fetch(`https://${siteUrl}/_api/v2/dynamicmodel`, {
    headers: { Accept: "application/json" },
    next: { revalidate: 300 },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch Wix dynamic model: ${res.status}`);
  }
  const data = await res.json();
  const token = data?.apps?.[WIX_BOOKINGS_APP_ID]?.instance;
  if (!token) {
    throw new Error("Wix bookings instance token not found");
  }
  return token;
}

interface WixTimeSlot {
  serviceId: string;
  localStartDate: string;
  localEndDate: string;
  bookable: boolean;
  totalCapacity: number;
  remainingCapacity: number;
}

async function fetchWixAvailability(
  provider: WixBookingProviderConfig,
  startDate: string
): Promise<AppointmentTypeAvailability[]> {
  const token = await fetchWixInstanceToken(provider.siteUrl);

  const from = new Date(startDate);
  const to = new Date(from);
  to.setDate(to.getDate() + 6);

  const fromLocal = `${startDate}T00:00:00`;
  const toLocal = `${to.toISOString().split("T")[0]}T23:59:59`;

  const res = await fetch(
    `https://${provider.siteUrl}/_api/service-availability/v2/time-slots/event`,
    {
      method: "POST",
      headers: {
        authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        timeZone: provider.timezone,
        fromLocalDate: fromLocal,
        toLocalDate: toLocal,
        serviceIds: provider.services.map((s) => s.serviceId),
        includeNonBookable: true,
        eventFilter: {},
        cursorPaging: { limit: 1000 },
      }),
      next: { revalidate: 300 },
    }
  );

  if (!res.ok) {
    throw new Error(`Wix availability API returned ${res.status}`);
  }

  const data = await res.json();
  const timeSlots: WixTimeSlot[] = data.timeSlots ?? [];

  // Group slots by serviceId, then by date
  const serviceMap = new Map<string, Record<string, AvailabilitySlot[]>>();
  for (const slot of timeSlots) {
    const dateKey = slot.localStartDate.split("T")[0];
    if (!serviceMap.has(slot.serviceId)) {
      serviceMap.set(slot.serviceId, {});
    }
    const dates = serviceMap.get(slot.serviceId)!;
    if (!dates[dateKey]) {
      dates[dateKey] = [];
    }
    dates[dateKey].push({
      time: slot.localStartDate,
      slotsAvailable: slot.remainingCapacity,
    });
  }

  return provider.services
    .filter((svc) => serviceMap.has(svc.serviceId))
    .map((svc) => ({
      appointmentTypeId: svc.serviceId,
      name: svc.name,
      price: svc.price,
      durationMinutes: svc.durationMinutes,
      dates: serviceMap.get(svc.serviceId) ?? {},
    }));
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
      case "wix":
        appointmentTypes = await fetchWixAvailability(provider, startDate);
        break;
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
