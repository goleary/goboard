import type { SojoBookingProviderConfig } from "@/data/saunas/saunas";
import type { AppointmentTypeAvailability, AvailabilitySlot } from "../types";

interface SojoTimeslot {
  id: string;
  date: string; // "03/01/2026"
  time: string; // "9:00 AM"
  status: string;
  price: number; // cents
  totalAmount: number;
  capacity: number;
  available: number;
  hasLowerPrice: boolean;
}

interface SojoDateslot {
  id: string;
  available: number;
  capacity: number;
  price: number; // cents
  date: string; // "03/01/2026"
  status: string;
  timeslots: SojoTimeslot[];
}

interface SojoAvailabilityResponse {
  code: number;
  result: {
    productId: string;
    dateslots: SojoDateslot[];
  };
}

function sojoTimeTo24h(time12: string): string {
  const match = time12.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return time12;
  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  const period = match[3].toUpperCase();
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return `${String(hours).padStart(2, "0")}:${minutes}:00`;
}

export async function fetchSojoAvailability(
  provider: SojoBookingProviderConfig,
  startDate: string
): Promise<AppointmentTypeAvailability[]> {
  const from = new Date(startDate);
  const to = new Date(from);
  to.setDate(to.getDate() + 6);
  const dateTo = to.toISOString().split("T")[0];

  const url = new URL(
    `${provider.baseUrl}/api/public/reservation/admission/availableTimeslots`
  );
  url.searchParams.set("dateFrom", startDate);
  url.searchParams.set("dateTo", dateTo);
  url.searchParams.set("numberOfGuest", "1");

  const res = await fetch(url.toString(), {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`SoJo API returned ${res.status}`);
  }

  const data: SojoAvailabilityResponse = await res.json();

  if (data.code !== 1 || !data.result?.dateslots) {
    return [];
  }

  const dates: Record<string, AvailabilitySlot[]> = {};
  let lowestPrice: number | undefined;

  for (const dateslot of data.result.dateslots) {
    if (dateslot.status !== "open") continue;

    // Convert "03/01/2026" to "2026-03-01"
    const [month, day, year] = dateslot.date.split("/");
    const dateKey = `${year}-${month}-${day}`;

    const slots: AvailabilitySlot[] = [];

    for (const ts of dateslot.timeslots) {
      if (ts.status !== "open" || ts.available <= 0) continue;

      const time24 = sojoTimeTo24h(ts.time);
      slots.push({
        time: `${dateKey} ${time24}`,
        slotsAvailable: ts.available,
      });

      const priceInDollars = ts.price / 100;
      if (lowestPrice === undefined || priceInDollars < lowestPrice) {
        lowestPrice = priceInDollars;
      }
    }

    if (slots.length > 0) {
      dates[dateKey] = slots;
    }
  }

  return [
    {
      appointmentTypeId: "DA_RESERVATION",
      name: "Daily Admission",
      price: lowestPrice,
      durationMinutes: 600,
      dates,
    },
  ];
}
