/**
 * Supported location slugs for saunas
 */
export type LocationSlug =
  | "pacific-northwest"
  | "seattle"
  | "portland"
  | "san-francisco"
  | "vancouver"
  | "vancouver-island"
  | "whistler"
  | "squamish"
  | "sunshine-coast"
  | "montana"
  | "idaho"
  | "nevada"
  | "utah"
  | "denver"
  | "colorado"
  | "minnesota"
  | "tennessee"
  | "chicago"
  | "indianapolis"
  | "boston"
  | "new-york"
  | "philadelphia"
  | "north-carolina";

/**
 * Location metadata for display and routing
 */
export interface Location {
  slug: LocationSlug;
  name: string;
  state: string;
  description: string;
  center: { lat: number; lng: number };
  zoom: number;
}

export const locations: Location[] = [
  {
    slug: "pacific-northwest",
    name: "Pacific Northwest",
    state: "WA, OR, BC",
    description:
      "Explore the Pacific Northwest's thriving sauna culture, from Seattle's waterfront saunas to Portland's forest retreats and Vancouver's Nordic spas.",
    center: { lat: 47.0, lng: -122.5 },
    zoom: 7,
  },
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
  {
    slug: "vancouver",
    name: "Vancouver",
    state: "BC",
    description:
      "Vancouver's Nordic sauna scene features European-inspired contrast therapy, Himalayan salt saunas, and historic bathhouses dating back to 1926.",
    center: { lat: 49.2827, lng: -123.1207 },
    zoom: 12,
  },
  {
    slug: "vancouver-island",
    name: "Vancouver Island",
    state: "BC",
    description:
      "Vancouver Island's sauna scene spans from Victoria's floating harbour saunas and urban Nordic spas to oceanfront experiences in Parksville and traditional Eastern European-style sauna houses in Courtenay.",
    center: { lat: 49.0, lng: -124.5 },
    zoom: 9,
  },
  {
    slug: "whistler",
    name: "Whistler",
    state: "BC",
    description:
      "Whistler's world-class spa scene offers Scandinavian thermal journeys set amidst old-growth rainforest and Coast Mountain views.",
    center: { lat: 50.1163, lng: -122.9574 },
    zoom: 11,
  },
  {
    slug: "squamish",
    name: "Squamish",
    state: "BC",
    description:
      "Squamish offers authentic Finnish sauna experiences beside glacier-fed rivers with mountain views in the Sea to Sky corridor.",
    center: { lat: 49.7016, lng: -123.1558 },
    zoom: 11,
  },
  {
    slug: "sunshine-coast",
    name: "Sunshine Coast",
    state: "BC",
    description:
      "The Sunshine Coast offers oceanside sauna experiences from Powell River to Sechelt, with wood-fired saunas overlooking the Salish Sea and cold plunges in the Pacific.",
    center: { lat: 49.6, lng: -124.0 },
    zoom: 9,
  },
  {
    slug: "montana",
    name: "Montana",
    state: "MT",
    description:
      "Montana's sauna scene features natural hot springs with dry saunas near Yellowstone and Big Sky, offering mountain wellness experiences.",
    center: { lat: 46.0, lng: -110.5 },
    zoom: 6,
  },
  {
    slug: "minnesota",
    name: "Minnesota",
    state: "MN",
    description:
      "Minnesota's sauna culture blends Nordic traditions with modern thermaculture clubs, offering contrast therapy in the Land of 10,000 Lakes.",
    center: { lat: 44.9778, lng: -93.265 },
    zoom: 8,
  },
  {
    slug: "tennessee",
    name: "Tennessee",
    state: "TN",
    description:
      "Tennessee's sauna scene features modern contrast therapy studios in Nashville, combining traditional saunas with commercial-grade cold plunge facilities.",
    center: { lat: 36.1627, lng: -86.7816 },
    zoom: 10,
  },
  {
    slug: "idaho",
    name: "Idaho",
    state: "ID",
    description:
      "Idaho offers geothermal hot springs and emerging sauna culture, from Boise to mountain resort towns like Sun Valley and McCall.",
    center: { lat: 44.0, lng: -114.5 },
    zoom: 6,
  },
  {
    slug: "nevada",
    name: "Nevada",
    state: "NV",
    description:
      "Nevada's wellness scene spans from Las Vegas resort spas to Reno's emerging sauna culture near Lake Tahoe.",
    center: { lat: 39.0, lng: -117.0 },
    zoom: 6,
  },
  {
    slug: "utah",
    name: "Utah",
    state: "UT",
    description:
      "Utah's growing sauna scene features Nordic-inspired contrast therapy from Salt Lake City to lakeside experiences at Utah Lake near Provo.",
    center: { lat: 40.5, lng: -111.5 },
    zoom: 7,
  },
  {
    slug: "denver",
    name: "Denver",
    state: "CO",
    description:
      "Denver's sauna scene spans from a historic 1927 Russian bathhouse to modern Finnish contrast therapy clubs, with options in Golden, Boulder, and across the Front Range.",
    center: { lat: 39.83, lng: -105.05 },
    zoom: 9,
  },
  {
    slug: "colorado",
    name: "Colorado",
    state: "CO",
    description:
      "Colorado's sauna culture blends outdoor thermaculture clubs in Denver and Boulder with mountain resort spas, offering contrast therapy at altitude.",
    center: { lat: 39.5, lng: -105.0 },
    zoom: 7,
  },
  {
    slug: "chicago",
    name: "Chicago",
    state: "IL",
    description:
      "Chicago's sauna scene is heating up with lakefront contrast therapy experiences and Nordic-inspired wellness clubs along Lake Michigan.",
    center: { lat: 41.8781, lng: -87.6298 },
    zoom: 11,
  },
  {
    slug: "indianapolis",
    name: "Indianapolis",
    state: "IN",
    description:
      "Indianapolis's sauna scene features mobile wood-fired experiences delivered directly to your door, bringing Nordic wellness to the heart of the Midwest.",
    center: { lat: 39.7684, lng: -86.1581 },
    zoom: 10,
  },
  {
    slug: "boston",
    name: "Boston",
    state: "MA",
    description:
      "Boston's sauna scene features modern Nordic-inspired wellness with wood-fired saunas, cold plunges, and communal relaxation spaces across multiple neighborhoods.",
    center: { lat: 42.3601, lng: -71.0589 },
    zoom: 12,
  },
  {
    slug: "new-york",
    name: "New York City",
    state: "NY",
    description:
      "New York City is emerging as the center of America's new bathing movement, with a wave of bathhouses and sauna clubs opening across Manhattan and Brooklyn.",
    center: { lat: 40.73, lng: -73.998 },
    zoom: 13,
  },
  {
    slug: "philadelphia",
    name: "Philadelphia",
    state: "PA",
    description:
      "Philadelphia's sauna scene features wood-fired experiences along the Schuylkill River, with outdoor saunas and cold plunges in natural settings.",
    center: { lat: 40.055, lng: -75.258 },
    zoom: 12,
  },
  {
    slug: "north-carolina",
    name: "North Carolina",
    state: "NC",
    description:
      "North Carolina's sauna scene features wood-fired Nordic experiences in the Blue Ridge Mountains, combining traditional heat with cold plunges and stunning mountain views.",
    center: { lat: 36.2177, lng: -81.6835 },
    zoom: 10,
  },
];

export function getLocationBySlug(slug: string): Location | undefined {
  return locations.find((l) => l.slug === slug);
}

/** Get saunas that fall within a location's approximate viewport. */
export function getSaunasForLocation(location: Location): Sauna[] {
  const latRange = 180 / Math.pow(2, location.zoom);
  const lngRange = 360 / Math.pow(2, location.zoom);
  return saunas.filter(
    (s) =>
      Math.abs(s.lat - location.center.lat) <= latRange &&
      Math.abs(s.lng - location.center.lng) <= lngRange
  );
}

/**
 * Acuity (Squarespace Scheduling) appointment type configuration.
 */
export interface AcuityAppointmentType {
  /** Acuity appointment type ID */
  acuityAppointmentId: number;
  /** Acuity calendar ID (numeric ID, or "any" for single-calendar accounts) */
  acuityCalendarId: number | "any";
  /** Display name (e.g. "Social Session") */
  name: string;
  /** Price in the sauna's currency (e.g. 30) */
  price: number;
  /** Duration in minutes (e.g. 60) */
  durationMinutes: number;
  /** Whether this is a private session (entire sauna reserved) */
  private?: boolean;
  /** Number of seats (people) supported in this session */
  seats?: number;
}

/**
 * Acuity (Squarespace Scheduling) booking provider configuration.
 */
export interface AcuityBookingProviderConfig {
  type: "acuity";
  /** Owner ID from the Squarespace Scheduling embed URL */
  owner: string;
  /** IANA timezone for availability display */
  timezone: string;
  /** Appointment types to show availability for */
  appointmentTypes: AcuityAppointmentType[];
}

/**
 * Wix Bookings service type configuration.
 */
export interface WixServiceType {
  /** Wix service ID (UUID) */
  serviceId: string;
  /** Display name (e.g. "Sauna Session") */
  name: string;
  /** Price in the sauna's currency */
  price: number;
  /** Duration in minutes */
  durationMinutes: number;
  /** Whether this is a private session (entire sauna reserved) */
  private?: boolean;
  /** Number of seats (people) supported in this session */
  seats?: number;
}

/**
 * Wix Bookings provider configuration.
 */
export interface WixBookingProviderConfig {
  type: "wix";
  /** The Wix site hostname (e.g. "www.vihtasauna.co") */
  siteUrl: string;
  /** IANA timezone for availability display */
  timezone: string;
  /** Services to show availability for */
  services: WixServiceType[];
}

/**
 * Glofox booking provider configuration.
 */
export interface GlofoxBookingProviderConfig {
  type: "glofox";
  /** Glofox branch ID from the booking URL */
  branchId: string;
  /** Glofox facility ID to filter events for this specific location */
  facilityId: string;
  /** IANA timezone for availability display */
  timezone: string;
  /** Override prices by Glofox program ID (guest API returns $0) */
  priceOverrides?: Record<string, number>;
  /** Mark programs as private with seat count, by Glofox program ID */
  privatePrograms?: Record<string, number>;
  /** Exclude programs whose name contains any of these strings */
  excludeNamePatterns?: string[];
}

/**
 * Mariana Tek class type configuration.
 */
export interface MarianaTekClassType {
  /** Mariana Tek class_type ID from the Customer API */
  classTypeId: string;
  /** Display name (e.g. "Sauna Session") */
  name: string;
  /** Price in the sauna's currency */
  price: number;
  /** Duration in minutes */
  durationMinutes: number;
  /** Whether this is a private session (entire sauna reserved) */
  private?: boolean;
  /** Number of seats (people) supported in this session */
  seats?: number;
}

/**
 * FareHarbor bookable item configuration.
 */
export interface FareHarborItem {
  /** FareHarbor item PK (numeric ID from the items API) */
  itemPk: number;
  /** Display name override (if not provided, uses the API name) */
  name?: string;
  /** Price override (if not provided, parsed from headline) */
  price?: number;
  /** Duration override in minutes (if not provided, parsed from headline) */
  durationMinutes?: number;
  /** Whether this is a private session (entire sauna reserved) */
  private?: boolean;
  /** Number of seats (people) supported in this session */
  seats?: number;
}

/**
 * Mariana Tek booking provider configuration.
 */
export interface MarianaTekBookingProviderConfig {
  type: "mariana-tek";
  /** Mariana Tek tenant subdomain (e.g. "hideout", "joinframework") */
  tenant: string;
  /** Mariana Tek location ID (required when tenant has multiple locations) */
  locationId?: string;
  /** IANA timezone for availability display */
  timezone: string;
  /** Class types to show availability for */
  classTypes: MarianaTekClassType[];
}

/**
 * FareHarbor booking provider configuration.
 */
export interface FareHarborBookingProviderConfig {
  type: "fareharbor";
  /** Company shortname from the FareHarbor booking URL
   *  (e.g., "cedarandstonesauna" from fareharbor.com/embeds/book/cedarandstonesauna/) */
  shortname: string;
  /** IANA timezone for availability display */
  timezone: string;
  /** Optional: specific items to show availability for.
   *  If omitted, auto-discovers all non-archived, non-private, bookable items. */
  items?: FareHarborItem[];
  /** Optional: item PKs to exclude from auto-discovery */
  excludeItemPks?: number[];
}

/**
 * Periode booking manifest type configuration.
 */
export interface PeriodeManifestType {
  /** Periode booking manifest ID */
  manifestId: string;
  /** Display name (e.g. "Social Sauna") */
  name: string;
  /** Price in the sauna's currency */
  price: number;
  /** Duration in minutes */
  durationMinutes: number;
}

/**
 * Periode (periode.no) booking provider configuration.
 */
export interface PeriodeBookingProviderConfig {
  type: "periode";
  /** Periode merchant ID (first path segment in the booking URL) */
  merchantId: string;
  /** IANA timezone for availability display */
  timezone: string;
  /** Booking manifests (service types) to show availability for */
  manifests: PeriodeManifestType[];
}

/**
 * Zenoti booking provider configuration.
 */
export interface ZenotiBookingProviderConfig {
  type: "zenoti";
  /** Zenoti webstore subdomain (e.g., "loylysauna") */
  subdomain: string;
  /** UUID of the specific center/location */
  centerId: string;
  /** IANA timezone for availability display */
  timezone: string;
  /** Services to fetch availability for */
  services: {
    serviceId: string;
    name: string;
    price: number;
    durationMinutes: number;
  }[];
}

/**
 * Booker (by Mindbody) booking provider configuration.
 */
export interface BookerBookingProviderConfig {
  type: "booker";
  /** Booker location slug (e.g., "WatercourseWay") */
  locationSlug: string;
  /** Numeric Booker location ID */
  locationId: number;
  /** IANA timezone for availability display */
  timezone: string;
  /** Services to fetch availability for */
  services: {
    serviceId: number;
    name: string;
    price: number;
    durationMinutes: number;
  }[];
}

/**
 * SimplyBook.me booking provider configuration.
 */
export interface SimplyBookBookingProviderConfig {
  type: "simplybook";
  /** SimplyBook company slug (e.g. "backyardblisspdx") */
  companySlug: string;
  /** IANA timezone for availability display */
  timezone: string;
  /** Services to fetch availability for */
  services: {
    serviceId: number;
    name: string;
    price: number;
    durationMinutes: number;
  }[];
}

/**
 * Zettlor booking provider configuration (wraps Momence).
 */
export interface ZettlorBookingProviderConfig {
  type: "zettlor";
  /** Zettlor business handle/slug (e.g. "fjord") */
  handle: string;
  /** IANA timezone for availability display */
  timezone: string;
}

/**
 * Trybe booking provider configuration.
 */
export interface TrybeBookingProviderConfig {
  type: "trybe";
  /** Trybe site ID (UUID) */
  siteId: string;
  /** Trybe session type ID (offering ID from booking URL) */
  sessionTypeId: string;
  /** IANA timezone for availability display */
  timezone: string;
  /** Display name for the session type */
  name: string;
  /** Session duration in minutes */
  durationMinutes: number;
}

/**
 * Vagaro booking provider configuration.
 * Uses the Vagaro public web API to fetch available time slots.
 */
export interface VagaroBookingProviderConfig {
  type: "vagaro";
  /** Vagaro business slug (e.g. "dripinfraredsaunastudio") */
  businessSlug: string;
  /** Vagaro numeric business ID (found in page source as AppBookBusinessID) */
  businessId: string;
  /** Vagaro region/tenant group (e.g. "us02", "us03") from the tenant_group cookie */
  region: string;
  /** IANA timezone for availability display */
  timezone: string;
  /** If true, uses the classes/events API instead of the appointments API */
  isClassBased?: boolean;
  /** Services to fetch availability for */
  services: {
    serviceId: number;
    name: string;
    price: number;
    durationMinutes: number;
  }[];
}

/**
 * Checkfront bookable item configuration.
 */
export interface CheckfrontItem {
  /** Checkfront item ID (numeric) from the inventory page */
  itemId: number;
  /** Display name (e.g. "Communal Sauna Voyage") */
  name: string;
  /** Price in the sauna's currency */
  price: number;
  /** Duration in minutes */
  durationMinutes: number;
  /** Whether this is a private session */
  private?: boolean;
  /** Number of seats (people) supported in this session */
  seats?: number;
}

/**
 * Checkfront booking provider configuration.
 * Uses the public reserve/api endpoint for availability.
 */
export interface CheckfrontBookingProviderConfig {
  type: "checkfront";
  /** Base URL for the Checkfront reserve page
   *  (e.g. "https://havn-saunas.checkfront.com" or
   *  "https://wild-haus.manage.na1.bookingplatform.app") */
  baseUrl: string;
  /** IANA timezone for availability display */
  timezone: string;
  /** Bookable items to show availability for */
  items: CheckfrontItem[];
}

/**
 * Peek bookable activity configuration.
 */
export interface PeekActivity {
  /** Peek activity UUID (from the availability-dates API) */
  activityId: string;
  /** Display name (e.g. "PRIVATE Beachfront Sauna") */
  name: string;
  /** Price in the sauna's currency (overrides API price if set) */
  price?: number;
  /** Duration in minutes (overrides API duration if set) */
  durationMinutes?: number;
  /** Whether this is a private session */
  private?: boolean;
  /** Number of seats (people) supported in this session */
  seats?: number;
}

/**
 * Peek (book.peek.com) booking provider configuration.
 * Uses the public REST API with the booking page key for auth.
 */
export interface PeekBookingProviderConfig {
  type: "peek";
  /** API key (UUID from the booking URL path: /s/{key}/{programId}) */
  key: string;
  /** Program ID (short code from the booking URL path: /s/{key}/{programId}) */
  programId: string;
  /** IANA timezone for availability display */
  timezone: string;
  /** Activities to show availability for */
  activities: PeekActivity[];
}

/**
 * Square Appointments booking provider configuration.
 * Scrapes the widget meta tag from the booking page to discover
 * services, then queries the public buyer availability API.
 */
export interface SquareBookingProviderConfig {
  type: "square";
  /** Widget ID from the booking URL (e.g. "xkixhokqjj5m3m") */
  widgetId: string;
  /** Location token from the booking URL (e.g. "LBCF5TC30K6Y1") */
  locationToken: string;
  /** IANA timezone for availability display */
  timezone: string;
}

/**
 * Mindbody booking provider configuration.
 * Uses the public prod-mkt-gateway consumer API.
 */
export interface MindbodyBookingProviderConfig {
  type: "mindbody";
  /** Mindbody studio/site ID (from studioid= parameter in the classic booking URL) */
  siteId: number;
  /** Location ID within the site (typically 1 for single-location businesses) */
  locationId: number;
  /** IANA timezone for availability display */
  timezone: string;
}

/**
 * ClinicSense booking provider configuration.
 * Uses the public appointment-booker REST API.
 */
export interface ClinicSenseBookingProviderConfig {
  type: "clinicsense";
  /** ClinicSense subdomain slug (e.g. "fusionbodyworkspdx2") */
  slug: string;
  /** IANA timezone for availability display */
  timezone: string;
  /** Services to fetch availability for */
  services: {
    /** ClinicSense service_duration_id (from settings API) */
    serviceDurationId: number;
    name: string;
    price: number;
    durationMinutes: number;
  }[];
}

/**
 * Mangomint booking provider configuration.
 * Uses the public booking API (startup + availability endpoints).
 */
export interface MangomintBookingProviderConfig {
  type: "mangomint";
  /** Mangomint company ID (numeric, discovered from startup API) */
  companyId: number;
  /** IANA timezone for availability display */
  timezone: string;
  /** Services to fetch availability for */
  services: {
    serviceId: number;
    name: string;
    price: number;
    durationMinutes: number;
  }[];
}

/**
 * Roller booking provider configuration.
 * Uses the public checkout API for venue product availability.
 */
export interface RollerBookingProviderConfig {
  type: "roller";
  /** Venue slug from the URL (e.g. "thesprings"), used as X-Api-Key */
  venueSlug: string;
  /** Checkout slug (typically "checkout") */
  checkoutSlug: string;
  /** IANA timezone for availability display */
  timezone: string;
}

/**
 * Boulevard booking provider configuration.
 * Uses the public GraphQL widget API with a cart-based flow.
 */
export interface BoulevardBookingProviderConfig {
  type: "boulevard";
  /** Boulevard business ID (UUID from the booking URL) */
  businessId: string;
  /** Boulevard location ID (UUID, discovered from cart creation) */
  locationId: string;
  /** IANA timezone for availability display */
  timezone: string;
  /** Services to fetch availability for */
  services: {
    /** Boulevard service item ID (e.g. "s_d0b150ed-...") */
    serviceId: string;
    name: string;
    price: number;
    durationMinutes: number;
  }[];
}

export interface SojoBookingProviderConfig {
  type: "sojo";
  /** Base URL for the SoJo shop API (e.g. "https://shop.sojospaclub.com") */
  baseUrl: string;
  /** IANA timezone for availability display */
  timezone: string;
}

/**
 * Booking provider configuration for availability checking.
 * Uses a discriminated union so new providers can be added
 * by extending this type.
 */
export type BookingProviderConfig =
  | AcuityBookingProviderConfig
  | WixBookingProviderConfig
  | GlofoxBookingProviderConfig
  | PeriodeBookingProviderConfig
  | MarianaTekBookingProviderConfig
  | FareHarborBookingProviderConfig
  | ZenotiBookingProviderConfig
  | BookerBookingProviderConfig
  | SimplyBookBookingProviderConfig
  | ZettlorBookingProviderConfig
  | TrybeBookingProviderConfig
  | VagaroBookingProviderConfig
  | CheckfrontBookingProviderConfig
  | PeekBookingProviderConfig
  | SquareBookingProviderConfig
  | MindbodyBookingProviderConfig
  | ClinicSenseBookingProviderConfig
  | MangomintBookingProviderConfig
  | RollerBookingProviderConfig
  | BoulevardBookingProviderConfig
  | SojoBookingProviderConfig;

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
  /** Optional map marker icon override */
  markerIconOverride?:
    | "house"
    | "waves"
    | "snowflake"
    | "ship"
    | "floating-sauna";
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
  /** Booking platform used by this sauna (for tracking, even if we don't support availability for it yet) */
  bookingPlatform?:
    | "acuity"
    | "vagaro"
    | "zenoti"
    | "glofox"
    | "mindbody"
    | "booker"
    | "peek"
    | "fareharbor"
    | "square"
    | "periode"
    | "simplybook"
    | "zettlor"
    | "roller"
    | "mangomint"
    | "checkfront"
    | "clinicsense"
    | "bookeo"
    | "wix"
    | "mariana-tek"
    | "momence"
    | "tock"
    | "boulevard"
    | "trybe"
    | "shopify"
    | "fresha"
    | "envision"
    | "sojo";
  /**
   * Google Maps short link. Use the maps.app.goo.gl format.
   * @example "https://maps.app.goo.gl/FQ1MFyyV8vXXAhnF8"
   */
  googleMapsUrl?: string;
  /** Price for a single session */
  sessionPrice: number;
  /** Currency code (defaults to "USD" if not specified) */
  currency?: "USD" | "CAD";
  /** Typical session length in minutes (e.g., 90, 120) */
  sessionLengthMinutes?: number | null;
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
  /** Whether the sauna is a floating structure (on a lake, bay, etc.) */
  floating?: boolean;
  /** Whether the sauna is on tidal water (e.g. Puget Sound) */
  tidal?: boolean;
  /** NOAA tide station ID for fetching tide predictions */
  noaaTideStation?: string;
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
  /** Booking provider config for live availability checking */
  bookingProvider?: BookingProviderConfig;
}

