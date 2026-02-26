# Saunas Data

This directory contains all sauna definitions and booking provider configurations. The main file is `saunas.ts`.

## Availability scope

We only care about timeslots for **facility use** — sauna sessions, steam room, hot tub, cold plunge, thermal springs, etc. We do **not** track availability for personal services like massage, facials, bodywork, or other spa treatments. When configuring a new booking provider, only include service/session types that represent facility access.

## Adding Acuity (Squarespace Scheduling) Availability

Many saunas use Acuity / Squarespace Scheduling for bookings. To enable live availability checking, you need to gather info from their scheduling page.

### Step 1: Find the owner ID

1. Go to the sauna's booking page and inspect the embedded iframe.
2. The iframe `src` will look like:
   ```
   https://app.acuityscheduling.com/schedule/<owner>
   ```
3. The last path segment is the **owner ID** (e.g. `25fbe559`).

### Step 2: Get appointment type details

#### Option A: `schedule.php` page (preferred)

Navigate to:
```
https://app.squarespacescheduling.com/schedule.php?owner=<owner>
```

View the page source and find the `BUSINESS` JavaScript object. It contains an `appointmentTypes` section with everything you need:

```js
"appointmentTypes": {
  "Category Name": [
    {
      "id": 87906317,           // → acuityAppointmentId
      "name": "Community Sauna Session",
      "duration": 75,           // → durationMinutes
      "price": "35.00",         // → price
      "calendarIDs": [10669303] // → acuityCalendarId (first entry)
    }
  ]
}
```

The `BUSINESS` object also contains the `timezone` field (e.g. `"America/Los_Angeles"`).

#### Option B: Network tab fallback

