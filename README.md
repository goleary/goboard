# Seattle Saunas

The `/seattle-saunas` section provides a comparison guide for saunas in Seattle.

## Adding/Editing Sauna Entries

Edit the data file at `data/saunas/seattle-saunas.ts`:

1. Add a new sauna object to the `seattleSaunas` array
2. Required fields: `slug`, `name`, `website`, `sessionPrice`, `steamRoom`, `coldPlunge`, `waterfront`, `naturalPlunge`, `showers`, `towelsIncluded`, `lat`, `lng`, `updatedAt`
3. Optional: `address`, `bookingUrl`, `sessionLengthMinutes`, `temperatureRangeF`, `capacity`, `hours`, `genderPolicy`, `clothingPolicy`, `notes`
4. TypeScript will catch type errors at build time
5. Update `updatedAt` to the current date (ISO format: `YYYY-MM-DD`)

Example entry:
```typescript
{
  slug: "example-sauna",
  name: "Example Sauna",
  website: "https://example.com",
  sessionPrice: 45, // Price in dollars for a session (typically 1-2 hours)
  steamRoom: true,
  coldPlunge: true,
  waterfront: true,
  naturalPlunge: true,
  showers: true,
  towelsIncluded: true,
  lat: 47.6223,
  lng: -122.3207,
  updatedAt: "2025-01-04",
}
```

---

# Photos

`photos.json` is produced using this command:

```
aws s3api list-objects-v2 \
  --bucket goleary-media \
  --endpoint-url=https://136eeb38c591adc8cbaaa1f5c3d156f7.r2.cloudflarestorage.com \
  --profile r2 \
  --query "Contents[].Key" \
  --output json > photos.json
```
