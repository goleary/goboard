import fs from "fs";
import path from "path";
import https from "https";
import http from "http";
import { URL } from "url";

interface PhotoWithDimensions {
  path: string;
  width: number;
  height: number;
}

async function getImageDimensions(
  imageUrl: string
): Promise<{ width: number; height: number } | null> {
  return new Promise((resolve) => {
    try {
      const urlObj = new URL(imageUrl);
      const protocol = urlObj.protocol === "https:" ? https : http;

      const request = protocol.get(
        imageUrl,
        {
          headers: {
            Range: "bytes=0-50000", // Get first 50KB which should contain dimensions
          },
        },
        (response) => {
          const chunks: Buffer[] = [];

          response.on("data", (chunk: Buffer) => {
            chunks.push(chunk);

            // Try to parse dimensions as we receive data
            const buffer = Buffer.concat(chunks);

            try {
              const dimensions = extractDimensions(buffer);
              if (dimensions) {
                response.destroy(); // Stop receiving more data
                resolve(dimensions);
              }
            } catch (e) {
              // Continue receiving data
            }
          });

          response.on("end", () => {
            const buffer = Buffer.concat(chunks);
            const dimensions = extractDimensions(buffer);
            resolve(dimensions);
          });

          response.on("error", (err) => {
            console.error(`Error fetching ${imageUrl}:`, err.message);
            resolve(null);
          });
        }
      );

      request.on("error", (err) => {
        console.error(`Request error for ${imageUrl}:`, err.message);
        resolve(null);
      });

      // Timeout after 10 seconds
      request.setTimeout(10000, () => {
        request.destroy();
        resolve(null);
      });
    } catch (err) {
      console.error(`Invalid URL ${imageUrl}:`, err);
      resolve(null);
    }
  });
}

function extractDimensions(
  buffer: Buffer
): { width: number; height: number } | null {
  // JPEG
  if (buffer[0] === 0xff && buffer[1] === 0xd8) {
    return extractJPEGDimensions(buffer);
  }

  // PNG
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return extractPNGDimensions(buffer);
  }

  // GIF
  if (
    buffer[0] === 0x47 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x38
  ) {
    return extractGIFDimensions(buffer);
  }

  return null;
}

function extractJPEGDimensions(
  buffer: Buffer
): { width: number; height: number } | null {
  let offset = 2;

  while (offset < buffer.length) {
    // Check for marker
    if (buffer[offset] !== 0xff) {
      return null;
    }

    const marker = buffer[offset + 1];
    offset += 2;

    // SOF (Start of Frame) markers
    if (
      marker >= 0xc0 &&
      marker <= 0xcf &&
      marker !== 0xc4 &&
      marker !== 0xc8 &&
      marker !== 0xcc
    ) {
      // Skip length (2 bytes) and precision (1 byte)
      const height = buffer.readUInt16BE(offset + 3);
      const width = buffer.readUInt16BE(offset + 5);
      return { width, height };
    }

    // Get segment length
    const segmentLength = buffer.readUInt16BE(offset);
    offset += segmentLength;
  }

  return null;
}

function extractPNGDimensions(
  buffer: Buffer
): { width: number; height: number } | null {
  // PNG dimensions are at bytes 16-23 (after signature and IHDR chunk header)
  if (buffer.length < 24) {
    return null;
  }

  const width = buffer.readUInt32BE(16);
  const height = buffer.readUInt32BE(20);
  return { width, height };
}

function extractGIFDimensions(
  buffer: Buffer
): { width: number; height: number } | null {
  // GIF dimensions are at bytes 6-9
  if (buffer.length < 10) {
    return null;
  }

  const width = buffer.readUInt16LE(6);
  const height = buffer.readUInt16LE(8);
  return { width, height };
}

async function main() {
  // Read photos.json
  const photosPath = path.join(process.cwd(), "photos.json");
  const photos: string[] = JSON.parse(fs.readFileSync(photosPath, "utf-8"));

  console.log(`Processing ${photos.length} photos...`);

  const photosWithDimensions: PhotoWithDimensions[] = [];
  const r2BaseUrl = "https://pub-92e63dc55dfd4d2abdb59a6b08457115.r2.dev";

  // Process photos in batches to avoid rate limiting
  const batchSize = 10;
  for (let i = 0; i < photos.length; i += batchSize) {
    const batch = photos.slice(i, i + batchSize);
    console.log(
      `Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(photos.length / batchSize)}...`
    );

    const results = await Promise.all(
      batch.map(async (photoPath) => {
        // Fetch directly from Cloudflare R2
        const imageUrl = `${r2BaseUrl}/${encodeURIComponent(photoPath)}`;

        const dimensions = await getImageDimensions(imageUrl);

        if (dimensions) {
          return {
            path: photoPath,
            width: dimensions.width,
            height: dimensions.height,
          };
        } else {
          console.warn(`Could not get dimensions for ${photoPath}`);
          return null;
        }
      })
    );

    photosWithDimensions.push(
      ...results.filter((r): r is PhotoWithDimensions => r !== null)
    );

    // Small delay between batches to be nice to Cloudflare
    if (i + batchSize < photos.length) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  // Write output
  const outputPath = path.join(process.cwd(), "photos-with-dimensions.json");
  fs.writeFileSync(
    outputPath,
    JSON.stringify(photosWithDimensions, null, 2),
    "utf-8"
  );

  console.log(`\nDone! Processed ${photosWithDimensions.length} photos.`);
  console.log(`Output written to ${outputPath}`);
}

main().catch(console.error);
