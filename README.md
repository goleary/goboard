# Seattle Saunas

The `/seattle-saunas` section provides a comparison guide for saunas in Seattle.

## Adding/Editing Sauna Entries

Edit the data file at `data/saunas/seattle-saunas.ts`:

1. Add a new sauna object to the `rawSaunas` array
2. Required fields: `slug`, `name`, `neighborhood`, `website`, `priceRange`, `dayPassAvailable`, `privateRoomAvailable`, `steamRoom`, `coldPlunge`, `showers`, `towelsIncluded`, `lat`, `lng`, `updatedAt`
3. Optional fields: `address`, `bookingUrl`, `temperatureRangeF`, `capacity`, `hours`, `genderPolicy`, `clothingPolicy`, `notes`
4. The Zod schema validates entries at build time - malformed data will cause build failures
5. Update `updatedAt` to the current date (ISO format: `YYYY-MM-DD`)

Example entry:
```typescript
{
  slug: "example-sauna",
  name: "Example Sauna",
  neighborhood: "Capitol Hill",
  website: "https://example.com",
  priceRange: "$$", // "$", "$$", or "$$$"
  dayPassAvailable: true,
  privateRoomAvailable: false,
  steamRoom: true,
  coldPlunge: true,
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
