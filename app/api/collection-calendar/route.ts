import { NextResponse } from "next/server";

const BASE_URL = "https://myutilities.seattle.gov/rest";
const ADDRESS = "5010 49th ave s";

interface AddressResult {
  premCode: string;
  addressLine1: string;
  city: string;
  state: string;
  zip: string;
  premiseType: string;
}

interface ServicePoint {
  servicePointId: string;
  subType: string;
  description: string;
}

export interface CollectionSchedule {
  garbage: { next: string | null; dates: string[] };
  recycling: { next: string | null; dates: string[] };
  foodYard: { next: string | null; dates: string[] };
  pickupDay: string;
  address: string;
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

async function findAddress(token: string): Promise<AddressResult> {
  const res = await fetch(`${BASE_URL}/serviceorder/findaddress`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      address: { addressLine1: ADDRESS, city: "", zip: "" },
    }),
  });
  const data = await res.json();
  return data.address[0];
}

async function findAccount(
  token: string,
  premCode: string
): Promise<{ accountNumber: string }> {
  const res = await fetch(`${BASE_URL}/serviceorder/findAccount`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ address: { premCode } }),
  });
  const data = await res.json();
  return data.account;
}

async function getSwSummary(
  token: string,
  accountNumber: string
): Promise<{
  personId: string;
  companyCd: string;
  pickupDay: string;
  serviceAddress: string;
  services: ServicePoint[];
}> {
  const res = await fetch(`${BASE_URL}/guest/swsummary`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      customerId: "guest",
      accountContext: {
        accountNumber,
        personId: null,
        companyCd: null,
        firstName: null,
        lastName: null,
        serviceAddress: null,
      },
    }),
  });
  const data = await res.json();
  const summary = data.accountSummaryType;
  return {
    personId: summary.personId,
    companyCd: summary.companyCd,
    pickupDay: summary.pickupDay,
    serviceAddress: summary.serviceAddress,
    services: summary.swServices?.[0]?.services ?? [],
  };
}

async function getCalendar(
  token: string,
  accountNumber: string,
  personId: string,
  companyCd: string,
  servicePoints: string[]
): Promise<Record<string, string[]>> {
  const res = await fetch(`${BASE_URL}/solidwastecalendar`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      customerId: "guest",
      accountContext: { accountNumber, personId, companyCd },
      servicePoints,
    }),
  });
  const data = await res.json();
  return data.calendar;
}

function getNextDate(
  calendar: Record<string, string[]>,
  servicePointId: string
): string | null {
  // _NP suffix = "Next Pickup"
  const npKey = `${servicePointId}_NP`;
  if (calendar[npKey]?.length) {
    return calendar[npKey][0];
  }
  // Fallback: find next future date from the full list
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
    const address = await findAddress(token);
    const account = await findAccount(token, address.premCode);
    const summary = await getSwSummary(token, account.accountNumber);

    const serviceMap: Record<string, string> = {};
    for (const svc of summary.services) {
      serviceMap[svc.subType] = svc.servicePointId;
    }

    const calendar = await getCalendar(
      token,
      account.accountNumber,
      summary.personId,
      summary.companyCd,
      summary.services.map((s) => s.servicePointId)
    );

    const schedule: CollectionSchedule = {
      garbage: {
        next: getNextDate(calendar, serviceMap["G"]),
        dates: calendar[serviceMap["G"]] ?? [],
      },
      recycling: {
        next: getNextDate(calendar, serviceMap["R"]),
        dates: calendar[serviceMap["R"]] ?? [],
      },
      foodYard: {
        next: getNextDate(calendar, serviceMap["F"]),
        dates: calendar[serviceMap["F"]] ?? [],
      },
      pickupDay: summary.pickupDay,
      address: summary.serviceAddress,
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
