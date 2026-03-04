# GoBoard

## Adding Sauna Listings

Follow the guidelines in [`data/saunas/GUIDELINES.md`](data/saunas/GUIDELINES.md) for listing criteria, required data, image policy, and quality checks.

For platform-specific booking provider setup (Acuity, Wix, Glofox, Periode, Boulevard, etc.), see [`data/saunas/README.md`](data/saunas/README.md).

### How to detect booking platforms using the browser

Use the Chrome browser tool to navigate to the sauna's booking page. Inspect the page source and network requests:
- **Acuity**: Look for iframes pointing to `acuityscheduling.com` or `squarespacescheduling.com`. The owner ID is the last path segment. Use `schedule.php?owner=<id>` to get appointment types.
- **Wix**: Filter network requests for `time-slots/event`. The request body contains service IDs and timezone.
- **Boulevard**: Look for `blvd` in the HTML source, `urn:blvd:Location:` URNs, or `joinblvd.com` URLs. Navigate through guest checkout to find `urn:blvd:Service:` IDs.
- **Periode**: Booking URLs contain `minside.periode.no`. Extract merchant and manifest IDs from the URL path.
