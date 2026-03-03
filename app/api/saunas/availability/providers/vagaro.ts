import type { VagaroBookingProviderConfig } from "@/data/saunas/saunas";
import type { AppointmentTypeAvailability, AvailabilitySlot } from "../types";

const VAGARO_USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

interface VagaroBookingGroup {
  BookingGroup: number;
  AppDate: string;
  AvailableTime: string;
  ServicepPoviderData: {
    AvailableTime: string;
    ServiceProviderName: string;
    ServiceID: number;
    Duration: number;
    SerivcePrice: number;
    ServiceName: string;
    AppDate: string;
  }[];
}

export async function fetchVagaroAvailability(
  provider: VagaroBookingProviderConfig,
  startDate: string
): Promise<AppointmentTypeAvailability[]> {
  // Build 7 days of dates
  const from = new Date(startDate);
  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(from);
    d.setDate(d.getDate() + i);
    // Format as M/D/YYYY which is what Vagaro expects
    dates.push(
      `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`
    );
  }

  // Fetch availability for each service x date in parallel
  const results = await Promise.all(
    provider.services.map(async (svc) => {
      const dayResults = await Promise.all(
        dates.map(async (dateStr) => {
          const res = await fetch(
            `https://www.vagaro.com/${provider.region}/websiteapi/homepage/getavailablemultiappointments`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "User-Agent": VAGARO_USER_AGENT,
              },
              body: JSON.stringify({
                lAppointmentID: 0,
                businessID: provider.businessId,
                csvServiceID: String(svc.serviceId),
                csvSPID: "",
                AppDate: dateStr,
                StyleID: null,
                isPublic: true,
                isOutcallAppointment: false,
                strCurrencySymbol: "$",
                IsFromWidgetPage: false,
                isFromShopAdmin: false,
                isMoveBack: false,
                BusinessPackageID: 0,
                PromotionID: "",
              }),
              next: { revalidate: 300 },
            }
          );

          if (!res.ok) {
            console.error(
              `Vagaro API returned ${res.status} for service ${svc.serviceId} date ${dateStr}`
            );
            return { date: dateStr, groups: [] as VagaroBookingGroup[] };
          }

          const data = await res.json();
          return {
            date: dateStr,
            groups: (data.d ?? []) as VagaroBookingGroup[],
          };
        })
      );

      // Merge all provider time slots across all days into a single set of
      // unique times per date. Each booking group represents one provider/room
      // for the same service; we union the available times across all providers
      // to get the overall availability for the service.
      const dateMap: Record<string, AvailabilitySlot[]> = {};

      for (const { groups } of dayResults) {
        if (groups.length === 0) continue;

        // Use the AppDate from the first group (format "DD Mon YYYY")
        const appDateRaw = groups[0].AppDate;
        // Parse "27 Feb 2026" -> Date -> YYYY-MM-DD
        const parsedDate = new Date(appDateRaw);
        const dateKey = parsedDate.toISOString().split("T")[0];

        // Collect all unique time slots across all providers for this date
        const timeSet = new Set<string>();
        for (const group of groups) {
          if (group.AvailableTime) {
            for (const time of group.AvailableTime.split(",")) {
              timeSet.add(time.trim());
            }
          }
        }

        if (timeSet.size === 0) continue;

        // Sort times chronologically
        const sortedTimes = Array.from(timeSet).sort((a, b) => {
          const toMinutes = (t: string) => {
            const match = t.match(/(\d+):(\d+)\s*(AM|PM)/i);
            if (!match) return 0;
            let h = parseInt(match[1], 10);
            const m = parseInt(match[2], 10);
            const period = match[3].toUpperCase();
            if (period === "PM" && h !== 12) h += 12;
            if (period === "AM" && h === 12) h = 0;
            return h * 60 + m;
          };
          return toMinutes(a) - toMinutes(b);
        });

        // Convert time strings to full datetime strings and count available providers
        dateMap[dateKey] = sortedTimes.map((time) => {
          // Count how many providers/rooms have this time available
          let providerCount = 0;
          for (const group of groups) {
            if (
              group.AvailableTime &&
              group.AvailableTime.split(",")
                .map((t) => t.trim())
                .includes(time)
            ) {
              providerCount++;
            }
          }

          // Convert "02:30 PM" to 24h format for the time string
          const match = time.match(/(\d+):(\d+)\s*(AM|PM)/i);
          let hours = 0;
          let minutes = 0;
          if (match) {
            hours = parseInt(match[1], 10);
            minutes = parseInt(match[2], 10);
            const period = match[3].toUpperCase();
            if (period === "PM" && hours !== 12) hours += 12;
            if (period === "AM" && hours === 12) hours = 0;
          }

          return {
            time: `${dateKey} ${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`,
            slotsAvailable: providerCount,
          };
        });
      }

      return {
        appointmentTypeId: String(svc.serviceId),
        name: svc.name,
        price: svc.price,
        durationMinutes: svc.durationMinutes,
        dates: dateMap,
      };
    })
  );

  return results;
}

