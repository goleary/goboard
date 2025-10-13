import photos from "../photos.json";

export function getPhotoUrls() {
  const photoUrls = photos.map((fileName) => {
    return {
      fileName,
      url: `https://pub-92e63dc55dfd4d2abdb59a6b08457115.r2.dev/${encodeURIComponent(
        fileName
      )}`,
    };
  });
  return photoUrls;
}
