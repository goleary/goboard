import photos from "../photos.json";

type PhotoItem = {
  fileName: string;
  url: string;
};

type PhotoGroup = {
  folderName: string;
  photos: PhotoItem[];
};

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

    // Determine folder name as the first segment after "papa/"
    const withoutPrefix = fileName.startsWith(basePrefix)
      ? fileName.slice(basePrefix.length)
      : fileName;
    const slashIdx = withoutPrefix.indexOf("/");
    const folderName =
      slashIdx === -1 ? "root" : withoutPrefix.slice(0, slashIdx);

    if (!groupMap[folderName]) groupMap[folderName] = [];
    groupMap[folderName].push({ fileName, url });
  }

  return Object.entries(groupMap).map(([folderName, items]) => ({
    folderName,
    photos: items,
  }));
}
