import { getPhotoFileNames } from "@/lib/photos";
import Image from "next/image";
const PhotosPage = () => {
  const photoFileNames = getPhotoFileNames();
  return (
    <div>
      <h1>Photos</h1>
      <ul>
        {Object.entries(photoFileNames).map(([key, value]) => (
          <li key={key}>
            <h2>{key}</h2>
            <ul>
              {value.map((fileName) => (
                <li key={fileName}>
                  <Image
                    src={`/photos/${key}/${fileName}`}
                    alt={fileName}
                    width={200}
                    height={200}
                  />
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PhotosPage;
