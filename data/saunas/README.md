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

### How it works

The availability API (`/api/saunas/availability`) reads the `bookingProvider` config and calls the Squarespace Scheduling API to fetch available time slots. Results are cached for 5 minutes. The `BookingProviderConfig` type is a discriminated union, so new providers can be added by extending the union in `saunas.ts` and adding a corresponding case in the API route.
