import type { RollerBookingProviderConfig } from "@/data/saunas/saunas";
import type { AppointmentTypeAvailability, AvailabilitySlot } from "../types";

interface RollerProduct {
  id: string;
  name: string;
  type: string;
  products: {
    id: string;
    name: string;
    cost: number;
  }[];
}

interface RollerSession {
  date: string;
  startTime: string;
  endTime: string;
  capacityRemaining: number;
  ticketCapacityRemaining: number;
  onlineSalesOpen: boolean;
}

interface RollerProductAvailability {
  id: string;
  name: string;
  type: string;
  sessions: RollerSession[] | null;
}

export async function fetchRollerAvailability(
  provider: RollerBookingProviderConfig,
  startDate: string
): Promise<AppointmentTypeAvailability[]> {
  const headers = {
    "X-Api-Key": provider.venueSlug,
    "X-Cell-Id": "a",
    "X-Checkout": provider.checkoutSlug,
    Accept: "application/json",
  };

  // Fetch products to get names and prices
  const productsRes = await fetch(
    `https://api.roller.app/api/checkout/${provider.checkoutSlug}/products`,
    { headers, next: { revalidate: 300 } }
  );
  if (!productsRes.ok) {
    throw new Error(`Roller products API returned ${productsRes.status}`);
  }
  const productGroups: RollerProduct[] = await productsRes.json();

  // Build a flat map of product ID -> product info
  const productMap = new Map<string, { name: string; price: number }>();
  for (const group of productGroups) {
    for (const prod of group.products) {
      productMap.set(prod.id, { name: prod.name, price: prod.cost });
    }
  }

  // Fetch availability for each day in the 7-day window
  const from = new Date(startDate);
  const dayPromises = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(from);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split("T")[0];
    dayPromises.push(
      fetch(
        `https://api.roller.app/api/checkout/${provider.checkoutSlug}/product-availability?date=${dateStr}`,
        { headers, next: { revalidate: 300 } }
      ).then(async (res) => {
        if (!res.ok) return [];
        return (await res.json()) as RollerProductAvailability[];
      })
    );
  }

  const dailyAvailability = await Promise.all(dayPromises);

  // Group sessions by product name across all days
  const productSessions = new Map<
    string,
    {
      name: string;
      price: number;
      durationMinutes: number;
      dates: Record<string, AvailabilitySlot[]>;
    }
  >();

  for (const dayProducts of dailyAvailability) {
    for (const product of dayProducts) {
      if (product.type !== "sessionpass") continue;
      const key = product.id;
      if (!productSessions.has(key)) {
        const info = productMap.get(product.id);
        productSessions.set(key, {
          name: info?.name ?? product.name,
          price: info?.price ?? 0,
          durationMinutes: 60,
          dates: {},
        });
      }

      const entry = productSessions.get(key)!;
      for (const session of product.sessions ?? []) {
        if (!session.onlineSalesOpen || session.capacityRemaining <= 0)
          continue;

        const dateKey = session.date;
        if (!entry.dates[dateKey]) {
          entry.dates[dateKey] = [];
        }
        entry.dates[dateKey].push({
          time: `${session.date} ${session.startTime}`,
          slotsAvailable: session.capacityRemaining,
        });

        // Infer duration from start/end time
        if (session.startTime && session.endTime) {
          const [sh, sm] = session.startTime.split(":").map(Number);
          const [eh, em] = session.endTime.split(":").map(Number);
          const dur = (eh * 60 + em) - (sh * 60 + sm);
          if (dur > 0) entry.durationMinutes = dur;
        }
      }
    }
  }

  return Array.from(productSessions.entries()).map(([id, product]) => ({
    appointmentTypeId: id,
    name: product.name,
    price: product.price,
    durationMinutes: product.durationMinutes,
    dates: product.dates,
  }));
}
