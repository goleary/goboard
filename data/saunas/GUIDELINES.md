# Sauna Listing Guidelines

This document is the authoritative guide for adding sauna listings to the GoBoard dataset. For platform-specific booking provider setup instructions, see [README.md](./README.md).

## 1. Listing Criteria

**Qualifies:**

- Sauna is the primary offering (not a gym amenity)
- Has at least one traditional (Finnish/dry) or steam sauna (infrared-only excluded)
- Mobile sauna rentals

**Does not qualify:**

- Gyms with saunas as a side feature
- Infrared-only facilities
- Personal services (massage, facials, memberships)

**Scope:** Only facility access — sauna sessions, bathhouse visits, cold plunge access, and mobile sauna rentals. Never massage, facials, or memberships.

## 2. Required Data for Every Listing

| Field | Requirement |
|---|---|
| `name`, `slug`, `website` | Required |
| `address` | Required when a physical location exists |
| `sessionPrice` | Verified from the actual booking page — never from review sites or guessed. For mobile sauna rentals, use the base rental price (e.g. first night). |
| `lat`, `lng` | Precise coordinates extracted from Google Maps |
| `googleMapsUrl` | Share short link (`maps.app.goo.gl/...`) copied from the Maps Share button — never fabricated or constructed |
| Amenity flags | `steamRoom`, `coldPlunge`, `soakingTub`, `showers`, `towelsIncluded`, `waterfront`, `naturalPlunge` — all required booleans |
| `sessionLengthMinutes` | Required (null for mobile rentals) |
| `bookingProvider` | Required when feasible — see [Booking Provider](#3-booking-provider) below |
| `images` | Required — at least one image from the sauna's primary website. See [Image Policy](#6-image-policy). |
| Location entry | Must exist in `LocationSlug` and `locations` array. Add new entries if the city/region is missing. |
| `updatedAt` | Date of last verification (YYYY-MM-DD) |

## 3. Booking Provider

Every new listing should include a complete `bookingProvider` configuration for live availability, provided the platform is supported or no more complex to integrate than existing providers. Supported platforms include Acuity, Wix, Glofox, Periode, Boulevard, Vagaro, Zenoti, and others.

- Follow platform-specific setup guides in [`README.md`](./README.md)
- Only include services representing facility access (not personal services like massage)
- If the sauna uses an unsupported platform, check if it has a public API comparable in complexity to existing integrations — if so, integrate it; if not, note it in the listing and move on
- A listing with a supported booking platform but no `bookingProvider` config is incomplete and should not be merged

## 4. SEO Locations

Every sauna must belong to an appropriate location for SEO and discovery:

- Check existing `LocationSlug` values and the `locations` array in `saunas.ts`
- If the city/region doesn't exist, add a new `LocationSlug` entry and corresponding `Location` object with: `slug`, `name`, `state`, `description`, `center` (lat/lng), and `zoom` level
- Group saunas into the most specific applicable location (city over region when there are multiple listings in that city)
- Consider whether the sauna warrants a new location page or fits an existing one

## 5. Optional Configurations

Check for and configure these when available, especially for waterfront or water-adjacent saunas.

### Live water temperature

Set `waterTempProvider` when a nearby sensor exists:

- **`noaa`** — NOAA CO-OPS stations (coastal/tidal). Use station ID and optional fallback stations. Verify the station has a water temp sensor via the NOAA metadata API.
- **`king-county-buoy`** — King County lake buoys (lakes near Seattle). Use lake name (e.g. "washington", "sammamish").
- **`cioos-erddap`** — Canadian ECCC MSC buoys (BC coast). Use WMO station ID.

### Tide monitoring

- `tidal: true` — set when the sauna is on tidal water (e.g. Puget Sound, ocean bays)
- `noaaTideStation` — NOAA CO-OPS station ID for tide predictions

### Other fields (strongly suggested)

These fields are optional only in the sense that a listing can be submitted without them if the information can't be found — but you should always try to find and include them.

- `instagram` — Instagram handle (without `@`)
- `heaterType` — "electric", "wood", or "gas"
- `temperatureRangeF` — dry sauna temperature range `{ min, max }`
- `capacity` — max guest count
- `isFloating` — floating sauna structures
- `isOutside` — primarily outdoor experience
- `markerIconOverride` — custom map icon ("house", "waves", "snowflake", "ship", "floating-sauna", "caravan")

## 6. Image Policy

- **Every listing must have at least one image**
- Source images from the sauna's **primary website only** — no user-generated content (no Google reviews, Yelp, social media reposts)
- Download images locally to `public/saunas/<slug>/`
- Never reference external image URLs in the listing
- Reference as `/saunas/<slug>/<filename>` in the `images` array
- Include descriptive `alt` text

## 7. Mobile Sauna Rentals

Mobile sauna rentals have special rules:

- Use the delivery base location for coordinates
- Set `sessionLengthMinutes: null`, `isDelivery: true`, `private: true`
- Use base rental price (e.g. first night) for `sessionPrice`
- Set `seats` to the sauna capacity
- Include delivery radius, add-on options, and additional night pricing in `notes`

## 8. Quality Checklist

Before submitting a new listing:

- [ ] Price verified against actual booking page
- [ ] Coordinates verified on Google Maps
- [ ] Google Maps share link is a real `maps.app.goo.gl/...` short link
- [ ] Booking provider config complete and tested (availability loads), or platform documented as unsupported
- [ ] At least one image downloaded from sauna's primary website
- [ ] Location entry exists (or new one added)
- [ ] Optional configs checked: water temp sensor, tide station (for waterfront saunas)
- [ ] `updatedAt` set to today's date
