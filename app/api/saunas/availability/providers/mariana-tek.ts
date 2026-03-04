import type { MarianaTekBookingProviderConfig } from "@/data/saunas/saunas";
import type { AppointmentTypeAvailability, AvailabilitySlot } from "../types";

interface MarianaTekClass {
  id: string;
  name: string;
  start_date: string;
  start_time: string;
  start_datetime: string;
  capacity: number;
  available_spot_count: number;
  is_cancelled: boolean;
  class_type: {
    id: string;
    name: string;
    duration: number;
  };
}

interface MarianaTekResponse {
  count: number;
  next: string | null;
  results: MarianaTekClass[];
}

export async function fetchMarianaTekAvailability(
  provider: MarianaTekBookingProviderConfig,
  startDate: string
): Promise<AppointmentTypeAvailability[]> {
  const from = new Date(startDate);
  const to = new Date(from);
  to.setDate(to.getDate() + 6);
  const endDate = to.toISOString().split("T")[0];

  let allClasses: MarianaTekClass[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const url = new URL(
      `https://${provider.tenant}.marianatek.com/api/customer/v1/classes`
    );
    url.searchParams.set("min_start_date", startDate);
    url.searchParams.set("max_start_date", endDate);
    url.searchParams.set("ordering", "start_datetime");
    url.searchParams.set("page_size", "100");
    url.searchParams.set("page", String(page));
    if (provider.locationId) {
      url.searchParams.set("location", provider.locationId);
    }

    const res = await fetch(url.toString(), {
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      throw new Error(
        `Mariana Tek API returned ${res.status} for ${provider.tenant}`
      );
    }

    const data: MarianaTekResponse = await res.json();
    allClasses = allClasses.concat(data.results ?? []);
    hasMore = data.next !== null;
    page++;
  }

  const classTypeIds = new Set(provider.classTypes.map((ct) => ct.classTypeId));
  const filteredClasses = allClasses.filter(
    (c) => !c.is_cancelled && classTypeIds.has(c.class_type.id)
  );

  const typeMap = new Map<string, Record<string, AvailabilitySlot[]>>();

  for (const cls of filteredClasses) {
    const typeId = cls.class_type.id;
    if (!typeMap.has(typeId)) {
      typeMap.set(typeId, {});
    }
    const dates = typeMap.get(typeId)!;
    const dateKey = cls.start_date;

    if (!dates[dateKey]) {
      dates[dateKey] = [];
    }
    dates[dateKey].push({
      time: `${cls.start_date}T${cls.start_time}`,
      slotsAvailable: cls.available_spot_count,
    });
  }

  return provider.classTypes
    .filter((ct) => typeMap.has(ct.classTypeId))
    .map((ct) => ({
      appointmentTypeId: ct.classTypeId,
      name: ct.name,
      price: ct.price,
      durationMinutes: ct.durationMinutes,
      ...(ct.private && { private: ct.private }),
      ...(ct.seats != null && { seats: ct.seats }),
      dates: typeMap.get(ct.classTypeId) ?? {},
    }));
}
