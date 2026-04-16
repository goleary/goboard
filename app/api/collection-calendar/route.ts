import { NextResponse } from "next/server";

const BASE_URL = "https://myutilities.seattle.gov/rest";

const ACCOUNT = {
  accountNumber: "RsVweFfjCdpwK7EYMuCgyA==",
  personId: "Lc5wHZduSqonroApxvPIHg==",
  companyCd: "SPU",
};

const SERVICE_POINTS = {
  garbage: "goGKre60lcrC9oH7jXfiNQ==",
  recycling: "f9xn9LhWEQRszQXAR/SuuA==",
  foodYard: "IyE4rsXBv9GfMyfC/I2YJA==",
};

const PICKUP_DAY = "Thu";

export interface CollectionSchedule {
  garbage: { next: string | null; dates: string[] };
  recycling: { next: string | null; dates: string[] };
  foodYard: { next: string | null; dates: string[] };
  pickupDay: string;
}

async function getGuestToken(): Promise<string> {
  const res = await fetch(`${BASE_URL}/auth/guest`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "",
  });
  const data = await res.json();
  return data.access_token;
}

async function getCalendar(token: string): Promise<Record<string, string[]>> {
  const res = await fetch(`${BASE_URL}/solidwastecalendar`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      customerId: "guest",
      accountContext: ACCOUNT,
      servicePoints: Object.values(SERVICE_POINTS),
    }),
  });
  const data = await res.json();
  return data.calendar;
}

function getNextDate(
  calendar: Record<string, string[]>,
  servicePointId: string
): string | null {
  const npKey = `${servicePointId}_NP`;
  if (calendar[npKey]?.length) {
    return calendar[npKey][0];
  }
  const dates = calendar[servicePointId] ?? [];
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  for (const d of dates) {
    const [month, day, year] = d.split("/");
    const date = new Date(+year, +month - 1, +day);
    if (date >= now) return d;
  }
  return null;
}

export async function GET() {
  try {
    const token = await getGuestToken();
    const calendar = await getCalendar(token);

    const schedule: CollectionSchedule = {
      garbage: {
        next: getNextDate(calendar, SERVICE_POINTS.garbage),
        dates: calendar[SERVICE_POINTS.garbage] ?? [],
      },
      recycling: {
        next: getNextDate(calendar, SERVICE_POINTS.recycling),
        dates: calendar[SERVICE_POINTS.recycling] ?? [],
      },
      foodYard: {
        next: getNextDate(calendar, SERVICE_POINTS.foodYard),
        dates: calendar[SERVICE_POINTS.foodYard] ?? [],
      },
      pickupDay: PICKUP_DAY,
    };

    return NextResponse.json(schedule, {
      headers: { "Cache-Control": "s-maxage=3600, stale-while-revalidate" },
    });
  } catch (error) {
    console.error("Collection calendar error:", error);
    return NextResponse.json(
      { error: "Failed to fetch collection schedule" },
      { status: 500 }
    );
  }
}
