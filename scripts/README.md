# Generate Photos with Dimensions

This script generates `photos-with-dimensions.json` by fetching image dimensions for all photos listed in `photos.json`.

## Usage

Run the script:
```bash
npm run generate-dimensions
```

The script will generate `photos-with-dimensions.json` in the project root.

## How it works

The script:
- Reads all photo paths from `photos.json`
- Fetches the first ~50KB of each image directly from Cloudflare R2
- Extracts dimensions from the image headers (supports JPEG, PNG, and GIF)
- Processes images in batches of 10 to avoid rate limiting
- Outputs results to `photos-with-dimensions.json`

No local server needed - it fetches directly from the Cloudflare R2 source of truth!

## Output format

The generated JSON file contains an array of objects:

```json
[
  {
    "path": "papa/'87 El Salvador/El Salvador 1987-1988_001.jpg",
    "width": 2048,
    "height": 1536
  },
  ...
]
```

This data can be used for creating masonry layouts or other photo gallery features that need to know image dimensions before loading.
