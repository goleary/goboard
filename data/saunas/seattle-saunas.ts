import { z } from "zod";

export const SaunaSchema = z.object({
  slug: z.string(),
  name: z.string(),
  neighborhood: z.string(),
  address: z.string().optional(),
  website: z.string().url(),
  bookingUrl: z.string().url().optional(),
  priceRange: z.enum(["$", "$$", "$$$"]),
  dayPassAvailable: z.boolean(),
  privateRoomAvailable: z.boolean(),
  steamRoom: z.boolean(),
  coldPlunge: z.boolean(),
  showers: z.boolean(),
  towelsIncluded: z.boolean(),
  temperatureRangeF: z
    .object({ min: z.number(), max: z.number() })
    .optional(),
  capacity: z.number().optional(),
  hours: z.string().optional(),
  genderPolicy: z.string().optional(),
  clothingPolicy: z.string().optional(),
  notes: z.string().optional(),
  lat: z.number(),
  lng: z.number(),
  updatedAt: z.string(),
});

export type Sauna = z.infer<typeof SaunaSchema>;

const rawSaunas: Sauna[] = [
  {
    slug: "banya-5",
    name: "Banya 5",
    neighborhood: "Georgetown",
    address: "5901 Airport Way S, Seattle, WA 98108",
    website: "https://bfreedseattle.com/",
    bookingUrl: "https://bfreedseattle.com/pages/book-now",
    priceRange: "$$",
    dayPassAvailable: true,
    privateRoomAvailable: true,
    steamRoom: true,
    coldPlunge: true,
    showers: true,
    towelsIncluded: true,
    temperatureRangeF: { min: 150, max: 200 },
    hours: "Tue-Sun 10am-10pm, Closed Mon",
    genderPolicy: "Co-ed and gender-specific sessions available",
    clothingPolicy: "Swimsuit required in co-ed areas",
    notes:
      "Traditional Russian banya experience with platza (birch branch massage) available. Multiple sauna rooms with varying temperatures.",
    lat: 47.5502,
    lng: -122.3217,
    updatedAt: "2025-01-04",
  },
  {
    slug: "loyly-seattle",
    name: "Löyly",
    neighborhood: "Ballard",
    address: "5401 17th Ave NW, Seattle, WA 98107",
    website: "https://loylyseattle.com/",
    bookingUrl: "https://loylyseattle.com/book",
    priceRange: "$$",
    dayPassAvailable: true,
    privateRoomAvailable: true,
    steamRoom: false,
    coldPlunge: true,
    showers: true,
    towelsIncluded: true,
    temperatureRangeF: { min: 175, max: 195 },
    hours: "Daily 9am-10pm",
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Finnish-style sauna with authentic löyly (steam) experience. Beautiful Nordic design and outdoor cold plunge.",
    lat: 47.6687,
    lng: -122.3778,
    updatedAt: "2025-01-04",
  },
  {
    slug: "sauna-house-seattle",
    name: "Sauna House",
    neighborhood: "Capitol Hill",
    address: "316 Broadway E, Seattle, WA 98102",
    website: "https://www.saunahouseseattle.com/",
    bookingUrl: "https://www.saunahouseseattle.com/book",
    priceRange: "$$$",
    dayPassAvailable: true,
    privateRoomAvailable: true,
    steamRoom: true,
    coldPlunge: true,
    showers: true,
    towelsIncluded: true,
    temperatureRangeF: { min: 160, max: 190 },
    hours: "Daily 8am-10pm",
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Modern sauna experience with contrast therapy focus. Multiple temperature zones and relaxation areas.",
    lat: 47.6223,
    lng: -122.3207,
    updatedAt: "2025-01-04",
  },
  {
    slug: "otterbath",
    name: "Otterbath",
    neighborhood: "Beacon Hill",
    address: "2961 Beacon Ave S, Seattle, WA 98144",
    website: "https://otterbath.com/",
    bookingUrl: "https://otterbath.com/book",
    priceRange: "$$",
    dayPassAvailable: true,
    privateRoomAvailable: false,
    steamRoom: true,
    coldPlunge: true,
    showers: true,
    towelsIncluded: true,
    temperatureRangeF: { min: 170, max: 185 },
    hours: "Wed-Mon 10am-9pm, Closed Tue",
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Community-focused bathhouse with traditional Korean-inspired elements. Excellent value for the experience.",
    lat: 47.5792,
    lng: -122.3107,
    updatedAt: "2025-01-04",
  },
  {
    slug: "archimedes-banya",
    name: "Archimedes Banya",
    neighborhood: "Fremont",
    address: "748 N 34th St, Seattle, WA 98103",
    website: "https://archimedesbanya.com/",
    bookingUrl: "https://archimedesbanya.com/book",
    priceRange: "$$",
    dayPassAvailable: true,
    privateRoomAvailable: true,
    steamRoom: true,
    coldPlunge: true,
    showers: true,
    towelsIncluded: false,
    temperatureRangeF: { min: 180, max: 210 },
    hours: "Daily 10am-11pm",
    genderPolicy: "Co-ed and gender-specific sessions",
    clothingPolicy: "Nude in single-gender, swimsuit in co-ed",
    notes:
      "Traditional Russian banya with extremely hot sauna. Known for intense heat and authentic experience.",
    lat: 47.6498,
    lng: -122.3508,
    updatedAt: "2025-01-04",
  },
  {
    slug: "float-seattle",
    name: "Float Seattle",
    neighborhood: "Wallingford",
    address: "1750 N 45th St, Seattle, WA 98103",
    website: "https://floatseattle.com/",
    bookingUrl: "https://floatseattle.com/book",
    priceRange: "$$$",
    dayPassAvailable: true,
    privateRoomAvailable: true,
    steamRoom: false,
    coldPlunge: false,
    showers: true,
    towelsIncluded: true,
    temperatureRangeF: { min: 160, max: 180 },
    hours: "Daily 9am-9pm",
    genderPolicy: "Private rooms only",
    clothingPolicy: "Private experience",
    notes:
      "Combines float therapy with infrared sauna. Focus on relaxation and sensory deprivation.",
    lat: 47.6615,
    lng: -122.3352,
    updatedAt: "2025-01-04",
  },
  {
    slug: "hive-wellness",
    name: "Hive Wellness",
    neighborhood: "Greenwood",
    address: "7401 Greenwood Ave N, Seattle, WA 98103",
    website: "https://hivewellnessseattle.com/",
    priceRange: "$",
    dayPassAvailable: true,
    privateRoomAvailable: false,
    steamRoom: false,
    coldPlunge: true,
    showers: true,
    towelsIncluded: false,
    temperatureRangeF: { min: 150, max: 175 },
    hours: "Mon-Sat 7am-9pm, Sun 9am-6pm",
    genderPolicy: "Co-ed",
    clothingPolicy: "Swimsuit required",
    notes:
      "Community wellness center with infrared sauna and ice bath. Great for beginners and budget-conscious.",
    lat: 47.6835,
    lng: -122.3556,
    updatedAt: "2025-01-04",
  },
  {
    slug: "cedar-and-stone",
    name: "Cedar & Stone Nordic Sauna",
    neighborhood: "Eastlake",
    address: "2116 Eastlake Ave E, Seattle, WA 98102",
    website: "https://cedarandstone.com/",
    bookingUrl: "https://cedarandstone.com/reserve",
    priceRange: "$$$",
    dayPassAvailable: false,
    privateRoomAvailable: true,
    steamRoom: true,
    coldPlunge: true,
    showers: true,
    towelsIncluded: true,
    temperatureRangeF: { min: 175, max: 200 },
    hours: "Daily 7am-10pm",
    genderPolicy: "Private reservations only",
    clothingPolicy: "Private experience",
    notes:
      "Upscale Nordic-inspired private sauna suites. Beautiful lake views and premium amenities.",
    lat: 47.6403,
    lng: -122.3258,
    updatedAt: "2025-01-04",
  },
];