interface VagaroClassEvent {
  className: string;
  availableTime: string;
  availableEndTime: string;
  strStartTime: string;
  duration: number;
  noOfAttendees: number;
  eventCapacity: number;
  sessionDetail: string; // "serviceId-qty-price-discount-finalPrice-tax"
}

export async function fetchVagaroClassAvailability(
  provider: VagaroBookingProviderConfig,
  startDate: string
): Promise<AppointmentTypeAvailability[]> {
  const from = new Date(startDate);

  // Build 7 days of dates in "Ddd Mmm-DD-YYYY" format
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const dates: { formatted: string; isoDate: string }[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(from);
    d.setDate(d.getDate() + i);
    const dayName = dayNames[d.getDay()];
    const monthName = monthNames[d.getMonth()];
    const dd = String(d.getDate()).padStart(2, "0");
    const yyyy = d.getFullYear();
    dates.push({
      formatted: `${dayName} ${monthName}-${dd}-${yyyy}`,
      isoDate: d.toISOString().split("T")[0],
    });
  }

  // Service IDs we care about (filter out non-sauna classes)
  const serviceIdSet = new Set(provider.services.map((s) => s.serviceId));

  // Fetch each day in parallel
  const dayResults = await Promise.all(
    dates.map(async ({ formatted, isoDate }) => {
      const res = await fetch(
        `https://www.vagaro.com/${provider.region}/websiteapi/homepage/getavailablemultievents`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "User-Agent": VAGARO_USER_AGENT,
            grouptoken: provider.region.toUpperCase(),
          },
          body: JSON.stringify({
            businessID: provider.businessId,
            sSatrtDate: formatted,
            sEndDate: formatted,
            Bus_TimeZone: -8,
            Bus_CountryID: 1,
            Bus_DayLightSaving: true,
            DAY_LIGHT_SAVING: "Y",
            Cust_Timezone: -8,
            Cust_CountryID: "1",
            Cust_IsDayLightSaving: true,
            searchdetails:
              "<searchdetails><searchdetail><serviceid>-2</serviceid><spid>-2</spid><streamingstatus>2</streamingstatus></searchdetail></searchdetails>",
            userID: "0",
            promotionID: 0,
            isFromOffline: false,
            IsNewWebsiteBuilder: false,
            IncludededClassId: "",
            ExcludededClassId: "",
            IsAllowAllLocation: false,
          }),
          next: { revalidate: 300 },
        }
      );

      if (!res.ok) {
        console.error(
          `Vagaro class API returned ${res.status} for date ${formatted}`
        );
        return { isoDate, events: [] as VagaroClassEvent[] };
      }

      const events = (await res.json()) as VagaroClassEvent[];
      return { isoDate, events };
    })
  );

  // Group events by service ID, mapping to our configured services
  const serviceMap = new Map<
    number,
    { svc: (typeof provider.services)[0]; dates: Record<string, AvailabilitySlot[]> }
  >();

  for (const svc of provider.services) {
    serviceMap.set(svc.serviceId, { svc, dates: {} });
  }

  for (const { isoDate, events } of dayResults) {
    for (const event of events) {
      // Parse serviceId from sessionDetail ("serviceId-qty-price-...")
      const sessionServiceId = parseInt(event.sessionDetail.split("-")[0], 10);
      if (!serviceIdSet.has(sessionServiceId)) continue;

      const entry = serviceMap.get(sessionServiceId);
      if (!entry) continue;

      const spotsAvailable = event.eventCapacity - event.noOfAttendees;
      if (spotsAvailable <= 0) continue;

      // Convert time to 24h format
      const match = event.availableTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
      let hours = 0;
      let minutes = 0;
      if (match) {
        hours = parseInt(match[1], 10);
        minutes = parseInt(match[2], 10);
        const period = match[3].toUpperCase();
        if (period === "PM" && hours !== 12) hours += 12;
        if (period === "AM" && hours === 12) hours = 0;
      }

      if (!entry.dates[isoDate]) entry.dates[isoDate] = [];
      entry.dates[isoDate].push({
        time: `${isoDate} ${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`,
        slotsAvailable: spotsAvailable,
      });
    }
  }

  return Array.from(serviceMap.values()).map(({ svc, dates }) => ({
    appointmentTypeId: String(svc.serviceId),
    name: svc.name,
    price: svc.price,
    durationMinutes: svc.durationMinutes,
    dates,
  }));
}
