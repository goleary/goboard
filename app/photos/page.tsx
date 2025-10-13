import { getPhotoUrls } from "@/lib/photos-r2";
import PhotoGallery from "@/components/photo-gallery";
const PhotosPage = () => {
  const photoUrls = getPhotoUrls().slice(0, 100);
  return (
    <div className="bg-black">
      <h1>Photos</h1>
      <PhotoGallery photos={photoUrls} />
    </div>
  );
};

export default PhotosPage;
