# GoBoard Tacoma

## Adding Sauna Listings

When adding a new sauna listing to `data/saunas/saunas.ts`, every listing MUST include a complete `bookingProvider` configuration for live availability. A listing without `bookingProvider` is incomplete.

### Required checklist for every new listing

1. **Verify actual pricing** — navigate to the booking page and extract the real drop-in session price. Do not guess or use prices from review sites.
2. **Get precise coordinates** — search Google Maps for the business and extract lat/lng from the URL.
3. **Identify the booking platform** — check the booking page for:
   - `acuityscheduling.com` or `squarespacescheduling.com` → Acuity
   - Wix sites (check network tab for `_api/service-availability`) → Wix
   - `app.glofox.com` → Glofox
   - `minside.periode.no` → Periode
   - `joinblvd.com` or `blvd` in page source → Boulevard
   - Other platforms: check if they have a public API that can be integrated
4. **Configure `bookingProvider`** — follow the platform-specific instructions in `data/saunas/README.md` to extract all required IDs (owner, service, location, etc.) and add the full config.
5. **Only track facility access** — sauna sessions, bathhouse visits, cold plunge access. Never massage, facials, memberships, or other personal services.
6. **Add Location entries** if needed — if the city/region doesn't exist in the `LocationSlug` type and `locations` array, add it.

### How to detect booking platforms using the browser

Use the Chrome browser tool to navigate to the sauna's booking page. Inspect the page source and network requests:
- **Acuity**: Look for iframes pointing to `acuityscheduling.com` or `squarespacescheduling.com`. The owner ID is the last path segment. Use `schedule.php?owner=<id>` to get appointment types.
- **Wix**: Filter network requests for `time-slots/event`. The request body contains service IDs and timezone.
- **Boulevard**: Look for `blvd` in the HTML source, `urn:blvd:Location:` URNs, or `joinblvd.com` URLs. Navigate through guest checkout to find `urn:blvd:Service:` IDs.
- **Periode**: Booking URLs contain `minside.periode.no`. Extract merchant and manifest IDs from the URL path.

### Reference

Full platform-specific setup instructions with field references: `data/saunas/README.md`
