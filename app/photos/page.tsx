import PhotosSlideshow from "@/components/photos-slideshow";
import { getPhotosGroupedByFolder } from "@/lib/photos-r2";
import PhotoGallery from "@/components/photo-gallery";
const PhotosPage = () => {
  const groups = getPhotosGroupedByFolder();
  return (
    <div className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-semibold mb-6">Photos</h1>

        <PhotosSlideshow groups={groups} />

        <div className="grid grid-cols-12 gap-6">
          <aside className="col-span-12 md:col-span-3">
            <nav className="sticky top-4">
              <ul className="space-y-2 text-sm">
                {groups.map((group) => {
                  const id = `folder-${group.folderName
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/^-+|-+$/g, "")}`;
                  return (
                    <li key={group.folderName}>
                      <a href={`#${id}`} className="hover:underline">
                        {group.folderName}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>

          <main className="col-span-12 md:col-span-9">
            {groups.map((group) => {
              const id = `folder-${group.folderName
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "")}`;
              return (
                <section key={group.folderName} id={id} className="mb-10">
                  <h2 className="text-xl font-medium mb-4">
                    {group.folderName}
                  </h2>
                  <PhotoGallery photos={group.photos} />
                </section>
              );
            })}
          </main>
        </div>
      </div>
    </div>
  );
};

export default PhotosPage;
