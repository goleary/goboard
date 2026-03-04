import type { CheckfrontBookingProviderConfig } from "@/data/saunas/saunas";
import type { AppointmentTypeAvailability, AvailabilitySlot } from "../types";

interface CheckfrontTimeslot {
  A: number; // available
  B: number; // booked
  start_time: string; // "09:00"
  end_time: string; // "10:30"
  status: string; // "A" = available
  days_span: number;
  start_date: number; // unix timestamp
  end_date: number; // unix timestamp
}

interface CheckfrontDateData {
  timeslots: CheckfrontTimeslot[];
  status: string;
  stock: { A: number; B: number; T: number };
}

interface CheckfrontRateResponse {
  item: {
    item_id: number;
    name: string;
    stock: number;
    rate: {
      status: string;
      available: number;
      dates: Record<string, CheckfrontDateData>;
    };
  };
}

export async function fetchCheckfrontAvailability(
  provider: CheckfrontBookingProviderConfig,
  startDate: string
): Promise<AppointmentTypeAvailability[]> {
  const from = new Date(startDate);
  const to = new Date(from);
  to.setDate(to.getDate() + 6);
  const endDate = to.toISOString().split("T")[0];

  const results = await Promise.all(
    provider.items.map(async (item) => {
      const url = `${provider.baseUrl}/reserve/api/?call=rate`;

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "X-Requested-With": "XMLHttpRequest",
          Referer: `${provider.baseUrl}/reserve/`,
        },
        body: new URLSearchParams({
          item_id: String(item.itemId),
          start_date: startDate,
          end_date: endDate,
          timeslot: "0",
          "param[adult]": "1",
        }).toString(),
        next: { revalidate: 300 },
      });

      if (!res.ok) {
        throw new Error(
          `Checkfront rate API returned ${res.status} for item ${item.itemId}`
        );
      }

      const data: CheckfrontRateResponse = await res.json();
      const rateDates = data.item?.rate?.dates ?? {};

      const dates: Record<string, AvailabilitySlot[]> = {};

      for (const [dateKey, dateData] of Object.entries(rateDates)) {
        // dateKey is YYYYMMDD format, convert to YYYY-MM-DD
        const isoDate = `${dateKey.slice(0, 4)}-${dateKey.slice(4, 6)}-${dateKey.slice(6, 8)}`;
        const timeslots = dateData.timeslots ?? [];

        // Filter to timeslots that have availability
        const availableSlots = timeslots.filter((ts) => ts.A > 0);
        if (availableSlots.length === 0) continue;

        dates[isoDate] = availableSlots.map((ts) => ({
          time: `${isoDate} ${ts.start_time}:00`,
          slotsAvailable: ts.A,
        }));
      }

      return {
        appointmentTypeId: String(item.itemId),
        name: item.name,
        price: item.price,
        durationMinutes: item.durationMinutes,
        ...(item.private && { private: item.private }),
        ...(item.seats != null && { seats: item.seats }),
        dates,
      };
    })
  );

  return results;
}
