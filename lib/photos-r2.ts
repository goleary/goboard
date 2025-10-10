import photos from "../photos.json";

export function getPhotoUrls() {
  const photoUrls = photos.map((fileName) => {
    return {
      fileName,
      url: `https://pub-30334a2ea6344023a6e49e27790dd7a2.r2.dev/${encodeURIComponent(
        fileName
      )}`,
    };
  });
  return photoUrls;
}
