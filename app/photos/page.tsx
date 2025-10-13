import { getPhotosGroupedByFolder } from "@/lib/photos-r2";
import PhotoGallery from "@/components/photo-gallery";
const PhotosPage = () => {
  const groups = getPhotosGroupedByFolder();
  const firstGroupPhotos = groups.length > 0 ? groups[0].photos : [];
  return (
    <div className="bg-black text-white">
      <h1>Photos</h1>
      {groups.map((group) => (
        <div key={group.folderName}>
          <h2>{group.folderName}</h2>
          <PhotoGallery key={group.folderName} photos={group.photos} />
        </div>
      ))}
    </div>
  );
};

export default PhotosPage;
