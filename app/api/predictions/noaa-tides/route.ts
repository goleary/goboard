import { NextRequest } from "next/server";

const NOAA_API_BASE = "https://api.tidesandcurrents.noaa.gov/api/prod/datagetter";

// All NOAA tide prediction stations in the Salish Sea / Puget Sound area
const NOAA_TIDE_STATIONS = [
  // Strait of Juan de Fuca
  { id: "9443644", name: "Twin Rivers", lat: 48.175, lng: -123.95 },
  { id: "9443826", name: "Crescent Bay", lat: 48.1617, lng: -123.725 },
  { id: "9444090", name: "Port Angeles", lat: 48.125, lng: -123.44 },
  { id: "9444122", name: "Ediz Hook", lat: 48.14, lng: -123.413 },
  { id: "9444471", name: "Dungeness", lat: 48.1667, lng: -123.117 },
  { id: "9444555", name: "Sequim Bay Entrance", lat: 48.0817, lng: -123.043 },
  { id: "9444705", name: "Gardiner, Discovery Bay", lat: 48.0583, lng: -122.917 },
  { id: "9444900", name: "Port Townsend", lat: 48.1112, lng: -122.7597 },
  { id: "9444971", name: "Mystery Bay, Marrowstone Island", lat: 48.0583, lng: -122.692 },
  { id: "9444972", name: "Marrowstone Point", lat: 48.0917, lng: -122.69 },
  // Hood Canal
  { id: "9445016", name: "Foulweather Bluff", lat: 47.9267, lng: -122.617 },
  { id: "9445017", name: "Port Ludlow", lat: 47.925, lng: -122.68 },
  { id: "9445059", name: "Port Gamble", lat: 47.8583, lng: -122.58 },
  { id: "9445088", name: "Lofall", lat: 47.815, lng: -122.657 },
  { id: "9445133", name: "Bangor Wharf", lat: 47.7483, lng: -122.727 },
  { id: "9445246", name: "Whitney Point, Dabob Bay", lat: 47.7617, lng: -122.85 },
  { id: "9445269", name: "Zelatched Point, Dabob Bay", lat: 47.7117, lng: -122.822 },
  { id: "9445272", name: "Quilcene", lat: 47.8, lng: -122.858 },
  { id: "9445293", name: "Pleasant Harbor", lat: 47.665, lng: -122.912 },
  { id: "9445303", name: "Seabeck", lat: 47.6417, lng: -122.828 },
  { id: "9445326", name: "Triton Head", lat: 47.6033, lng: -122.982 },
  { id: "9445388", name: "Ayock Point", lat: 47.5083, lng: -123.052 },
  { id: "9445441", name: "Lynch Cove Dock", lat: 47.4183, lng: -122.9 },
  { id: "9445478", name: "Union", lat: 47.3583, lng: -123.098 },
  // Kitsap Peninsula / Bainbridge
  { id: "9445526", name: "Hansville", lat: 47.9183, lng: -122.545 },
  { id: "9445639", name: "Kingston", lat: 47.7967, lng: -122.493 },
  { id: "9445683", name: "Port Jefferson", lat: 47.7467, lng: -122.477 },
  { id: "9445719", name: "Poulsbo, Liberty Bay", lat: 47.725, lng: -122.638 },
  { id: "9445753", name: "Port Madison", lat: 47.705, lng: -122.525 },
  { id: "9445832", name: "Brownsville", lat: 47.6517, lng: -122.615 },
  { id: "9445882", name: "Eagle Harbor, Bainbridge Island", lat: 47.62, lng: -122.515 },
  { id: "9445901", name: "Tracyton, Dyes Inlet", lat: 47.61, lng: -122.66 },
  { id: "9445913", name: "Port Blakely", lat: 47.5967, lng: -122.51 },
  { id: "9445938", name: "Clam Bay, Rich Passage", lat: 47.5733, lng: -122.543 },
  { id: "9445958", name: "Bremerton", lat: 47.5617, lng: -122.623 },
  { id: "9445993", name: "Harper, Yukon Harbor", lat: 47.5233, lng: -122.517 },
  // Vashon Island / East Passage
  { id: "9446025", name: "Point Vashon", lat: 47.5117, lng: -122.463 },
  { id: "9446248", name: "Des Moines", lat: 47.4, lng: -122.328 },
  { id: "9446254", name: "Burton, Quartermaster Hbr.", lat: 47.395, lng: -122.463 },
  { id: "9446375", name: "Tahlequah, Dalco Passage", lat: 47.3333, lng: -122.507 },
  // South Puget Sound
  { id: "9446281", name: "Allyn, Case Inlet", lat: 47.3833, lng: -122.823 },
  { id: "9446291", name: "Wauna, Carr Inlet", lat: 47.3783, lng: -122.634 },
  { id: "9446366", name: "Vaughn, Case Inlet", lat: 47.3417, lng: -122.775 },
  { id: "9446369", name: "Gig Harbor", lat: 47.34, lng: -122.588 },
  { id: "9446451", name: "Horsehead Bay, Carr Inlet", lat: 47.3017, lng: -122.682 },
  { id: "9446484", name: "Tacoma", lat: 47.2667, lng: -122.4133 },
  { id: "9446486", name: "Tacoma Narrows Bridge", lat: 47.2717, lng: -122.552 },
  { id: "9446489", name: "Walkers Landing", lat: 47.2817, lng: -122.923 },
  { id: "9446491", name: "Arletta, Hale Passage", lat: 47.28, lng: -122.652 },
  { id: "9446500", name: "Home, Carr Inlet", lat: 47.275, lng: -122.758 },
  { id: "9446583", name: "McMicken Island, Case Inlet", lat: 47.2467, lng: -122.862 },
  { id: "9446628", name: "Shelton", lat: 47.215, lng: -123.083 },
  { id: "9446638", name: "Longbranch, Filucy Bay", lat: 47.21, lng: -122.753 },
  { id: "9446666", name: "Arcadia, Totten Inlet", lat: 47.1967, lng: -122.938 },
  { id: "9446671", name: "Devils Head, Drayton Passage", lat: 47.1667, lng: -122.763 },
  { id: "9446705", name: "Yoman Point, Anderson Island", lat: 47.18, lng: -122.675 },
  { id: "9446714", name: "Steilacoom", lat: 47.1733, lng: -122.603 },
  { id: "9446742", name: "Barron Point", lat: 47.1567, lng: -123.008 },
  { id: "9446752", name: "Henderson Inlet", lat: 47.155, lng: -122.838 },
  { id: "9446800", name: "Dofflemeyer Point, Budd Inlet", lat: 47.1417, lng: -122.903 },
  { id: "9446828", name: "Dupont Wharf", lat: 47.1183, lng: -122.665 },
  { id: "9446969", name: "Olympia", lat: 47.06, lng: -122.903 },
  // Seattle / Central Puget Sound
  { id: "9447029", name: "Duwamish Waterway", lat: 47.535, lng: -122.322 },
  { id: "9447110", name: "Harbor Island", lat: 47.585, lng: -122.362 },
  { id: "9447130", name: "Seattle", lat: 47.6026, lng: -122.3393 },
  { id: "9447265", name: "Meadow Point, Shilshole Bay", lat: 47.6883, lng: -122.403 },
  { id: "9447427", name: "Edmonds", lat: 47.8133, lng: -122.383 },
  { id: "9447659", name: "Everett", lat: 47.98, lng: -122.223 },
  { id: "9447717", name: "Priest Point", lat: 48.0349, lng: -122.2272 },
  { id: "9447773", name: "Tulalip", lat: 48.065, lng: -122.288 },
  // Whidbey Island
  { id: "9447814", name: "Glendale, Whidbey Island", lat: 47.94, lng: -122.357 },
  { id: "9447854", name: "Bush Point, Whidbey Island", lat: 48.0333, lng: -122.607 },
  { id: "9447883", name: "Greenbank, Whidbey Island", lat: 48.105, lng: -122.57 },
  { id: "9447905", name: "Admiralty Head", lat: 48.1583, lng: -122.668 },
  { id: "9447929", name: "Coupeville, Penn Cove", lat: 48.2233, lng: -122.69 },
  { id: "9447934", name: "Point Partridge", lat: 48.2317, lng: -122.765 },
  { id: "9447951", name: "Sunset Beach, Whidbey Island", lat: 48.2833, lng: -122.728 },
  { id: "9447952", name: "Crescent Harbor", lat: 48.2867, lng: -122.617 },
  { id: "9447973", name: "NAS Whidbey Island", lat: 48.3428, lng: -122.6858 },
  { id: "9447985", name: "Smith Island", lat: 48.3167, lng: -122.837 },
  { id: "9447993", name: "Ala Spit, Whidbey Island", lat: 48.3967, lng: -122.587 },
  { id: "9447995", name: "Cornet Bay, Deception Pass", lat: 48.4017, lng: -122.623 },
  // Skagit / La Conner
  { id: "9448558", name: "La Conner, Swinomish Channel", lat: 48.3917, lng: -122.497 },
  { id: "9448576", name: "Sneeoosh Point", lat: 48.4, lng: -122.548 },
  { id: "9448601", name: "Yokeko Point, Deception Pass", lat: 48.4133, lng: -122.615 },
  { id: "9448657", name: "Turner Bay, Similk Bay", lat: 48.445, lng: -122.555 },
  { id: "9448682", name: "Swinomish Channel Entrance", lat: 48.4583, lng: -122.513 },
  // Anacortes / Fidalgo Island
  { id: "9448683", name: "Burrows Bay", lat: 48.46, lng: -122.695 },
  { id: "9448772", name: "Ship Harbor, Fidalgo Island", lat: 48.5067, lng: -122.677 },
  { id: "9448794", name: "Anacortes", lat: 48.5183, lng: -122.62 },
  { id: "9448876", name: "Strawberry Bay, Cypress Island", lat: 48.565, lng: -122.722 },
  { id: "9448918", name: "Tide Point, Cypress Island", lat: 48.5867, lng: -122.748 },
  // Bellingham / Lummi
  { id: "9449161", name: "Village Point, Lummi Island", lat: 48.7167, lng: -122.708 },
  { id: "9449184", name: "Gooseberry Point", lat: 48.73, lng: -122.67 },
  { id: "9449211", name: "Bellingham", lat: 48.745, lng: -122.495 },
  { id: "9449292", name: "Sandy Point, Lummi Bay", lat: 48.79, lng: -122.708 },
  { id: "9449424", name: "Cherry Point", lat: 48.8627, lng: -122.7586 },
  { id: "9449639", name: "Point Roberts", lat: 48.975, lng: -123.083 },
  { id: "9449679", name: "Blaine", lat: 48.9917, lng: -122.765 },
  // San Juan Islands
  { id: "9449704", name: "Patos Island", lat: 48.7867, lng: -122.97 },
  { id: "9449712", name: "Echo Bay, Sucia Islands", lat: 48.7567, lng: -122.897 },
  { id: "9449746", name: "Waldron Island", lat: 48.6868, lng: -123.0376 },
  { id: "9449771", name: "Rosario, Orcas Island", lat: 48.6467, lng: -122.87 },
  { id: "9449798", name: "Orcas, Orcas Island", lat: 48.6, lng: -122.95 },
  { id: "9449828", name: "Hanbury Point, San Juan Island", lat: 48.5817, lng: -123.17 },
  { id: "9449834", name: "Roche Harbor", lat: 48.61, lng: -123.155 },
  { id: "9449856", name: "Kanaka Bay, San Juan Island", lat: 48.485, lng: -123.083 },
  { id: "9449880", name: "Friday Harbor", lat: 48.5453, lng: -123.0125 },
  { id: "9449904", name: "Shaw Island Ferry Terminal", lat: 48.585, lng: -122.928 },
  { id: "9449911", name: "Upright Head, Lopez Island", lat: 48.5717, lng: -122.885 },
  { id: "9449932", name: "Armitage Island, Thatcher Pass", lat: 48.535, lng: -122.797 },
  { id: "9449982", name: "Richardson, Lopez Island", lat: 48.4467, lng: -122.9 },
  { id: "9449994", name: "Aleck Bay, Lopez Island", lat: 48.425, lng: -122.853 },
];

