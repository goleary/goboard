/**
 * Supported city slugs for saunas
 */
export type CitySlug = "seattle" | "portland" | "san-francisco";

/**
 * City metadata for display and routing
 */
export interface City {
  slug: CitySlug;
  name: string;
  state: string;
  description: string;
  center: { lat: number; lng: number };
  zoom: number;
}

export const cities: City[] = [
  {
    slug: "seattle",
    name: "Seattle",
    state: "WA",
    description:
      "Discover Seattle's vibrant sauna scene, from waterfront wood-fired saunas with Puget Sound plunges to traditional Russian banyas.",
    center: { lat: 47.6062, lng: -122.3321 },
    zoom: 10,
  },
  {
    slug: "portland",
    name: "Portland",
    state: "OR",
    description:
      "Portland's sauna culture blends Finnish traditions with Pacific Northwest wellness. Find cooperatives, forest retreats, and urban escapes.",
    center: { lat: 45.5152, lng: -122.6784 },
    zoom: 11,
  },
  {
    slug: "san-francisco",
    name: "San Francisco",
    state: "CA",
    description:
      "Explore SF Bay Area saunas from Japanese bathhouses in Japantown to floating saunas on the Bay with cold plunges into the Pacific.",
    center: { lat: 37.7749, lng: -122.4194 },
    zoom: 10,
  },
];

export function getCityBySlug(slug: string): City | undefined {
  return cities.find((c) => c.slug === slug);
}

/**
 * Represents a sauna facility with its amenities and details.
 *
 * **Inclusion criteria:**
 * - Must have a traditional dry sauna (wood-fired, electric, etc.). Infrared-only saunas do NOT qualify.
 * - Must be gender-inclusive. Women's-only or men's-only saunas are NOT included.
 *   Saunas with occasional gender-specific nights (e.g., Archimedes Banya) are OK if they also offer co-ed sessions.
 * - Cold plunge must be 50°F or lower to qualify as `coldPlunge: true`.
 */
export interface Sauna {
  /** URL-friendly unique identifier */
  slug: string;
  /** Display name of the sauna */
  name: string;
  /** Street address */
  address?: string;
  /** Main website URL */
  website: string;
  /** Direct booking/reservation URL */
  bookingUrl?: string;
  /**
   * Google Maps short link. Use the maps.app.goo.gl format.
   * @example "https://maps.app.goo.gl/FQ1MFyyV8vXXAhnF8"
   */
  googleMapsUrl?: string;
  /** Price in USD for a single session */
  sessionPrice: number;
  /** Typical session length in minutes (e.g., 90, 120) */
  sessionLengthMinutes?: number;
  /** Whether the facility has a steam room */
  steamRoom: boolean;
  /** Whether the facility has a cold plunge pool (50°F or lower) */
  coldPlunge: boolean;
  /** Whether the facility has a hot tub, thermal pool, or soaking tub */
  soakingTub: boolean;
  /** Whether the facility is located on water (lake, bay, canal, etc.) */
  waterfront: boolean;
  /** Whether cold plunge is into a natural body of water (bay, lake, etc.) */
  naturalPlunge: boolean;
  /** Whether showers are available */
  showers: boolean;
  /** Whether towels are included with admission */
  towelsIncluded: boolean;
  /** Whether the facility serves food (restaurant, cafe, or kitchen on-site) */
  servesFood?: boolean;
  /** Dry sauna temperature range in Fahrenheit */
  temperatureRangeF?: { min: number; max: number };
  /** Maximum guest capacity */
  capacity?: number;
  /** Operating hours description */
  hours?: string;
  /** Gender policy (e.g., "Co-ed", "Women only", "Gender-specific days") */
  genderPolicy?: string;
  /** Clothing policy (e.g., "Swimsuit required", "Clothing optional") */
  clothingPolicy?: string;
  /** Additional notes about the facility */
  notes?: string;
  /** Latitude coordinate */
  lat: number;
  /** Longitude coordinate */
  lng: number;
  /** Date when this entry was last verified (YYYY-MM-DD) */
  updatedAt: string;
}