If `schedule.php` returns a 404 (some newer accounts don't support it):

1. Go to the scheduling page and open the browser's Network tab.
2. Note the appointment type names, prices, and durations shown on the page.
3. Click "Book" on each appointment type.
4. Look for a request to:
   ```
   https://app.squarespacescheduling.com/api/scheduling/v1/availability/times
   ```
5. The query parameters contain:
   - `appointmentTypeId` — the appointment type ID
   - `calendarId` — the calendar ID
   - `timezone` — the IANA timezone

Repeat for each appointment type.

### Step 4: Add the config to the sauna entry

Add `bookingPlatform` and `bookingProvider` to the sauna object in `saunas.ts`:

```ts
{
  slug: "huntsville-sauna",
  // ...other fields...
  bookingUrl: "https://huntsvillesauna.com/booking-now",
  bookingPlatform: "acuity",
  // ...other fields...
  bookingProvider: {
    type: "acuity",
    owner: "25fbe559",
    timezone: "America/Denver",
    appointmentTypes: [
      {
        acuityAppointmentId: 87622287,
        acuityCalendarId: 13332794,
        name: "Community Sauna Session",
        price: 36,
        durationMinutes: 60,
      },
    ],
  },
},
```

### Field reference

| Field | Source | Description |
|---|---|---|
| `bookingPlatform` | — | Set to `"acuity"` |
| `bookingProvider.type` | — | Must be `"acuity"` |
| `bookingProvider.owner` | iframe URL (step 1) | Owner ID from the embed URL |
| `bookingProvider.timezone` | network request (step 3) | IANA timezone (e.g. `America/Los_Angeles`) |
| `acuityAppointmentId` | network request (step 3) | Numeric appointment type ID |
| `acuityCalendarId` | network request (step 3) | Numeric calendar ID |
| `name` | scheduling page (step 2) | Display name (e.g. "Social Session") |
| `price` | scheduling page (step 2) | Price per session in the sauna's currency |
| `durationMinutes` | scheduling page (step 2) | Session length in minutes |

## Adding Wix Bookings Availability

Some saunas use Wix Bookings (you can usually tell because their site is on a `.co` or custom domain hosted by Wix). The auth token is fetched dynamically from the site, so no credentials need to be stored.

### Step 1: Confirm the site uses Wix Bookings

Open the sauna's booking page and check the Network tab for requests to `_api/service-availability/v2/time-slots/event`. If present, it's a Wix Bookings site.

### Step 2: Get service IDs and metadata

1. On the bookings page, open the browser Network tab and filter for `time-slots/event`.
2. Navigate to a date range to trigger an availability request.
3. In the **request body**, find the `serviceIds` array — these are the Wix service UUIDs.
4. In the **response body**, each time slot has `localStartDate`/`localEndDate` (giving you the duration) and capacity info.
5. Note the `timeZone` from the request body (e.g. `"America/Los_Angeles"`).
6. Get the service name and price from the bookings page UI.

### Step 3: Add the config to the sauna entry

```ts
{
  slug: "vihta",
  // ...other fields...
  bookingUrl: "https://www.vihtasauna.co/bookings",
  bookingPlatform: "wix",
  // ...other fields...
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
```

### Field reference

| Field | Source | Description |
|---|---|---|
| `bookingPlatform` | — | Set to `"wix"` |
| `bookingProvider.type` | — | Must be `"wix"` |
| `bookingProvider.siteUrl` | site URL | Hostname without protocol (e.g. `www.vihtasauna.co`) |
| `bookingProvider.timezone` | request body (step 2) | IANA timezone |
| `serviceId` | request body (step 2) | UUID from the `serviceIds` array |
| `name` | bookings page UI | Display name |
| `price` | bookings page UI | Price per session |
| `durationMinutes` | response body (step 2) | Computed from `localStartDate`/`localEndDate` |

## Adding Glofox Availability

Some saunas use Glofox (ABC Glofox) for class-based bookings. The booking URL typically looks like `https://app.glofox.com/portal/#/branch/<branchId>/classes-list-view`. Auth is handled via an anonymous guest login, so no credentials need to be stored.

### Step 1: Find the branch ID

The branch ID is in the booking URL path:
```
https://app.glofox.com/portal/#/branch/<branchId>/classes-list-view
```

### Step 2: Find the facility ID

Glofox branches can have multiple facilities (locations). Each sauna entry needs a specific facility ID.

1. Open the booking URL and open the browser's Network tab.
2. Look for a request to `https://api.glofox.com/2.0/facilities?sort_by=name`.
3. Each facility in the response has an `_id` and `name` — use the `_id` for the matching location.

Alternatively, look at an `events` request in the Network tab — each event has a `facility` field with the facility ID and a `facility_obj.name` with the human-readable name.

### Step 3: Add the config to the sauna entry

```ts
{
  slug: "bywater-alki",
  // ...other fields...
  bookingUrl: "https://app.glofox.com/portal/#/branch/666cd839c3e964051d0e4307/classes-list-view",
  bookingPlatform: "glofox",
  // ...other fields...
  bookingProvider: {
    type: "glofox",
    branchId: "666cd839c3e964051d0e4307",
    facilityId: "667117c9d33bf18a0e021529",
    timezone: "America/Los_Angeles",
  },
},
```

Class types (programs) and their prices/durations are auto-detected from the API response — no need to configure them manually.

### Field reference

| Field | Source | Description |
|---|---|---|
| `bookingPlatform` | — | Set to `"glofox"` |
| `bookingProvider.type` | — | Must be `"glofox"` |
| `bookingProvider.branchId` | booking URL (step 1) | Branch ID from the portal URL |
| `bookingProvider.facilityId` | network tab (step 2) | Facility ID for this specific location |
| `bookingProvider.timezone` | — | IANA timezone (e.g. `America/Los_Angeles`) |

## Adding Periode Availability

Some saunas use [Periode](https://periode.no) (a Norwegian booking platform). Periode is backed by Google Cloud Firestore, and slot data is publicly readable via the Firestore REST API using the public API key from their client app — no authentication required.

### Step 1: Find the merchant ID

The merchant ID is the first path segment after the page type in the Periode booking URL:
```
https://minside.periode.no/bookinggroups/<merchantId>/<groupKey>
https://minside.periode.no/booking/<merchantId>/<manifestId>
https://minside.periode.no/eventlist/<merchantId>/<eventKey>
```

### Step 2: Find manifest IDs

1. Navigate to the sauna's Periode booking page (the `bookinggroups` or `eventlist` URL).
2. Each bookable service links to a URL like:
   ```
   https://minside.periode.no/booking/<merchantId>/<manifestId>/<date>
   ```
3. The `<manifestId>` in each link is the manifest ID you need.

### Step 3: Get manifest metadata

Fetch the manifest details from Firestore:
```
https://firestore.googleapis.com/v1/projects/periode-prod/databases/(default)/documents/bookingManifests/<manifestId>?key=AIzaSyDmV1nOZSBcpndV1SwLFNUFFPQbpTEl4AI
```

The response contains `name`, `price` (in cents), `length` (in hours), `timezone`, and `currency`.

### Step 4: Add the config to the sauna entry

```ts
{
  slug: "von-sauna",
  // ...other fields...
  bookingUrl: "https://minside.periode.no/bookinggroups/PqrVGDw50fAmCwkYGrxY/Off8bTkjMxsqCHc84gDD",
  bookingPlatform: "periode",
  // ...other fields...
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
    ],
  },
},
```

### Field reference

| Field | Source | Description |
|---|---|---|
| `bookingPlatform` | — | Set to `"periode"` |
| `bookingProvider.type` | — | Must be `"periode"` |
| `bookingProvider.merchantId` | booking URL (step 1) | First path segment after page type |
| `bookingProvider.timezone` | Firestore manifest (step 3) | IANA timezone |
| `manifestId` | booking links (step 2) | Manifest ID from the booking link |
| `name` | Firestore manifest (step 3) | Display name |
| `price` | Firestore manifest (step 3) | Price per session (convert from cents) |
| `durationMinutes` | Firestore manifest (step 3) | Computed from `length` in hours × 60 |

## How it works

The availability API (`/api/saunas/availability`) reads the `bookingProvider` config and calls the appropriate provider API to fetch available time slots. Results are cached for 5 minutes. The `BookingProviderConfig` type is a discriminated union, so new providers can be added by extending the union in `saunas.ts` and adding a corresponding case in the API route.

For Wix, the auth token is fetched dynamically from `https://<siteUrl>/_api/v2/dynamicmodel` on each request (also cached 5 minutes), so no tokens need to be stored or refreshed manually.

For Glofox, a guest JWT is obtained via `POST https://api.glofox.com/2.0/login` (also cached 5 minutes). Events are fetched from the branch's events API and filtered by facility ID to show only the relevant location's classes.

For Periode, slot data is fetched directly from Google Cloud Firestore using the public REST API. Each date's slots are fetched as individual Firestore documents at `dateSlots/<merchantId>/manifests/<manifestId>/slots/<date>`. The API key (`AIzaSyDmV1nOZSBcpndV1SwLFNUFFPQbpTEl4AI`) is from Periode's public `env-config.js` at `https://minside.periode.no/env-config.js`.
