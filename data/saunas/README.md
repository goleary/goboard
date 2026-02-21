# Saunas Data

This directory contains all sauna definitions and booking provider configurations. The main file is `saunas.ts`.

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

## How it works

The availability API (`/api/saunas/availability`) reads the `bookingProvider` config and calls the appropriate provider API to fetch available time slots. Results are cached for 5 minutes. The `BookingProviderConfig` type is a discriminated union, so new providers can be added by extending the union in `saunas.ts` and adding a corresponding case in the API route.

For Wix, the auth token is fetched dynamically from `https://<siteUrl>/_api/v2/dynamicmodel` on each request (also cached 5 minutes), so no tokens need to be stored or refreshed manually.