export const saunas: Sauna[] = [
  {
    slug: "815-refresh",
    name: "815 Refresh",
    address: "815 NE 72nd St, Seattle, WA 98115",
    website: "https://www.815refresh.com/",
    sessionPrice: 25,
    sessionLengthMinutes: 60,
    steamRoom: false,
    coldPlunge: true,
    soakingTub: false,
    waterfront: false,
    naturalPlunge: false,
    showers: true,
    towelsIncluded: false,
    temperatureRangeF: { min: 170, max: 190 },
    capacity: 4,
    genderPolicy: "Private booking",
    clothingPolicy: "Swimsuit required",
    notes:
      "Private outdoor sauna and cold plunge near Green Lake. Book the entire space for up to 4 guests. Cold plunge 45-55°F. Open year-round.",
    lat: 47.680725826899355,
    lng: -122.31912671966559,
    googleMapsUrl: "https://maps.app.goo.gl/V8vZT5EHxyWjvdTt8",
    updatedAt: "2025-01-04",
  },
  {
    slug: "banya-5",
    name: "Banya 5",
    website: "https://bfreedseattle.com/",
    bookingUrl: "https://bfreedseattle.com/pages/book-now",
    sessionPrice: 70,
    sessionLengthMinutes: 120,
    steamRoom: true,
    coldPlunge: true,
    soakingTub: true,
    waterfront: false,
    naturalPlunge: false,
    showers: true,
    towelsIncluded: true,
    temperatureRangeF: { min: 150, max: 200 },
    hours: "Tue-Sun 10am-10pm, Closed Mon",
    genderPolicy: "Co-ed and gender-specific sessions available",
    clothingPolicy: "Swimsuit required in co-ed areas",
    notes:
      "Traditional Russian banya experience with platza (birch branch massage) available. Multiple sauna rooms with varying temperatures.",
    lat: 47.62033531850257,
    lng: -122.33992852528486,
    updatedAt: "2025-01-04",
  },
  // {
  //   slug: "loyly-seattle",
  //   name: "Löyly",
  //   neighborhood: "Ballard",
  //   address: "5401 17th Ave NW, Seattle, WA 98107",
  //   website: "https://loylyseattle.com/",
  //   bookingUrl: "https://loylyseattle.com/book",
  //   sessionPrice: 45,
  //   dayPassAvailable: true,
  //   privateRoomAvailable: true,
  //   steamRoom: false,
  //   coldPlunge: true,
  //   showers: true,
  //   towelsIncluded: true,
  //   temperatureRangeF: { min: 175, max: 195 },
  //   hours: "Daily 9am-10pm",
  //   genderPolicy: "Co-ed",
  //   clothingPolicy: "Swimsuit required",
  //   notes:
  //     "Finnish-style sauna with authentic löyly (steam) experience. Beautiful Nordic design and outdoor cold plunge.",
  //   lat: 47.6687,
  //   lng: -122.3778,
  //   updatedAt: "2025-01-04",
  // },  // NOTE: Actually in Portland, not Seattle
  // {
  //   slug: "otterbath",
  //   name: "Otterbath",
  //   neighborhood: "Beacon Hill",
  //   address: "2961 Beacon Ave S, Seattle, WA 98144",
  //   website: "https://otterbath.com/",
  //   bookingUrl: "https://otterbath.com/book",
  //   sessionPrice: 40,
  //   dayPassAvailable: true,
  //   privateRoomAvailable: false,
  //   steamRoom: true,
  //   coldPlunge: true,
  //   showers: true,
  //   towelsIncluded: true,
  //   temperatureRangeF: { min: 170, max: 185 },
  //   hours: "Wed-Mon 10am-9pm, Closed Tue",
  //   genderPolicy: "Co-ed",
  //   clothingPolicy: "Swimsuit required",
  //   notes:
  //     "Community-focused bathhouse with traditional Korean-inspired elements. Excellent value for the experience.",
  //   lat: 47.5792,
  //   lng: -122.3107,
  //   updatedAt: "2025-01-04",
  // },  // NOTE: Does not exist
  // {
  //   slug: "archimedes-banya",
  //   name: "Archimedes Banya",
  //   neighborhood: "Fremont",
  //   address: "748 N 34th St, Seattle, WA 98103",
  //   website: "https://archimedesbanya.com/",
  //   bookingUrl: "https://archimedesbanya.com/book",
  //   sessionPrice: 50,
  //   dayPassAvailable: true,
  //   privateRoomAvailable: true,
  //   steamRoom: true,
  //   coldPlunge: true,
  //   showers: true,
  //   towelsIncluded: false,
  //   temperatureRangeF: { min: 180, max: 210 },
  //   hours: "Daily 10am-11pm",
  //   genderPolicy: "Co-ed and gender-specific sessions",
  //   clothingPolicy: "Nude in single-gender, swimsuit in co-ed",
  //   notes:
  //     "Traditional Russian banya with extremely hot sauna. Known for intense heat and authentic experience.",
  //   lat: 47.6498,
  //   lng: -122.3508,
  //   updatedAt: "2025-01-04",
  // },  // NOTE: Actually in San Francisco, not Seattle
  // {
  //   slug: "float-seattle",
  //   name: "Float Seattle",
  //   neighborhood: "Wallingford",
  //   address: "1750 N 45th St, Seattle, WA 98103",
  //   website: "https://floatseattle.com/",
  //   bookingUrl: "https://floatseattle.com/book",
  //   sessionPrice: 89,
  //   dayPassAvailable: true,
  //   privateRoomAvailable: true,
  //   steamRoom: false,
  //   coldPlunge: false,
  //   showers: true,
  //   towelsIncluded: true,
  //   temperatureRangeF: { min: 160, max: 180 },
  //   hours: "Daily 9am-9pm",
  //   genderPolicy: "Private rooms only",
  //   clothingPolicy: "Private experience",
  //   notes:
  //     "Combines float therapy with infrared sauna. Focus on relaxation and sensory deprivation.",
  //   lat: 47.6615,
  //   lng: -122.3352,
  //   updatedAt: "2025-01-04",
  // },  // NOTE: Float/infrared focused, not public outdoor sauna
  // {
  //   slug: "hive-wellness",
  //   name: "Hive Wellness",
  //   neighborhood: "Greenwood",
  //   address: "7401 Greenwood Ave N, Seattle, WA 98103",
  //   website: "https://hivewellnessseattle.com/",
  //   sessionPrice: 25,
  //   dayPassAvailable: true,
  //   privateRoomAvailable: false,
  //   steamRoom: false,
  //   coldPlunge: true,
  //   showers: true,
  //   towelsIncluded: false,
  //   temperatureRangeF: { min: 150, max: 175 },
  //   hours: "Mon-Sat 7am-9pm, Sun 9am-6pm",
  //   genderPolicy: "Co-ed",
  //   clothingPolicy: "Swimsuit required",
  //   notes:
  //     "Community wellness center with infrared sauna and ice bath. Great for beginners and budget-conscious.",
  //   lat: 47.6835,
  //   lng: -122.3556,
  //   updatedAt: "2025-01-04",
  // },  // NOTE: Infrared focused, not traditional sauna
  {
    slug: "bywater-alki",
    name: "Bywater Alki",
    website: "https://bywatersauna.com/",
    sessionPrice: 35,
    sessionLengthMinutes: 60,
    steamRoom: false,
    coldPlunge: true,
    soakingTub: false,
    waterfront: true,
    naturalPlunge: true,
    showers: true,
    towelsIncluded: false,
    hours: "Daily",
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes: "Waterfront sauna at Alki Beach with cold plunge into Puget Sound.",
    lat: 47.57970873990119,
    lng: -122.41016181679144,
    googleMapsUrl: "https://maps.app.goo.gl/BEs4m6Az5EfVA84w6",
    updatedAt: "2025-01-04",
  },
  {
    slug: "bywater-golden-gardens",
    name: "Bywater Golden Gardens",
    website: "https://bywatersauna.com/",
    sessionPrice: 35,
    sessionLengthMinutes: 60,
    steamRoom: false,
    coldPlunge: true,
    soakingTub: false,
    waterfront: true,
    naturalPlunge: true,
    showers: true,
    towelsIncluded: false,
    hours: "Daily",
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Waterfront sauna at Golden Gardens with cold plunge into Puget Sound.",
    lat: 47.69039345903234,
    lng: -122.40271635662027,
    updatedAt: "2025-01-04",
  },
  {
    slug: "evergreen-sauna",
    name: "Evergreen Sauna",
    address: "Mukilteo, WA",
    website: "https://evergreensauna.com/",
    googleMapsUrl: "https://maps.app.goo.gl/ywjXu2CnYXdt6fNL6",
    sessionPrice: 35,
    sessionLengthMinutes: 75,
    steamRoom: false,
    coldPlunge: true,
    soakingTub: false,
    waterfront: true,
    naturalPlunge: true,
    showers: false,
    towelsIncluded: false,
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Wood-fired mobile sauna in Snohomish County. Community sessions at rotating outdoor locations. Private rentals also available.",
    lat: 47.947830005194824,
    lng: -122.30645419904099,
    updatedAt: "2026-01-05",
  },
  {
    slug: "vihta",
    name: "Vihta",
    address: "3560 W Lake Sammamish Pkwy SE, Bellevue, WA 98008",
    website: "https://www.vihtasauna.co/",
    sessionPrice: 40,
    sessionLengthMinutes: 75,
    steamRoom: false,
    coldPlunge: true,
    soakingTub: false,
    waterfront: true,
    naturalPlunge: true,
    showers: true,
    towelsIncluded: false,
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Wood-fired sauna on Lake Sammamish at Vasa Park Resort. Hand-crafted mobile sauna with Kuuma stove and volcanic stones from Paradise Valley.",
    lat: 47.57703144634996,
    lng: -122.1118042997229,
    googleMapsUrl: "https://maps.app.goo.gl/CDbBkrwehr3fHGjG9",
    updatedAt: "2025-01-04",
  },
  {
    slug: "von-sauna",
    name: "Von Sauna",
    address: "1200 Carillon Point, Kirkland, WA 98033",
    website: "https://www.vonsauna.co/",
    sessionPrice: 40,
    sessionLengthMinutes: 75,
    steamRoom: false,
    coldPlunge: true,
    soakingTub: false,
    waterfront: true,
    naturalPlunge: true,
    showers: false,
    towelsIncluded: false,
    hours: "7AM - 7PM, 7 Days/Week",
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "PNW's original floating sauna on Lake Washington. Wood-burning heat with cold plunge directly into the lake. Custom-built floating saunas with changing room, hot room seating up to 9, and deck.",
    lat: 47.656246059795905,
    lng: -122.2077221912926,
    googleMapsUrl: "https://maps.app.goo.gl/qLPor8mT4ycxEqCe9",
    updatedAt: "2025-01-04",
  },
  {
    slug: "tuli-lodge",
    name: "Tuli Lodge",
    website: "https://www.tuli-lodge.com/",
    sessionPrice: 27,
    sessionLengthMinutes: 60,
    steamRoom: false,
    coldPlunge: true,
    soakingTub: false,
    waterfront: true,
    naturalPlunge: false,
    showers: true,
    towelsIncluded: true,
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes: "Outdoor waterfront sauna.",
    lat: 47.60852962325468,
    lng: -122.3445952181373,
    googleMapsUrl: "https://maps.app.goo.gl/MJbPogPMmEuQTraD9",
    updatedAt: "2025-01-04",
  },
  {
    slug: "good-day-sauna",
    name: "Good Day Sauna",
    address: "Lincoln Park, West Seattle",
    website: "http://www.gooddaysauna.com/",
    sessionPrice: 35,
    sessionLengthMinutes: 60,
    steamRoom: false,
    coldPlunge: true,
    soakingTub: false,
    waterfront: true,
    naturalPlunge: true,
    showers: false,
    towelsIncluded: false,
    capacity: 15,
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Wood-fired mobile sauna at Lincoln Park with iki stove. Cold plunge into Puget Sound. Bring your own towel.",
    lat: 47.52677659870919,
    lng: -122.39572104295499,
    googleMapsUrl: "https://maps.app.goo.gl/M6J5vgcMeswgkGht5",
    updatedAt: "2025-01-04",
  },
  {
    slug: "fire-and-floe",
    name: "Fire+Floe",
    website: "https://fireandfloe.com/",
    sessionPrice: 30,
    sessionLengthMinutes: 75,
    steamRoom: false,
    coldPlunge: true,
    soakingTub: false,
    waterfront: true,
    naturalPlunge: true,
    showers: false,
    towelsIncluded: false,
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Wood-burning Finnish sauna on Bainbridge Island with cold plunge into Puget Sound. Offers memberships and special events.",
    lat: 47.60460859818258,
    lng: -122.54906706776069,
    googleMapsUrl: "https://maps.app.goo.gl/VyE9xPAczrJhch9h8",
    updatedAt: "2025-01-04",
  },
  {
    slug: "fyre-sauna",
    name: "Fyre Sauna",
    address: "14123 Redmond - Woodinville Rd NE, Redmond, WA 98052",
    website: "https://www.fyresauna.com/",
    sessionPrice: 35,
    sessionLengthMinutes: 60,
    steamRoom: false,
    coldPlunge: true,
    soakingTub: false,
    waterfront: false,
    naturalPlunge: false,
    showers: true,
    towelsIncluded: true,
    temperatureRangeF: { min: 170, max: 210 },
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Wood-fired cedar-lined sauna in Woodinville Wine Country with Kuuma stove. Cold plunge tanks range from 37-55°F.",
    lat: 47.72657300142058,
    lng: -122.13848356206124,
    googleMapsUrl: "https://maps.app.goo.gl/B7dqHRKFQAWEqX9K7",
    updatedAt: "2025-01-04",
  },
  {
    slug: "soak-and-sage",
    name: "Soak & Sage",
    address: "1135 Lake Washington Blvd N Suite 60, Renton, WA 98057",
    website: "http://www.soakandsagespa.com/",
    sessionPrice: 75,
    sessionLengthMinutes: 120,
    steamRoom: true,
    coldPlunge: true,
    soakingTub: true,
    waterfront: true,
    naturalPlunge: false,
    showers: true,
    towelsIncluded: true,
    genderPolicy: "Co-ed (18+)",
    clothingPolicy: "Swimsuit required",
    notes:
      "Social wellness spa on Lake Washington. Features Adobe Clay Sauna, Finnish Sauna, steam room, cold plunge (40°F), and thermal pool (104°F). Also offers massages, facials, and body treatments.",
    lat: 47.50265104293176,
    lng: -122.201659441966,
    googleMapsUrl: "https://maps.app.goo.gl/WNCP4HCTXaxbPHJW7",
    updatedAt: "2025-01-04",
  },
  {
    slug: "seattle-sauna",
    name: "Seattle Sauna",
    website: "https://seattlesauna.com/",
    sessionPrice: 64,
    sessionLengthMinutes: 90,
    steamRoom: false,
    coldPlunge: true,
    soakingTub: false,
    waterfront: true,
    naturalPlunge: false,
    showers: true,
    towelsIncluded: true,
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes: "Traditional sauna experience.",
    lat: 47.650332705185996,
    lng: -122.33052201956258,
    updatedAt: "2025-01-04",
  },
  {
    slug: "sauna-n-soak",
    name: "Sauna n Soak",
    address: "Brackett's Landing North, Edmonds, WA",
    website: "https://www.saunansoak.com/services",
    bookingUrl: "https://www.saunansoak.com/appointments",
    googleMapsUrl: "https://maps.app.goo.gl/BJZ2vLncQueWCy5V9",
    sessionPrice: 30,
    sessionLengthMinutes: 60,
    steamRoom: false,
    coldPlunge: true,
    soakingTub: false,
    waterfront: true,
    naturalPlunge: true,
    showers: false,
    towelsIncluded: false,
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Mobile cedar sauna on the beach at Brackett's Landing North. Bring your own water and large towel. Small towel provided to sit on.",
    lat: 47.813456307232165,
    lng: -122.38195767249658,
    updatedAt: "2026-01-04",
  },
  {
    slug: "wildhaus",
    name: "Wildhaus",
    website: "https://wildhaussauna.com/",
    sessionPrice: 150,
    sessionLengthMinutes: 90,
    steamRoom: false,
    coldPlunge: true,
    soakingTub: false,
    waterfront: true,
    naturalPlunge: true,
    showers: true,
    towelsIncluded: true,
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes: "Outdoor sauna experience.",
    lat: 47.64941161755134,
    lng: -122.32544961013753,
    updatedAt: "2025-01-04",
  },
  {
    slug: "svette-sauna",
    name: "Svette Sauna",
    address: "5605 Owen Beach Rd, Tacoma, WA 98407",
    website: "https://svettetacoma.com/",
    sessionPrice: 35, // Peak pricing, $28 matinee
    sessionLengthMinutes: 75,
    steamRoom: false,
    coldPlunge: true, // Puget Sound 46-58°F
    soakingTub: false,
    waterfront: true,
    naturalPlunge: true,
    showers: false, // No public showers at Owen Beach
    towelsIncluded: false,
    temperatureRangeF: { min: 180, max: 180 }, // Average 180°F
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Tacoma's seaside sauna experience at Owen Beach. Mobile sauna with cold plunge into Puget Sound (46-58°F). Matinee $28, peak $35. Credit system booking. No public showers available.",
    lat: 47.31281390821457,
    lng: -122.52883465036992,
    googleMapsUrl: "https://maps.app.goo.gl/vZi2eZ2Mk1zFd8zu5",
    updatedAt: "2026-01-05",
  },
  {
    slug: "sacred-rain-healing-center",
    name: "Sacred Rain Healing Center",
    address: "1100 NW 50th St, Seattle, WA 98107",
    website: "https://www.sacredrainhealing.com/",
    googleMapsUrl: "https://maps.app.goo.gl/4TvEQXXCKVcUyXa57",
    sessionPrice: 50,
    sessionLengthMinutes: 180,
    steamRoom: false,
    coldPlunge: false,
    soakingTub: true,
    waterfront: false,
    naturalPlunge: false,
    showers: true,
    towelsIncluded: false,
    hours: "Sun-Thu 10am-8pm, Fri-Sat 10am-10pm",
    genderPolicy: "Co-ed",
    clothingPolicy: "Clothing optional",
    notes:
      "Outdoor spa with hot pool, dry sauna, cold outdoor showers, and sundeck. Spa entry reduced to $30 with 60+ min bodywork. 10-visit punch card available for $350.",
    lat: 47.66521324757182,
    lng: -122.37104683010173,
    updatedAt: "2026-01-05",
  },
  {
    slug: "hothouse-spa",
    name: "Hothouse Spa & Sauna",
    address: "1019 E Pike St, Seattle, WA 98122",
    website: "https://www.hothousespa.com/",
    googleMapsUrl: "https://maps.app.goo.gl/nWMgFkAafFz76Lc49",
    sessionPrice: 190, // Starting price for 90min weekday rental (up to 4 people)
    sessionLengthMinutes: 90,
    steamRoom: true,
    coldPlunge: false,
    soakingTub: true, // Tiled hot tub
    waterfront: false,
    naturalPlunge: false,
    showers: true,
    towelsIncluded: true,
    capacity: 4,
    hours: "Open 7 days a week for private use",
    genderPolicy: "Gender inclusive",
    clothingPolicy: "Private rental",
    notes:
      "Private rental spa on Capitol Hill with cedar sauna, herbal steam room, and tiled hot tub. Rates from $190 (weekday) to $240 (eve/weekend) for 90min, includes up to 4 people. Longer sessions available. $100 deposit required. Entrance on 11th Ave.",
    lat: 47.61395512236991,
    lng: -122.31851450204844,
    updatedAt: "2026-01-05",
  },
  {
    slug: "yuan-spa-bellevue",
    name: "Yuan Spa (Bellevue)",
    address: "1032 106th Ave NE, Suite 125, Bellevue, WA 98004",
    website: "https://yuanspa.com/",
    bookingUrl: "https://go.booker.com/brand/yuanspabrand/locations",
    googleMapsUrl: "https://goo.gl/maps/UphkRHkShgbc5kMa8",
    sessionPrice: 59, // Weekday price, $69 on weekends
    sessionLengthMinutes: 60,
    steamRoom: true, // Eucalyptus steam room with salt bar
    coldPlunge: false, // Cool pool is 70-85°F, not cold enough
    soakingTub: true, // Hot pool (100-105°F)
    waterfront: false,
    naturalPlunge: false,
    showers: true,
    towelsIncluded: false,
    temperatureRangeF: { min: 185, max: 195 }, // Cedar Chromatherapy Sauna
    hours: "Hydrotherapy: Daily 10am-9pm (Spa: 9:30am-10pm)",
    genderPolicy: "Co-ed (18+)",
    clothingPolicy: "Swimsuit required",
    notes:
      "Luxury day spa in downtown Bellevue blending Asian healing philosophies with modern spa tech. Hydrotherapy includes hot pool, cool pool (70-85°F), eucalyptus steam room with salt bar, cold drench shower, and cedar chromatherapy sauna. $69 on weekends. $35 with same-day spa service of $165+. Cell phones not permitted in hydrotherapy area.",
    lat: 47.6194628,
    lng: -122.1989303,
    updatedAt: "2026-01-05",
  },
  {
    slug: "rainier-beach-pool",
    name: "Rainier Beach Pool",
    address: "8825 Rainier Ave S, Seattle, WA 98118",
    website: "https://www.seattle.gov/parks/pools/rainier-beach-pool",
    googleMapsUrl: "https://goo.gl/maps/wpkhqygV5s52",
    sessionPrice: 8, // Adult drop-in 2026 pricing
    steamRoom: false,
    coldPlunge: false,
    soakingTub: true, // Hot tub/spa
    waterfront: false,
    naturalPlunge: false,
    showers: true,
    towelsIncluded: false, // $0.50 rental available
    hours: "Varies by season - check website for lap swim + sauna times",
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Seattle Parks public pool with dry sauna and hot tub. Modern facility (2013 remodel) with lap pool, leisure pool, lazy river, and water slide. Sauna available during lap swim sessions. Youth/Senior/Adaptive $6. Best value sauna+spa combo in Seattle!",
    lat: 47.524353,
    lng: -122.2707338,
    updatedAt: "2026-01-05",
  },
  {
    slug: "medgar-evers-pool",
    name: "Medgar Evers Pool",
    address: "500 23rd Ave, Seattle, WA 98122",
    website: "https://www.seattle.gov/parks/pools/medgar-evers-pool",
    googleMapsUrl: "https://goo.gl/maps/XawzGx6FqND2",
    sessionPrice: 8, // Adult drop-in 2026 pricing
    steamRoom: false,
    coldPlunge: false,
    soakingTub: false,
    waterfront: false,
    naturalPlunge: false,
    showers: true,
    towelsIncluded: false, // $0.50 rental available
    hours: "Varies by season - check website",
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Seattle Parks public pool with dry sauna. Located next to Garfield Community Center. Youth/Senior/Adaptive $6. 10-punch cards and monthly passes available. Currently closed for maintenance, anticipated reopening early 2026.",
    lat: 47.606707,
    lng: -122.302376,
    updatedAt: "2026-01-05",
  },
  {
    slug: "queen-anne-pool",
    name: "Queen Anne Pool",
    address: "1920 1st Ave W, Seattle, WA 98119",
    website: "https://www.seattle.gov/parks/pools/queen-anne-pool",
    googleMapsUrl: "https://goo.gl/maps/D3SbUfpwi6G2",
    sessionPrice: 8, // Adult drop-in 2026 pricing
    steamRoom: false,
    coldPlunge: false,
    soakingTub: false,
    waterfront: false,
    naturalPlunge: false,
    showers: true,
    towelsIncluded: false, // $0.50 rental available
    hours: "Varies by season - check website",
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Seattle Parks public pool with dry sauna. Located on Queen Anne Hill. 25-yard pool with 1m and 3m diving boards, rope swing. Youth/Senior/Adaptive $6. Currently closed for emergency maintenance (water leak) until Jan 12, 2026.",
    lat: 47.6363728,
    lng: -122.3579254,
    updatedAt: "2026-01-05",
  },
  {
    slug: "southwest-pool",
    name: "Southwest Pool",
    address: "2801 SW Thistle St, Seattle, WA 98126",
    website: "https://www.seattle.gov/parks/pools/southwest-pool",
    googleMapsUrl: "https://goo.gl/maps/6qwS4wcf6N22",
    sessionPrice: 8, // Adult drop-in 2026 pricing
    steamRoom: false,
    coldPlunge: false,
    soakingTub: true, // Spa mentioned in amenities
    waterfront: false,
    naturalPlunge: false,
    showers: true,
    towelsIncluded: false, // $0.50 rental available
    hours: "Varies by season - check website",
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Seattle Parks public pool with dry sauna and spa. Located in Roxhill neighborhood of West Seattle. 25-yard pool with diving boards. Youth/Senior/Adaptive $6. Complimentary exercise machines available.",
    lat: 47.5279301,
    lng: -122.3687135,
    updatedAt: "2026-01-05",
  },
  {
    slug: "evans-pool",
    name: "Evans Pool (Green Lake)",
    address: "7201 East Green Lake Dr N, Seattle, WA 98115",
    website: "https://www.seattle.gov/parks/pools/evans-pool",
    googleMapsUrl: "https://goo.gl/maps/31vSzVJRTSt",
    sessionPrice: 8, // Adult drop-in 2026 pricing
    steamRoom: false,
    coldPlunge: false,
    soakingTub: false,
    waterfront: false,
    naturalPlunge: false,
    showers: true,
    towelsIncluded: false, // $0.50 rental available
    hours: "Varies by season - check website",
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Seattle Parks public pool with dry sauna. Located at Green Lake Community Center. 25-yard multi-use pool with 6 lanes, 1-meter diving board. Youth/Senior/Adaptive $6.",
    lat: 47.680392,
    lng: -122.3279299,
    updatedAt: "2026-01-05",
  },
  {
    slug: "yuan-spa-totem-lake",
    name: "Yuan Spa (Totem Lake)",
    address: "11900 NE Village Plaza #176, Kirkland, WA 98034",
    website: "https://yuanspa.com/",
    bookingUrl: "https://go.booker.com/brand/yuanspabrand/locations",
    googleMapsUrl: "https://goo.gl/maps/HtTVeP2ihv92JdH36",
    sessionPrice: 59, // Weekday price, $69 on weekends
    sessionLengthMinutes: 60,
    steamRoom: true, // Eucalyptus steam room with salt bar
    coldPlunge: false, // Cool pool is 70-85°F, not cold enough; Ice Cave is cryotherapy not a plunge
    soakingTub: true, // Hot pool (100-105°F)
    waterfront: false,
    naturalPlunge: false,
    showers: true,
    towelsIncluded: false,
    temperatureRangeF: { min: 155, max: 165 }, // Heated Himalayan Salt Room
    hours: "Hydrotherapy: Daily 10am-9pm (Spa: 9:30am-10pm)",
    genderPolicy: "Co-ed (18+)",
    clothingPolicy: "Swimsuit required",
    notes:
      "Luxury day spa at The Village at Totem Lake blending Asian healing philosophies with modern spa tech. Hydrotherapy includes hot pool, cool pool (70-85°F), eucalyptus steam room with salt bar, Ice Cave (Italian imported), and Heated Himalayan Salt Room. $69 on weekends. $35 with same-day spa service of $165+. Cell phones not permitted in hydrotherapy area.",
    lat: 47.7126696,
    lng: -122.1812823,
    updatedAt: "2026-01-05",
  },
  {
    slug: "q-spa-lynnwood",
    name: "Q Sauna & Spa",
    address: "17420 Highway 99, Lynnwood, WA 98037",
    website: "https://qspalynnwood.com/",
    bookingUrl: "https://qspalynnwood.com/online-booking/",
    googleMapsUrl: "https://maps.app.goo.gl/LQXGoWeVX991iM3L8",
    sessionPrice: 48, // Day pass, $30 with service
    steamRoom: true,
    coldPlunge: true,
    soakingTub: true, // Hot tubs
    waterfront: false,
    naturalPlunge: false,
    showers: true,
    towelsIncluded: false,
    servesFood: true, // Korean restaurant on-site
    hours: "Mon-Thu 9am-10pm, Fri-Sun 9am-11pm",
    genderPolicy: "Separate men's and women's facilities",
    clothingPolicy: "Swimsuit required",
    notes:
      "Traditional Korean-inspired spa with themed sauna rooms (Charcoal, Jade, Rock & Salt), steam room, and hot tubs. Day pass $48, or $30 with service. Offers body scrubs, massages, facials, and spa packages.",
    lat: 47.8406742,
    lng: -122.2993405,
    updatedAt: "2026-01-05",
  },
  {
    slug: "cedar-and-stone-duluth",
    name: "Cedar & Stone Nordic Sauna (Duluth)",
    address: "800 W Railroad St, Duluth, MN 55802",
    website: "https://cedarandstonesauna.com/",
    bookingUrl:
      "https://fareharbor.com/embeds/book/cedarandstonesauna/?full-items=yes",
    googleMapsUrl: "https://maps.app.goo.gl/kxzGvHoJ6bTw1Rsg6",
    sessionPrice: 49, // Social session price
    sessionLengthMinutes: 75,
    steamRoom: false,
    coldPlunge: true, // Harborside natural cold plunge into Lake Superior harbor
    soakingTub: false,
    waterfront: true,
    naturalPlunge: true,
    showers: true, // Outdoor cold showers
    towelsIncluded: true,
    hours: "Thu-Mon 9am-9pm, Closed Tue-Wed",
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Flagship location on Lake Superior harbor with floating saunas. Social sessions $49, Private $79, Floating Sauna $99. Includes guided experience, herbal teas, aromatherapy, towels, and harborside cold plunge. 5.0 stars with 627 reviews. Monthly membership $199 for up to 5 sessions/week.",
    lat: 46.7769647,
    lng: -92.103863,
    updatedAt: "2026-01-06",
  },
  // {
  //   slug: "soak-on-the-sound",
  //   name: "Soak on the Sound",
  //   address: "242 Monroe St, Port Townsend, WA 98368",
  //   website: "https://soakonthesound.com/",
  //   bookingUrl:
  //     "https://square.site/book/F9RT836CPTTC6/soak-on-the-sound-port-townsend-wa",
  //   googleMapsUrl: "https://maps.app.goo.gl/WnwwSV2reCcwWbb6A",
  //   sessionPrice: 44,
  //   sessionLengthMinutes: 45,
  //   steamRoom: true, // Finnish steam sauna in Soak & Sauna Suite (wet, not dry)
  //   coldPlunge: false,
  //   soakingTub: true,
  //   waterfront: false,
  //   naturalPlunge: false,
  //   showers: true,
  //   towelsIncluded: true,
  //   hours: "Mon-Tue 3pm-9pm, Wed-Thu 11am-9pm, Fri-Sat 10am-10pm, Sun 11am-9pm",
  //   genderPolicy: "Private",
  //   clothingPolicy: "Private experience",
  //   notes:
  //     "Pacific Northwest's premier soak & sauna experience in Port Townsend. Features private salt-water soaking tubs and private FAR infrared saunas. Soak & Sauna Suite has Finnish steam sauna (wet). Reservation-based private experiences only.",
  //   lat: 48.1166702,
  //   lng: -122.7527507,
  //   updatedAt: "2026-01-06",
  // }, // NOTE: Infrared saunas only - no traditional dry sauna
  {
    slug: "onsen-sf",
    name: "Onsen",
    address: "466 Eddy St, San Francisco, CA 94109",
    website: "https://www.onsensf.com/",
    bookingUrl:
      "https://www.exploretock.com/onsenurbanbathandrestaurant/experience/109861/co-ed-bathhouse-reservation",
    googleMapsUrl: "https://maps.app.goo.gl/UEw2pajjXMjEZQ659",
    sessionPrice: 50,
    sessionLengthMinutes: 120,
    steamRoom: true,
    coldPlunge: false, // Overhead cold plunge shower, not a pool
    soakingTub: true, // 104°F heated communal pool (15 person)
    waterfront: false,
    naturalPlunge: false,
    showers: true,
    towelsIncluded: true, // Includes robe, towel, sandals
    servesFood: true, // Restaurant on-site
    hours:
      "Mon 4-10pm (Men), Tue 4-10pm (Women), Thu 2-10pm (Co-ed), Fri-Sun 10am-10pm (Co-ed), Wed Closed",
    genderPolicy: "Gender-specific and co-ed sessions",
    clothingPolicy: "Bathing suit optional on gender days, required on co-ed",
    notes:
      "Japanese-inspired communal bathhouse in SF's Tenderloin. Features redwood dry sauna, steam room, overhead cold plunge shower, and 15-person heated soaking pool. Reopened April 2025 after 5-year hiatus. Complimentary bath products and hot tea included. Max 4 guests per reservation.",
    lat: 37.7837186,
    lng: -122.4154065,
    updatedAt: "2026-01-06",
  },
  {
    slug: "alchemy-springs-sf",
    name: "Alchemy Springs",
    address: "939 Post St, San Francisco, CA 94109",
    website: "https://www.alchemysprings.com/",
    bookingUrl: "https://www.alchemysprings.com/visit",
    googleMapsUrl: "https://maps.app.goo.gl/qTQFTYt4WLd8jMXq6",
    sessionPrice: 45, // Estimated based on similar venues; offers packs and memberships
    sessionLengthMinutes: 90,
    steamRoom: false,
    coldPlunge: true, // Cold plunge pools
    soakingTub: false, // Coming in 2026 full opening
    waterfront: false,
    naturalPlunge: false,
    showers: true, // Outdoor showers
    towelsIncluded: false,
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Modern bathhouse in Lower Nob Hill with the largest freestanding dry sauna in the U.S. (40-person capacity). Currently operating 'Sauna Garden' with outdoor sauna, cold plunge pools, thermal benches, and fire pit. Full 6,000 sq ft bathhouse opening 2026. 4.8 stars with 57 reviews. Offers 3-packs, 5-packs, and 30-day unlimited memberships.",
    lat: 37.7869327,
    lng: -122.4173046,
    updatedAt: "2026-01-06",
  },
  {
    slug: "piedmont-springs",
    name: "Piedmont Springs",
    address: "3939 Piedmont Ave, Oakland, CA 94611",
    website: "https://www.piedmontsprings.com/",
    bookingUrl: "https://www.piedmontsprings.com/online-booking",
    googleMapsUrl: "https://maps.app.goo.gl/oRvFr6f97Kbaxgds8",
    sessionPrice: 20, // $20 per 30 min, $22 per 45 min
    sessionLengthMinutes: 30,
    steamRoom: true, // Separate steam room available
    coldPlunge: false,
    soakingTub: true, // Outdoor hot tubs available separately
    waterfront: false,
    naturalPlunge: false,
    showers: true,
    towelsIncluded: false,
    hours: "Daily 11am-10pm",
    genderPolicy: "Private",
    clothingPolicy: "Private rooms",
    notes:
      "Oakland spa since 1981. Private cedar-lined dry sauna with shower and dressing room. $20/30 min or $22/45 min per person. Also offers separate steam room (same pricing) and outdoor hot tubs. 2-person minimum Fri-Sun after 5pm. Massage and skin care services also available.",
    lat: 37.825413,
    lng: -122.254051,
    updatedAt: "2026-01-06",
  },
  {
    slug: "loyly-southeast",
    name: "Löyly Southeast",
    address: "2713 SE 21st Ave, Portland, OR 97202",
    website: "https://www.loyly.net/",
    bookingUrl: "https://loylysauna.zenoti.com/webstoreNew/services",
    googleMapsUrl: "https://maps.app.goo.gl/oRJtXBpuSshfED5S7",
    sessionPrice: 30, // Mon-Thu price; $40 Fri-Sun
    sessionLengthMinutes: 120,
    steamRoom: false, // SE location has steam room per web search
    coldPlunge: false,
    soakingTub: false,
    waterfront: false,
    naturalPlunge: false,
    showers: true,
    towelsIncluded: true, // Includes towel and robe
    hours: "Daily 9am-9pm",
    genderPolicy: "Co-ed (check for gender-specific days)",
    clothingPolicy: "Swimsuit required",
    notes:
      "Traditional Finnish dry sauna in SE Portland. 2-hour Sauna Lounge $30 Mon-Thu, $40 Fri-Sun. Includes towel, robe, showers with house-made products. Upgrades available: Sagewood Seasonal ($55-70) includes foot soak, face mask, tea, salt scrub. 4.7 stars with 188 reviews.",
    lat: 45.5030764,
    lng: -122.6448491,
    updatedAt: "2026-01-06",
  },
  {
    slug: "loyly-northeast",
    name: "Löyly Northeast",
    address: "3525 NE Martin Luther King Jr Blvd, Portland, OR 97212",
    website: "https://www.loyly.net/",
    bookingUrl: "https://loylysauna.zenoti.com/webstoreNew/services",
    googleMapsUrl: "https://maps.app.goo.gl/woXtQYh8kmyJuwud7",
    sessionPrice: 30, // Mon-Thu price; $40 Fri-Sun
    sessionLengthMinutes: 120,
    steamRoom: false,
    coldPlunge: false,
    soakingTub: false,
    waterfront: false,
    naturalPlunge: false,
    showers: true,
    towelsIncluded: true, // Includes towel and robe
    hours: "Daily 9am-9pm",
    genderPolicy: "Co-ed (check for gender-specific days)",
    clothingPolicy: "Swimsuit required",
    notes:
      "Traditional Finnish dry sauna in NE Portland on MLK Jr Blvd. 2-hour Sauna Lounge $30 Mon-Thu, $40 Fri-Sun. Includes towel, robe, showers with house-made products. Offers traditional whisking (vihta) treatment Thu-Sat for $45. 4.7 stars with 179 reviews.",
    lat: 45.548673,
    lng: -122.6617778,
    updatedAt: "2026-01-06",
  },
  {
    slug: "common-ground-wellness",
    name: "Common Ground Wellness Cooperative",
    address: "5010 NE 33rd Ave, Portland, OR 97211",
    website: "https://www.cgwc.org/",
    bookingUrl: "https://www.cgwc.org/scheduling",
    googleMapsUrl: "https://maps.app.goo.gl/LCiBe5hwypAzRs6R8",
    sessionPrice: 18, // 30 min; 60 min $28, 90 min $38, 120 min $48
    sessionLengthMinutes: 30,
    steamRoom: false,
    coldPlunge: false,
    soakingTub: true, // Salt water hot pool
    waterfront: false,
    naturalPlunge: false,
    showers: true,
    towelsIncluded: false, // Towel rental $2.50
    hours: "Daily 10am-10pm (Wed opens 3pm). Silent hours 10-11am & 9-10pm",
    genderPolicy: "Co-ed",
    clothingPolicy: "Clothing optional",
    notes:
      "Portland cooperative since 1970s with outdoor courtyard. Dry cedar sauna and salt water hot pool. Pricing: 30 min $18, 60 min $28, 90 min $38, 120 min $48. Members get discounts. Towel rental $2.50. Also offers massage, acupuncture, and naturopathy services.",
    lat: 45.5594156,
    lng: -122.6304762,
    updatedAt: "2026-01-06",
  },
  {
    slug: "forest-haven-sauna",
    name: "Forest Haven Sauna",
    address: "9644 SW W Haven Dr, Portland, OR 97225",
    website: "https://www.forestsaunapdx.com/",
    bookingUrl:
      "https://app.squareup.com/appointments/book/xkixhokqjj5m3m/LBCF5TC30K6Y1/start",
    googleMapsUrl: "https://maps.app.goo.gl/wV4N4MEm7jbvuxdu8",
    sessionPrice: 50, // Price varies by group size; estimate for private session
    sessionLengthMinutes: 90,
    steamRoom: false,
    coldPlunge: false, // Cold outdoor shower available
    soakingTub: false,
    waterfront: false,
    naturalPlunge: false,
    showers: true, // Warm shower + cold outdoor shower
    towelsIncluded: true,
    hours: "Daily 10am-8pm, by appointment",
    genderPolicy: "Private groups",
    clothingPolicy: "Private experience",
    notes:
      "Traditional Russian banya in tranquil forest setting. Private sessions for 1-6 people (1.5 or 2.5 hrs) or guided bath attendant experience for up to 4 people. Includes sauna, relaxation room, warm/cold showers, essential oils, tea, and snacks. 5.0 stars with 45 reviews. Price varies by group size.",
    lat: 45.5143955,
    lng: -122.7762441,
    updatedAt: "2026-01-06",
  },
  {
    slug: "archimedes-banya",
    name: "Archimedes Banya",
    address: "748 Innes Ave, San Francisco, CA 94124",
    website: "https://banyasf.com/",
    bookingUrl: "https://go.booker.com/location/ARCHIMEDESBANYASF/service-menu",
    googleMapsUrl: "https://maps.app.goo.gl/JAT6Wr8q8EDNeqJi9",
    sessionPrice: 55, // Happy Hour Pass; Basic Banya Pass $67
    sessionLengthMinutes: 180,
    steamRoom: true, // Turkish hammam
    coldPlunge: true, // Ice-cold plunge pool
    soakingTub: true, // Private soaking tubs available
    waterfront: true, // On shores of SF Bay with rooftop views
    naturalPlunge: false,
    showers: true,
    towelsIncluded: true,
    servesFood: true, // Zteamers' Cafe with Russian/European fare
    temperatureRangeF: { min: 180, max: 210 },
    hours:
      "Mon/Wed-Fri 12pm-11pm, Sat-Sun 10am-11pm, Tue closed (except gender nights)",
    genderPolicy: "Co-ed (Women's Night 1st Tue, Men's Night 3rd Tue)",
    clothingPolicy: "Clothing optional",
    notes:
      "Traditional Russian banya on SF Bay shores blending Greek, Turkish, German, and Russian bathing traditions. Happy Hour $55 (weekdays 12-4pm), Basic Pass $67 (3 hrs), All Day Pass $95. Features venik platza (birch branch massage), hammam scrubs, aromatherapy/aufguss sessions. Rooftop deck with panoramic Bay views. On-site cafe. 4.1 stars with 441 reviews. 18+ only.",
    lat: 37.7305426,
    lng: -122.37276,
    updatedAt: "2026-01-06",
  },
  {
    slug: "fjord-sausalito",
    name: "Fjord – Floating Sauna",
    address: "2320 Marinship Way, Sausalito, CA 94965",
    website: "https://www.thisisfjord.com/",
    bookingUrl: "https://www.zettlor.com/c/fjord",
    googleMapsUrl: "https://maps.app.goo.gl/BXAmzUXPz2gi8J3HA",
    sessionPrice: 45, // Shared session; Private $270
    sessionLengthMinutes: 90,
    steamRoom: false,
    coldPlunge: true, // Plunge into San Francisco Bay
    soakingTub: false,
    waterfront: true, // Floating on Richardson Bay
    naturalPlunge: true, // Bay plunge
    showers: false, // No showers, must bring towels
    towelsIncluded: false, // Must bring 2 towels
    temperatureRangeF: { min: 180, max: 190 },
    hours: "Daily 8am-8:30pm, Tue 2pm-8:30pm",
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Unique floating sauna on SF Bay with two Finnish saunas and bay plunge. Shared sessions $45 (90 min, up to 8 ppl), Private $270 (2 hrs, up to 6), Full Buyout $2K half-day or $5K full-day. 5-pack $210. Sessions sell out fast—book when calendar opens. Must bring 2 towels, water, swimsuit. 4.9 stars. ~30 min from SF.",
    lat: 37.8669,
    lng: -122.49484,
    updatedAt: "2026-01-06",
  },
  {
    slug: "good-hot-richmond",
    name: "Good Hot",
    address: "1950 Stenmark Dr, Richmond, CA 94801",
    website: "https://www.good-hot-booking.com/",
    bookingUrl: "https://www.good-hot-booking.com/book",
    googleMapsUrl: "https://maps.app.goo.gl/ESCG9k97EtiJmrnp8",
    sessionPrice: 130, // Saunas 1-3; Saunas 4-5 are $150
    sessionLengthMinutes: 90,
    steamRoom: false,
    coldPlunge: true, // Beach access to SF Bay
    soakingTub: false,
    waterfront: true, // Point San Pablo waterfront
    naturalPlunge: true, // Bay plunge at beach
    showers: true, // Communal cold rinse showers
    towelsIncluded: false,
    temperatureRangeF: { min: 160, max: 180 },
    hours: "Thu-Mon 9:30am-8:30pm, reservation only",
    genderPolicy: "Private rental",
    clothingPolicy: "Swimsuit in common areas, nude OK in saunas",
    notes:
      "Bayside saunas on Point San Pablo with 5 private saunas for rent. Saunas 1-3: $130 (1-6 ppl), Saunas 4-5: $150 (1-8 ppl). Beach access for bay plunge (check tides). 18+ only. QTBIPOC reduced rate program available. 4.8 stars with 48 reviews. Water shoes required for beach.",
    lat: 37.962097,
    lng: -122.4270183,
    updatedAt: "2026-01-06",
  },
  {
    slug: "dogpatch-paddle-sauna",
    name: "Dogpatch Paddle Sauna",
    address: "701 Illinois Street #A, San Francisco, CA 94107",
    website: "https://www.dogpatchpaddle.com/sauna",
    bookingUrl:
      "https://book.peek.com/s/2530f333-35eb-43fc-b661-6c7d3c95dfea/wqA07",
    googleMapsUrl: "https://maps.app.goo.gl/FQ1MFyyV8vXXAhnF8",
    sessionPrice: 25, // Public session; Private $100
    sessionLengthMinutes: 60,
    steamRoom: false,
    coldPlunge: true, // Plunge in SF Bay
    soakingTub: false,
    waterfront: true, // Crane Cove Park on the Bay
    naturalPlunge: true, // Bay plunge
    showers: true, // Cold rinse shower available
    towelsIncluded: false,
    temperatureRangeF: { min: 170, max: 190 },
    hours: "Daily 9am-5pm (closed Mon Sept-May)",
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "SF's only waterfront sauna—4-person barrel sauna at Crane Cove Park. Public sessions $25/hr, Private $100/hr (max 4). Cold plunge in the Bay (50s°F year-round). 5-pack $100, 10-pack $200. Memberships from $60/mo. Also offers kayak/SUP rentals. 5.0 stars with 102 reviews.",
    lat: 37.7629995,
    lng: -122.3873433,
    updatedAt: "2026-01-06",
  },
  {
    slug: "kabuki-springs-sf",
    name: "Kabuki Springs & Spa",
    address: "1750 Geary Blvd, San Francisco, CA 94115",
    website: "https://kabukisprings.com/",
    bookingUrl: "https://kabukisprings.com/baths/",
    googleMapsUrl: "https://maps.app.goo.gl/2UJpZWKc1CitbvVS6",
    sessionPrice: 35, // Communal bath admission (estimated)
    sessionLengthMinutes: 120,
    steamRoom: true, // 120°F steam room
    coldPlunge: true, // 55°F cold plunge
    soakingTub: true, // 104°F hot pool
    waterfront: false,
    naturalPlunge: false,
    showers: true, // Traditional seated and Western showers
    towelsIncluded: true,
    temperatureRangeF: { min: 130, max: 140 },
    hours:
      "Mon 2pm-8pm, Tue-Sun 10am-9:30pm. Women: Sun/Wed/Fri. Men: Thu/Sat. All Gender: Mon/Tue",
    genderPolicy: "Gender-specific and all-gender days",
    clothingPolicy:
      "Bathing suit optional on gender days, required on all-gender days",
    notes:
      "Iconic Japanese bathhouse in SF Japantown since 1968. Features dry sauna (140°F), steam room (120°F), hot pool (104°F), cold plunge (55°F), and traditional showers. Spa services include Shiatsu, Swedish massage, Reiki, and more. Non-binary facilities available on all-gender days. Validated parking at Japan Center. 4.5 stars with 1,500+ reviews.",
    lat: 37.7847765,
    lng: -122.4326245,
    updatedAt: "2026-01-06",
  },
  {
    slug: "the-springs-leavenworth",
    name: "The Springs",
    address: "200 Zelt Strasse, Leavenworth, WA 98826",
    website: "https://www.thesprings.us/",
    bookingUrl: "https://ecom.roller.app/thesprings/checkout/en-us/products",
    googleMapsUrl: "https://maps.app.goo.gl/qaB6GfHQLbDP8GPYA",
    sessionPrice: 35, // $35 Sun-Thu, $45 Fri-Sat
    sessionLengthMinutes: 120,
    steamRoom: false,
    coldPlunge: true, // Communal cold plunge pool
    soakingTub: true, // Hot and warm pools
    waterfront: false,
    naturalPlunge: false,
    showers: true, // Individual shower rooms
    towelsIncluded: true, // Robes and towels included
    hours: "Reservations recommended, walk-ins welcome",
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Outdoor hydrotherapy experience in Leavenworth featuring hot pools, warm pools, communal cold plunge, and traditional cedar sauna. Designed to blend with the natural mountain environment. Includes lounge areas and fire bowl patio. Typical visit is 1.5-2 hours. 4.9 stars with 131 reviews. 5-visit punch cards and memberships available.",
    lat: 47.5989797,
    lng: -120.6434129,
    updatedAt: "2026-01-06",
  },
  {
    slug: "seatsu-sauna",
    name: "SeaTsu Sauna",
    address: "Thompson Rd, Sequim, WA 98382",
    website: "https://www.seatsusauna.com/",
    bookingUrl: "https://www.seatsusauna.com/book-online",
    googleMapsUrl: "https://maps.app.goo.gl/RJ787PtCqXUcJTQa7",
    sessionPrice: 35, // Community session; Private $135 for up to 4 people
    sessionLengthMinutes: 90,
    steamRoom: false,
    coldPlunge: true, // Cold plunge pool
    soakingTub: true, // Hot bath available
    waterfront: false,
    naturalPlunge: false,
    showers: true, // Outdoor showers
    towelsIncluded: false,
    hours: "By appointment only; Community sessions Thu/Sun 6pm",
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Wood-fired sauna in a forest setting on the North Olympic Peninsula near Sequim/Blyn. Features Forest Bathing Sanctuary combining forest bathing and sauna practices. Private sessions $135 for up to 4 people (1.5 hrs). Community sessions $35/person Thu/Sun. Women's session last Wed of month. Sauna & Stay overnight in Geodesic Dome $275/night. Mobile sauna rental available. 5.0 stars with 22 reviews.",
    lat: 48.0560647,
    lng: -122.9889463,
    updatedAt: "2026-01-06",
  },
  {
    slug: "snow-peak-campfield",
    name: "Snow Peak Campfield Ofuro Spa",
    address: "5411 Sandridge Rd, Long Beach, WA 98631",
    website: "https://snowpeakcampfield.com/ofuro/",
    bookingUrl: "https://www.vagaro.com/spcpyc3/classes",
    googleMapsUrl: "https://maps.app.goo.gl/XDiU6yWXPVXeaHf76",
    sessionPrice: 35, // Day guest pass; included for overnight guests
    sessionLengthMinutes: 120,
    steamRoom: false,
    coldPlunge: true, // Cold plunge pool
    soakingTub: true, // Hot soaking pool
    waterfront: false,
    naturalPlunge: false,
    showers: true,
    towelsIncluded: false, // Bring your own towel
    hours: "Day guest passes subject to availability, book within 3 days",
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Japanese-inspired Ofuro Spa at Snow Peak Campfield on the Long Beach Peninsula. Features hinoki cypress sauna, hot soaking pool, and cold plunge in an open-air setting overlooking alder trees and pond. Day passes $35 for 2 hours. Included for overnight guests (tent suites, Jyubako cabins, field sites). Campstore & Café on-site. 4.3 stars with 123 reviews.",
    lat: 46.3420938,
    lng: -124.0421083,
    updatedAt: "2026-01-06",
  },
  {
    slug: "watercourse-way",
    name: "Watercourse Way Bath House Spa",
    address: "165 Channing Ave, Palo Alto, CA 94301",
    website: "https://watercourseway.com/",
    bookingUrl: "https://go.booker.com/location/WatercourseWay/service-menu",
    googleMapsUrl: "https://maps.app.goo.gl/gqMVsmoqDNEqPBHw5",
    sessionPrice: 55, // Premium hot tub room with sauna (Mon-Thu); $60 Fri-Sun
    sessionLengthMinutes: 60,
    steamRoom: false,
    coldPlunge: true, // Cold plunge in Eight Stars room
    soakingTub: true, // Private hot tub rooms
    waterfront: false,
    naturalPlunge: false,
    showers: true,
    towelsIncluded: false,
    hours: "Daily 8am-11:30pm",
    genderPolicy: "Private rooms",
    clothingPolicy: "Private experience (swimsuit optional)",
    notes:
      "Classic Palo Alto bathhouse since 1980 offering private hot tub rooms. 'Eight Stars' room includes sauna, hot tub, and cold plunge. Standard rooms $40-45/hr, Premium rooms with cold plunge $55-60/hr. Also offers massage, spa treatments, and skincare. Book hot tub rooms by phone. 4.7 stars with 1,310 reviews.",
    lat: 37.4412042,
    lng: -122.1585519,
    updatedAt: "2026-01-06",
  },
  {
    slug: "alyeska-nordic-spa",
    name: "Alyeska Nordic Spa",
    address: "1000 Arlberg Avenue, Girdwood, AK 99587",
    website: "https://www.anordicspa.com/",
    bookingUrl: "https://www.anordicspa.com/",
    googleMapsUrl: "https://maps.app.goo.gl/8VLZ8Y7VJvNPRzHR7",
    sessionPrice: 85, // Hydrotherapy access; verify on website
    sessionLengthMinutes: 180,
    steamRoom: true, // Aromatherapy-infused steam rooms
    coldPlunge: true, // Cold plunge pools and waterfall
    soakingTub: true, // Warm and hot hydrotherapy pools
    waterfront: false,
    naturalPlunge: false,
    showers: true,
    towelsIncluded: true,
    servesFood: true, // Two Trees Bistro on-site
    hours: "Daily 10am-9pm",
    genderPolicy: "Co-ed (18+)",
    clothingPolicy: "Swimsuit required",
    notes:
      "Alaska's first Nordic spa, a stunning 50,000 sq ft indoor-outdoor facility at Alyeska Resort in the Chugach Mountains. Features Finnish sauna, Halotherapy Signature sauna, two Banya saunas, two barrel saunas, aromatherapy steam rooms, hot/warm/cold hydrotherapy pools, cold plunge waterfall, and exfoliation cabin with Alaskan sea salt. On-site Two Trees Bistro. Reservations required. 45-min scenic drive from Anchorage.",
    lat: 60.9706743,
    lng: -149.0959696,
    updatedAt: "2026-01-05",
  },
];

// Backwards-compatible alias
export const seattleSaunas = saunas;

// Helper functions
export function getSaunaBySlug(slug: string): Sauna | undefined {
  return saunas.find((s) => s.slug === slug);
}

export function getLatestUpdateDate(): string {
  return saunas.reduce((latest, sauna) => {
    return sauna.updatedAt > latest ? sauna.updatedAt : latest;
  }, saunas[0]?.updatedAt ?? "");
}

export function getSimilarSaunas(
  currentSlug: string,
  limit: number = 5
): Sauna[] {
  const current = getSaunaBySlug(currentSlug);
  if (!current) return saunas.slice(0, limit);

  // Prioritize similar amenities and price
  const others = saunas.filter((s) => s.slug !== currentSlug);

  const scored = others.map((sauna) => {
    let score = 0;
    // Similar price range
    if (Math.abs(sauna.sessionPrice - current.sessionPrice) <= 20) score += 10;
    // Similar amenities
    if (sauna.coldPlunge === current.coldPlunge) score += 5;
    if (sauna.steamRoom === current.steamRoom) score += 5;
    if (sauna.waterfront === current.waterfront) score += 5;
    if (sauna.naturalPlunge === current.naturalPlunge) score += 5;
    return { sauna, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.sauna);
}