interface NOAAPrediction {
  t: string; // "2026-03-26 00:00"
  v: string; // water level in meters
}

type TideStationWithPrediction = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  source: "noaa-tide";
  predictions: {
    Time: string;
    waterLevel: number;
  }[];
};

const GET = async (request: NextRequest) => {
  const beginDate = request.nextUrl.searchParams.get("begin_date");
  const endDate = request.nextUrl.searchParams.get("end_date");

  if (!beginDate || !endDate) {
    return Response.json(
      { error: "begin_date and end_date required" },
      { status: 400 }
    );
  }

  const stations: TideStationWithPrediction[] = [];

  // NOAA doesn't have the same rate limit issues as CHS, but batch to be safe
  const BATCH_SIZE = 6;
  const BATCH_DELAY_MS = 200;

  for (let i = 0; i < NOAA_TIDE_STATIONS.length; i += BATCH_SIZE) {
    const batch = NOAA_TIDE_STATIONS.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.allSettled(
      batch.map(async (station) => {
        const url = `${NOAA_API_BASE}?station=${station.id}&product=predictions&begin_date=${beginDate}&end_date=${endDate}&datum=MLLW&time_zone=gmt&interval=30&units=metric&format=json`;
        const response = await fetch(url, { next: { revalidate: 3600 } });
        if (!response.ok) {
          console.warn(`NOAA tide API error for station ${station.id}: ${response.status}`);
          return null;
        }
        const data = await response.json();
        const preds = data?.predictions as NOAAPrediction[] | undefined;
        if (!preds?.length) return null;

        return {
          id: `noaa-tide-${station.id}`,
          name: station.name,
          lat: station.lat,
          lng: station.lng,
          source: "noaa-tide" as const,
          predictions: preds.map((p) => ({
            Time: p.t.replace(" ", "T"),
            waterLevel: parseFloat(p.v),
          })),
        };
      })
    );

    for (const result of batchResults) {
      if (result.status === "fulfilled" && result.value) {
        stations.push(result.value);
      }
    }

    if (i + BATCH_SIZE < NOAA_TIDE_STATIONS.length) {
      await new Promise((r) => setTimeout(r, BATCH_DELAY_MS));
    }
  }

  // Ensure consistent prediction count
  let expectedLen: number | undefined;
  const filtered: TideStationWithPrediction[] = [];
  for (const station of stations) {
    if (!expectedLen) {
      expectedLen = station.predictions.length;
    } else if (station.predictions.length !== expectedLen) {
      console.warn(
        `NOAA tide station ${station.id} has ${station.predictions.length} predictions, expected ${expectedLen}`
      );
      continue;
    }
    filtered.push(station);
  }

  return Response.json(filtered);
};

export { GET };
