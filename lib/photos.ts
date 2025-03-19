import fs from "fs";
import path from "path";

type PhotoMap = { [key: string]: string[] };

function readPhotoDirectory(dirPath: string, baseDir: string): PhotoMap {
  const result: PhotoMap = {};
  const items = fs.readdirSync(dirPath);

  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Recursively read subdirectories
      const subDirPhotos = readPhotoDirectory(fullPath, baseDir);
      Object.assign(result, subDirPhotos);
    } else {
      // Check if it's an image file
      const extension = path.extname(item).toLowerCase();
      if ([".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(extension)) {
        // Get relative path from base photos directory
        const relativePath = path.relative(baseDir, dirPath);
        const key = relativePath || "root";

        if (!result[key]) {
          result[key] = [];
        }
        result[key].push(item);
      }
    }
  }

  return result;
}

export function getPhotoFileNames(): PhotoMap {
  const photosDirectory = path.join(process.cwd(), "public", "photos");

  // Check if directory exists
  if (!fs.existsSync(photosDirectory)) {
    return {};
  }

  return readPhotoDirectory(photosDirectory, photosDirectory);
}
