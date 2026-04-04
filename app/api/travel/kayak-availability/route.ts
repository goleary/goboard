import { NextResponse } from "next/server";

const CHECKFRONT_BASE =
  "https://terracentric-coastal-adventures.manage.na1.bookingplatform.app";

// Double Kayak Rental on Checkfront
const DOUBLE_KAYAK_ITEM_ID = "108718";
const CATEGORY_ID = "4057";

export interface KayakAvailability {
  date: string;
  available: number | null;
  price: number | null;
  itemName: string;
  status: "available" | "sold_out" | "unavailable" | "error";
}

async function fetchAvailabilityForDate(
  startDate: string
): Promise<KayakAvailability> {
  // Use the /reserve/inventory/ endpoint which returns JSON with rendered HTML
  const url = `${CHECKFRONT_BASE}/reserve/inventory/?filter_item_id=${DOUBLE_KAYAK_ITEM_ID}&filter_category_id=${CATEGORY_ID}&item_id=${DOUBLE_KAYAK_ITEM_ID}&category_id=${CATEGORY_ID}&start_date=${startDate}&style=droplet&cacheable=1`;

  try {
    const res = await fetch(url, { next: { revalidate: 300 } });

    if (!res.ok) {
      return {
        date: startDate,
        available: null,
        price: null,
        itemName: "Double Kayak Rental",
        status: "error",
      };
    }

    const data = await res.json();
    const html: string = data.inventory ?? "";

    // Parse item name: <h2 ... class='grid-h2 ct'>Double Kayak Rental<span
    const nameMatch = html.match(/class='grid-h2[^']*'>([^<]+)/);
    const itemName = nameMatch ? nameMatch[1].trim() : "Double Kayak Rental";

    // Parse availability: class='cf-item-status AVAILABLE'>12 Available</a>
    const availMatch = html.match(
      /cf-item-status\s+(AVAILABLE|SOLD_OUT|UNAVAILABLE)[^>]*>(\d+)\s*Available/i
    );

    // Parse price: <span>$105.00</span>
    const priceMatch = html.match(
      /aria-label='Price:\s*\$?([\d,.]+)'/
    );

    if (availMatch) {
      const statusClass = availMatch[1].toUpperCase();
      const count = parseInt(availMatch[2], 10);
      return {
        date: startDate,
        available: count,
        price: priceMatch ? parseFloat(priceMatch[1].replace(",", "")) : null,
        itemName,
        status:
          statusClass === "AVAILABLE"
            ? "available"
            : statusClass === "SOLD_OUT"
              ? "sold_out"
              : "unavailable",
      };
    }

    // Check for sold out without a count
    if (html.includes("SOLD_OUT") || html.includes("Sold Out")) {
      return {
        date: startDate,
        available: 0,
        price: priceMatch ? parseFloat(priceMatch[1].replace(",", "")) : null,
        itemName,
        status: "sold_out",
      };
    }

    // No inventory HTML means item not found for this date
    if (!html.trim()) {
      return {
        date: startDate,
        available: null,
        price: null,
        itemName: "Double Kayak Rental",
        status: "unavailable",
      };
    }

    return {
      date: startDate,
      available: null,
      price: priceMatch ? parseFloat(priceMatch[1].replace(",", "")) : null,
      itemName,
      status: "unavailable",
    };
  } catch {
    return {
      date: startDate,
      available: null,
      price: null,
      itemName: "Double Kayak Rental",
      status: "error",
    };
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get("start_date") ?? "2026-05-17";
  const days = parseInt(searchParams.get("days") ?? "5", 10);

  // Generate date strings for the rental window
  const dates: string[] = [];
  const from = new Date(startDate + "T12:00:00");
  for (let i = 0; i < days; i++) {
    const d = new Date(from);
    d.setDate(d.getDate() + i);
    dates.push(d.toISOString().split("T")[0]);
  }

  // Fetch availability for each day in parallel
  const dailyAvailability = await Promise.all(
    dates.map((date) => fetchAvailabilityForDate(date))
  );

  // Also fetch the calendar_days API for a broader month overview
  const calendarStart = startDate.slice(0, 7) + "-01";
  const endMonth = new Date(calendarStart);
  endMonth.setMonth(endMonth.getMonth() + 2);
  const calendarEnd = endMonth.toISOString().split("T")[0];

  let calendarDays: Record<string, number> = {};
  try {
    const calUrl = `${CHECKFRONT_BASE}/reserve/api/?call=calendar_days&cacheable=1&style=droplet&filter_item_id=${DOUBLE_KAYAK_ITEM_ID}&filter_category_id=${CATEGORY_ID}&item_id=${DOUBLE_KAYAK_ITEM_ID}&category_id=${CATEGORY_ID}&view=H&start_date=${calendarStart}&end_date=${calendarEnd}`;
    const calRes = await fetch(calUrl, { next: { revalidate: 300 } });
    if (calRes.ok) {
      calendarDays = await calRes.json();
    }
  } catch {
    // Calendar data is supplementary, don't fail the whole request
  }

  return NextResponse.json({
    dailyAvailability,
    calendarDays,
    checkedAt: new Date().toISOString(),
    bookingUrl: `https://www.terracentricadventures.com/rentals/kayak-rentals/`,
  });
}
