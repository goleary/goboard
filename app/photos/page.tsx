import { getPhotoUrls } from "@/lib/photos-r2";
// import Image from "next/image";
const PhotosPage = () => {
  const photoUrls = getPhotoUrls().slice(0, 100);
  return (
    <div className="bg-black">
      <h1>Photos</h1>
      <div style={{ columns: "300px" }}>
        {photoUrls.map(({ fileName, url }) => (
          <div key={url}>
            {/* <Image src={url} alt={fileName} width={200} height={200} /> */}
            <img src={url} alt={fileName} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotosPage;