export const saunas: Sauna[] = [
  {
    slug: "815-refresh",
    name: "815 Refresh",
    address: "815 NE 72nd St, Seattle, WA 98115",
    website: "https://www.815refresh.com/",
    bookingUrl: "https://www.vagaro.com/815refresh/book-now",
    bookingPlatform: "vagaro",
    bookingProvider: {
      type: "vagaro",
      businessSlug: "815refresh",
      businessId: "404046",
      region: "us02",
      timezone: "America/Los_Angeles",
      services: [
        {
          serviceId: 36320697,
          name: "1 hr Sauna Session",
          price: 35,
          durationMinutes: 60,
        },
        {
          serviceId: 36320768,
          name: "2 hr Sauna Session",
          price: 50,
          durationMinutes: 120,
        },
      ],
    },
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
    address: "217 9th Ave N, Seattle, WA 98109",
    website: "https://www.banya5.com/",
    bookingUrl:
      "https://banya5.zenoti.com/webstoreNew/fitness/classes/59175a72-7837-4902-afc2-c16704fbc371",
    bookingPlatform: "zenoti",
    googleMapsUrl: "https://maps.app.goo.gl/ABKyKsmbLZbBeeCR7",
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
      "Traditional Russian banya experience with platza (birch branch massage) available. Multiple sauna rooms with varying temperatures. Uses Zenoti for bookings.",
    lat: 47.6203409,
    lng: -122.3399385,
    updatedAt: "2026-01-14",
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
    bookingUrl:
      "https://app.glofox.com/portal/#/branch/666cd839c3e964051d0e4307/classes-list-view",
    bookingPlatform: "glofox",
    bookingProvider: {
      type: "glofox",
      branchId: "666cd839c3e964051d0e4307",
      facilityId: "667117c9d33bf18a0e021529",
      timezone: "America/Los_Angeles",
      excludeNamePatterns: ["[Member Only]"],
    },
    sessionPrice: 35,
    sessionLengthMinutes: 60,
    steamRoom: false,
    coldPlunge: true,
    soakingTub: false,
    waterfront: true,
    naturalPlunge: true,
    tidal: true,
    noaaTideStation: "9447130",
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
    bookingUrl:
      "https://app.glofox.com/portal/#/branch/666cd839c3e964051d0e4307/classes-list-view",
    bookingPlatform: "glofox",
    bookingProvider: {
      type: "glofox",
      branchId: "666cd839c3e964051d0e4307",
      facilityId: "666cd83dc3e964051d0e430e",
      timezone: "America/Los_Angeles",
    },
    sessionPrice: 35,
    sessionLengthMinutes: 60,
    steamRoom: false,
    coldPlunge: true,
    soakingTub: false,
    waterfront: true,
    naturalPlunge: true,
    tidal: true,
    noaaTideStation: "9447265",
    showers: true,
    towelsIncluded: false,
    hours: "Daily",
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Waterfront sauna at Golden Gardens with cold plunge into Puget Sound.",
    lat: 47.69039345903234,
    lng: -122.40271635662027,
    googleMapsUrl: "https://maps.app.goo.gl/LgenbWCtmXG9GN9P9",
    updatedAt: "2025-01-04",
  },
  {
    slug: "bywater-leschi",
    name: "Bywater Leschi",
    address: "201 Lakeside Ave S, Seattle, WA 98122",
    website: "https://bywatersauna.com/",
    bookingUrl:
      "https://app.glofox.com/portal/#/branch/666cd839c3e964051d0e4307/classes-list-view",
    bookingPlatform: "glofox",
    bookingProvider: {
      type: "glofox",
      branchId: "666cd839c3e964051d0e4307",
      facilityId: "6917a6d31834e278470237ea",
      timezone: "America/Los_Angeles",
    },
    googleMapsUrl: "https://maps.app.goo.gl/fEJKv6J2wSnAxaFT7",
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
      "Waterfront sauna on Lake Washington with cold plunge into the lake.",
    lat: 47.60192549413326,
    lng: -122.2841857043505,
    updatedAt: "2025-01-04",
  },
  {
    slug: "bywater-old-stove",
    name: "Bywater x Old Stove Brewing",
    website: "https://bywatersauna.com/",
    bookingUrl:
      "https://app.glofox.com/portal/#/branch/666cd839c3e964051d0e4307/classes-list-view",
    bookingPlatform: "glofox",
    bookingProvider: {
      type: "glofox",
      branchId: "666cd839c3e964051d0e4307",
      facilityId: "66f63fd9e778d6b036044012",
      timezone: "America/Los_Angeles",
    },
    sessionPrice: 35,
    sessionLengthMinutes: 60,
    steamRoom: false,
    coldPlunge: true,
    soakingTub: false,
    waterfront: false,
    naturalPlunge: false,
    showers: false,
    towelsIncluded: false,
    hours: "Daily",
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Bywater sauna and cold tub at Old Stove Brewing in Ballard.",
    lat: 47.664534194550185,
    lng: -122.37824861677305,
    updatedAt: "2026-02-22",
  },
  {
    slug: "evergreen-sauna",
    name: "Evergreen Sauna",
    address: "Mukilteo, WA",
    website: "https://evergreensauna.com/",
    bookingUrl: "https://app.acuityscheduling.com/schedule.php?owner=33228599",
    bookingPlatform: "acuity",
    googleMapsUrl: "https://maps.app.goo.gl/ywjXu2CnYXdt6fNL6",
    sessionPrice: 35,
    sessionLengthMinutes: 75,
    steamRoom: false,
    coldPlunge: true,
    soakingTub: false,
    waterfront: true,
    naturalPlunge: true,
    tidal: true,
    noaaTideStation: "9447659",
    showers: false,
    towelsIncluded: false,
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Wood-fired mobile sauna in Snohomish County. Community sessions at rotating outdoor locations. Private rentals also available.",
    lat: 47.947830005194824,
    lng: -122.30645419904099,
    updatedAt: "2026-01-05",
    bookingProvider: {
      type: "acuity",
      owner: "11de2e69",
      timezone: "America/Los_Angeles",
      appointmentTypes: [
        {
          acuityAppointmentId: 87906317,
          acuityCalendarId: 10669303,
          name: "Community Session",
          price: 35,
          durationMinutes: 75,
        },
        {
          acuityAppointmentId: 87906287,
          acuityCalendarId: 10669303,
          name: "Private Session",
          price: 270,
          durationMinutes: 75,
          private: true,
          seats: 8,
        },
      ],
    },
  },
  {
    slug: "sauna-moon-alki",
    name: "Sauna Moon Alki Beach",
    address: "2701 Alki Ave SW, Seattle, WA 98116",
    website: "https://www.hotrockssaunaclub.com/",
    bookingUrl: "https://app.acuityscheduling.com/schedule/fab325db",
    bookingPlatform: "acuity",
    sessionPrice: 35,
    sessionLengthMinutes: 60,
    steamRoom: false,
    coldPlunge: false,
    soakingTub: false,
    waterfront: true,
    naturalPlunge: true,
    showers: false,
    towelsIncluded: false,
    capacity: 14,
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Mobile wood-fired cedar barrel sauna at Alki Beach with cold plunge into Puget Sound.",
    lat: 47.579690752543705,
    lng: -122.40965128425405,
    updatedAt: "2026-02-27",
    bookingProvider: {
      type: "acuity",
      owner: "fab325db",
      timezone: "America/Los_Angeles",
      appointmentTypes: [
        {
          acuityAppointmentId: 85171004,
          acuityCalendarId: 12674009,
          name: "Alki Beach Park Seattle Sauna + Cold Plunge",
          price: 35,
          durationMinutes: 60,
          seats: 14,
        },
      ],
    },
  },
  {
    slug: "sauna-moon-seacrest-park",
    name: "Sauna Moon Seacrest Park",
    address: "1660 Harbor Ave SW, Seattle, WA 98126",
    website: "https://www.hotrockssaunaclub.com/",
    bookingUrl: "https://app.acuityscheduling.com/schedule/fab325db",
    bookingPlatform: "acuity",
    sessionPrice: 35,
    sessionLengthMinutes: 60,
    steamRoom: false,
    coldPlunge: false,
    soakingTub: false,
    waterfront: true,
    naturalPlunge: true,
    showers: false,
    towelsIncluded: false,
    capacity: 14,
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Mobile wood-fired cedar barrel sauna at Seacrest Park Cove with cold plunge into Puget Sound.",
    lat: 47.58723118931083,
    lng: -122.37805356401263,
    updatedAt: "2026-02-27",
    bookingProvider: {
      type: "acuity",
      owner: "fab325db",
      timezone: "America/Los_Angeles",
      appointmentTypes: [
        {
          acuityAppointmentId: 89571960,
          acuityCalendarId: 12674009,
          name: "Alki Beach (Seacrest Park Cove 1) Seattle Sauna + Cold Plunge",
          price: 35,
          durationMinutes: 60,
          seats: 14,
        },
      ],
    },
  },
  {
    slug: "vihta",
    name: "Vihta",
    address: "3560 W Lake Sammamish Pkwy SE, Bellevue, WA 98008",
    website: "https://www.vihtasauna.co/",
    bookingUrl: "https://www.vihtasauna.co/bookings",
    bookingPlatform: "wix",
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
    bookingProvider: {
      type: "wix",
      siteUrl: "www.vihtasauna.co",
      timezone: "America/Los_Angeles",
      services: [
        {
          serviceId: "cf27f6ae-2db0-4c1a-8a3e-b5d9e186e765",
          name: "Sauna Session",
          price: 40,
          durationMinutes: 75,
        },
      ],
    },
  },
  {
    slug: "von-sauna",
    name: "Von Sauna",
    markerIconOverride: "floating-sauna",
    address: "1200 Carillon Point, Kirkland, WA 98033",
    website: "https://www.vonsauna.co/",
    bookingUrl:
      "https://minside.periode.no/bookinggroups/PqrVGDw50fAmCwkYGrxY/Off8bTkjMxsqCHc84gDD",
    bookingPlatform: "periode",
    sessionPrice: 40,
    sessionLengthMinutes: 75,
    steamRoom: false,
    coldPlunge: true,
    soakingTub: false,
    waterfront: true,
    naturalPlunge: true,
    floating: true,
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
    bookingProvider: {
      type: "periode",
      merchantId: "PqrVGDw50fAmCwkYGrxY",
      timezone: "America/Los_Angeles",
      manifests: [
        {
          manifestId: "ledXa8zrCUgv2dEgSyy8",
          name: "Social Sauna",
          price: 40,
          durationMinutes: 75,
        },
        // Private Sauna (ICOjDjUjlZuJgXiJMppn) and Sauna Ritual (tbfQkWkaMkoOafpng2Bc)
        // currently have no slot data in Periode — all dates disabled on their site.
      ],
    },
  },
  {
    slug: "tuli-lodge",
    name: "Tuli Lodge",
    website: "https://www.tuli-lodge.com/",
    bookingUrl: "https://www.tuli-lodge.com/book",
    bookingPlatform: "mariana-tek",
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
    bookingProvider: {
      type: "mariana-tek",
      tenant: "tuli",
      timezone: "America/Los_Angeles",
      classTypes: [
        {
          classTypeId: "5889",
          name: "Sauna Session",
          price: 27,
          durationMinutes: 60,
        },
      ],
    },
  },
  {
    slug: "good-day-sauna",
    name: "Good Day Sauna",
    address: "Lincoln Park, West Seattle",
    website: "http://www.gooddaysauna.com/",
    bookingUrl:
      "https://app.acuityscheduling.com/schedule/5e9464ed/appointment/82608594/calendar/12638621",
    bookingPlatform: "acuity",
    sessionPrice: 35,
    sessionLengthMinutes: 60,
    steamRoom: false,
    coldPlunge: true,
    soakingTub: false,
    waterfront: true,
    naturalPlunge: true,
    tidal: true,
    noaaTideStation: "9447130",
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
    bookingProvider: {
      type: "acuity",
      owner: "5e9464ed",
      timezone: "America/Los_Angeles",
      appointmentTypes: [
        {
          acuityAppointmentId: 82608594,
          acuityCalendarId: 12638621,
          name: "Sauna Session",
          price: 35,
          durationMinutes: 60,
        },
      ],
    },
  },
  {
    slug: "fire-and-floe",
    name: "Fire+Floe",
    website: "https://fireandfloe.com/",
    bookingUrl:
      "https://minside.periode.no/bookinggroups/7Rnv6gI4q8eaTuU5uSQA/xJeWObTOZgRyDoyknG7C",
    bookingPlatform: "periode",
    sessionPrice: 30,
    sessionLengthMinutes: 75,
    steamRoom: false,
    coldPlunge: true,
    soakingTub: false,
    waterfront: true,
    naturalPlunge: true,
    tidal: true,
    noaaTideStation: "9445882",
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
    bookingProvider: {
      type: "periode",
      merchantId: "7Rnv6gI4q8eaTuU5uSQA",
      timezone: "America/Los_Angeles",
      manifests: [
        {
          manifestId: "PFtBW8NkrXgbf3Ay78Hh",
          name: "Community Sauna Session",
          price: 30,
          durationMinutes: 75,
        },
      ],
    },
  },
  {
    slug: "fyre-sauna",
    name: "Fyre Sauna",
    address: "14123 Redmond - Woodinville Rd NE, Redmond, WA 98052",
    website: "https://www.fyresauna.com/",
    bookingUrl: "https://www.fyresauna.com/book-online",
    bookingPlatform: "wix",
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
    bookingProvider: {
      type: "wix",
      siteUrl: "www.fyresauna.com",
      timezone: "America/Los_Angeles",
      services: [
        {
          serviceId: "712a0bcb-4c7d-41ac-a381-b71307ae32bd",
          name: "Contrast Therapy Session",
          price: 35,
          durationMinutes: 60,
        },
      ],
    },
  },
  {
    slug: "soak-and-sage",
    name: "Soak & Sage",
    address: "1135 Lake Washington Blvd N Suite 60, Renton, WA 98057",
    website: "http://www.soakandsagespa.com/",
    bookingUrl:
      "https://www.joinblvd.com/b/34303b6d-5682-4a50-b816-c4901c2b1072/widget",
    bookingPlatform: "boulevard",
    bookingProvider: {
      type: "boulevard",
      businessId: "34303b6d-5682-4a50-b816-c4901c2b1072",
      locationId: "beadba55-20ae-431b-bd4f-e2057183727c",
      timezone: "America/Los_Angeles",
      services: [
        {
          serviceId: "s_d0b150ed-95de-42bf-adfe-87c79f98cef6",
          name: "2 Hour Sauna Spa Pass",
          price: 75,
          durationMinutes: 120,
        },
      ],
    },
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
    markerIconOverride: "floating-sauna",
    website: "https://seattlesauna.com/",
    bookingUrl: "https://bookeo.com/seattlesauna",
    bookingPlatform: "bookeo",
    sessionPrice: 64,
    sessionLengthMinutes: 90,
    steamRoom: false,
    coldPlunge: true,
    soakingTub: false,
    waterfront: true,
    naturalPlunge: false,
    floating: true,
    showers: true,
    towelsIncluded: true,
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes: "Traditional sauna experience.",
    lat: 47.650332705185996,
    lng: -122.33052201956258,
    googleMapsUrl: "https://maps.app.goo.gl/zWoF6awqyvpSLaa76",
    updatedAt: "2025-01-04",
  },
  {
    slug: "sauna-n-soak",
    name: "Sauna n Soak",
    address: "Brackett's Landing North, Edmonds, WA",
    website: "https://www.saunansoak.com/services",
    bookingUrl: "https://www.saunansoak.com/appointments",
    bookingPlatform: "acuity",
    googleMapsUrl: "https://maps.app.goo.gl/BJZ2vLncQueWCy5V9",
    sessionPrice: 30,
    sessionLengthMinutes: 60,
    steamRoom: false,
    coldPlunge: true,
    soakingTub: false,
    waterfront: true,
    naturalPlunge: true,
    tidal: true,
    noaaTideStation: "9447427",
    showers: false,
    towelsIncluded: false,
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Mobile cedar sauna on the beach at Brackett's Landing North. Bring your own water and large towel. Small towel provided to sit on.",
    lat: 47.813456307232165,
    lng: -122.38195767249658,
    updatedAt: "2026-01-04",
    bookingProvider: {
      type: "acuity",
      owner: "2fd467d2",
      timezone: "America/Los_Angeles",
      appointmentTypes: [
        {
          acuityAppointmentId: 73677787,
          acuityCalendarId: 11452405,
          name: "Morning Sauna",
          price: 25,
          durationMinutes: 45,
        },
        {
          acuityAppointmentId: 73677820,
          acuityCalendarId: 11452405,
          name: "Sauna and Cold Plunge",
          price: 30,
          durationMinutes: 60,
        },
        {
          acuityAppointmentId: 87550111,
          acuityCalendarId: 11452405,
          name: "Weekday Morning Sauna (Reduced Price)",
          price: 20,
          durationMinutes: 45,
        },
        {
          acuityAppointmentId: 87550863,
          acuityCalendarId: 11452405,
          name: "Thursday Sauna and Cold Plunge",
          price: 20,
          durationMinutes: 60,
        },
      ],
    },
  },
  {
    slug: "wildhaus",
    name: "Wildhaus",
    markerIconOverride: "ship",
    website: "https://thewildhaus.com/",
    bookingUrl: "https://wild-haus.checkfront.com/reserve/",
    bookingPlatform: "checkfront",
    bookingProvider: {
      type: "checkfront",
      baseUrl: "https://wild-haus.manage.na1.bookingplatform.app",
      timezone: "America/Los_Angeles",
      items: [
        {
          itemId: 4240,
          name: "Communal Captained Sauna Voyage",
          price: 150,
          durationMinutes: 90,
        },
        {
          itemId: 5342,
          name: "Private Captained Sauna Voyage (1.5 Hours)",
          price: 900,
          durationMinutes: 90,
          private: true,
          seats: 6,
        },
        {
          itemId: 3401,
          name: "Private Captained Sauna Voyage (2.5 Hours)",
          price: 1200,
          durationMinutes: 150,
          private: true,
          seats: 12,
        },
        {
          itemId: 106550,
          name: "Wild Wednesdays",
          price: 95,
          durationMinutes: 90,
        },
      ],
    },
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
    googleMapsUrl: "https://maps.app.goo.gl/vc1HhqLA9G5XXaEz8",
    updatedAt: "2025-01-04",
  },
  {
    slug: "svette-sauna",
    name: "Svette Sauna",
    address: "5605 Owen Beach Rd, Tacoma, WA 98407",
    website: "https://svettetacoma.com/",
    bookingUrl:
      "https://app.glofox.com/portal/#/branch/67a141b0d1806cff7106b964/classes-day-view",
    bookingPlatform: "glofox",
    bookingProvider: {
      type: "glofox",
      branchId: "67a141b0d1806cff7106b964",
      facilityId: "67a141b1d1806cff7106b96b",
      timezone: "America/Los_Angeles",
      priceOverrides: {
        "68af1bc596e3414b0b0d765c": 35, // Peak-time Social Sauna Session
        "6863046ee1518f87a404e00b": 28, // Matinee Social Sauna Session
      },
    },
    sessionPrice: 28, // Matinee pricing (peak is $35)
    sessionLengthMinutes: 75,
    steamRoom: false,
    coldPlunge: true, // Puget Sound 46-58°F
    soakingTub: false,
    waterfront: true,
    naturalPlunge: true,
    tidal: true,
    noaaTideStation: "9447130",
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
    slug: "tacoma-banya",
    name: "Tacoma Banya",
    address: "4704 S Oakes St #6400, Tacoma, WA 98409",
    website: "https://www.tacomabanya.com/",
    googleMapsUrl: "https://maps.app.goo.gl/TacomaBanya123",
    sessionPrice: 0, // Pricing not listed on website - call for rates
    sessionLengthMinutes: null,
    steamRoom: true, // Steam room and wet sauna
    coldPlunge: false, // Tepid pool (not cold plunge)
    soakingTub: true, // Hot tub mentioned
    waterfront: false,
    naturalPlunge: false,
    showers: true, // Temperature-controlled showers
    towelsIncluded: false,
    temperatureRangeF: { min: 170, max: 200 },
    hours: "Daily 6pm-midnight",
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Traditional Russian banya (Eastern European sauna) experience in Tacoma. Features hot sauna, steam room, wet sauna, hot tub, and tepid pool. Temperature-controlled showers on main floor. Additional amenities include VIP room (with sauna, relaxation space, TV, karaoke, chess table), billiard room, and tea zone. Traditional birch branch (venik) practice available. Waiver required before participation. Call for pricing: (253) 878-8966 or email tacomabanya@gmail.com",
    lat: 47.21400939375373,
    lng: -122.4733156020583,
    updatedAt: "2026-02-06",
  },
  {
    slug: "everett-banya",
    name: "Banya",
    address: "2814 Colby Ave, Everett, WA 98201",
    website: "https://banyabyfgm.com/",
    bookingUrl: "https://banyabyfgm.com/book-now/",
    bookingPlatform: "mindbody",
    googleMapsUrl: "https://maps.app.goo.gl/BaTyLaz1F2j9baw28",
    sessionPrice: 40, // Day reservation $40, Day walk-in $50, Evening reservation $50, Evening walk-in $60
    sessionLengthMinutes: 180, // 3-hour sessions
    steamRoom: true, // Steam room with essential oils
    coldPlunge: true, // Cold plunge 35-40°F (coldest in PNW)
    soakingTub: true, // Jacuzzi/hot tub
    waterfront: false,
    naturalPlunge: false,
    showers: true,
    towelsIncluded: true, // Towels and flip flops included
    servesFood: true, // On-site kitchen with traditional Eastern European food
    temperatureRangeF: { min: 160, max: 200 },
    hours: "Mon-Thu 12pm-10pm, Fri-Sat 12pm-12am, Sun Private Events",
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Authentic Eastern European banya in Everett—hottest sauna and coldest cold plunge (35-40°F) in the Pacific Northwest. Features traditional European sauna, steam room with essential oils, red light therapy sauna, jacuzzi, and on-site kitchen serving traditional Eastern European cuisine (dumplings, pickled salads, kvass, kombucha). 3-hour sessions. Day reservation $40, day walk-in $50, evening reservation $50, evening walk-in $60. Memberships available. Family hours Mon-Thu & Fri-Sat 12pm-8pm (youth 5-11, no children under 5). Contact: (425) 252-2692 or dtbanya@gmail.com",
    lat: 47.98004258034211,
    lng: -122.2089488431352,
    updatedAt: "2026-02-06",
  },
  {
    slug: "hot-spot-lookout-arts-quarry",
    name: "Hot Spot Sauna Club (Lookout Arts Quarry)",
    address: "246 Old Hwy 99 N, Bellingham, WA 98229",
    website: "https://www.hotspotbellingham.com/",
    bookingUrl: "https://www.hotspotbellingham.com/bookings",
    bookingPlatform: "mindbody",
    bookingProvider: {
      type: "mindbody",
      siteId: 5743493,
      locationId: 1,
      timezone: "America/Los_Angeles",
    },
    googleMapsUrl: "https://maps.app.goo.gl/5EpaLT2r57PqxSN37",
    sessionPrice: 35,
    sessionLengthMinutes: 50,
    steamRoom: false,
    coldPlunge: true, // 80ft freshwater quarry
    soakingTub: false,
    waterfront: true, // On quarry
    naturalPlunge: true, // Freshwater quarry cold plunge
    showers: true,
    towelsIncluded: false, // Towels available to rent $4
    temperatureRangeF: { min: 175, max: 194 },
    capacity: 8,
    hours: "Fri-Sat 5-10pm, Sun 12-5pm",
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Custom cedar barrel sauna at Lookout Arts Quarry with cold plunge into an 80ft freshwater quarry (with waterslide). Social sessions $35/seat, private booking $210 for whole sauna. Membership $50/mo includes 2 sessions then $5 each. Towels and sauna hats available to rent or purchase. Bring sandals and headlamp.",
    lat: 48.64144031843873,
    lng: -122.35482835387809,
    updatedAt: "2026-02-18",
  },
  {
    slug: "hot-spot-bloedel-donovan",
    name: "Hot Spot Sauna Club (Bloedel Donovan)",
    address: "Bloedel Donovan Park, Bellingham, WA",
    website: "https://www.hotspotbellingham.com/",
    bookingUrl: "https://www.hotspotbellingham.com/bookings",
    bookingPlatform: "mindbody",
    bookingProvider: {
      type: "mindbody",
      siteId: 5743493,
      locationId: 1,
      timezone: "America/Los_Angeles",
    },
    googleMapsUrl: "https://maps.app.goo.gl/5EpaLT2r57PqxSN37",
    sessionPrice: 35,
    sessionLengthMinutes: 50,
    steamRoom: false,
    coldPlunge: true, // Lake Whatcom
    soakingTub: false,
    waterfront: true, // On Lake Whatcom
    naturalPlunge: true, // Lake Whatcom
    showers: false,
    towelsIncluded: false,
    hours: "Check website for session times (soft opening Feb 2026)",
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Hot Spot Sauna Club's newest location on Lake Whatcom at Bloedel Donovan Park. Soft opening February 2026. Book individually online.",
    lat: 48.76063678683713,
    lng: -122.41836214427805,
    updatedAt: "2026-02-18",
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
    bookingUrl: "https://www.hothousespa.com/schedule",
    bookingPlatform: "acuity",
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
    bookingProvider: {
      type: "acuity",
      owner: "bae4137c",
      timezone: "America/Los_Angeles",
      appointmentTypes: [
        {
          acuityAppointmentId: 40981922,
          acuityCalendarId: 5156616,
          name: "90 min Daytime Weekday",
          price: 190,
          durationMinutes: 90,
          private: true,
          seats: 4,
        },
        {
          acuityAppointmentId: 67383995,
          acuityCalendarId: 5156616,
          name: "90 min Eve/Weekend",
          price: 240,
          durationMinutes: 90,
          private: true,
          seats: 4,
        },
        {
          acuityAppointmentId: 62947500,
          acuityCalendarId: 5156616,
          name: "2 Hour Daytime Weekdays",
          price: 220,
          durationMinutes: 120,
          private: true,
          seats: 4,
        },
        {
          acuityAppointmentId: 62947509,
          acuityCalendarId: 5156616,
          name: "2 Hour Evenings & Weekends",
          price: 270,
          durationMinutes: 120,
          private: true,
          seats: 4,
        },
        {
          acuityAppointmentId: 67384119,
          acuityCalendarId: 5156616,
          name: "3 Hour Daytime Weekdays",
          price: 300,
          durationMinutes: 180,
          private: true,
          seats: 4,
        },
        {
          acuityAppointmentId: 67384126,
          acuityCalendarId: 5156616,
          name: "3 Hour Evenings & Weekends",
          price: 350,
          durationMinutes: 180,
          private: true,
          seats: 4,
        },
      ],
    },
  },
  {
    slug: "yuan-spa-bellevue",
    name: "Yuan Spa (Bellevue)",
    address: "1032 106th Ave NE, Suite 125, Bellevue, WA 98004",
    website: "https://yuanspa.com/",
    bookingUrl: "https://go.booker.com/brand/yuanspabrand/locations",
    bookingPlatform: "booker",
    bookingProvider: {
      type: "booker",
      locationSlug: "yuanspabellevue",
      locationId: 3708,
      timezone: "America/Los_Angeles",
      services: [
        {
          serviceId: 4016064,
          name: "1-Hour Hydrotherapy Pass (Co-ed)",
          price: 59,
          durationMinutes: 60,
        },
        {
          serviceId: 4587860,
          name: "1-Hour Hydrotherapy Pass (Co-ed, Fri-Sun)",
          price: 69,
          durationMinutes: 60,
        },
      ],
    },
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
    bookingPlatform: "booker",
    bookingProvider: {
      type: "booker",
      locationSlug: "yuanspaTotemlake",
      locationId: 51266,
      timezone: "America/Los_Angeles",
      services: [
        {
          serviceId: 4016065,
          name: "1-Hour Hydrotherapy Pass (Co-ed)",
          price: 59,
          durationMinutes: 60,
        },
        {
          serviceId: 4587861,
          name: "1-Hour Hydrotherapy Pass (Co-ed, Fri-Sun)",
          price: 69,
          durationMinutes: 60,
        },
      ],
    },
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
    bookingPlatform: "fareharbor",
    bookingProvider: {
      type: "fareharbor",
      shortname: "cedarandstonesauna",
      timezone: "America/Chicago",
    },
    googleMapsUrl: "https://maps.app.goo.gl/kxzGvHoJ6bTw1Rsg6",
    sessionPrice: 49, // Social session price
    sessionLengthMinutes: 75,
    steamRoom: false,
    coldPlunge: true, // Harborside natural cold plunge into Lake Superior harbor
    soakingTub: false,
    waterfront: true,
    naturalPlunge: true,
    floating: true,
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
  {
    slug: "sauna-du-nord",
    name: "Sauna du Nord",
    address: "Caribou Lake, Duluth, MN",
    website: "https://www.saunadunord.com/",
    bookingUrl: "https://www.saunadunord.com/booking",
    googleMapsUrl: "https://maps.app.goo.gl/a7hn962v4w9hdMTP6",
    sessionPrice: 35,
    sessionLengthMinutes: 75,
    steamRoom: false,
    coldPlunge: true,
    soakingTub: false,
    waterfront: true,
    naturalPlunge: true, // Lake access at Caribou Lake
    showers: false,
    towelsIncluded: false, // Bring your own small towel
    hours: "Wed, Thu, Sat, plus by request",
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Nordic sauna experience at Caribou Lake north of Duluth. Cedar sauna with lake access for cold plunge. Community sessions $35/person (75 min), private group sessions $245 for up to 10 people. Private delivery packages also available. Bring towel, water bottle, and flip-flops.",
    lat: 46.8995902,
    lng: -92.3128808,
    updatedAt: "2026-01-20",
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
    bookingPlatform: "tock",
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
    bookingPlatform: "booker",
    bookingProvider: {
      type: "booker",
      locationSlug: "PiedmontSprings",
      locationId: 49414,
      timezone: "America/Los_Angeles",
      services: [
        {
          serviceId: 3626390,
          name: "30 Minute Sauna",
          price: 20,
          durationMinutes: 30,
        },
        {
          serviceId: 3626391,
          name: "45 Minute Sauna",
          price: 22,
          durationMinutes: 45,
        },
        {
          serviceId: 3668786,
          name: "30 Minute Steam",
          price: 20,
          durationMinutes: 30,
        },
      ],
    },
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
    bookingPlatform: "zenoti",
    bookingProvider: {
      type: "zenoti",
      subdomain: "loylysauna",
      centerId: "e1256f48-ef61-4047-815e-3139392311c1",
      timezone: "America/Los_Angeles",
      services: [
        {
          serviceId: "ad539819-879e-4a96-bbd4-e25f61d46c2a",
          name: "Sauna Lounge - 2 hours",
          price: 40,
          durationMinutes: 120,
        },
      ],
    },
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
    bookingPlatform: "zenoti",
    bookingProvider: {
      type: "zenoti",
      subdomain: "loylysauna",
      centerId: "a09def69-5adb-4b2f-b030-6908911fb8ee",
      timezone: "America/Los_Angeles",
      services: [
        {
          serviceId: "ad539819-879e-4a96-bbd4-e25f61d46c2a",
          name: "Sauna Lounge - 2 hours",
          price: 40,
          durationMinutes: 120,
        },
      ],
    },
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
    bookingPlatform: "square",
    bookingProvider: {
      type: "square",
      widgetId: "xkixhokqjj5m3m",
      locationToken: "LBCF5TC30K6Y1",
      timezone: "America/Los_Angeles",
    },
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
    slug: "everett-house",
    name: "Everett House Community Healing Center",
    address: "2927 NE Everett St, Portland, OR 97232",
    website: "https://www.everetthousecommunityhealingcenter.com/",
    bookingUrl:
      "https://clients.mindbodyonline.com/classic/ws?studioid=47269&stype=-101",
    bookingPlatform: "mindbody",
    bookingProvider: {
      type: "mindbody",
      siteId: 47269,
      locationId: 1,
      timezone: "America/Los_Angeles",
    },
    googleMapsUrl: "https://maps.app.goo.gl/WwuiZuSaPTu5y3Zv9",
    sessionPrice: 28, // 60 min; 30 min $18, 90 min $39
    sessionLengthMinutes: 60,
    steamRoom: true,
    coldPlunge: true, // Two clawfoot cold plunge tubs
    soakingTub: true, // Large salt hot tub
    waterfront: false,
    naturalPlunge: false,
    showers: true, // Outdoor shower
    towelsIncluded: false, // $2.50 towel rental
    hours:
      "Mon 1-11pm, Tue 9am-11pm (LGBTQ 9am-1pm), Wed-Thu 9am-11pm, Fri 11am-11pm, Sat 9am-11pm, Sun 9am-11pm (Women's 9am-3pm)",
    genderPolicy: "Co-ed (LGBTQ hours Tue 9am-1pm, Women's Sun 9am-3pm)",
    clothingPolicy: "Clothing optional",
    notes:
      "Portland community sanctuary since 1970s. Features two dry saunas (large and small), steam room, salt hot tub, two cold plunge clawfoot tubs, outdoor shower, and fire pit patio. 10-pack available for 20% off. 18+ only. 4.5 stars with 651 reviews.",
    lat: 45.5252261,
    lng: -122.6352974,
    updatedAt: "2026-01-05",
  },
  {
    slug: "bear-banya",
    name: "Bear Banya",
    address: "2130 SE 96th Ave, Portland, OR 97216",
    website: "https://www.bearbanya.com/",
    bookingUrl:
      "https://book.squareup.com/appointments/sdr909jlzvzvv8/location/L05M6ZMRXDHXZ/services",
    bookingPlatform: "square",
    bookingProvider: {
      type: "square",
      widgetId: "sdr909jlzvzvv8",
      locationToken: "L05M6ZMRXDHXZ",
      timezone: "America/Los_Angeles",
    },
    googleMapsUrl: "https://maps.app.goo.gl/zB2mFo97osPvVUZr8",
    sessionPrice: 60, // 1 hr All Inclusive; 2 hr $120, 3 hr $180
    sessionLengthMinutes: 60,
    steamRoom: true, // Turkish Hamam steam room
    coldPlunge: true,
    soakingTub: true, // Wood-burning hot tub (Kupel)
    waterfront: false,
    naturalPlunge: false,
    showers: true, // Summer shower
    towelsIncluded: true, // Towels, slippers, robes included
    hours: "By appointment",
    genderPolicy: "Co-ed",
    clothingPolicy: "Private experience",
    notes:
      "Traditional Russian banya in Portland. All Inclusive Banya Retreat: 1hr $60, 2hr $120, 3hr $180. Includes Russian Banya (Parilka), Turkish Steam Room (Hamam), wood-burning hot tub (Kupel), cold plunge, herbal tea, fruits, and relaxation lounge with fireplace. Signature Banya Ritual with venik treatment $260/2hr. 5.0 stars with 88 reviews.",
    lat: 45.5074432,
    lng: -122.5640963,
    updatedAt: "2026-01-05",
  },
  {
    slug: "saunaglo",
    name: "SaunaGlo",
    address: "1915 SE Jefferson St, Milwaukie, OR 97222",
    website: "https://www.saunaglo.com/",
    bookingUrl: "https://www.saunaglo.com/book",
    bookingPlatform: "glofox",
    bookingProvider: {
      type: "glofox",
      branchId: "67211b267819f979d70dad4d",
      facilityId: "673192fb37a2a46702016536",
      timezone: "America/Los_Angeles",
    },
    googleMapsUrl: "https://maps.app.goo.gl/Nbv2Uhdf8zfLPyaA8",
    sessionPrice: 29, // Day pass; $19 weekdays before 2pm
    steamRoom: false,
    coldPlunge: true, // Cedar barrel cold plunge tank
    soakingTub: false,
    waterfront: false,
    naturalPlunge: false,
    showers: true, // Rainwater shower and water pail dump bucket
    towelsIncluded: false,
    hours: "Mon-Thu 7am-8pm, Fri 7am-9pm, Sat 9am-9pm, Sun 9am-8pm",
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Community Nordic sauna built to Finnish standards with 18-person capacity. Cold contrast options include rainwater shower, water pail dump bucket, and cedar barrel cold plunge. Weekday early bird $19 before 2pm. Multi Pass 10-pack available. Membership $149/mo unlimited. Walk-ins welcome. 5.0 stars with 123 reviews.",
    lat: 45.4438,
    lng: -122.6317,
    updatedAt: "2026-01-05",
  },
  {
    slug: "guss-mobile-sauna",
    name: "Guss Mobile Sauna",
    address: "Sellwood Riverfront Park, Portland, OR 97202",
    website: "https://www.theguss.com/",
    bookingUrl:
      "https://minside.periode.no/eventlist/v9YqrmvzfkNDbpcILgA8/KcnoUcYNgTY9TtpttJ4g",
    bookingPlatform: "periode",
    googleMapsUrl: "https://maps.app.goo.gl/qsYa7tDFeHjtngis6",
    sessionPrice: 30, // Drop-in; 5-session punch pass $120
    sessionLengthMinutes: 60,
    steamRoom: false,
    coldPlunge: true, // Willamette River cold plunge
    soakingTub: false,
    waterfront: true, // On Willamette River
    naturalPlunge: true, // River plunge
    showers: false,
    towelsIncluded: false, // Bring two towels
    hours: "Check website for session times",
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Portland's first riverfront wood-fired barrel sauna. Located at Sellwood Riverfront Park or Willamette Park. Drop-in $30/hr, 5-session punch pass $120 (never expires). Private rental $280/hr (up to 12 people). Cold plunge in Willamette River. Bring two towels. 5% of revenue donated to Human Access Project. 5.0 stars with 73 reviews.",
    lat: 45.4659271,
    lng: -122.6628812,
    updatedAt: "2026-01-05",
  },
  {
    slug: "knot-springs",
    name: "Knot Springs",
    address: "33 NE 3rd Ave Suite 365, Portland, OR 97232",
    website: "https://knotsprings.com/",
    bookingUrl:
      "https://clients.mindbodyonline.com/classic/ws?studioid=337004&stype=-103&sView=week&sLoc=0",
    bookingPlatform: "mindbody",
    bookingProvider: {
      type: "mindbody",
      siteId: 337004,
      locationId: 1,
      timezone: "America/Los_Angeles",
    },
    googleMapsUrl: "https://maps.app.goo.gl/nHaJyxDfqGuLcD7M7",
    sessionPrice: 69, // Tue-Thu before 3pm; $89 all other times
    sessionLengthMinutes: 120,
    steamRoom: true, // Eucalyptus-infused steam room
    coldPlunge: true, // 47°F cold plunge
    soakingTub: true, // Hot tub and tepid bath
    waterfront: false,
    naturalPlunge: false,
    showers: true,
    towelsIncluded: true,
    temperatureRangeF: { min: 170, max: 190 },
    hours: "Public 8am-8pm daily; Members 6am-10pm M-F, 8am-10pm S-S",
    genderPolicy: "Co-ed (18+)",
    clothingPolicy: "Swimsuit required",
    notes:
      "Urban wellness club in Central Eastside with Portland skyline views. Springs area includes dry sauna, eucalyptus steam room, 47°F cold plunge, hot tub, and tepid bath. Midweek pricing (Tue-Thu before 3pm) $69, all other times $89. Also offers massage, skincare, and movement classes. Memberships available. 4.4 stars with 643 reviews.",
    lat: 45.5234981,
    lng: -122.6629436,
    updatedAt: "2026-01-05",
  },
  {
    slug: "koti-sauna",
    name: "Koti",
    address: "4128 SE Jefferson St, Milwaukie, OR 97222",
    website: "https://www.kotisauna.com/",
    bookingUrl: "https://www.kotisauna.com/booksauna",
    bookingPlatform: "acuity",
    googleMapsUrl: "https://maps.app.goo.gl/QHpZ294cn2vYyqhD6",
    sessionPrice: 40,
    sessionLengthMinutes: 120,
    steamRoom: false,
    coldPlunge: true, // Two outdoor cold plunges at 40-50°F
    soakingTub: false,
    waterfront: false,
    naturalPlunge: false,
    showers: true, // Outdoor showers
    towelsIncluded: false,
    temperatureRangeF: { min: 185, max: 195 },
    hours: "Mon/Thu-Sun 8am-8:30pm, Tue-Wed Closed",
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Neighborhood Finnish sauna in Milwaukie. Outdoor cedar sauna (185-195°F) with three tiers of benches and birch-scented steam. Two outdoor cold plunges (40-50°F), outdoor showers, and firepit lounge. Community sessions $40/2hr. Private rentals and memberships available. Inspired by Finnish word 'koti' meaning home. 5.0 stars with 103 reviews.",
    lat: 45.4442786,
    lng: -122.6201981,
    updatedAt: "2026-01-05",
    bookingProvider: {
      type: "acuity",
      owner: "d8dc9e08",
      timezone: "America/Los_Angeles",
      appointmentTypes: [
        {
          acuityAppointmentId: 78853595,
          acuityCalendarId: 11520159,
          name: "Community Sauna and Cold Plunge",
          price: 40,
          durationMinutes: 120,
        },
        {
          acuityAppointmentId: 86951055,
          acuityCalendarId: 11520159,
          name: "Rooted Warmth: Sauna + Sound Bath Reset",
          price: 70,
          durationMinutes: 180,
        },
      ],
    },
  },
  {
    slug: "connect-wellness",
    name: "Connect Wellness",
    address: "4301 NE 59th Ave, Vancouver, WA 98661",
    website: "https://www.connectwellness.biz/",
    bookingUrl: "https://www.connectwellness.biz/calendar",
    bookingPlatform: "wix",
    googleMapsUrl: "https://maps.app.goo.gl/RSHr2Ewh21DP4SK87",
    sessionPrice: 40,
    sessionLengthMinutes: 120,
    steamRoom: false,
    coldPlunge: true, // Ice baths at 35-55°F
    soakingTub: true, // Warm soaking tub
    waterfront: false,
    naturalPlunge: false,
    showers: false,
    towelsIncluded: false,
    temperatureRangeF: { min: 165, max: 190 },
    hours: "Fri-Mon 7am-9:30pm, Tue/Thu 6am-8:30pm, Wed 5pm-9:30pm",
    genderPolicy: "Co-ed (13+)",
    clothingPolicy: "Swimsuit required",
    notes:
      "Community backyard spa in Vancouver, WA. Features electric barrel sauna (165-190°F) with Huum heater, infrared sauna cabin, cold plunge tubs (35-55°F), and warm soaking tub. 2-hour sessions $40/person. Appointment only. Address provided with booking confirmation. Grass-roots community focused.",
    lat: 45.6528752,
    lng: -122.6111391,
    updatedAt: "2026-01-05",
    bookingProvider: {
      type: "wix",
      siteUrl: "www.connectwellness.biz",
      timezone: "America/Los_Angeles",
      services: [
        {
          serviceId: "5a415d4e-496f-4709-82b7-222ff55f5962",
          name: "Community Spa Session",
          price: 40,
          durationMinutes: 120,
        },
      ],
    },
  },
  {
    slug: "backyard-bliss-pdx",
    name: "Backyard Bliss PDX",
    address: "6545 N Fenwick Ave, Portland, OR 97217",
    website: "https://backyardblisspdx.simplybook.me/",
    bookingUrl: "https://backyardblisspdx.simplybook.me/v2/#book",
    bookingPlatform: "simplybook",
    googleMapsUrl: "https://maps.app.goo.gl/vyXa58VwfctfRHBLA",
    sessionPrice: 45, // Sauna & Shower 1hr Mon/Thu; Full experience 90min $100
    sessionLengthMinutes: 60,
    steamRoom: false,
    coldPlunge: false, // "Cool plunge" is tap water, guests bring ice
    soakingTub: true, // Hot tub
    waterfront: false,
    naturalPlunge: false,
    showers: true, // Outdoor shower
    towelsIncluded: false,
    temperatureRangeF: { min: 170, max: 190 },
    capacity: 5,
    hours: "Daily 8am-10pm",
    genderPolicy: "Co-ed, LGBTQ+ friendly",
    clothingPolicy: "Swimsuit required",
    notes:
      "Private backyard oasis in North Portland. Hand-built 5-person cedar sauna with electric heater. Includes hot tub, outdoor shower, cool plunge (tap water - bring ice), and propane fire pit. Sauna & Shower only: $45/hr (Mon/Thu). Full experience: Mid-week 90 min $100, 2 hr $130, 3 hr $200. Weekend 90 min $125, 2 hr $155, 3 hr $255. Up to 5 guests. 5.0 stars.",
    lat: 45.5706761,
    lng: -122.6855365,
    updatedAt: "2026-01-06",
    bookingProvider: {
      type: "simplybook",
      companySlug: "backyardblisspdx",
      timezone: "America/Los_Angeles",
      services: [
        { serviceId: 19, name: "Mid Week Special: 90 Minutes - Sauna, Hot Tub, and Cold Plunge", price: 100, durationMinutes: 90 },
        { serviceId: 22, name: "Weekend Special: 90 Minutes - Sauna, Hot Tub, and Cold Plunge", price: 125, durationMinutes: 90 },
        { serviceId: 16, name: "Mid Week Special: 2 Hours - Sauna, Hot Tub, and Cold Plunge", price: 130, durationMinutes: 120 },
        { serviceId: 23, name: "Weekend Special: 2 Hours - Sauna, Hot Tub, and Cold Plunge", price: 155, durationMinutes: 120 },
        { serviceId: 21, name: "Mid Week Special: 3 Hours - Sauna, Hot Tub, and Cold Plunge", price: 200, durationMinutes: 180 },
        { serviceId: 24, name: "Weekend Special: 3 Hours - Sauna, Hot Tub, and Cold Plunge", price: 255, durationMinutes: 180 },
        { serviceId: 14, name: "Hot Tub and Shower - Mon/Thurs", price: 45, durationMinutes: 60 },
        { serviceId: 5, name: "Hot Tub and Shower - Fri/Sun", price: 50, durationMinutes: 60 },
        { serviceId: 20, name: "Sauna and Shower - Mon/Thurs", price: 45, durationMinutes: 60 },
        { serviceId: 13, name: "Hot Bath - Mon/Thurs", price: 30, durationMinutes: 60 },
      ],
    },
  },
  {
    slug: "fusion-bodyworks-pdx",
    name: "Fusion Bodyworks PDX",
    address: "7415 N Oatman Ave, Portland, OR 97217",
    website: "https://www.fusionpdx.com/",
    bookingUrl: "http://fusionbodyworkspdx2.clinicsense.com/book/",
    bookingPlatform: "clinicsense",
    bookingProvider: {
      type: "clinicsense",
      slug: "fusionbodyworkspdx2",
      timezone: "America/Los_Angeles",
      services: [
        {
          serviceDurationId: 327920,
          name: "Community Sauna and Soak",
          price: 34,
          durationMinutes: 90,
        },
      ],
    },
    googleMapsUrl: "https://maps.app.goo.gl/YoBZYagBtnN3wkm57",
    sessionPrice: 30, // Community sauna 90 min; Private $200/90min, $250/120min
    sessionLengthMinutes: 90,
    steamRoom: false,
    coldPlunge: false, // Has cold plunge but temperature not specified
    soakingTub: true, // Two hot soaking tubs with salt infusions
    waterfront: false,
    naturalPlunge: false,
    showers: false,
    towelsIncluded: false, // $5 towel and robe rental
    temperatureRangeF: { min: 170, max: 190 },
    capacity: 8, // Private rental up to 8, +2 more at $40/guest
    hours: "Daily 9am-8pm, by appointment",
    genderPolicy: "Co-ed, LGBTQ+ friendly",
    clothingPolicy: "Swimsuit required (community), optional (private)",
    notes:
      "Healing arts center in North Portland with outdoor cedar sauna built in a vintage trailer. Community sauna $30/90min (bathing suits required). Private rental $200/90min, $250/120min for up to 8 guests (bathing suits optional). Also offers infrared sauna ($25-45), soaking tubs ($85-125), and massage. LGBTQ+ owned, women-owned. 4.9 stars (319 reviews).",
    lat: 45.5769069,
    lng: -122.7007139,
    updatedAt: "2026-01-06",
  },
  {
    slug: "fern-and-thistle",
    name: "Fern & Thistle Massage and Spa",
    address: "8160 N Jersey St, Portland, OR 97203",
    website: "https://www.fernandthistle.co/",
    bookingUrl:
      "https://www.vagaro.com//Users/BusinessWidget.aspx?enc=MMLjhIwJMcwFQhXLL7ifVKn0Tz6QdbfjxAhAIcfKsQIt3PHfWZmW1NGrsutPz35VvfCdchdL3vBXHR7ZhFnnlmp5GLs3/Fn1RCKNDfhpshOVLYG6X4o8IP2RvFmKwjCDjEFURQIFRzOGN2Kn/N0nNbDHIyKQ+zrSnvU8YHpxwnctPVKnluEGtGTnaH/s9xF/0cn1f3Mo0uvqhp7/OTxoNRsFmQL1Ne1wsQK2diEzCpmJhKHPxvuDL6Jqop0rg8ZEXZGkAybs90s4ie0ytmi/zz4SnX77ITbfsPi106OyEeaTwppa9ZOVT4hN5LBbA4DtIyfEExqySpyr6/34f4dSIBj18GZ1+dJyF3jvnfTWHtAI6FdCX33E6M0hd8DiSeIeSv5qQ1FaaUwEAzEl5SwYDBnxXk227tSuAFPcNA1mcxNMFqXINIoztZ/F/C/H9QtK",
    googleMapsUrl: "https://maps.app.goo.gl/iJ5NEB5KewdazvAA6",
    sessionPrice: 25, // 1 hour spa session
    sessionLengthMinutes: 60,
    steamRoom: false,
    coldPlunge: false, // Has clawfoot cold plunge tub but temperature not specified
    soakingTub: false,
    waterfront: false,
    naturalPlunge: false,
    showers: false,
    towelsIncluded: false,
    temperatureRangeF: { min: 170, max: 200 },
    hours: "Spa: Fri, Sat, some Sundays; by appointment",
    genderPolicy: "Co-ed (13+)",
    clothingPolicy: "Swimsuit required",
    notes:
      "St. Johns neighborhood spa with traditional Finnish sauna, clawfoot cold-plunge tub, DIY facial bar, and outdoor lounge. Spa sessions $25/hour. Open to public on Fri, Sat, and 2 Sundays per month. Also offers massage ($140+), yoga, and movement classes. Family-friendly (13+). Spa membership available. 5.0 stars (54 reviews).",
    lat: 45.5887579,
    lng: -122.7506969,
    updatedAt: "2026-01-06",
  },
  {
    slug: "uptown-sauna-house",
    name: "Uptown Sauna House",
    address: "414 W 23rd St, Vancouver, WA 98660",
    website: "https://www.uptownsaunahouse.com/",
    bookingUrl: "https://www.uptownsaunahouse.com/book-online",
    bookingPlatform: "wix",
    googleMapsUrl: "https://maps.app.goo.gl/Zmj6oReyvZkhW2fL6",
    sessionPrice: 35, // 90-min session; Sunrise Mini $25/30min
    sessionLengthMinutes: 90,
    steamRoom: false,
    coldPlunge: true, // Filtered cold plunges
    soakingTub: false,
    waterfront: false,
    naturalPlunge: false,
    showers: true, // Outdoor hot/cold shower with soaps provided
    towelsIncluded: false,
    hours:
      "Mon/Wed/Fri 6am-11:30am & 5pm-8:30pm, Sun 8am-4:30pm; Tue/Thu/Sat Closed",
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Finnish-inspired outdoor cedar sauna in Vancouver, WA. Public sessions $35/90min (up to 4 people), Sunrise Mini $25/30min. Multi-passes available: 6-pack $175, 10-pack $280. Clean filtered cold plunges. Outdoor shower with hot/cold water and soap provided. Owned by Rebekah and Paul Crawford.",
    lat: 45.6382949,
    lng: -122.6757138,
    updatedAt: "2026-01-05",
    bookingProvider: {
      type: "wix",
      siteUrl: "www.uptownsaunahouse.com",
      timezone: "America/Los_Angeles",
      services: [
        {
          serviceId: "34660c0c-56be-4e34-938c-0a14f6d8d519",
          name: "Public Sauna & Cold Plunge",
          price: 35,
          durationMinutes: 90,
        },
        {
          serviceId: "fdbe8315-f9d6-448c-9adf-fad7c9a776bb",
          name: "Sunrise Mini Session",
          price: 25,
          durationMinutes: 30,
        },
      ],
    },
  },
  {
    slug: "ebb-and-ember",
    name: "Ebb & Ember Floating Saunas",
    address: "173 NE Bridgeton Rd, Portland, OR 97211",
    website: "https://www.ebbandember.com/",
    bookingUrl:
      "https://minside.periode.no/bookinggroups/wE4l5rKVuae2oCBE93gz/XBS8E3lQehtlsunpb5Kx/2025-11-09",
    bookingPlatform: "periode",
    googleMapsUrl: "https://maps.app.goo.gl/SxKydKCWtX9iFnBSA",
    sessionPrice: 59, // Social session; Private $539 for up to 10 guests
    sessionLengthMinutes: 105, // 1hr 45min
    steamRoom: false,
    coldPlunge: true, // Columbia River plunge
    soakingTub: false,
    waterfront: true, // Floating on Columbia River
    naturalPlunge: true, // River plunge
    floating: true,
    showers: true, // Freshwater showers (no soap for environmental reasons)
    towelsIncluded: false, // Bring two towels
    hours: "Social Fri-Sun 7am-7pm; Private available all week",
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Floating sauna on the Columbia River with modern design and deck lounge. Social sessions $59/person (up to 8 people), Private sessions $539 (up to 10 guests). All sessions 1hr 45min with 15min transition. Memberships available: Ember 1 $99/mo (4 sessions), Ember 2 $149/mo (6 sessions). Bring swimsuit, two towels, and non-metallic water bottle.",
    lat: 45.6018646,
    lng: -122.6631804,
    updatedAt: "2026-01-05",
    bookingProvider: {
      type: "periode",
      merchantId: "wE4l5rKVuae2oCBE93gz",
      timezone: "America/Los_Angeles",
      manifests: [
        {
          manifestId: "w5FpVIGDc7DPhwYo5u3w",
          name: "Social Sauna",
          price: 59,
          durationMinutes: 105,
        },
        {
          manifestId: "Hy1DLi3fx7KiCgYCtAuT",
          name: "Private Sauna",
          price: 539,
          durationMinutes: 105,
        },
      ],
    },
  },
  {
    slug: "archimedes-banya",
    name: "Archimedes Banya",
    address: "748 Innes Ave, San Francisco, CA 94124",
    website: "https://banyasf.com/",
    bookingUrl: "https://go.booker.com/location/ARCHIMEDESBANYASF/service-menu",
    bookingPlatform: "booker",
    // Booker provider disabled — available services (platza, hammam) are add-on
    // treatments, not general banya admission. Re-enable if admission booking is
    // added: locationSlug "ARCHIMEDESBANYASF", locationId 50873.
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
    markerIconOverride: "floating-sauna",
    address: "2320 Marinship Way, Sausalito, CA 94965",
    website: "https://www.thisisfjord.com/",
    bookingUrl: "https://www.zettlor.com/c/fjord",
    bookingPlatform: "zettlor",
    googleMapsUrl: "https://maps.app.goo.gl/BXAmzUXPz2gi8J3HA",
    sessionPrice: 45, // Shared session; Private $270
    sessionLengthMinutes: 90,
    steamRoom: false,
    coldPlunge: true, // Plunge into San Francisco Bay
    soakingTub: false,
    waterfront: true, // Floating on Richardson Bay
    naturalPlunge: true, // Bay plunge
    floating: true,
    showers: false, // No showers, must bring towels
    towelsIncluded: false, // Must bring 2 towels
    temperatureRangeF: { min: 180, max: 190 },
    hours: "Daily 8am-8:30pm, Tue 2pm-8:30pm",
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Unique floating sauna on SF Bay with two Finnish saunas and bay plunge. Shared sessions $45 (90 min, up to 8 ppl), Private $270 (2 hrs, up to 6), Full Buyout $2K half-day or $5K full-day. 5-pack $210. Sessions sell out fast—book when calendar opens. Must bring 2 towels, water, swimsuit. 4.9 stars. ~30 min from SF.",
    lat: 37.866355519413275,
    lng: -122.49567078054073,
    updatedAt: "2026-01-06",
    bookingProvider: {
      type: "zettlor",
      handle: "fjord",
      timezone: "America/Los_Angeles",
    },
  },
  {
    slug: "almonte-spa",
    name: "Almonte Spa",
    address: "158 Almonte Blvd, Mill Valley, CA 94941",
    website: "https://www.almontespa.com/",
    bookingUrl: "https://www.almontespa.com/book",
    bookingPlatform: "booker",
    bookingProvider: {
      type: "booker",
      locationSlug: "SI",
      locationId: 19061,
      timezone: "America/Los_Angeles",
      services: [
        {
          serviceId: 1318371,
          name: "Finnish Sauna - for 1 (30 min)",
          price: 35,
          durationMinutes: 30,
        },
        {
          serviceId: 3914467,
          name: "Finnish Sauna - for 1 (60 min)",
          price: 55,
          durationMinutes: 60,
        },
        {
          serviceId: 1400414,
          name: "Hot Tub - for 1 (30 min)",
          price: 35,
          durationMinutes: 30,
        },
      ],
    },
    googleMapsUrl: "https://maps.app.goo.gl/4c1sTy9dAZeBDLq16",
    sessionPrice: 35, // Finnish sauna 30 min; also $45/45min, $55/60min
    sessionLengthMinutes: 30,
    steamRoom: false,
    coldPlunge: false, // Cold showers only, no cold plunge pool
    soakingTub: true, // Outdoor hot tubs under the redwoods
    waterfront: false,
    naturalPlunge: false,
    showers: true,
    towelsIncluded: false,
    temperatureRangeF: { min: 190, max: 200 },
    hours: "Daily 10am-9pm",
    genderPolicy: "Private booking",
    clothingPolicy: "Private rooms",
    notes:
      "Marin County wellness sanctuary since 1978, nestled under redwoods near Muir Woods. Features private Finnish cedar sauna (190°F+) and infrared sauna. Outdoor hot tubs available separately ($35-55). Also offers massage services. Cold showers available for contrast therapy. 4.5 stars with 162 reviews. Voted Best in Marin.",
    lat: 37.8879632,
    lng: -122.5265786,
    updatedAt: "2026-01-06",
  },
  {
    slug: "good-hot-richmond",
    name: "Good Hot",
    address: "1950 Stenmark Dr, Richmond, CA 94801",
    website: "https://www.good-hot-booking.com/",
    bookingUrl: "https://www.good-hot-booking.com/book",
    bookingPlatform: "wix",
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
    bookingProvider: {
      type: "wix",
      siteUrl: "www.good-hot-booking.com",
      timezone: "America/Los_Angeles",
      services: [
        {
          serviceId: "c5c17895-bbde-4e4e-ad38-8a876b868730",
          name: "Sauna 1 - Circle Skylight",
          price: 110,
          durationMinutes: 90,
        },
        {
          serviceId: "6efce4a0-2bef-4d77-a785-3c886331b1cf",
          name: "Sauna 2 - Picture Window",
          price: 110,
          durationMinutes: 90,
        },
        {
          serviceId: "8569f2c2-124a-42b8-9716-16e57bee4a07",
          name: "Sauna 3 - Step Skylight",
          price: 110,
          durationMinutes: 90,
        },
        {
          serviceId: "d2e1d240-c496-41ff-b3fd-0341afd121ae",
          name: "Sauna 4 - Big View",
          price: 130,
          durationMinutes: 90,
        },
        {
          serviceId: "14bcb950-57de-499b-9454-772efb429096",
          name: "Sauna 5 - Big Sky",
          price: 130,
          durationMinutes: 90,
        },
      ],
    },
  },
  {
    slug: "dogpatch-paddle-sauna",
    name: "Dogpatch Paddle Sauna",
    address: "701 Illinois Street #A, San Francisco, CA 94107",
    website: "https://www.dogpatchpaddle.com/sauna",
    bookingUrl:
      "https://book.peek.com/s/2530f333-35eb-43fc-b661-6c7d3c95dfea/wqA07",
    bookingPlatform: "peek",
    bookingProvider: {
      type: "peek",
      key: "2530f333-35eb-43fc-b661-6c7d3c95dfea",
      programId: "wqA07",
      timezone: "America/Los_Angeles",
      activities: [
        {
          activityId: "052acf51-ff36-4fd8-a3a9-fffd5931181a",
          name: "Sauna (Public)",
          price: 25,
          durationMinutes: 60,
        },
      ],
    },
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
    sessionPrice: 49, // Communal bath admission
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
  // NOTE: Imperial Day Spa excluded - requires booking a treatment, no spa-only access
  // {
  //   slug: "imperial-day-spa-sf",
  //   name: "Imperial Day Spa",
  //   address: "1875 Geary Blvd, San Francisco, CA 94115",
  //   website: "https://imperialdayspa.com/",
  //   bookingUrl: "https://imperialdayspa.com/appointment/",
  //   googleMapsUrl: "https://maps.app.goo.gl/3TQZb5BhZwxN9Fxv7",
  //   sessionPrice: 90,
  //   sessionLengthMinutes: 120,
  //   steamRoom: true,
  //   coldPlunge: true,
  //   soakingTub: true,
  //   waterfront: false,
  //   naturalPlunge: false,
  //   showers: true,
  //   towelsIncluded: true,
  //   hours: "Mon-Thu 9am-8:45pm, Fri-Sun 8am-8:45pm",
  //   genderPolicy: "Separate men's and women's areas (gender identity respected)",
  //   clothingPolicy: "Nude required in spa areas",
  //   notes: "Authentic Korean jjimjilbang-style spa. Requires treatment booking - no spa-only access.",
  //   lat: 37.7839019,
  //   lng: -122.4342635,
  //   updatedAt: "2026-01-06",
  // },
  {
    slug: "the-springs-leavenworth",
    name: "The Springs",
    address: "200 Zelt Strasse, Leavenworth, WA 98826",
    website: "https://www.thesprings.us/",
    bookingUrl: "https://ecom.roller.app/thesprings/checkout/en-us/products",
    bookingPlatform: "roller",
    bookingProvider: {
      type: "roller",
      venueSlug: "thesprings",
      checkoutSlug: "checkout",
      timezone: "America/Los_Angeles",
    },
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
    bookingPlatform: "wix",
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
    bookingProvider: {
      type: "wix",
      siteUrl: "www.seatsusauna.com",
      timezone: "America/Los_Angeles",
      services: [
        {
          serviceId: "bae83ae4-6a83-45b2-a4fe-6012fbf399b8",
          name: "Community Session",
          price: 35,
          durationMinutes: 90,
        },
        {
          serviceId: "0eb6faf2-2649-4609-901a-a1eda92001ac",
          name: "Private Sauna (1-4 people)",
          price: 135,
          durationMinutes: 90,
          private: true,
          seats: 4,
        },
      ],
    },
  },
  {
    slug: "snow-peak-campfield",
    name: "Snow Peak Campfield Ofuro Spa",
    address: "5411 Sandridge Rd, Long Beach, WA 98631",
    website: "https://snowpeakcampfield.com/ofuro/",
    bookingUrl: "https://www.vagaro.com/spcpyc3/classes",
    bookingPlatform: "vagaro",
    bookingProvider: {
      type: "vagaro",
      businessSlug: "spcpyc3",
      businessId: "375772",
      region: "us05",
      timezone: "America/Los_Angeles",
      isClassBased: true,
      services: [
        {
          serviceId: 13880,
          name: "Ofuro Spa Day Guest Pass",
          price: 35,
          durationMinutes: 120,
        },
        {
          serviceId: 68079,
          name: "Ofuro Day Guest Adults Only",
          price: 35,
          durationMinutes: 120,
        },
      ],
    },
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
    bookingPlatform: "booker",
    bookingProvider: {
      type: "booker",
      locationSlug: "WatercourseWay",
      locationId: 49647,
      timezone: "America/Los_Angeles",
      services: [
        {
          serviceId: 3700085,
          name: "Eight Stars - 1 person (60 min, Mon-Thu)",
          price: 55,
          durationMinutes: 60,
        },
        {
          serviceId: 3901769,
          name: "Eight Stars - 1 person (60 min, Fri-Sun)",
          price: 60,
          durationMinutes: 60,
        },
        {
          serviceId: 3700079,
          name: "One Pine - 1 person (60 min, Mon-Thu)",
          price: 55,
          durationMinutes: 60,
        },
        {
          serviceId: 3901934,
          name: "One Pine - 1 person (60 min, Fri-Sun)",
          price: 60,
          durationMinutes: 60,
        },
        {
          serviceId: 3700080,
          name: "Two Stones - 1 person (60 min, Mon-Thu)",
          price: 55,
          durationMinutes: 60,
        },
        {
          serviceId: 3901950,
          name: "Two Stones - 1 person (60 min, Fri-Sun)",
          price: 60,
          durationMinutes: 60,
        },
      ],
    },
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
  {
    slug: "gather-sauna-house",
    name: "Gather Sauna House",
    address: "Riverbend Park, Bend, OR 97702",
    website: "https://www.gathersaunahouse.com/",
    bookingUrl: "https://www.gathersaunahouse.com/locations",
    bookingPlatform: "acuity",
    googleMapsUrl: "https://maps.app.goo.gl/dxnDXFy9y6dF9c1N8",
    sessionPrice: 40,
    sessionLengthMinutes: 90,
    steamRoom: false,
    coldPlunge: true, // Natural river cold plunge in Deschutes River
    soakingTub: false,
    waterfront: true, // On the Deschutes River
    naturalPlunge: true, // Deschutes River
    showers: true, // Rain and bucket showers
    towelsIncluded: false,
    hours: "Seasonal Oct-May (Riverside); Hanai Garden year-round",
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Traditional wood-fired sauna on the banks of the Deschutes River at Riverbend Park. Founded in 2019, focused on reconnecting with nature and community. Features natural river cold plunge. Also has year-round Hanai Sauna Garden location on Bend's Eastside with two wood-fired saunas and cold plunges. Public and private sessions available.",
    lat: 44.0548,
    lng: -121.2932,
    updatedAt: "2026-01-05",
    bookingProvider: {
      type: "acuity",
      owner: "5ce047b0",
      timezone: "America/Los_Angeles",
      appointmentTypes: [
        {
          acuityAppointmentId: 33194159,
          acuityCalendarId: 11295248,
          name: "Public Session - Riverbend",
          price: 45,
          durationMinutes: 75,
        },
        {
          acuityAppointmentId: 37714997,
          acuityCalendarId: 11295248,
          name: "Private Session - Riverbend",
          price: 250,
          durationMinutes: 75,
          private: true,
          seats: 12,
        },
        {
          acuityAppointmentId: 87599235,
          acuityCalendarId: 11295248,
          name: "Thermic Thursday Socials",
          price: 30,
          durationMinutes: 75,
        },
      ],
    },
  },
  {
    slug: "breitenbush-hot-springs",
    name: "Breitenbush Hot Springs",
    address: "53000 Breitenbush Rd SE, Detroit, OR 97342",
    website: "https://breitenbush.com/",
    bookingUrl: "https://breitenbush.com/visit/",
    googleMapsUrl: "https://maps.app.goo.gl/4kxYMQjmAWvUvKdK9",
    sessionPrice: 45, // Day use pass; verify on website
    steamRoom: true, // Geothermally-heated steam sauna
    coldPlunge: true, // Cold river available
    soakingTub: true, // Natural hot spring pools
    waterfront: true, // On Breitenbush River
    naturalPlunge: true, // Breitenbush River
    showers: true,
    towelsIncluded: false,
    hours: "Day use and overnight retreats available; reservations required",
    genderPolicy: "Co-ed",
    clothingPolicy: "Clothing optional",
    notes:
      "Historic retreat center in Willamette National Forest, ~60 miles east of Salem. Features natural hot spring-fed pools, geothermally-heated steam sauna, and cold river access. Operates off-grid using hydroelectric and geothermal power. Offers day passes, personal retreats, and workshops. Vegetarian meals included with overnight stays. Rebuilt after 2020 Santiam Fire.",
    lat: 44.7817,
    lng: -121.9778,
    updatedAt: "2026-01-05",
  },
  // ============================================================================
  // VANCOUVER, BC, CANADA
  // ============================================================================
  {
    slug: "kolm-kontrast",
    name: "Kolm Kontrast",
    address: "525 W 8th Ave, Vancouver, BC V5Z 1C6, Canada",
    website: "https://kolmkontrast.com/",
    bookingUrl: "https://kolmkontrast.com/schedule",
    googleMapsUrl: "https://maps.app.goo.gl/TAP17wVM5xfuGX2V6",
    sessionPrice: 45,
    currency: "CAD",
    sessionLengthMinutes: 75,
    steamRoom: false,
    coldPlunge: true, // Ice baths
    soakingTub: false,
    waterfront: false,
    naturalPlunge: false,
    showers: true,
    towelsIncluded: true, // 2 towels provided
    hours: "Daily, check schedule for session times",
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Immersive Nordic spa experience at Cambie & 8th. Features dry sauna, ice baths, and tea lounge. Four session styles: Self Guided, Classes (aromatherapy, breathwork, meditation), After Hours (social), and Silent Self Guided. 4.9 stars with 654 reviews. LGBTQ+ friendly, women-owned.",
    lat: 49.2643689,
    lng: -123.1156152,
    updatedAt: "2026-01-05",
  },
  {
    slug: "aetherhaus",
    name: "AetherHaus",
    address: "1768 Davie St, Vancouver, BC V6G 1W2, Canada",
    website: "https://www.aetherhaus.ca/",
    bookingUrl: "https://www.aetherhaus.ca/buy-pass",
    googleMapsUrl: "https://maps.app.goo.gl/MUKWDi3PgxADvKnu7",
    sessionPrice: 45,
    currency: "CAD",
    sessionLengthMinutes: 90,
    steamRoom: false,
    coldPlunge: true, // Group cold plunge pools at 2 temperature ranges
    soakingTub: false,
    waterfront: false,
    naturalPlunge: false,
    showers: true,
    towelsIncluded: true, // 2 towels per guest
    hours: "Daily, check schedule for session times",
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "European-inspired sauna blending Slavic & Nordic culture. Features Himalayan salt sauna, group cold plunge pools at 2 temperatures, and tea lounge. Offers Open Haus (self-guided), Haus Sessions (semi-guided with Aufguss rituals, Yin Yoga, Sound Journeys), and special events. Phone-free space. 4.9 stars with 284 reviews. Valet parking available.",
    lat: 49.2847,
    lng: -123.1407,
    updatedAt: "2026-01-05",
  },
  {
    slug: "the-good-sauna-vancouver",
    name: "The Good Sauna (Vancouver)",
    address:
      "Container Brewing, 1216 Franklin St, Vancouver, BC V6A 1K1, Canada",
    website: "https://www.thegoodsauna.com/",
    bookingUrl: "https://www.thegoodsauna.com/book-a-session",
    sessionPrice: 35,
    currency: "CAD",
    sessionLengthMinutes: 90,
    steamRoom: false,
    coldPlunge: true,
    soakingTub: false,
    waterfront: false,
    naturalPlunge: false,
    showers: true,
    towelsIncluded: false,
    hours: "Check website for session times",
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Outdoor community sauna experience at Container Brewing. Community sessions (up to 10 people), Private sessions, and Express sessions available. Post-sauna beer in the taproom. 4.9 stars with 222 reviews. Also has locations in Port Moody (coming soon) and UK.",
    lat: 49.2725,
    lng: -123.0847,
    updatedAt: "2026-01-05",
  },
  {
    slug: "hastings-spa",
    name: "Hastings Spa",
    address: "766 E Hastings St, Vancouver, BC V6A 1R5, Canada",
    website: "https://hastingsspa.com/",
    bookingUrl:
      "https://squareup.com/appointments/book/p860or5934mejb/Y9NQRV2CZP0BT/services",
    bookingPlatform: "square",
    bookingProvider: {
      type: "square",
      widgetId: "p860or5934mejb",
      locationToken: "Y9NQRV2CZP0BT",
      timezone: "America/Vancouver",
    },
    sessionPrice: 37,
    currency: "CAD",
    sessionLengthMinutes: 90,
    steamRoom: true, // Steam plus saunas available
    coldPlunge: false,
    soakingTub: false,
    waterfront: false,
    naturalPlunge: false,
    showers: true,
    towelsIncluded: true,
    hours: "Thu-Mon 11am-11pm, Wed 12pm-11pm, Tue Closed",
    genderPolicy: "Co-ed",
    clothingPolicy: "Private rooms",
    notes:
      "Vancouver's oldest spa, established 1926. Private sauna rooms with high heat dry saunas, steam plus saunas, and hybrid infrared suites. 1 person $37, 2 person $67, 3 person $99, 4 person $120 (1.5 hrs). Also offers massage, reflexology, and couples packages. 4.7 stars with 463 reviews.",
    lat: 49.2815,
    lng: -123.0825,
    updatedAt: "2026-01-05",
  },
  {
    slug: "mist-thermal-sanctuary",
    name: "Mist Thermal Sanctuary",
    address: "Bowen Island, BC, Canada",
    website: "https://www.mistthermal.com/",
    bookingUrl: "https://mistthermalsanctuary.as.me/",
    bookingPlatform: "acuity",
    sessionPrice: 199,
    currency: "CAD",
    sessionLengthMinutes: 90,
    steamRoom: false,
    coldPlunge: true,
    soakingTub: true, // Transition tub
    waterfront: false,
    naturalPlunge: false,
    showers: true, // Outdoor hot/cold shower
    towelsIncluded: false,
    temperatureRangeF: { min: 170, max: 200 },
    hours: "Check booking calendar for availability",
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Private forested Nordic spa circuits on Bowen Island, 20-min ferry from Horseshoe Bay. Wood-burning sauna, cold plunge tub, transition tub, outdoor fire lounge. 90 min CA$199, 120 min CA$249 (1-2 people). Private change hut with tea bar. Next to Nectar Yoga Retreat. Featured in BC Living and CTV News.",
    lat: 49.3833,
    lng: -123.3333,
    updatedAt: "2026-01-05",
    bookingProvider: {
      type: "acuity",
      owner: "e382c61c",
      timezone: "America/Vancouver",
      appointmentTypes: [
        {
          acuityAppointmentId: 69916653,
          acuityCalendarId: "any",
          name: "Mist Experience (90 min)",
          price: 199,
          durationMinutes: 90,
        },
        {
          acuityAppointmentId: 74108106,
          acuityCalendarId: "any",
          name: "Mist Experience (120 min)",
          price: 249,
          durationMinutes: 120,
        },
      ],
    },
  },
  {
    slug: "jericho-beach-seaside-sauna",
    name: "Jericho Beach Seaside Sauna",
    address: "Jericho Sailing Centre, Vancouver, BC, Canada",
    website:
      "https://www.thefinnishsauna.ca/service-page/jericho-beach-seaside-sauna-social",
    bookingUrl:
      "https://www.thefinnishsauna.ca/booking-calendar/jericho-beach-seaside-sauna-social?referral=service_list_widget",
    bookingPlatform: "wix",
    sessionPrice: 36,
    currency: "CAD",
    sessionLengthMinutes: 105,
    steamRoom: false,
    coldPlunge: true, // Ocean cold plunge at Jerry's Cove
    soakingTub: false,
    waterfront: true, // Oceanside at Jericho Beach
    naturalPlunge: true, // Ocean access
    showers: true, // Freshwater rinse showers
    towelsIncluded: false, // Bring two towels
    hours: "Seasonal winter pop-up, check schedule for session times",
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Seasonal ocean-side wood-fired sauna pop-up at Jericho Sailing Centre. Shared sessions for up to 9 people, CA$36/1hr45min. Ocean cold plunge at Jerry's Cove, freshwater rinse showers, covered rest area. Outdoor changing rooms and indoor washrooms. Collaboration between Windsure Adventure Watersports, Tality Wellness, and The Finnish Sauna Co.",
    lat: 49.27556069996275,
    lng: -123.20116604338386,
    updatedAt: "2026-02-18",
    bookingProvider: {
      type: "wix",
      siteUrl: "www.thefinnishsauna.ca",
      timezone: "America/Vancouver",
      services: [
        {
          serviceId: "ba313794-9e17-4202-a544-3167e54419c3",
          name: "Seaside Sauna Social",
          price: 36,
          durationMinutes: 105,
        },
      ],
    },
  },
  // ============================================================================
  // VANCOUVER ISLAND, BC
  // ============================================================================
  {
    slug: "havn-harbour-sauna",
    name: "HAVN Harbour Sauna",
    address: "920 Wharf St, Victoria, BC V8W 1T3, Canada",
    website: "https://www.havnsaunas.com/",
    bookingUrl: "https://www.havnsaunas.com/book",
    bookingPlatform: "checkfront",
    bookingProvider: {
      type: "checkfront",
      baseUrl: "https://havn-saunas.checkfront.com",
      timezone: "America/Vancouver",
      items: [
        {
          itemId: 178,
          name: "Book a Visit (3 Hours)",
          price: 94,
          durationMinutes: 180,
        },
        {
          itemId: 179,
          name: "Late Night 2-Hour Booking",
          price: 84,
          durationMinutes: 120,
        },
      ],
    },
    googleMapsUrl: "https://maps.app.goo.gl/tMQ7JM7VZ2VWLD8y6",
    sessionPrice: 94,
    currency: "CAD",
    sessionLengthMinutes: 180,
    steamRoom: false,
    coldPlunge: true, // 2 cold plunge pools
    soakingTub: true, // 2 hot mineral tubs
    waterfront: true, // Floating in Victoria's Inner Harbour
    naturalPlunge: false,
    floating: true,
    showers: true,
    towelsIncluded: true, // Plush robe and towels included
    servesFood: true, // Light food and beverage service in lounge
    temperatureRangeF: { min: 160, max: 200 },
    hours: "Fri-Mon 8am-Close, Tue-Thu 9am-Close",
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Floating wellness sanctuary in Victoria's Inner Harbour. 3 saunas (varying temps, 2 with löyly, 1 dry), 2 cold pools, 2 hot mineral tubs, exfoliation shower with salt scrub. Robes, towels, premium skincare included. Late night 2hr booking CA$84. 5-punch pass CA$425. Phone-free facility. 19+ only.",
    lat: 48.4236,
    lng: -123.3683,
    updatedAt: "2026-01-05",
  },
  {
    slug: "ritual-nordic-spa",
    name: "RITUAL Nordic Spa",
    address: "989 Johnson St #101, Victoria, BC V8V 0E3, Canada",
    website: "https://ritualnordicspa.com/",
    bookingUrl: "https://ritualnordicspa.zenoti.com/webstorenew",
    bookingPlatform: "zenoti",
    bookingProvider: {
      type: "zenoti",
      subdomain: "ritualnordicspa",
      centerId: "442384e8-d2be-4a5e-b235-4f1224cfbc2d",
      timezone: "America/Vancouver",
      services: [
        {
          serviceId: "39294234-1dbf-4c90-9787-ca9eb18a814f",
          name: "Nordic Circuit - Midweek 2HR",
          price: 59,
          durationMinutes: 120,
        },
        {
          serviceId: "2c5fdc34-ccba-400d-87da-7bf0e436388e",
          name: "Nordic Circuit - Weekend 2HR",
          price: 69,
          durationMinutes: 120,
        },
      ],
    },
    googleMapsUrl: "https://maps.app.goo.gl/Q8X9e7VQnLkj2fxr5",
    sessionPrice: 59,
    currency: "CAD",
    sessionLengthMinutes: 120,
    steamRoom: true,
    coldPlunge: true, // Indoor cold plunge pool at 9°C
    soakingTub: false,
    waterfront: false,
    naturalPlunge: false,
    showers: true, // Nordic showers, rinse station, bucket shower
    towelsIncluded: true,
    temperatureRangeF: { min: 160, max: 200 },
    hours: "Open 7 days, 7:30am weekdays (Tue 2-9pm)",
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "First Nordic spa on Vancouver Island. Indoor cold plunge (9°C), 4 saunas (Finnish & infrared), steam room, Himalayan salt lounge, Nordic showers, outdoor patios. 2hr circuit $59 midweek, $69 weekends. 1hr EarlyBird/NiteOwl $40. Wed 3:30pm+ female-only. Tue eves Silent Sauna. Private suites available. 18+.",
    lat: 48.4284,
    lng: -123.3656,
    updatedAt: "2026-01-05",
  },
  {
    slug: "sea-edge-sauna",
    name: "Sea Edge Sauna",
    address: "209 Island Hwy W, Parksville, BC V9P 1K8, Canada",
    website: "https://www.thefinnishsauna.ca/sea-edge-sauna",
    googleMapsUrl: "https://maps.app.goo.gl/6YhNcvZy3Nmuerh26",
    bookingUrl:
      "https://www.thefinnishsauna.ca/bookings?category=e7a79865-03c4-48ce-8c0c-15461f872892",
    bookingPlatform: "wix",
    sessionPrice: 40,
    currency: "CAD",
    sessionLengthMinutes: 90,
    steamRoom: false,
    coldPlunge: true, // Ocean cold plunge
    soakingTub: false,
    waterfront: true, // Oceanfront at Sea Edge Beachside Hotel
    naturalPlunge: true, // Ocean access
    showers: true,
    towelsIncluded: false,
    temperatureRangeF: { min: 170, max: 200 },
    hours: "Check schedule for session times",
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Oceanfront Finnish sauna at Sea Edge Beachside Hotel in Parksville. 11-12 person electric sauna with ocean cold plunge access. Communal sessions CA$40/90min, private CA$370. 25% off for Evergreen property guests. 5/5 stars. Operated by The Finnish Sauna Co.",
    lat: 49.32266548355333,
    lng: -124.31835823099492,
    updatedAt: "2026-01-05",
    bookingProvider: {
      type: "wix",
      siteUrl: "www.thefinnishsauna.ca",
      timezone: "America/Vancouver",
      services: [
        {
          serviceId: "8720ff8a-e714-4e58-9a35-3687ad7af0a1",
          name: "Sauna Social",
          price: 40,
          durationMinutes: 90,
        },
      ],
    },
  },
  {
    slug: "the-lost-faucet",
    name: "The Lost Faucet Sauna House",
    address: "3455 Cumberland Rd, Courtenay, BC V9N 9N6, Canada",
    website: "https://thelostfaucet.com/",
    bookingUrl:
      "https://square.site/book/A3DZSYC1ZD77J/the-lost-faucet-courtenay-bc",
    bookingPlatform: "square",
    bookingProvider: {
      type: "square",
      widgetId: "nraxk8eafyr8nl",
      locationToken: "A3DZSYC1ZD77J",
      timezone: "America/Vancouver",
    },
    googleMapsUrl: "https://maps.app.goo.gl/mxJDKJa5kPv6VFEZ7",
    sessionPrice: 38,
    currency: "CAD",
    sessionLengthMinutes: 105,
    steamRoom: false,
    coldPlunge: true, // Cold plunge add-on available
    soakingTub: false,
    waterfront: false,
    naturalPlunge: false,
    showers: true,
    towelsIncluded: true, // 2 complimentary towels
    temperatureRangeF: { min: 185, max: 195 }, // 85-90°C
    hours: "Mon/Wed/Fri Social Sauna, Thu Women's Night",
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Traditional Eastern European-style sauna house modeled after Finnish, Banya, and German public saunas. Social Sauna CA$38/1hr45min. Banya Experience with whisking CA$310-390. Deluxe Circuit CA$320-420. Infrared room, wet area, rest spaces. Aufguss ritual included. 30 min from Mt Washington. 5.0 stars (162 reviews).",
    lat: 49.6836,
    lng: -125.0298,
    updatedAt: "2026-01-05",
  },
  {
    slug: "nyubu-nordic-spa",
    name: "NYÜBU - West Coast Nordic Spa",
    address: "2795 Meadowview Rd, Shawnigan Lake, BC V0R 2W0, Canada",
    website: "https://nyubu.com/",
    bookingUrl: "https://fareharbor.com/embeds/book/nyubu/?full-items=yes",
    bookingPlatform: "fareharbor",
    bookingProvider: {
      type: "fareharbor",
      shortname: "nyubu",
      timezone: "America/Vancouver",
      items: [
        { itemPk: 497244, name: "Community Spa Session", price: 30, durationMinutes: 90 },
        { itemPk: 497276, name: "Private Spa Session", price: 270, durationMinutes: 90, private: true, seats: 10 },
      ],
    },
    googleMapsUrl: "https://maps.app.goo.gl/bq4BvBhhtuYgAoFa7",
    sessionPrice: 30,
    currency: "CAD",
    sessionLengthMinutes: 90,
    steamRoom: false,
    coldPlunge: true, // Cold plunge, dunk bucket, outdoor shower
    soakingTub: false,
    waterfront: false,
    naturalPlunge: false,
    showers: true, // Outdoor shower
    towelsIncluded: false, // Bring your own
    temperatureRangeF: { min: 170, max: 200 },
    hours: "Check booking calendar for availability",
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Cowichan Valley's first West Coast Nordic Spa. 10-person cedar wood barrel sauna (custom by Wildwood Saunas), cold plunge, dunk bucket, covered fire bowl rest area. Community CA$30/90min, Private CA$270/90min. 5-punch CA$130, 10-punch CA$250, Membership CA$190/mo. 40 min from Victoria, 30 min to Duncan.",
    lat: 48.6447,
    lng: -123.6328,
    updatedAt: "2026-01-05",
  },
  {
    slug: "island-sauna-black-creek",
    name: "Island Sauna (Black Creek)",
    address: "Black Creek, BC, Canada",
    website: "https://www.islandsauna.ca/",
    bookingUrl:
      "https://book.peek.com/s/6182797e-e84c-474f-bdb6-261fd070df1e/N3xJ8",
    bookingPlatform: "peek",
    bookingProvider: {
      type: "peek",
      key: "6182797e-e84c-474f-bdb6-261fd070df1e",
      programId: "N3xJ8",
      timezone: "America/Vancouver",
      activities: [
        {
          activityId: "b2467d5b-61b0-42c2-be8c-222c2a18ae78",
          name: "Social Sauna Session",
          price: 38,
          durationMinutes: 120,
        },
        {
          activityId: "ccc760b7-5367-4827-a274-7803ff2c3a53",
          name: "Private Sauna Session",
          price: 190,
          durationMinutes: 120,
          private: true,
          seats: 2,
        },
      ],
    },
    sessionPrice: 38, // CA$37.50 rounded up
    currency: "CAD",
    sessionLengthMinutes: 120,
    steamRoom: false,
    coldPlunge: true, // 5 ice plunge tubs ranging from outdoor temp to -5°C
    soakingTub: false,
    waterfront: true, // Creekside location
    naturalPlunge: false,
    showers: true, // Hot shower
    towelsIncluded: false,
    temperatureRangeF: { min: 170, max: 200 },
    hours: "Check schedule for session times",
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Two wood-fired mobile saunas creekside with 5 ice plunge tubs (-5°C to outdoor temp), hot shower, firepit lounge. Social sessions CA$37.50/2hrs. Private CA$190 for 2 (+CA$20/person). Ladies Night and Singles Night available. Aufguss at 15min and 1hr15min. 4.9 stars.",
    lat: 49.785,
    lng: -125.12,
    updatedAt: "2026-01-06",
  },
  {
    slug: "island-sauna-nanaimo",
    name: "Island Sauna (Nanaimo)",
    address: "Inn On Long Lake, Nanaimo, BC, Canada",
    website: "https://www.islandsauna.ca/",
    bookingUrl:
      "https://book.peek.com/s/6182797e-e84c-474f-bdb6-261fd070df1e/0lYdX",
    bookingPlatform: "peek",
    bookingProvider: {
      type: "peek",
      key: "6182797e-e84c-474f-bdb6-261fd070df1e",
      programId: "0lYdX",
      timezone: "America/Vancouver",
      activities: [
        {
          activityId: "b0000fa1-6a63-4dde-8b77-d064dad8bb7f",
          name: "Social Sauna Session",
          price: 35,
          durationMinutes: 90,
        },
        {
          activityId: "a2e6c68f-c8d9-4e6f-8d8a-5726337748d4",
          name: "Private Sauna Session",
          price: 190,
          durationMinutes: 90,
          private: true,
          seats: 2,
        },
      ],
    },
    sessionPrice: 35, // CA$35 for social session
    currency: "CAD",
    sessionLengthMinutes: 90,
    steamRoom: false,
    coldPlunge: true, // Ice filled cold plunge tubs
    soakingTub: false,
    waterfront: true, // Lakeside
    naturalPlunge: false,
    showers: false,
    towelsIncluded: false,
    temperatureRangeF: { min: 170, max: 200 },
    hours: "Check schedule for session times",
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Mobile sauna lakeside at Inn On Long Lake. Ice-filled cold plunge tubs (outdoor temp to -2°C), firepit lounge. Social sessions CA$35/90min. Private CA$175-190 for 2 (+CA$20/person). Birthday person free with 7+ group. Perfect for parties and events.",
    lat: 49.1666,
    lng: -124.037,
    updatedAt: "2026-01-06",
  },
  {
    slug: "tuff-city-saunas-pacific-sands",
    name: "Tuff City Saunas (Pacific Sands)",
    address: "1421 Pacific Rim Hwy, Tofino, BC V0R 2Z0, Canada",
    website: "https://tuffcitysaunas.com/",
    bookingUrl:
      "https://book.peek.com/s/cb68db65-f54b-43a1-b5d6-3d11dd60c422/4X0Ax",
    bookingPlatform: "peek",
    bookingProvider: {
      type: "peek",
      key: "cb68db65-f54b-43a1-b5d6-3d11dd60c422",
      programId: "4X0Ax",
      timezone: "America/Vancouver",
      activities: [
        {
          activityId: "20d17f93-39c1-4bb2-9c64-3bde93e291ad",
          name: "PRIVATE Beachfront Sauna #1",
          price: 199,
          durationMinutes: 120,
          private: true,
          seats: 6,
        },
        {
          activityId: "d6abdc08-959d-449c-a626-c03fa9f410af",
          name: "PRIVATE Beachfront Sauna #2",
          price: 199,
          durationMinutes: 120,
          private: true,
          seats: 6,
        },
      ],
    },
    googleMapsUrl:
      "https://www.google.com/maps/place/Pacific+Sands+Beach+Resort/@49.1066474,-125.8729172,17z",
    sessionPrice: 199, // CA$199 for private 2hr session (up to 6 people)
    currency: "CAD",
    sessionLengthMinutes: 120,
    steamRoom: false,
    coldPlunge: false, // Cold shower only, not plunge
    soakingTub: false,
    waterfront: true, // Beachfront at Cox Bay
    naturalPlunge: false,
    showers: true, // Cold shower for cold-water-therapy
    towelsIncluded: false,
    temperatureRangeF: { min: 170, max: 200 },
    hours: "9am-9pm, booking required",
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Beachfront wood-fired cedar sauna at Pacific Sands Beach Resort overlooking Cox Bay. Private session for up to 6 people CA$199/2hrs weekday, CA$249/2hrs weekend. All-day rental available. Aromatherapy add-on. Cold shower, firewood included. Arrive ready to sauna (swimsuit on). Open to public and resort guests. 4.9 stars.",
    lat: 49.1066,
    lng: -125.8729,
    updatedAt: "2026-01-06",
  },
  {
    slug: "remote-floating-sauna-tofino",
    name: "Remote Floating Sauna",
    address: "634 Campbell St, Tofino, BC V0R 2Z0, Canada",
    website: "https://tofinoresortandmarina.com/remote-floating-sauna-dock/",
    bookingUrl:
      "https://fareharbor.com/embeds/book/tofinoresortandmarina/?full-items=yes&flow=1039132",
    bookingPlatform: "fareharbor",
    bookingProvider: {
      type: "fareharbor",
      shortname: "tofinoresortandmarina",
      timezone: "America/Vancouver",
      // Tofino Resort has many non-sauna activities (fishing, whale watching, etc.)
      // so we explicitly specify the sauna items
      items: [
        { itemPk: 492418, name: "Winter Floating Sauna Experience", price: 800, private: true, seats: 12 },
        { itemPk: 661714, name: "Community Floating Sauna Experience", price: 179 },
        { itemPk: 368145, name: "Spring + Summer Floating Sauna Experience", price: 1000, private: true, seats: 12 },
      ],
    },
    googleMapsUrl: "https://maps.app.goo.gl/wKtMwNTh4ahGiQzJ7",
    sessionPrice: 179, // CA$179/person community session (Sun/Wed)
    currency: "CAD",
    sessionLengthMinutes: 300, // 5 hours summer, 4 hours winter
    steamRoom: false,
    coldPlunge: false, // Ocean plunge counts as natural
    soakingTub: false,
    waterfront: true, // Floating in Clayoquot Sound
    naturalPlunge: true, // Pacific Ocean cold plunges
    floating: true,
    showers: false,
    towelsIncluded: true,
    temperatureRangeF: { min: 170, max: 200 },
    hours: "Summer: 8am + 2pm, Winter: 8am + 12:30pm",
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Unique floating wood-fired cedar sauna in Clayoquot Sound UNESCO Biosphere Reserve. 30-min boat ride to remote location. Cold plunges in Pacific Ocean. Private group of 4: CA$1000 summer, CA$800 winter (+CA$150/extra person up to 12). Community sessions for locals CA$179/person Sun/Wed. Includes paddleboards, kayaks, hammocks, fire pit. Year-round.",
    lat: 49.1498,
    lng: -125.8956,
    updatedAt: "2026-01-06",
  },
  // ============================================================================
  // WHISTLER, BC
  // ============================================================================
  {
    slug: "scandinave-spa-whistler",
    name: "Scandinave Spa Whistler",
    address: "8010 Mons Rd, Whistler, BC V8E 1K7, Canada",
    website: "https://www.scandinave.com/whistler/",
    bookingUrl:
      "https://scandinave.zenoti.com/webstoreNew/services/69bb2568-7d3c-4353-afc5-ad61c51bed79",
    bookingPlatform: "zenoti",
    bookingProvider: {
      type: "zenoti",
      subdomain: "scandinave",
      centerId: "69bb2568-7d3c-4353-afc5-ad61c51bed79",
      timezone: "America/Vancouver",
      services: [
        {
          serviceId: "17713992-c38c-401b-a381-428c707c3315",
          name: "Thermal Journey with Reservation",
          price: 138,
          durationMinutes: 120,
        },
      ],
    },
    googleMapsUrl: "https://maps.app.goo.gl/u9j8cDT5TySgqNrJ8",
    sessionPrice: 138,
    currency: "CAD",
    sessionLengthMinutes: 0, // No time limit once checked in
    steamRoom: true,
    coldPlunge: true,
    soakingTub: true, // Multiple hot pools
    waterfront: false,
    naturalPlunge: false,
    showers: true,
    towelsIncluded: true, // Robe rental, towels, locker included
    temperatureRangeF: { min: 160, max: 200 },
    hours: "Daily 9am-10pm",
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Iconic 25,000 sq ft outdoor thermal spa surrounded by old-growth rainforest and Coast Mountain views. Thermal circuit with hot/cold pools, saunas, steam rooms, and relaxation areas. Silence policy and digital detox. Walk-in from CA$118, reservation from CA$138. No time limit. Massages available.",
    lat: 50.1082,
    lng: -122.9359,
    updatedAt: "2026-01-05",
  },
  {
    slug: "meadow-park-sports-centre",
    name: "Meadow Park Sports Centre",
    address: "8625 BC-99, Whistler, BC V8E 1K1, Canada",
    website:
      "https://www.whistler.ca/parks-recreation-culture/meadow-park-sports-centre/",
    bookingUrl:
      "https://www.whistler.ca/parks-recreation-culture/meadow-park-sports-centre/",
    googleMapsUrl: "https://maps.app.goo.gl/Ryvt2WeRa92znkJK9",
    sessionPrice: 11, // CA$10.50 drop-in rounded up, all-day CA$15.75
    currency: "CAD",
    sessionLengthMinutes: 0, // Drop-in is single entry, no time limit
    steamRoom: true,
    coldPlunge: false, // Only hot tub
    soakingTub: true, // Hot tub
    waterfront: false,
    naturalPlunge: false,
    showers: true,
    towelsIncluded: false,
    temperatureRangeF: { min: 160, max: 180 },
    hours: "Daily 6am-9pm",
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Whistler's municipal recreation center with sauna, steam room, hot tub, 25m lap pool, and leisure pool. Very affordable: CA$10.50 drop-in (single entry), CA$15.75 all-day (re-entry). 10-visit pass CA$88. 4 km north of Whistler Village. 4.6 stars (604 reviews).",
    lat: 50.1445,
    lng: -122.9606,
    updatedAt: "2026-01-06",
  },
  // ============================================================================
  // SQUAMISH, BC
  // ============================================================================
  {
    slug: "cheekye-ranch-sauna",
    name: "Cheekye Ranch Sauna",
    address: "Cheekye Ranch, Squamish, BC, Canada",
    website: "https://www.thefinnishsauna.ca/squamish",
    bookingUrl:
      "https://www.thefinnishsauna.ca/booking-calendar/cheekye-ranch-sauna-social?referral=service_list_widget",
    bookingPlatform: "wix",
    googleMapsUrl: "https://maps.app.goo.gl/KU4dEmFnTw5Zfhz87",
    sessionPrice: 40,
    currency: "CAD",
    sessionLengthMinutes: 120,
    steamRoom: false,
    coldPlunge: true, // River access
    soakingTub: false,
    waterfront: true, // Beside glacier-fed river
    naturalPlunge: true, // Glacier-fed river just 10m away
    showers: false, // Off-grid, river bathing only
    towelsIncluded: false, // Bring your own towel
    temperatureRangeF: { min: 170, max: 200 },
    hours: "Check calendar - typically 2 days/week for drop-ins",
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Authentic off-grid 14-person Finnish-style mobile sauna on private ranch beside glacier-fed river. Social drop-ins CA$40/2hrs, private groups CA$450/2hrs. Heated changing tent, firepit, benches. Bring own towel, headlamp, and sandals. Pet-friendly. Operated by The Finnish Sauna Co. since 2019.",
    lat: 49.7976,
    lng: -123.1581,
    updatedAt: "2026-01-05",
    bookingProvider: {
      type: "wix",
      siteUrl: "www.thefinnishsauna.ca",
      timezone: "America/Vancouver",
      services: [
        {
          serviceId: "634ae6cc-5df4-4792-9a57-651938d4d306",
          name: "Sauna Social",
          price: 42,
          durationMinutes: 120,
        },
      ],
    },
  },
  // ============================================================================
  // SUNSHINE COAST, BC (Powell River area)
  // ============================================================================
  {
    slug: "orca-saunas-willingdon-beach",
    name: "Orca Saunas (Willingdon Beach)",
    address: "4845 Marine Ave, Powell River, BC V8A 2L2, Canada",
    website: "https://orcasaunas.com/",
    bookingUrl:
      "https://minside.periode.no/booking/aoy42QDbXlX69KNH6ook/HTj3APooRPh93WMtVFlq",
    bookingPlatform: "periode",
    googleMapsUrl: "https://maps.app.goo.gl/cWhMT1FsiK5YAWmG6",
    sessionPrice: 25, // CA$25 single session drop-in
    currency: "CAD",
    sessionLengthMinutes: 90,
    steamRoom: false,
    coldPlunge: false, // Ocean plunge counts as natural
    soakingTub: false,
    waterfront: true, // Oceanside on the beach
    naturalPlunge: true, // Salish Sea cold plunge
    showers: true, // Outdoor cold shower
    towelsIncluded: false,
    temperatureRangeF: { min: 160, max: 176 }, // Up to 80°C
    hours: "Seasonal - check booking calendar",
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Oceanside wood-fired cedar sauna at Willingdon Beach Park overlooking the Salish Sea. Drop-in CA$25/session, 5-pass CA$112, 10-pass CA$190, 20-pass CA$320, Season Pass CA$500. Private sessions from CA$175. West Coast contemporary design with panoramic ocean views. Cold plunge in the sea. Ladies and LGBTQ+ affinity sessions available. 5.0 stars.",
    lat: 49.8479,
    lng: -124.5314,
    updatedAt: "2026-01-06",
    bookingProvider: {
      type: "periode",
      merchantId: "aoy42QDbXlX69KNH6ook",
      timezone: "America/Vancouver",
      manifests: [
        {
          manifestId: "HTj3APooRPh93WMtVFlq",
          name: "Community Sauna",
          price: 25,
          durationMinutes: 75,
        },
      ],
    },
  },
  // ============================================================================
  // PEMBERTON, BC - EXCLUDED (no dry sauna)
  // ============================================================================
  // {
  //   slug: "sloquet-hot-springs",
  //   name: "Sloquet Hot Springs",
  //   address: "Sloquet Hot Springs, Pemberton, BC, Canada",
  //   website: "https://www.sloquethotsprings.ca/",
  //   notes:
  //     "EXCLUDED: NO DRY SAUNA. Natural hot springs in wilderness setting southeast of Pemberton. Features multiple soaking pools at various temperatures. Requires forest service road access. Beautiful but does not meet sauna criteria.",
  //   lat: 49.9123,
  //   lng: -122.6245,
  //   updatedAt: "2026-01-05",
  // },
  // ============================================================================
  // WASHINGTON LOCATIONS - EXCLUDED (no reliable day passes or no dry sauna)
  // ============================================================================
  // {
  //   slug: "doe-bay-resort",
  //   name: "Doe Bay Resort & Retreat",
  //   address: "107 Doe Bay Rd, Olga, WA 98279",
  //   website: "https://doebay.com/",
  //   bookingUrl: "https://doebay.com/spa-and-wellness/",
  //   googleMapsUrl: "https://maps.app.goo.gl/1BYE3K3BqXvMGQzQ9",
  //   sessionPrice: 0, // No reliable day pass pricing - off-site guests can only do private rentals
  //   steamRoom: false,
  //   coldPlunge: false,
  //   soakingTub: true, // Soaking tubs
  //   waterfront: true, // On Orcas Island waterfront
  //   naturalPlunge: false,
  //   showers: true,
  //   towelsIncluded: false,
  //   hours: "By reservation only",
  //   genderPolicy: "Co-ed",
  //   clothingPolicy: "Clothing optional",
  //   notes:
  //     "EXCLUDED: Has sauna and soaking tubs, but no reliable day passes. Off-site guests can only book exclusive private rentals on a 'last minute, mid-week' basis if vacancies allow. Communal sessions reserved for lodging guests only.",
  //   lat: 48.641199,
  //   lng: -122.780899,
  //   updatedAt: "2026-01-05",
  // },
  // {
  //   slug: "sol-duc-hot-springs",
  //   name: "Sol Duc Hot Springs Resort",
  //   address: "Sol Duc Hot Springs Rd, Olympic National Park, WA 98362",
  //   website: "https://www.olympicnationalparks.com/things-to-do/sol-duc-hot-springs-resort/",
  //   googleMapsUrl: "https://maps.app.goo.gl/5VQkPQzVB4oV5E9r6",
  //   sessionPrice: 19, // Adults per 1.5 hr session
  //   sessionLengthMinutes: 90,
  //   steamRoom: false,
  //   coldPlunge: false,
  //   soakingTub: true, // Three mineral hot spring pools (99-104°F) + freshwater pool
  //   waterfront: false,
  //   naturalPlunge: false,
  //   showers: true,
  //   towelsIncluded: false, // $5 rental
  //   hours: "Check schedule for pool hours",
  //   genderPolicy: "Co-ed",
  //   clothingPolicy: "Swimsuit required",
  //   notes:
  //     "EXCLUDED: NO DRY SAUNA. Only has mineral hot spring pools and freshwater pool. Beautiful Olympic National Park setting with hiking trails and Sol Duc Falls nearby. Pool access free for cabin guests. Seniors/Military/Children (4-11) $15.",
  //   lat: 47.9546,
  //   lng: -123.8627,
  //   updatedAt: "2026-01-05",
  // },
  // {
  //   slug: "carson-hot-springs",
  //   name: "Carson Hot Springs Resort",
  //   address: "372 St. Martin's Springs Road, Carson, WA 98610",
  //   website: "https://www.carsonresort.com/",
  //   bookingUrl: "https://psmsspa-northcentral.azurewebsites.net/#/en-US/carsonhotsprings/BC1",
  //   googleMapsUrl: "https://maps.app.goo.gl/D5mYvMPVB6bQdLrZ9",
  //   sessionPrice: 14, // Weekday pool pass; $19 Fri-Sun/holidays
  //   sessionLengthMinutes: 60,
  //   steamRoom: false,
  //   coldPlunge: false,
  //   soakingTub: true, // Mineral Therapy Pool (104°F) + clawfoot tub baths
  //   waterfront: false,
  //   naturalPlunge: false,
  //   showers: true,
  //   towelsIncluded: false,
  //   hours: "Mon-Thu 9am-9pm, Holidays/Fri-Sun 9am-9pm",
  //   genderPolicy: "Co-ed (18+)",
  //   clothingPolicy: "Swimsuit required",
  //   notes:
  //     "EXCLUDED: NO DRY SAUNA. 1930s bathhouse with mineral water clawfoot tubs, linen wraps, and public soaking pool. Despite FAQ mentioning 'Bathhouse, Sauna & Spa', no actual dry sauna is listed in services. Also has 18-hole golf course and restaurant.",
  //   lat: 45.7214,
  //   lng: -121.8167,
  //   updatedAt: "2026-01-05",
  // },
  // ============================================================================
  // MONTANA
  // ============================================================================
  {
    slug: "portal-bozeman",
    name: "PORTAL° Bozeman",
    address: "707 E Peach St, Bozeman, MT 59715",
    website: "https://www.portalthermaculture.com/bozeman",
    bookingUrl: "https://book.portalthermaculture.com/book-session",
    googleMapsUrl: "https://maps.app.goo.gl/PortalBozeman123",
    sessionPrice: 45,
    sessionLengthMinutes: 90,
    steamRoom: false,
    coldPlunge: true,
    soakingTub: false,
    waterfront: false,
    naturalPlunge: false,
    showers: true,
    towelsIncluded: false,
    temperatureRangeF: { min: 170, max: 200 },
    hours: "Coming Soon",
    genderPolicy: "Co-ed (18+)",
    clothingPolicy: "Swimsuit required",
    notes:
      "PORTAL° thermaculture club in Bozeman (coming soon). Same pricing as other PORTAL° locations: $45/session, credit packs available. Memberships work at all PORTAL° locations ($179/mo unlimited all clubs).",
    lat: 45.6778,
    lng: -111.0344,
    updatedAt: "2026-02-06",
  },
  {
    slug: "bozeman-hot-springs",
    name: "Bozeman Hot Springs",
    address: "81123 Gallatin Rd, Bozeman, MT 59718",
    website: "https://bozemanhotsprings.co/",
    googleMapsUrl: "https://maps.app.goo.gl/3tVq5Ry4Yvh7VJQZ8",
    sessionPrice: 21,
    sessionLengthMinutes: 0, // No time limit
    steamRoom: true, // Wet sauna
    coldPlunge: true, // 59°F cold pool
    soakingTub: true, // 12 hot pools up to 106°F
    waterfront: false,
    naturalPlunge: false,
    showers: true,
    towelsIncluded: false,
    servesFood: true, // On-site cafe
    temperatureRangeF: { min: 170, max: 200 },
    hours: "Daily, closes at 11pm (check website for opening times)",
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Historic natural hot springs since 1880s, 8 miles west of Bozeman near Big Sky. 12 pools (59-106°F), dry and wet saunas, fitness center, cafe, campground. Adults $21 weekday/$28 weekend, Seniors/Military $17/$21. Indoor pools drained nightly (no chemicals). Near Yellowstone and Big Sky Resort.",
    lat: 45.6478,
    lng: -111.2012,
    updatedAt: "2026-01-05",
  },
  // ============================================================================
  // MINNESOTA
  // ============================================================================
  {
    slug: "portal-minneapolis",
    name: "PORTAL° Minneapolis",
    address: "3120 Excelsior Blvd, Minneapolis, MN 55416",
    website: "https://www.portalthermaculture.com/minneapolis",
    bookingUrl: "https://book.portalthermaculture.com/book-session",
    googleMapsUrl: "https://maps.app.goo.gl/PortalMinneapolis123",
    sessionPrice: 45,
    sessionLengthMinutes: 90,
    steamRoom: false,
    coldPlunge: true,
    soakingTub: false,
    waterfront: false,
    naturalPlunge: false,
    showers: true,
    towelsIncluded: false,
    temperatureRangeF: { min: 170, max: 200 },
    hours: "Sun 8am-10pm, Mon-Wed 6am-10pm, Thu 12pm-10pm, Fri-Sat 8am-11pm",
    genderPolicy: "Co-ed (18+)",
    clothingPolicy: "Swimsuit required",
    notes:
      "PORTAL° thermaculture club in Minneapolis with saunas and cold plunges. Same pricing as other PORTAL° locations: $45/session, credit packs available. Memberships work at all PORTAL° locations ($179/mo unlimited all clubs).",
    lat: 44.9489,
    lng: -93.3159,
    updatedAt: "2026-02-06",
  },
  // ============================================================================
  // UTAH
  // ============================================================================
  {
    slug: "sauna-public-slc",
    name: "Sauna Public",
    address: "1952 E. 2700 S., Salt Lake City, UT 84106",
    website: "https://www.saunapublic.com/",
    bookingUrl: "https://booking.mangomint.com/saunapublic1",
    bookingPlatform: "mangomint",
    bookingProvider: {
      type: "mangomint",
      companyId: 386824,
      timezone: "America/Denver",
      services: [
        {
          serviceId: 23,
          name: "Day Pass",
          price: 35,
          durationMinutes: 120,
        },
      ],
    },
    googleMapsUrl: "https://maps.app.goo.gl/ggoiJKj2YDjFpxt37",
    sessionPrice: 35,
    sessionLengthMinutes: 0, // No time limit
    steamRoom: false,
    coldPlunge: true, // 45-50°F, largest in Utah
    soakingTub: false,
    waterfront: false,
    naturalPlunge: false,
    showers: true, // Private and public showers
    towelsIncluded: true,
    temperatureRangeF: { min: 190, max: 200 },
    hours: "M-F 6am-10pm, Sat-Sun 10am-10pm",
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Traditional Finnish-style sauna with largest cold plunge in Utah (45-50°F). Walk-ins welcome. $35 day pass (no time limit), 10-visit punch pass $250 (save $100). Weekly events include Chess Club Tuesdays ($15 off), yoga, and Sauna Sangha meditation. Unlimited membership $150/mo. Student discount available.",
    lat: 40.7089,
    lng: -111.8418,
    updatedAt: "2026-01-06",
  },
  {
    slug: "plunj-salt-lake",
    name: "PLUNJ Salt Lake",
    address: "55 W Utopia Ave #103, South Salt Lake, UT 84115",
    website: "https://saltlake.plunj.co/",
    bookingUrl: "https://saltlake.plunj.co/book-now/",
    googleMapsUrl: "https://maps.app.goo.gl/8Z4vQMJkY7FdZ7zZ9",
    sessionPrice: 35,
    sessionLengthMinutes: 60,
    steamRoom: false,
    coldPlunge: true, // 50°F
    soakingTub: false,
    waterfront: false,
    naturalPlunge: false,
    showers: true, // Bucket showers
    towelsIncluded: false,
    temperatureRangeF: { min: 194, max: 194 },
    hours: "Check website for schedule",
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Nordic bathhouse spa with communal sauna (194°F), cold pools (50°F), bucket showers, and lounge. Inspired by Finnish contrast therapy traditions. $35 drop-in (60 min), 10-visit punch pass $250. Memberships from $99/mo (4 sessions) to $225/mo unlimited. Group buyouts $250/hr (12 guests) or $375/2hrs (20 guests).",
    lat: 40.7118,
    lng: -111.8885,
    updatedAt: "2026-01-06",
  },
  {
    slug: "utah-lake-sauna",
    name: "Utah Lake Sauna",
    address: "Utah Lake State Park, Provo, UT",
    website: "https://www.utahlakesauna.com/",
    bookingUrl: "https://www.utahlakesauna.com/appointments",
    bookingPlatform: "acuity",
    googleMapsUrl: "https://maps.app.goo.gl/YnZ8XKZQ5Yvq1xZ7",
    sessionPrice: 36,
    sessionLengthMinutes: 75,
    steamRoom: false,
    coldPlunge: true, // Lake plunge
    soakingTub: false,
    waterfront: true, // Lakeside at Utah Lake State Park
    naturalPlunge: true, // Lake access
    showers: true, // Outdoor shower
    towelsIncluded: false,
    temperatureRangeF: { min: 170, max: 200 },
    hours: "Daily 6am-11pm",
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Utah Valley's first Nordic-style lakeside sauna at Utah Lake State Park near Provo. Communal Finnish sauna with panoramic lake views, Himalayan salt wall, outdoor shower, cold plunge in the lake, and relaxation area. $36 community session, $249 private booking (up to 8 guests). 2-session pass $69, 6-session $159, 10-session $199.",
    lat: 40.2338,
    lng: -111.7352,
    updatedAt: "2026-01-06",
    bookingProvider: {
      type: "acuity",
      owner: "1a980a7f",
      timezone: "America/Denver",
      appointmentTypes: [
        {
          acuityAppointmentId: 85865448,
          acuityCalendarId: 13077391,
          name: "Community Session",
          price: 36,
          durationMinutes: 75,
        },
      ],
    },
  },
  {
    slug: "huntsville-sauna",
    name: "Huntsville Sauna",
    address: "150 S 7400 E, Huntsville, UT 84317",
    website: "https://huntsvillesauna.com/",
    bookingUrl: "https://huntsvillesauna.com/booking-now",
    bookingPlatform: "acuity",
    sessionPrice: 36,
    sessionLengthMinutes: 75,
    steamRoom: false,
    coldPlunge: false,
    soakingTub: false,
    waterfront: false,
    naturalPlunge: false,
    showers: false,
    towelsIncluded: false,
    capacity: 6,
    hours: "Mon-Sun 6am-10pm",
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Traditional Nordic sauna in Huntsville, UT. 75-min sessions with 3-4 cycles of heat and cool. Self-service with door code sent 1 hour before session. BYOT. Single $36, 2-pack $69, 6-pack $139, 12-pack $199. Memberships: 4 sessions/mo $100, 8/mo $175, unlimited $199/mo.",
    lat: 41.26175827280718,
    lng: -111.76965785952436,
    updatedAt: "2026-02-18",
    bookingProvider: {
      type: "acuity",
      owner: "25fbe559",
      timezone: "America/Denver",
      appointmentTypes: [
        { acuityAppointmentId: 87622287, acuityCalendarId: 13332794, name: "Community Sauna Session", price: 36, durationMinutes: 60 },
      ],
    },
  },
  {
    slug: "soho-saunas",
    name: "Soho Saunas",
    address: "West Soldier Hollow Ln, Midway, UT 84049",
    website: "https://sohosaunas.com/",
    bookingUrl: "https://www.zettlor.com/c/sohosaunas",
    bookingPlatform: "acuity",
    googleMapsUrl: "https://maps.app.goo.gl/WJJqd5UxSn1twaYC6",
    sessionPrice: 38,
    sessionLengthMinutes: 120,
    steamRoom: false,
    coldPlunge: true,
    soakingTub: false,
    waterfront: false,
    naturalPlunge: false,
    showers: false,
    towelsIncluded: false,
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Japanese-inspired outdoor barrel sauna and cold plunge near Soldier Hollow in Heber Valley. Social sessions (2 hrs, per person), private barrel rental (up to 6 guests), and full venue rental (both saunas, up to 30 guests). Founded with a jichinsai groundbreaking ceremony honoring Japanese onsen traditions. Book through Zettlor.",
    lat: 40.4809,
    lng: -111.501,
    updatedAt: "2026-02-11",
    bookingProvider: {
      type: "acuity",
      owner: "d90563ca",
      timezone: "America/Denver",
      appointmentTypes: [
        {
          acuityAppointmentId: 84092048,
          acuityCalendarId: 12586589,
          name: "Sauna Session",
          price: 38,
          durationMinutes: 120,
          seats: 8,
        },
        {
          acuityAppointmentId: 87591104,
          acuityCalendarId: 12586589,
          name: "Private Barrel Rental",
          price: 0,
          durationMinutes: 120,
          private: true,
          seats: 1,
        },
      ],
    },
  },
  // ============================================================================
  // COLORADO
  // ============================================================================
  {
    slug: "portal-denver",
    name: "PORTAL° Denver",
    address: "2949 Federal Blvd, Denver, CO 80211",
    website: "https://www.portalthermaculture.com/denver",
    bookingUrl:
      "https://book.portalthermaculture.com/book-session?region=2&location=2",
    googleMapsUrl: "https://maps.app.goo.gl/XWWQnCPtH9iSC8Un7",
    sessionPrice: 45,
    sessionLengthMinutes: 90,
    steamRoom: false,
    coldPlunge: true, // 3 individual cold plunge tubs
    soakingTub: false,
    waterfront: false,
    naturalPlunge: false,
    showers: true, // Rinse stations
    towelsIncluded: false, // Available to rent
    temperatureRangeF: { min: 170, max: 200 },
    hours: "Sun 8am-10pm, M/W-F 7am-10pm, Tue 2pm-10pm, Sat 8am-10pm",
    genderPolicy: "Co-ed (18+)",
    clothingPolicy: "Swimsuit required",
    notes:
      "Outdoor thermaculture club in LoHi neighborhood featuring 2 saunas and 3 individual cold plunge tubs. Part of Nurture wellness marketplace. $45 single session, 4-credit pack $120, 8-credit pack $220. Memberships from $99/mo (4 credits) to $129/mo (unlimited Denver). Contrast therapy: 15 min heat, 3 min cold, repeat 3x.",
    lat: 39.7595,
    lng: -105.0258,
    updatedAt: "2026-01-06",
  },
  {
    slug: "portal-boulder",
    name: "PORTAL° Boulder",
    address: "4949 Broadway #113, Boulder, CO 80304",
    website: "https://www.portalthermaculture.com/boulder",
    bookingUrl: "https://book.portalthermaculture.com/book-session",
    googleMapsUrl: "https://maps.app.goo.gl/BoulderPortal123",
    sessionPrice: 45,
    sessionLengthMinutes: 90,
    steamRoom: false,
    coldPlunge: true,
    soakingTub: false,
    waterfront: false,
    naturalPlunge: false,
    showers: true,
    towelsIncluded: false,
    temperatureRangeF: { min: 170, max: 200 },
    hours: "Sun 10am-10pm, Mon-Fri 4pm-10pm, Sat 10am-10pm",
    genderPolicy: "Co-ed (18+)",
    clothingPolicy: "Swimsuit required",
    notes:
      "PORTAL° thermaculture club in Boulder with saunas and cold plunges. Same pricing as Denver: $45/session, credit packs available. Memberships work at all PORTAL° locations ($179/mo unlimited all clubs).",
    lat: 40.0509,
    lng: -105.2517,
    updatedAt: "2026-01-06",
  },
  {
    slug: "garden-sauna-denver",
    name: "Garden Sauna",
    address: "1407 N Ogden St, Denver, CO 80218",
    website: "https://www.gardensaunadenver.com/",
    bookingUrl: "https://www.gardensaunadenver.com/book-now",
    googleMapsUrl: "https://maps.app.goo.gl/GardenSaunaDenver123",
    sessionPrice: 33,
    sessionLengthMinutes: 60,
    steamRoom: false,
    coldPlunge: true,
    soakingTub: false,
    waterfront: false,
    naturalPlunge: false,
    showers: true,
    towelsIncluded: false,
    temperatureRangeF: { min: 170, max: 200 },
    hours:
      "Sun 9am-9pm, Mon/Wed 4pm-9pm, Tue/Thu/Fri 7am-1pm & 3pm-9pm, Sat 9am-9pm",
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Community-centered dry sauna and cold plunge in Denver. New client intro $23, regular drop-in $33 (1 hour). 5-pack $145, 10-pack $260. Memberships: 6x/mo $122, 9x/mo $149, unlimited $189. Shared space designed for quiet reflection and gentle connection. Enter through Rooted Heart Yoga.",
    lat: 39.7419,
    lng: -104.9706,
    updatedAt: "2026-01-06",
  },
  {
    slug: "lake-steam-baths",
    name: "Lake Steam Baths",
    address: "3540 W Colfax Ave, Denver, CO 80204",
    website: "https://www.lakesteam.com/",
    bookingPlatform: "envision",
    googleMapsUrl: "https://maps.app.goo.gl/DijMA1Aq3KAGnSuj9",
    sessionPrice: 32,
    steamRoom: true,
    coldPlunge: true,
    soakingTub: true, // Hot tub included
    waterfront: false,
    naturalPlunge: false,
    showers: true,
    towelsIncluded: false,
    hours: "Mon 8:30am-9pm, Tue closed, Wed 8:30am-10pm, Thu 8:30am-9pm, Fri 8:30am-10pm, Sat 8:30am-10pm, Sun 6am-9pm",
    genderPolicy: "Co-ed",
    clothingPolicy: "Nude",
    notes:
      "Historic Russian bathhouse operating since 1927. $32 admission includes unlimited access to hot tub, steam room, dry sauna, showers, and cold plunge. Affordable add-on services: salt scrubs ($10), massage ($35/55min, $52/80min), reflexology ($18/30min), detox foot baths ($20/30min).",
    lat: 39.74019517146539,
    lng: -105.03420445995344,
    updatedAt: "2026-02-26",
  },
  {
    slug: "r3-spa",
    name: "R3 Spa",
    address: "2805 S Broadway, Englewood, CO 80113",
    website: "https://www.r3experience.com/",
    bookingUrl: "https://www.r3experience.com/booking-calendar/sauna-cold-plunge-session",
    bookingPlatform: "wix",
    googleMapsUrl: "https://maps.app.goo.gl/2UpansqpxQZXUTK49",
    sessionPrice: 35,
    sessionLengthMinutes: 60,
    steamRoom: false,
    coldPlunge: true, // 3 cold plunge temperatures
    soakingTub: false,
    waterfront: false,
    naturalPlunge: false,
    showers: true,
    towelsIncluded: true,
    temperatureRangeF: { min: 190, max: 190 },
    hours: "Mon/Tue/Thu/Fri/Sat 7am-10pm, Wed closed, Sun closed",
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Clean, alcohol-free Finnish sauna and cold plunge studio. 190°F Finnish sauna with 3 cold plunge temperatures. $35 drop-in (60 min), towels included. Session packs: $20/session. Unlimited membership $125/mo.",
    lat: 39.665618894957504,
    lng: -104.98821795997937,
    updatedAt: "2026-02-26",
    bookingProvider: {
      type: "wix",
      siteUrl: "www.r3experience.com",
      timezone: "America/Denver",
      services: [
        {
          serviceId: "173e870c-7c72-4f12-92c7-89ba1863c3d2",
          name: "Sauna + Cold Plunge Session",
          price: 35,
          durationMinutes: 60,
        },
      ],
    },
  },
  {
    slug: "hooga-house",
    name: "Hooga House",
    address: "16305 S Golden Rd Unit C, Golden, CO 80401",
    website: "https://www.hoogahouse.co/",
    bookingUrl: "https://www.hoogahouse.co/booking-calendar/contrast-therapy-booking",
    bookingPlatform: "wix",
    googleMapsUrl: "https://maps.app.goo.gl/b5vXG4hWa19LvhTs8",
    sessionPrice: 45,
    sessionLengthMinutes: 90,
    steamRoom: false,
    coldPlunge: true, // Blue Cube cold plunges at 37-45°F
    soakingTub: false,
    waterfront: false,
    naturalPlunge: false,
    showers: false,
    towelsIncluded: false,
    temperatureRangeF: { min: 150, max: 195 },
    hours: "Mon-Fri 7am-10am & 1pm-9pm, Sat-Sun 7am-7pm",
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Outdoor contrast therapy wellness center in Golden. Features traditional dry sauna and infrared sauna with Blue Cube cold plunge units at 37-45°F. Stretching zone and cozy lounge on site.",
    lat: 39.73551616648868,
    lng: -105.1829639599772,
    updatedAt: "2026-02-26",
    bookingProvider: {
      type: "wix",
      siteUrl: "www.hoogahouse.co",
      timezone: "America/Denver",
      services: [
        {
          serviceId: "9525e025-441b-45e6-9310-87bc6aba5f55",
          name: "Contrast Therapy Booking",
          price: 45,
          durationMinutes: 90,
        },
      ],
    },
  },
  // The Cove — excluded: infrared-only facility
  // {
  //   slug: "the-cove-denver",
  //   name: "The Cove",
  //   address: "1361 S Broadway, Denver, CO 80210",
  //   website: "https://thecovesauna.com/",
  //   googleMapsUrl: "https://maps.app.goo.gl/gv3EZWef5Qz8bupy6",
  //   sessionPrice: 24,
  //   steamRoom: false,
  //   coldPlunge: true,
  //   soakingTub: true,
  //   waterfront: false,
  //   naturalPlunge: false,
  //   showers: true,
  //   towelsIncluded: false,
  //   temperatureRangeF: { min: 175, max: 200 },
  //   hours: "Mon 12pm-9pm, Tue closed, Wed-Sun 12pm-9pm",
  //   genderPolicy: "Co-ed",
  //   clothingPolicy: "Swimsuit required",
  //   notes:
  //     "Wellness center with multiple sauna types including infrared saunas, healing salt mist sauna, and vibrational resonance sauna. Also features 3 cold plunges, 2 hot tubs, red light therapy, lounge chair sauna, leg-compression boots, and gym. Passes from $24.",
  //   lat: 39.6993,
  //   lng: -104.9876,
  //   updatedAt: "2026-02-26",
  // },
  {
    slug: "red-rock-sauna",
    name: "Red Rock Sauna",
    address: "4460 W 29th Ave, Denver, CO 80212",
    website: "https://redrocksauna.com/",
    bookingUrl: "https://redrocksauna.com/products/private-sauna-session",
    bookingPlatform: "momence",
    googleMapsUrl: "https://maps.app.goo.gl/XxRcCbQeQnSjtUF87",
    sessionPrice: 50,
    sessionLengthMinutes: 60,
    steamRoom: true,
    coldPlunge: true,
    soakingTub: false,
    waterfront: false,
    naturalPlunge: false,
    showers: false,
    towelsIncluded: true,
    hours: "Mon/Fri 7am-10am & 4pm-9pm, Tue-Thu 4pm-9pm, Sat 9am-8pm, Sun 9am-8pm",
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Private group sauna experience at Hogshead Brewery. 8-person cedar sauna with gas stove, cold plunge, cold waterfall bucket, and steam room. $50/person/hour ($40/person/hour for parties of 2+). Private rentals available for parties and retreats. Towels, lounging area, water bucket, and ladle included.",
    lat: 39.75821833272818,
    lng: -105.04508446441803,
    updatedAt: "2026-02-26",
  },
  {
    slug: "denver-sports-recovery",
    name: "Denver Sports Recovery",
    address: "2242 W 29th Ave, Denver, CO 80211",
    website: "https://www.denversportsrecovery.com/",
    bookingPlatform: "mindbody",
    bookingUrl: "https://www.denversportsrecovery.com/book-online",
    bookingProvider: {
      type: "mindbody",
      siteId: 38008,
      locationId: 1,
      timezone: "America/Denver",
    },
    googleMapsUrl: "https://maps.app.goo.gl/y5qPsqaR1anajCsGA",
    sessionPrice: 35,
    steamRoom: false,
    coldPlunge: true, // 3 cold plunge pools at 35-52°F
    soakingTub: false,
    waterfront: false,
    naturalPlunge: false,
    showers: true,
    towelsIncluded: false,
    hours: "Mon-Thu 9am-9pm, Fri 9am-6pm, Sat 10am-5pm, Sun 12pm-5pm",
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Sports recovery center in LoHi with dry sauna and 3 cold plunge pools at varying temperatures (35-52°F). Also offers infrared saunas, NormaTec compression, and other recovery modalities. $35 day pass includes sauna, cold plunge, and more. Private cold plunge + sauna session $45/50min. Memberships from $120/mo.",
    lat: 39.75827077792347,
    lng: -105.01409132883606,
    updatedAt: "2026-02-26",
  },
  {
    slug: "mountlake-terrace-recreation-pavilion",
    name: "Mountlake Terrace Recreation Pavilion",
    address: "5303 228th St SW, Mountlake Terrace, WA 98043",
    website: "https://www.cityofmlt.com/385/Recreation-Pavilion",
    googleMapsUrl: "https://maps.app.goo.gl/umozFFM9FcwvfMQQ8",
    sessionPrice: 9,
    steamRoom: false,
    coldPlunge: false,
    soakingTub: true,
    waterfront: false,
    naturalPlunge: false,
    showers: true,
    towelsIncluded: false,
    hours:
      "Mon-Thu 5:45am-8:30pm, Fri 5:45am-6:30pm, Sat 8am-2pm, Sun 8:30am-12:30pm",
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Municipal recreation center with dry sauna, hot tub (therapy pool), indoor swimming pool complex (25-yard pool, leisure pool, lazy river), fitness room, and racquetball courts. Resident rate $7.25, non-resident $9. Youth/Senior/Disability $6-6.75. Pool closure alert currently in effect - check website for updates.",
    lat: 47.7925322,
    lng: -122.3052979,
    updatedAt: "2026-01-07",
  },
  {
    slug: "sauna-club-lakeside",
    name: "Sauna Club (Lakeside)",
    address: "1251 Lake Shore Blvd, Evanston, IL 60202",
    website: "https://mysaunaclub.com/",
    bookingUrl: "https://mysaunaclub.com/book/lakeside/",
    googleMapsUrl: "https://maps.app.goo.gl/WDTngA2naYvPBDqs6",
    sessionPrice: 20,
    sessionLengthMinutes: 30,
    steamRoom: false,
    coldPlunge: true,
    soakingTub: false,
    waterfront: true,
    naturalPlunge: true,
    showers: false,
    towelsIncluded: false,
    hours: "Wed-Fri 7am-7:30am, Sun 9am-9:30am (quiet time); other times vary",
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Mobile wood-burning sauna at Dempster Street Beach with Lake Michigan cold plunge. 30-minute sessions for $20 (book 2 for a full hour). Bring a water bottle, towel, and loose/comfy clothes for easy changing. Parking on corners of Dempster and Lake Shore Blvd (no parking in lot). Restrooms open around 7am. Community and private sessions available.",
    lat: 42.0408139,
    lng: -87.669627,
    updatedAt: "2026-01-08",
  },
  {
    slug: "sauna-club-sketchbook",
    name: "Sauna Club (Sketchbook)",
    address: "4901 Main St, Skokie, IL 60077",
    website: "https://mysaunaclub.com/",
    bookingUrl: "https://mysaunaclub.com/book/sketchbook/",
    googleMapsUrl: "https://maps.app.goo.gl/MwiMoN5NNY7SEhL18",
    sessionPrice: 20,
    sessionLengthMinutes: 30,
    steamRoom: false,
    coldPlunge: true,
    soakingTub: false,
    waterfront: false,
    naturalPlunge: false,
    showers: false,
    towelsIncluded: false,
    hours: "Tue & Thu 4pm-9pm",
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Mobile wood-burning sauna at Sketchbook Brewing Company. 30-minute sessions for $20, private rentals $399. Fall & Winter location. Contrast therapy with sauna and cold plunge. Pair your session with craft beer (including NA options) from Sketchbook Brewery. Join Skokie Swifters running club Tuesday nights at 6pm followed by brew and sauna. Pickledilly indoor pickleball courts in the same complex.",
    lat: 42.0327111,
    lng: -87.7498633,
    updatedAt: "2026-01-08",
  },
  {
    slug: "south-woods-nwa",
    name: "South Woods",
    address: "17097 Lake Sequoyah Dr, Fayetteville, AR 72701",
    website: "https://southwoodsnwa.com/",
    bookingUrl:
      "https://book.peek.com/s/c483e16c-9ecf-4e56-a76d-d3155e7c0646/0b7pw",
    bookingPlatform: "peek",
    bookingProvider: {
      type: "peek",
      key: "c483e16c-9ecf-4e56-a76d-d3155e7c0646",
      programId: "0b7pw",
      timezone: "America/Chicago",
      activities: [
        {
          activityId: "1051083c-9b8a-49f1-94b5-8767defd3ed1",
          name: "Happy Hour Free Flow (90 min)",
          price: 55,
          durationMinutes: 90,
        },
        {
          activityId: "6999ca1e-ec4b-4002-9a46-df37114ff85a",
          name: "Guided Session (90 min)",
          price: 55,
          durationMinutes: 90,
        },
        {
          activityId: "7d89d215-24e3-461a-95e1-9fdc0879325a",
          name: "Private Buy-out",
          price: 399,
          durationMinutes: 180,
          private: true,
        },
      ],
    },
    googleMapsUrl: "https://maps.app.goo.gl/7wBuqNnCzB4LzBBd8",
    sessionPrice: 55,
    sessionLengthMinutes: 90,
    steamRoom: false,
    coldPlunge: false,
    soakingTub: false,
    waterfront: false,
    naturalPlunge: false,
    showers: true,
    towelsIncluded: true,
    hours: "Check booking calendar for session times",
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit or light gym clothing",
    notes:
      "Wood-fired outdoor sauna retreat in Northwest Arkansas with community sessions and guided saunakeepers. Cold contrast is via cold showers or bucket dousing. Towels and tea included.",
    lat: 36.0597787,
    lng: -94.0537409,
    updatedAt: "2026-02-01",
  },
  // ============================================================================
  // TENNESSEE
  // ============================================================================
  {
    slug: "framework-flagship-nashville",
    name: "Framework (Flagship)",
    address: "1411 4th Ave South, Nashville, TN 37210",
    website: "https://www.joinframework.com/",
    bookingUrl: "https://www.joinframework.com/schedule",
    bookingPlatform: "mariana-tek",
    googleMapsUrl: "https://maps.app.goo.gl/myhsXzMqzdzBuXW88",
    sessionPrice: 35, // $35 weekday, $55 weekend
    sessionLengthMinutes: null,
    steamRoom: false,
    coldPlunge: true, // 9 commercial-grade cold tubs (38-60°F)
    soakingTub: false,
    waterfront: false,
    naturalPlunge: false,
    showers: true, // Indoor showers
    towelsIncluded: false,
    temperatureRangeF: { min: 190, max: 190 }, // Traditional saunas at 190°F
    hours: "Mon/Wed-Fri 6am-8pm, Sat 8am-6pm, Sun 8am-7pm",
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Framework's original flagship studio in Wedgewood Houston—Nashville's largest sauna and cold plunge facility. Features 3 traditional saunas (social, silent, and outdoor), 9 commercial-grade cold tubs (38-60°F) with solo and group options, full-service locker rooms, indoor showers, outdoor patio sauna and cold tubs. Also includes The Café, SAVA Sound Journey, and private rooms with sauna, tub, rinse shower, and lounge space. Drop-in: $35 weekday, $55 weekend. First timer intro offer: $79 for 5 sessions (10 days to use). Memberships: Forge $109/mo (4x), Fuse $179/mo (8x), Fortify $249/mo (unlimited). Text preferred: 615.200.7409",
    lat: 36.1447,
    lng: -86.7786,
    updatedAt: "2026-02-06",
    bookingProvider: {
      type: "mariana-tek",
      tenant: "joinframework",
      locationId: "48717",
      timezone: "America/Chicago",
      classTypes: [
        {
          classTypeId: "5889",
          name: "Sauna Session",
          price: 35,
          durationMinutes: 60,
        },
        {
          classTypeId: "5943",
          name: "Private Room",
          price: 80,
          durationMinutes: 60,
          private: true,
          seats: 4,
        },
      ],
    },
  },
  {
    slug: "framework-backyard-nashville",
    name: "Framework (Backyard)",
    address: "928 McFerrin Ave, Nashville, TN 37206",
    website: "https://www.joinframework.com/",
    bookingUrl: "https://www.joinframework.com/schedule",
    bookingPlatform: "mariana-tek",
    googleMapsUrl: "https://maps.app.goo.gl/YsgWzJ6zGCw2GUQ69",
    sessionPrice: 25, // $25 weekday, $35 weekend
    sessionLengthMinutes: null,
    steamRoom: false,
    coldPlunge: true, // Solo & dual tubs (40-60°F)
    soakingTub: false,
    waterfront: false,
    naturalPlunge: false,
    showers: true, // Outdoor showers
    towelsIncluded: false,
    temperatureRangeF: { min: 190, max: 190 }, // Social sauna at 190°F
    hours: "Mon/Tue/Thu/Fri 7am-7pm, Sat-Sun 8am-6pm",
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Framework's East Nashville Backyard location—fully outdoor and designed for neighborhood ease. Features a social 190°F sauna (fits 10-12) and solo & dual cold tubs (40-60°F). Outdoor showers, indoor lockers, changing rooms, and bathrooms inside a fully remodeled historic 1900s home. Hosts fitness classes and events. Drop-in: $25 weekday, $35 weekend. First timer intro offer: $79 for 5 sessions (10 days to use). Memberships: Forge $89/mo (4x), Fuse $149/mo (8x), Fortify $199/mo (unlimited). Text preferred: 615.241.0277",
    lat: 36.1887,
    lng: -86.7506,
    updatedAt: "2026-02-06",
    bookingProvider: {
      type: "mariana-tek",
      tenant: "joinframework",
      locationId: "48751",
      timezone: "America/Chicago",
      classTypes: [
        {
          classTypeId: "5889",
          name: "Sauna Session",
          price: 25,
          durationMinutes: 60,
        },
      ],
    },
  },
  // ============================================================================
  // NORTH CAROLINA
  // ============================================================================
  {
    slug: "river-birch-nordic-sauna",
    name: "River Birch Nordic Sauna",
    address: "2543 Broadstone Rd, Banner Elk, NC 28604",
    website: "https://www.riverbirchsauna.com/",
    bookingUrl:
      "https://book.peek.com/s/9c0bbf73-2460-47fa-86d4-504afae5c5a0/BLeN2",
    bookingPlatform: "peek",
    bookingProvider: {
      type: "peek",
      key: "9c0bbf73-2460-47fa-86d4-504afae5c5a0",
      programId: "BLeN2",
      timezone: "America/New_York",
      activities: [
        {
          activityId: "338641be-2e7b-490d-aa85-fbcd87edc3b0",
          name: "60 Minute Private Sauna Experience",
          price: 59,
          durationMinutes: 60,
          private: true,
          seats: 8,
        },
        {
          activityId: "e1f5861d-0e42-42be-ab36-b47d34aa240a",
          name: "120 Minute Private Sauna Experience",
          price: 99,
          durationMinutes: 120,
          private: true,
          seats: 8,
        },
      ],
    },
    googleMapsUrl: "https://maps.app.goo.gl/i4YLSog9AmRBxXJL6",
    sessionPrice: 59,
    sessionLengthMinutes: 60,
    steamRoom: false,
    coldPlunge: true,
    soakingTub: false,
    waterfront: false,
    naturalPlunge: false,
    showers: false, // Cold water bucket shower only
    towelsIncluded: false,
    capacity: 8,
    hours: "Mon/Wed/Thu/Sun 10am-8pm, Fri-Sat 10am-9:30pm",
    genderPolicy: "Co-ed (private booking)",
    clothingPolicy: "Swimsuit required",
    notes:
      "Wood-fired Nordic sauna at The Mast Farm Inn in Valle Crucis, NC. Private sessions for up to 8 guests with outdoor cold plunge tubs and cold water bucket shower. Set in the Blue Ridge Mountains with scenic mountain views. 60-min sessions $59, 120-min sessions $99. Session packs available (6 for the price of 5).",
    lat: 36.207028602161,
    lng: -81.77167177687609,
    updatedAt: "2026-02-28",
  },
  {
    slug: "glidden-point-oyster-farms",
    name: "Glidden Point Oyster Farms",
    address: "637 River Road, Edgecomb, ME 04556",
    website: "https://www.gliddenpoint.com/pages/saunas-at-glidden-point",
    bookingUrl: "https://www.ticketsignup.io/TicketEvent/GliddenPointSauna",
    googleMapsUrl: "https://maps.app.goo.gl/MVcTNwwzNP3s6H3EA",
    sessionPrice: 133.5,
    sessionLengthMinutes: 75,
    steamRoom: false,
    coldPlunge: true,
    soakingTub: false,
    waterfront: true,
    naturalPlunge: true,
    floating: true,
    showers: false,
    towelsIncluded: false,
    hours: "Thu-Sun sunrise to sunset, Oct 2-May 8",
    genderPolicy: "Co-ed, ages 18+",
    clothingPolicy: "Swimsuit required",
    notes:
      "Two wood-fired saunas (Riverside and Floating) at Glidden Point Oyster Farms with cold plunge in Damariscotta River from oyster cage dock. Up to 4 people per session (booking is per session, not per person). Includes access to shuck fresh oysters. Water available. Bring your own towels (hand towel provided for sauna seating). Food and beverages available for purchase. 24-hour cancellation policy. Arrive 10 minutes early for check-in.",
    lat: 43.95,
    lng: -69.63,
    updatedAt: "2026-02-08",
  },
  {
    slug: "good-medicine-whidbey",
    name: "Good Medicine Whidbey",
    address: "Whidbey Island, WA 98249",
    website: "https://www.goodmedicinewhidbey.com/",
    bookingUrl:
      "https://www.goodmedicinewhidbey.com/https/appacuityschedulingcom/catalogphpowner35124680",
    bookingPlatform: "acuity",
    googleMapsUrl: "https://maps.app.goo.gl/zaUiFtrFkpaqbKiv8",
    sessionPrice: 40,
    sessionLengthMinutes: 90,
    steamRoom: false,
    coldPlunge: true,
    soakingTub: false,
    waterfront: true,
    naturalPlunge: true,
    tidal: true,
    noaaTideStation: "9447855",
    showers: false,
    towelsIncluded: false,
    hours: "Check website for schedule",
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Mobile wood-fired sauna with Salish Sea cold plunge on Whidbey Island beaches (Robinson Beach, Maxwelton Beach, or Freeland Park). Social sessions up to 8 guests ($40/person). Private 90-min sessions ($300) and full-day rentals ($750) also available. Bring towels, water (no metal bottles), and water shoes.",
    lat: 47.9928,
    lng: -122.541,
    updatedAt: "2026-02-08",
    bookingProvider: {
      type: "acuity",
      owner: "138cd2f6",
      timezone: "America/Los_Angeles",
      appointmentTypes: [
        {
          acuityAppointmentId: 76761625,
          acuityCalendarId: 11722003,
          name: "Robinson Beach Social Session",
          price: 40,
          durationMinutes: 90,
        },
        {
          acuityAppointmentId: 76522553,
          acuityCalendarId: 11722003,
          name: "90-Minute Private Rental",
          price: 300,
          durationMinutes: 90,
          private: true,
          seats: 8,
        },
        {
          acuityAppointmentId: 76724657,
          acuityCalendarId: 11722003,
          name: "Hierophant Meadery Sip & Sauna",
          price: 27.5,
          durationMinutes: 60,
        },
        {
          acuityAppointmentId: 76523967,
          acuityCalendarId: 11722003,
          name: "Private Daily Rental",
          price: 750,
          durationMinutes: 480,
          private: true,
          seats: 8,
        },
      ],
    },
  },
  {
    slug: "driftwood-sauna-co",
    name: "Driftwood Sauna Co",
    address: "Whidbey Island, WA",
    website: "https://www.driftwoodsaunaco.com/",
    bookingUrl: "https://www.driftwoodsaunaco.com/book",
    bookingPlatform: "acuity",
    sessionPrice: 30,
    sessionLengthMinutes: 60,
    steamRoom: false,
    coldPlunge: true,
    soakingTub: false,
    waterfront: true,
    naturalPlunge: true,
    tidal: true,
    noaaTideStation: "9447905",
    showers: false,
    towelsIncluded: false, // Bring two towels
    temperatureRangeF: { min: 140, max: 180 },
    capacity: 8,
    hours: "Check website for schedule",
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Family-owned waterfront mobile wood-fired sauna on Whidbey Island at Ebey's Landing with plunge access to the Admiralty Inlet. IKI wood stove with deep heat and rich steam. Shared sessions $30/60min (up to 8 people). Private sessions $150/60min (up to 8 people). Bring two towels and water bottle.",
    lat: 48.192226197179,
    lng: -122.70851049351572,
    updatedAt: "2026-02-18",
    bookingProvider: {
      type: "acuity",
      owner: "25eb04ae",
      timezone: "America/Los_Angeles",
      appointmentTypes: [
        {
          acuityAppointmentId: 88542873,
          acuityCalendarId: 13535422,
          name: "Social Session",
          price: 30,
          durationMinutes: 60,
        },
        {
          acuityAppointmentId: 88545427,
          acuityCalendarId: 13535422,
          name: "Private Session",
          price: 150,
          durationMinutes: 60,
          private: true,
          seats: 8,
        },
      ],
    },
  },
  {
    slug: "moki-sauna-south-boston",
    name: "Moki Sauna - South Boston",
    address: "385 Dorchester Ave, Boston, MA 02127",
    website: "https://www.mokisauna.com/",
    bookingUrl: "https://www.mokisauna.com/social-sessions",
    bookingPlatform: "periode",
    sessionPrice: 59,
    sessionLengthMinutes: 90,
    steamRoom: false,
    coldPlunge: true,
    soakingTub: false,
    waterfront: false,
    naturalPlunge: false,
    showers: true,
    towelsIncluded: true,
    hours:
      "Mon 4pm-9pm, Tues Closed, Wed/Thurs 4pm-9pm, Fri/Sat 8am-10pm, Sun 8am-8pm",
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Modern Nordic-inspired sauna and cold plunge facility in South Boston. Features wood-fired and electric saunas, cedar cold plunge tubs, outdoor lounge areas with firepits, and showers. Towels and sandals provided. Social sessions (shared, $59/90min) and private rentals available. Memberships offered.",
    lat: 42.3385,
    lng: -71.0564,
    updatedAt: "2026-02-09",
    // Periode publishNightly=false — no pre-generated slot data in Firestore
  },
  {
    slug: "moki-sauna-allston",
    name: "Moki Sauna - Allston",
    address: "267 Western Ave, Allston, MA 02134",
    website: "https://www.mokisauna.com/",
    bookingUrl: "https://www.mokisauna.com/social-sessions",
    bookingPlatform: "periode",
    sessionPrice: 59,
    sessionLengthMinutes: 90,
    steamRoom: false,
    coldPlunge: true,
    soakingTub: false,
    waterfront: false,
    naturalPlunge: false,
    showers: true,
    towelsIncluded: true,
    hours:
      "Mon 4pm-9pm, Tues Closed, Wed/Thurs 4pm-9pm, Fri/Sat 8am-10pm, Sun 8am-8pm",
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Modern Nordic-inspired sauna and cold plunge facility in Allston (Zone 3). Features wood-fired and electric saunas, cedar cold plunge tubs, outdoor lounge areas with firepits, and showers. Towels and sandals provided. Social sessions (shared, $59/90min) and private rentals available. Memberships offered.",
    lat: 42.3625,
    lng: -71.1285,
    updatedAt: "2026-02-09",
    // Periode publishNightly=false — no pre-generated slot data in Firestore
  },
  // New York City
  {
    slug: "lore-bathing-club",
    name: "Lore Bathing Club",
    address: "676 Broadway, New York, NY 10012",
    website: "https://www.lorebathingclub.com/",
    bookingUrl: "https://www.lorebathingclub.com/membership",
    bookingPlatform: "glofox",
    bookingProvider: {
      type: "glofox",
      branchId: "67c5eb09efb4277b06084eb6",
      facilityId: "67c5eb0aefb4277b06084ebd",
      timezone: "America/New_York",
    },
    googleMapsUrl: "https://maps.app.goo.gl/opRcSwt9dS69oSC26",
    sessionPrice: 55,
    sessionLengthMinutes: 75,
    steamRoom: false,
    coldPlunge: true,
    soakingTub: false,
    waterfront: false,
    naturalPlunge: false,
    showers: true,
    towelsIncluded: true,
    servesFood: true,
    temperatureRangeF: { min: 170, max: 190 },
    hours: "Mon-Sun 7am-11pm",
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Membership-based neighborhood bathing club in NoHo. Features large Finnish dry sauna (up to 190°F), infrared sauna, 16x7ft cold pool with hammam-style heated stone benches. Programming includes aufguss, guided cold water soaks, in-sauna aroma therapy, and guided stretching. Cafe with La Cabra coffee, tea, bone broth, and juice. Monthly membership $200/mo (75-min sessions, unlimited weekdays), one-week pass $89, weekend visits $25/visit with membership. Towels and Dyson hair dryers provided.",
    lat: 40.72745,
    lng: -73.99488,
    updatedAt: "2026-02-11",
  },
  // {
  //   slug: "schwet",
  //   name: "Schwet",
  //   address: "78 Franklin Street, New York, NY 10013",
  //   website: "https://www.getschwet.com/",
  //   sessionPrice: 150,
  //   sessionLengthMinutes: 150,
  //   steamRoom: true,
  //   coldPlunge: true,
  //   soakingTub: true,
  //   waterfront: false,
  //   naturalPlunge: false,
  //   showers: true,
  //   towelsIncluded: true,
  //   servesFood: true,
  //   genderPolicy: "Co-ed",
  //   clothingPolicy: "Swimsuit required",
  //   notes:
  //     "European-inspired bathhouse in Tribeca opening Spring 2026. Features traditional Russian banya, aromatic steam room, Japanese scrub room, and red light infrared sauna. Grand Pool Room with hot mineral pool and 48°F cold plunge with top-of-the-line water filtration. Bar with wine program by Parcelle and fireplace lounge. Programming includes dinner parties, artist takeovers, Indian head massage, and Russian platza. $150 general admission for 2.5 hours.",
  //   lat: 40.7188,
  //   lng: -74.0041,
  //   updatedAt: "2026-02-11",
  // },
  {
    slug: "the-altar",
    name: "The Altar",
    address: "122 Fifth Avenue, New York, NY 10011",
    website: "https://www.the-altar.com/",
    bookingUrl: "https://www.the-altar.com/menu",
    sessionPrice: 65,
    steamRoom: false,
    coldPlunge: true,
    soakingTub: false,
    waterfront: false,
    naturalPlunge: false,
    showers: true,
    towelsIncluded: true,
    capacity: 50,
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Health club and community gathering space in Flatiron. Features 50-person sauna, cold plunge suite, and central gathering area with guided classes, open sessions, and later-evening 'Afters.' Recovery suite offers vitamin IVs (from $200), hyperbaric oxygen chambers ($100), NAD+ (from $450), compression boots ($35), red light ($35), and PEMF ($35). Founding memberships: Base $275-$299/mo, Resident $500/mo with credits toward services. Atrium pass (sauna + cold plunge) $65 per session.",
    lat: 40.738,
    lng: -73.9912,
    updatedAt: "2026-02-11",
  },
  {
    slug: "culture-of-bathe-ing",
    name: "Culture of Bathe-ing",
    address: "Domino Park, Williamsburg, Brooklyn, NY",
    website: "https://cultureofbathe-ing.com/",
    bookingUrl: "https://cultureofbathe-ing.com/tickets",
    sessionPrice: 60,
    sessionLengthMinutes: 120,
    steamRoom: true, // Steam and aromatherapy sessions
    coldPlunge: false,
    soakingTub: false,
    waterfront: true, // Williamsburg waterfront
    naturalPlunge: false,
    showers: true,
    towelsIncluded: false,
    hours: "Feb 12 – Mar 1, 2026, daily 7am-10pm",
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "NYC's first sauna festival — a village of 15 architecturally-distinct saunas along the Williamsburg waterfront at Domino Park. Feb 12–Mar 1, 2026. 2hr sessions: Core $60 (weekdays), Peak $85 (weekends 12-4pm), After Dark $95 (Fri-Sun 4-10pm). Daily aufguss rituals led by international sauna masters. Cultural programming by Pioneer Works. Family days available. Indoor lounge, lockers, and retail at One Domino Square.",
    lat: 40.71348874983753,
    lng: -73.96838781492237,
    updatedAt: "2026-02-18",
  },
  // New Jersey
  {
    slug: "sojo-spa-club",
    name: "SoJo Spa Club",
    address: "660 River Rd, Edgewater, NJ 07020",
    website: "https://sojospaclub.com/",
    bookingUrl: "https://shop.sojospaclub.com/reservation/admission",
    bookingPlatform: "sojo",
    googleMapsUrl: "https://maps.app.goo.gl/XU2bkRWjJVYUjbmeA",
    sessionPrice: 90,
    sessionLengthMinutes: null,
    steamRoom: false,
    coldPlunge: false,
    soakingTub: true,
    waterfront: true,
    naturalPlunge: false,
    showers: true,
    towelsIncluded: true,
    servesFood: true,
    hours: "Mon-Sun 9am-9:30pm",
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Reimagined Korean bathhouse spanning 140,000 sq ft on the Hudson River waterfront with NYC skyline views. Features outdoor dry sauna, Himalayan salt sauna, far-infrared sauna, and ganbanyoku heated stone beds. Ten heated pools and baths open year-round including infinity pool, hydrotherapy pool, volcanic sand bath, and silk bath. ESPA spa treatments, Korean body scrubs, yoga classes, and fitness center. Rooftop garden and cowork space. Dining with diverse menu. Complimentary robes, towels, and locker. Must be 18+. Reservations recommended.",
    lat: 40.8218,
    lng: -73.9748,
    updatedAt: "2026-02-28",
    bookingProvider: {
      type: "sojo",
      baseUrl: "https://shop.sojospaclub.com",
      timezone: "America/New_York",
    },
  },
  // Connecticut
  {
    slug: "hideout-social-club",
    name: "Hideout Social Club",
    address: "1 Blachley Rd, Stamford, CT 06902",
    website: "https://hideoutsocial.club/",
    bookingUrl: "https://hideoutsocial.club/book",
    bookingPlatform: "mariana-tek",
    googleMapsUrl: "https://maps.app.goo.gl/uziZddHwQoj1tz788",
    sessionPrice: 30,
    steamRoom: false,
    coldPlunge: true,
    soakingTub: false,
    waterfront: false,
    naturalPlunge: false,
    showers: false,
    towelsIncluded: false,
    capacity: 16,
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Outdoor sauna and cold plunge social club in Stamford, CT. Features custom-built 16-person dry sauna and four Ice Barrel cold plunges with garden lounge. Session types include free flow (self-guided), private sessions, guided group sessions (breathwork, aroma, 3 rounds hot / 2 cold; Mon/Wed/Thurs 7:30PM), and Friday socials. Phone-free and alcohol-free environment. First timer $19, trial $49 (3 passes/10 days), 4-pack $119 (30 days), individual membership $159/mo (2 guest passes), family $249/mo (10 guest passes). 5.0 stars (20 reviews).",
    lat: 41.0676,
    lng: -73.5365,
    updatedAt: "2026-02-11",
    bookingProvider: {
      type: "mariana-tek",
      tenant: "hideout",
      timezone: "America/New_York",
      classTypes: [
        {
          classTypeId: "6517",
          name: "Free Flow",
          price: 30,
          durationMinutes: 75,
        },
        {
          classTypeId: "6021",
          name: "Guided Group Session",
          price: 30,
          durationMinutes: 75,
        },
        {
          classTypeId: "6615",
          name: "Private Sauna",
          price: 200,
          durationMinutes: 120,
          private: true,
          seats: 16,
        },
      ],
    },
  },
  {
    slug: "dryyp-sauna",
    name: "DRYYP",
    address: "745 Chapel St, New Haven, CT",
    website: "https://www.dryypsauna.com/",
    bookingUrl: "https://fareharbor.com/embeds/book/dryypsauna/?full-items=yes",
    bookingPlatform: "fareharbor",
    bookingProvider: {
      type: "fareharbor",
      shortname: "dryypsauna",
      timezone: "America/New_York",
      items: [
        { itemPk: 679964, name: "Community Sauna Session", price: 35, durationMinutes: 60 },
      ],
    },
    googleMapsUrl: "https://maps.app.goo.gl/YLBk4xcULW9pF46B9",
    sessionPrice: 35,
    sessionLengthMinutes: 60,
    steamRoom: false,
    coldPlunge: false,
    soakingTub: false,
    waterfront: false,
    naturalPlunge: false,
    showers: false,
    towelsIncluded: true,
    temperatureRangeF: { min: 160, max: 190 },
    capacity: 8,
    hours: "Wed 5:30p–8:30p, Fri 5:30p–9:30p, Sat 2p–8p, Sun 10a–4p",
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Wood-fired communal sauna in downtown New Haven at CITA Park (corner of Orange & Chapel). 60-min sessions with 2–3 rounds of heat and rest. Heated greenhouses for cooling between rounds, outdoor fire pits, heated changing rooms, and lockers. Towels provided. Unlimited membership $149/mo (includes 1 guest pass, 10% off private bookings, 20% off merch). Session packs: 3 for $95, 5 for $149, 10 for $279. Private sessions available by request.",
    lat: 41.3054,
    lng: -72.9238,
    updatedAt: "2026-02-11",
  },
  // Berkshires, MA / NY
  {
    slug: "huht-sauna-village-bousquet",
    name: "HUHT Sauna Village at Bousquet",
    address: "Bousquet Mountain, 101 Dan Fox Dr, Pittsfield, MA",
    website: "https://www.gethuht.com/gather/sauna-village-bousquet",
    bookingUrl: "https://www.gethuht.com/gather/sauna-village-bousquet",
    bookingPlatform: "fareharbor",
    bookingProvider: {
      type: "fareharbor",
      shortname: "huht",
      timezone: "America/New_York",
      items: [
        { itemPk: 688205, name: "Single Session", price: 39, durationMinutes: 60 },
        { itemPk: 627902, name: "Private Rental: 8 Seater", price: 742, private: true, seats: 8 },
        { itemPk: 636095, name: "Private Rental: 12 Seater", price: 1166, private: true, seats: 12 },
      ],
    },
    sessionPrice: 39,
    sessionLengthMinutes: 60,
    steamRoom: false,
    coldPlunge: true,
    soakingTub: false,
    waterfront: false,
    naturalPlunge: false,
    showers: false,
    towelsIncluded: false,
    hours:
      "Wed-Thu 4-8pm, Fri 12-8pm, Sat 10am-8pm, Sun 10am-4pm (Dec 12, 2025 – Mar 21, 2026)",
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Seasonal wood-fired sauna village at Bousquet Mountain ski area. Finnish-inspired HUHT mobile saunas with cold plunge. Open to anyone — no ski pass required. First-timer $20 (code HUHT), single $39, 5-pack $175.50, season pass $249. Private hourly buyout $499 (up to 15 people). Aufguss rituals and guest sauna masters throughout the season.",
    lat: 42.41908285082946,
    lng: -73.27661717759202,
    updatedAt: "2026-02-18",
  },
  {
    slug: "huht-sauna-ps21",
    name: "HUHT Sauna at PS21",
    address: "PS21, 2980 NY-66, Chatham, NY",
    website: "https://www.gethuht.com/gather/ps21",
    bookingUrl: "https://www.gethuht.com/gather/ps21",
    bookingPlatform: "fareharbor",
    bookingProvider: {
      type: "fareharbor",
      shortname: "huht",
      timezone: "America/New_York",
      items: [
        { itemPk: 688205, name: "Single Session", price: 25, durationMinutes: 60 },
      ],
    },
    sessionPrice: 25,
    sessionLengthMinutes: 60,
    steamRoom: false,
    coldPlunge: true, // Natural pond
    soakingTub: false,
    waterfront: true, // PS21 Pond
    naturalPlunge: true, // Cold plunge in natural pond
    showers: false,
    towelsIncluded: false,
    hours: "Daily 10am-7pm (Jan 31 – Mar 1, 2026)",
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Seasonal wood-fired HUHT mobile sauna at PS21 performing arts center in Chatham, NY. $25/person, 60-min sessions with option to stay longer if no booking follows. Cold plunge in the natural PS21 pond. Sauna sound installation by Kara-Lis Coverdale. Thursdays available for private bookings (up to 6-7 people). Walk-ups welcome if space is available.",
    lat: 42.37499137949829,
    lng: -73.6062908949651,
    updatedAt: "2026-02-18",
  },
  // Chicago
  {
    slug: "fire-and-ice-sauna-experience",
    name: "Fire & Ice Sauna Experience",
    address: "1600 N Lake Shore Dr, Chicago, IL 60613",
    website: "https://fire-ice-sauna-experience.square.site/",
    bookingUrl: "https://fire-ice-sauna-experience.square.site/",
    bookingPlatform: "square",
    bookingProvider: {
      type: "square",
      widgetId: "zanikeqfx5ru7j",
      locationToken: "L1SJ2HM473E1H",
      timezone: "America/Chicago",
    },
    googleMapsUrl: "https://maps.app.goo.gl/GJdxDD68Qf49ofQD6",
    sessionPrice: 30,
    sessionLengthMinutes: 30,
    steamRoom: false,
    coldPlunge: true,
    soakingTub: false,
    waterfront: true,
    naturalPlunge: true,
    showers: false,
    towelsIncluded: false,
    temperatureRangeF: { min: 160, max: 185 },
    capacity: 3,
    genderPolicy: "Co-ed (private booking)",
    clothingPolicy: "Swimsuit required",
    notes:
      "Seasonal outdoor wood-fired cedar sauna at North Ave Beach, next to Castaways. Private sessions for up to 6 guests (3 in sauna at once). Cold plunge in Lake Michigan in winter or ice bath in summer. Heated dome with changing room and belongings storage. Open Fri–Sat 9AM–3PM. Private events available: full sauna camp (8-person sauna, 4-person sauna, heated dome) from $300/2hrs.",
    lat: 41.9141307,
    lng: -87.625018,
    updatedAt: "2026-02-11",
  },
  {
    slug: "fire-and-ice-sauna",
    name: "Fire & Ice Sauna",
    address: "726 E Boughton Rd, Bolingbrook, IL 60440",
    website: "https://fireiceco.com/",
    bookingUrl: "https://fireiceco.com/collections/grand-opening",
    googleMapsUrl:
      "https://www.google.com/maps/place/Fire+%26+Ice+Sauna/@41.7217,-88.0417,15z",
    sessionPrice: 45,
    steamRoom: false,
    coldPlunge: true,
    soakingTub: false,
    waterfront: false,
    naturalPlunge: false,
    showers: true,
    towelsIncluded: true,
    temperatureRangeF: { min: 180, max: 190 },
    genderPolicy: "Gender-segregated (separate men's & women's facilities)",
    clothingPolicy: "Swimsuit required",
    notes:
      "Permanent indoor contrast therapy facility in Bolingbrook with fully gender-separated sides, each with dedicated traditional sauna, cold plunge (39–49°F), showers, lockers, and relaxation lounge. Self-guided sessions; most guests spend 60–90 min. Intro rate $30 single entry (regular $45). Monthly membership $199 (intro) / $299 (regular). Towels, sandals, and tea included. Yoga classes also available. Open Mon–Sat 10AM–8PM, closed Wed.",
    lat: 41.7217,
    lng: -88.0417,
    updatedAt: "2026-02-11",
  },
  // Indianapolis
  {
    slug: "sol-drift-sauna",
    name: "Sol Drift Sauna",
    address: "Westfield, IN 46074",
    website: "https://www.soldriftsauna.com/",
    bookingUrl: "https://www.soldriftsauna.com/book",
    bookingPlatform: "acuity",
    googleMapsUrl: "https://maps.app.goo.gl/KisQzfgcaax75HTn9",
    sessionPrice: 400,
    sessionLengthMinutes: 240,
    steamRoom: false,
    coldPlunge: false,
    soakingTub: false,
    waterfront: false,
    naturalPlunge: false,
    showers: false,
    towelsIncluded: false,
    capacity: 10,
    genderPolicy: "Private booking",
    clothingPolicy: "Up to your group",
    notes:
      "Mobile wood-fired sauna delivered to your location. Family-owned, serving Indianapolis and northside suburbs. Half-day (4hr, $400) and full-day (8hr, $700) rentals include delivery, setup, fire supplies, and pickup. Seats 4-8. Cold plunge available as add-on ($75). Off-grid operation — no electricity needed.",
    lat: 39.8669548,
    lng: -86.1565051,
    updatedAt: "2026-02-27",
    bookingProvider: {
      type: "acuity",
      owner: "0c565062",
      timezone: "America/New_York",
      appointmentTypes: [
        {
          acuityAppointmentId: 82500589,
          acuityCalendarId: 12626933,
          name: "Half Day Rental",
          price: 400,
          durationMinutes: 240,
          private: true,
        },
        {
          acuityAppointmentId: 82501047,
          acuityCalendarId: 12626933,
          name: "Full Day Rental",
          price: 700,
          durationMinutes: 480,
          private: true,
        },
        {
          acuityAppointmentId: 82501132,
          acuityCalendarId: 12626933,
          name: "Overnight Rental",
          price: 1000,
          durationMinutes: 720,
          private: true,
        },
        {
          acuityAppointmentId: 83056778,
          acuityCalendarId: 12626933,
          name: "Weekend Rental",
          price: 1500,
          durationMinutes: 720,
          private: true,
        },
        {
          acuityAppointmentId: 86325150,
          acuityCalendarId: 12626933,
          name: "Weeklong Rental",
          price: 1750,
          durationMinutes: 720,
          private: true,
        },
      ],
    },
  },
  {
    slug: "fiorst-riverside",
    name: "Fiorst - Riverside",
    address: "32 River Road, Conshohocken, PA 19428",
    website: "https://www.fiorst.com/",
    bookingUrl: "https://fiorst.as.me/schedule/4ee5a478",
    bookingPlatform: "acuity",
    googleMapsUrl: "https://maps.app.goo.gl/SbzFH1yzitaKncc88",
    sessionPrice: 75,
    sessionLengthMinutes: 90,
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
      "Wood-fired cedar sauna along the Schuylkill River with cold plunge. Social sessions ($75/person, up to 3 guests) and private sessions ($300, up to 8 guests) available. Firepit area for post-session relaxation. Bring two towels, swimwear, and sandals. Restroom facilities available for changing.",
    lat: 40.05509923738114,
    lng: -75.26407447417756,
    updatedAt: "2026-02-23",
    bookingProvider: {
      type: "acuity",
      owner: "4ee5a478",
      timezone: "America/New_York",
      appointmentTypes: [
        {
          acuityAppointmentId: 73916119,
          acuityCalendarId: "any",
          name: "The Social Session",
          price: 75,
          durationMinutes: 90,
        },
        {
          acuityAppointmentId: 70502326,
          acuityCalendarId: "any",
          name: "Private Session (Up to 8 Guests)",
          price: 300,
          durationMinutes: 90,
          private: true,
          seats: 8,
        },
      ],
    },
  },
  {
    slug: "fiorst-schuylkill-center",
    name: "Fiorst - Schuylkill Center",
    address: "8480 Hagy's Mill Road, Philadelphia, PA 19128",
    website: "https://www.fiorst.com/",
    bookingUrl: "https://fiorst.as.me/schedule/4ee5a478",
    bookingPlatform: "acuity",
    googleMapsUrl: "https://maps.app.goo.gl/SbzFH1yzitaKncc88",
    sessionPrice: 75,
    sessionLengthMinutes: 90,
    steamRoom: false,
    coldPlunge: true,
    soakingTub: false,
    waterfront: false,
    naturalPlunge: false,
    showers: false,
    towelsIncluded: false,
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Wood-fired cedar sauna at the Schuylkill Center for Environmental Education. Social sessions ($75/person) and private sessions ($300 for 1 sauna/8 guests, $600 for 2 saunas/16 guests) available. Firepit area for post-session relaxation. Bring two towels, swimwear, and sandals.",
    lat: 40.05573187938797,
    lng: -75.25230839689085,
    updatedAt: "2026-02-23",
    bookingProvider: {
      type: "acuity",
      owner: "4ee5a478",
      timezone: "America/New_York",
      appointmentTypes: [
        {
          acuityAppointmentId: 88609063,
          acuityCalendarId: "any",
          name: "The Social Session",
          price: 75,
          durationMinutes: 90,
        },
        {
          acuityAppointmentId: 89136665,
          acuityCalendarId: "any",
          name: "Private Session (1 Sauna, up to 8 Guests)",
          price: 300,
          durationMinutes: 90,
          private: true,
          seats: 8,
        },
        {
          acuityAppointmentId: 88698188,
          acuityCalendarId: "any",
          name: "Private Session (2 Saunas, up to 16 Guests)",
          price: 600,
          durationMinutes: 90,
          private: true,
          seats: 16,
        },
      ],
    },
  },
  {
    slug: "cascada",
    name: "Cascada",
    address: "1150 NE Alberta St, Portland, OR 97211",
    website: "https://cascada.me/",
    bookingUrl:
      "https://cascada.try.be/items/66e0cdadce72b654de090522/thermal-springs",
    bookingPlatform: "trybe",
    googleMapsUrl: "https://maps.app.goo.gl/6BtD3qVzK5UqjBdH7",
    sessionPrice: 100,
    sessionLengthMinutes: 150,
    steamRoom: true,
    coldPlunge: true,
    soakingTub: true,
    waterfront: false,
    naturalPlunge: false,
    showers: true,
    towelsIncluded: true,
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Boutique hotel and thermal springs spa in Portland's Alberta Arts District. 2.5-hour thermal springs day pass includes access to vitality pools, saunas, steam, cold plunge, and relaxation spaces across three areas: the Conservatory, Secret Garden, and Silent Sanctuary. 21+ only. Fitness classes available separately ($22/class). Hotel guests receive unlimited thermal access.",
    lat: 45.55891246250745,
    lng: -122.65373332667728,
    updatedAt: "2026-02-23",
    bookingProvider: {
      type: "trybe",
      siteId: "9cf17a22-42ba-4192-92e2-c03bc7a6fa6c",
      sessionTypeId: "66e0cdadce72b654de090522",
      timezone: "America/Los_Angeles",
      name: "Thermal Springs",
      durationMinutes: 150,
    },
  },
  {
    slug: "pnw-sauna-cda",
    name: "PNW Sauna",
    address: "Coeur d'Alene, ID 83814",
    website: "https://pnwsaunacda.com/",
    bookingUrl: "https://pnwsaunacda.com/book/",
    bookingPlatform: "acuity",
    googleMapsUrl: "https://maps.app.goo.gl/RunGGJBbC451sreh8",
    sessionPrice: 70,
    sessionLengthMinutes: 75,
    steamRoom: false,
    coldPlunge: false,
    soakingTub: false,
    waterfront: false,
    naturalPlunge: false,
    showers: false,
    towelsIncluded: false,
    capacity: 8,
    genderPolicy: "Private booking",
    clothingPolicy: "Up to your group",
    notes:
      "Mobile wood-fired Finnish sauna delivered to your location in Coeur d'Alene, Hayden, and Post Falls. Includes setup, firewood, essential oils, and breakdown. Optional cold plunge tub add-on available ($65).",
    lat: 47.69059478343702,
    lng: -116.78791453211564,
    updatedAt: "2026-02-28",
    bookingProvider: {
      type: "acuity",
      owner: "9511b063",
      timezone: "America/Los_Angeles",
      appointmentTypes: [
        {
          acuityAppointmentId: 89218122,
          acuityCalendarId: 12953190,
          name: "Week-day Special",
          price: 70,
          durationMinutes: 75,
          private: true,
          seats: 8,
        },
        {
          acuityAppointmentId: 85032314,
          acuityCalendarId: 12953190,
          name: "Local SaunaStream Rental",
          price: 100,
          durationMinutes: 60,
          private: true,
          seats: 8,
        },
        {
          acuityAppointmentId: 85778890,
          acuityCalendarId: 12953190,
          name: "Full Day Sauna Rental",
          price: 400,
          durationMinutes: 1440,
          private: true,
          seats: 8,
        },
      ],
    },
  },
];

// Backwards-compatible alias
export const seattleSaunas = saunas;

// Helper functions

/**
 * Format a price with the appropriate currency symbol.
 * Defaults to USD ($) if no currency is specified.
 */
export function formatPrice(sauna: Sauna): string {
  if (!sauna.sessionPrice || sauna.sessionPrice <= 0) return "";
  const symbol = sauna.currency === "CAD" ? "CA$" : "$";
  return `${symbol}${sauna.sessionPrice}`;
}

export function getSaunaBySlug(slug: string): Sauna | undefined {
  return saunas.find((s) => s.slug === slug);
}

/** Build a full meta description for an individual sauna page. */
export function buildSaunaMetaDescription(sauna: Sauna): string {
  const amenities = describeSaunaAmenities(sauna);
  return (
    sauna.notes ||
    [
      sauna.name,
      sauna.sessionPrice
        ? `${formatPrice(sauna)}${
            sauna.sessionLengthMinutes
              ? ` for ${sauna.sessionLengthMinutes} min`
              : ""
          }`
        : "",
      amenities,
    ]
      .filter(Boolean)
      .join(". ")
      .trim() + "."
  );
}

/** Build a short description for JSON-LD structured data (no name/notes). */
export function buildSaunaSchemaDescription(sauna: Sauna): string {
  const amenities = describeSaunaAmenities(sauna);
  return [
    sauna.sessionPrice
      ? `${formatPrice(sauna)}${
          sauna.sessionLengthMinutes
            ? ` for ${sauna.sessionLengthMinutes} min`
            : ""
        }`
      : "",
    amenities,
  ]
    .filter(Boolean)
    .join(". ");
}

/** Build a concise amenity summary string for SEO descriptions. */
export function describeSaunaAmenities(sauna: Sauna): string {
  const parts: string[] = [];
  if (sauna.floating) parts.push("Floating sauna");
  else if (sauna.waterfront) parts.push("Waterfront location");
  if (sauna.naturalPlunge) parts.push("natural cold plunge");
  else if (sauna.coldPlunge) parts.push("cold plunge");
  if (sauna.soakingTub) parts.push("soaking tub");
  if (sauna.steamRoom) parts.push("steam room");
  if (sauna.towelsIncluded) parts.push("towels included");
  return parts.join(", ");
}

/** Build a dynamic SEO description for a location based on its saunas. */
export function describeLocationAmenities(locationSaunas: Sauna[]): string {
  const total = locationSaunas.length;
  const floating = locationSaunas.filter((s) => s.floating).length;
  const waterfront = locationSaunas.filter((s) => s.waterfront).length;
  const coldPlunge = locationSaunas.filter((s) => s.coldPlunge).length;
  const naturalPlunge = locationSaunas.filter((s) => s.naturalPlunge).length;
  const soakingTub = locationSaunas.filter((s) => s.soakingTub).length;
  const steamRoom = locationSaunas.filter((s) => s.steamRoom).length;

  const highlights: string[] = [];
  if (floating > 0) highlights.push(`${floating} floating`);
  if (waterfront > floating)
    highlights.push(`${waterfront - floating} waterfront`);
  if (naturalPlunge > 0)
    highlights.push(`${naturalPlunge} with natural cold plunge`);
  else if (coldPlunge > 0) highlights.push(`${coldPlunge} with cold plunge`);
  if (soakingTub > 0) highlights.push(`${soakingTub} with soaking tubs`);
  if (steamRoom > 0) highlights.push(`${steamRoom} with steam rooms`);

  if (highlights.length === 0) return `Compare ${total} saunas and bathhouses.`;
  return `Compare ${total} saunas including ${highlights.join(", ")}.`;
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