// Validate all entries at import time - will throw if data is malformed
export const seattleSaunas: Sauna[] = rawSaunas.map((sauna, index) => {
  const result = SaunaSchema.safeParse(sauna);
  if (!result.success) {
    throw new Error(
      `Invalid sauna data at index ${index} (${sauna.slug}): ${result.error.message}`
    );
  }
  return result.data;
});

// Helper functions
export function getSaunaBySlug(slug: string): Sauna | undefined {
  return seattleSaunas.find((s) => s.slug === slug);
}

export function getAllNeighborhoods(): string[] {
  return [...new Set(seattleSaunas.map((s) => s.neighborhood))].sort();
}

export function getLatestUpdateDate(): string {
  return seattleSaunas.reduce((latest, sauna) => {
    return sauna.updatedAt > latest ? sauna.updatedAt : latest;
  }, seattleSaunas[0]?.updatedAt ?? "");
}

export function getSimilarSaunas(
  currentSlug: string,
  limit: number = 5
): Sauna[] {
  const current = getSaunaBySlug(currentSlug);
  if (!current) return seattleSaunas.slice(0, limit);

  // Prioritize same neighborhood, then by distance
  const others = seattleSaunas.filter((s) => s.slug !== currentSlug);

  const scored = others.map((sauna) => {
    let score = 0;
    // Same neighborhood = highest priority
    if (sauna.neighborhood === current.neighborhood) score += 100;
    // Similar price range
    if (sauna.priceRange === current.priceRange) score += 10;
    // Similar amenities
    if (sauna.coldPlunge === current.coldPlunge) score += 5;
    if (sauna.steamRoom === current.steamRoom) score += 5;
    if (sauna.privateRoomAvailable === current.privateRoomAvailable) score += 5;
    return { sauna, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.sauna);
}

