import type { BoulevardBookingProviderConfig } from "@/data/saunas/saunas";
import type { AppointmentTypeAvailability, AvailabilitySlot } from "../types";

const BOULEVARD_API_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
  "x-blvd-app-name": "booking-widget",
};

export async function fetchBoulevardAvailability(
  provider: BoulevardBookingProviderConfig,
  startDate: string
): Promise<AppointmentTypeAvailability[]> {
  const apiUrl = `https://www.joinblvd.com/b/.api/graph`;
  const headers = {
    ...BOULEVARD_API_HEADERS,
    "x-blvd-bid": provider.businessId,
  };

  const results = await Promise.all(
    provider.services.map(async (svc) => {
      // Step 1: Create a cart
      const createCartRes = await fetch(apiUrl, {
        method: "POST",
        headers,
        body: JSON.stringify({
          query: `mutation { createCart(locationId: "${provider.locationId}") { cartToken cart { id } } }`,
        }),
        next: { revalidate: 300 },
      });

      if (!createCartRes.ok) {
        throw new Error(
          `Boulevard createCart returned ${createCartRes.status}`
        );
      }

      const createCartData = await createCartRes.json();
      const cartId = createCartData.data?.createCart?.cart?.id;
      const cartToken = createCartData.data?.createCart?.cartToken;
      if (!cartId) {
        throw new Error("Boulevard createCart did not return cart ID");
      }

      // Step 2: Add the service to the cart
      const addItemRes = await fetch(apiUrl, {
        method: "POST",
        headers,
        body: JSON.stringify({
          query: `mutation { cartAddSelectedBookableItem(input: { idOrToken: "${cartToken}", itemId: "${svc.serviceId}" }) { cart { id } } }`,
        }),
        next: { revalidate: 300 },
      });

      if (!addItemRes.ok) {
        throw new Error(
          `Boulevard addItem returned ${addItemRes.status}`
        );
      }

      // Step 3: Query available dates
      const datesRes = await fetch(apiUrl, {
        method: "POST",
        headers,
        body: JSON.stringify({
          query: `query { cartBookableDates(idOrToken: "${cartId}", limit: 14, tz: "${provider.timezone}") { date } }`,
        }),
        next: { revalidate: 300 },
      });

      if (!datesRes.ok) {
        throw new Error(`Boulevard cartBookableDates returned ${datesRes.status}`);
      }

      const datesData = await datesRes.json();
      const availableDates: { date: string }[] =
        datesData.data?.cartBookableDates ?? [];

      // Filter to 7-day window
      const from = new Date(startDate);
      const to = new Date(from);
      to.setDate(to.getDate() + 7);
      const filteredDates = availableDates.filter((d) => {
        const dt = new Date(d.date);
        return dt >= from && dt < to;
      });

      // Step 4: Query available times for each date
      const dates: Record<string, AvailabilitySlot[]> = {};
      const timePromises = filteredDates.map(async (d) => {
        const timesRes = await fetch(apiUrl, {
          method: "POST",
          headers,
          body: JSON.stringify({
            query: `query { cartBookableTimes(idOrToken: "${cartId}", searchDate: "${d.date}", tz: "${provider.timezone}") { id startTime } }`,
          }),
          next: { revalidate: 300 },
        });

        if (!timesRes.ok) return;

        const timesData = await timesRes.json();
        const times: { id: string; startTime: string }[] =
          timesData.data?.cartBookableTimes ?? [];

        if (times.length > 0) {
          dates[d.date] = times.map((t) => {
            const dt = new Date(t.startTime);
            const timeStr = dt.toLocaleString("sv-SE", {
              timeZone: provider.timezone,
            });
            return {
              time: timeStr,
              slotsAvailable: null,
            };
          });
        }
      });

      await Promise.all(timePromises);

      return {
        appointmentTypeId: svc.serviceId,
        name: svc.name,
        price: svc.price,
        durationMinutes: svc.durationMinutes,
        dates,
      };
    })
  );

  return results;
}
