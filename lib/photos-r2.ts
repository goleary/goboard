import photos from "../photos.json";
import photosWithDimensions from "../photos-with-dimensions.json";

type PhotoItem = {
  fileName: string;
  url: string;
  width: number;
  height: number;
};

type PhotoGroup = {
  folderName: string;
  photos: PhotoItem[];
};

// Create a lookup map for dimensions
const dimensionsMap = new Map(
  photosWithDimensions.map((photo) => [photo.path, photo])
);

export function getPhotosGroupedByFolder(): PhotoGroup[] {
  const basePrefix = "papa/";
  const validExtensions = new Set([
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".webp",
    ".avif",
  ]);

  const groupMap: Record<string, PhotoItem[]> = {};

  for (const fileName of photos) {
    const lower = fileName.toLowerCase();
    const extIdx = lower.lastIndexOf(".");
    const ext = extIdx >= 0 ? lower.slice(extIdx) : "";
    if (!validExtensions.has(ext)) continue;

    const url = `https://pub-92e63dc55dfd4d2abdb59a6b08457115.r2.dev/${encodeURIComponent(
      fileName
    )}`;

    // Get dimensions from the lookup map, fallback to 1:1 aspect ratio
    const dimensions = dimensionsMap.get(fileName) || { width: 1, height: 1 };

    // Determine folder name as the first segment after "papa/"
    const withoutPrefix = fileName.startsWith(basePrefix)
      ? fileName.slice(basePrefix.length)
      : fileName;
    const slashIdx = withoutPrefix.indexOf("/");
    const folderName =
      slashIdx === -1 ? "root" : withoutPrefix.slice(0, slashIdx);

    if (!groupMap[folderName]) groupMap[folderName] = [];
    groupMap[folderName].push({
      fileName,
      url,
      width: dimensions.width,
      height: dimensions.height,
    });
  }

  return Object.entries(groupMap).map(([folderName, items]) => ({
    folderName,
    photos: items,
  }));
}
