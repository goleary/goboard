"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import type { Slide } from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Counter from "yet-another-react-lightbox/plugins/counter";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import PhotoAlbum, {
  RenderImageProps,
  type RenderImageContext,
} from "react-photo-album";
import "react-photo-album/rows.css";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import "yet-another-react-lightbox/plugins/counter.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

type PhotoItem = {
  url: string;
  fileName: string;
};

type PhotoGalleryProps = {
  photos: PhotoItem[];
};

function renderNextImage(
  { alt = "", title, sizes }: RenderImageProps,
  { photo, width, height }: RenderImageContext
) {
  return (
    <div
      style={{
        width: "100%",
        position: "relative",
        aspectRatio: `${width} / ${height}`,
      }}
    >
      <Image
        fill
        src={photo}
        alt={alt}
        title={title}
        sizes={sizes}
        placeholder={"blurDataURL" in photo ? "blur" : undefined}
      />
    </div>
  );
}

export default function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  type AlbumPhoto = {
    src: string;
    width: number;
    height: number;
    alt?: string;
  };

  const [albumPhotos, setAlbumPhotos] = useState<AlbumPhoto[]>(() =>
    photos.map((p) => ({ src: p.url, alt: p.fileName, width: 1, height: 1 }))
  );

  // Load intrinsic dimensions for layout and to avoid upscaling
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const results = await Promise.all(
        photos.map(
          (p) =>
            new Promise<AlbumPhoto>((resolve) => {
              const img = new window.Image();
              img.src = p.url;
              img.onload = () =>
                resolve({
                  src: p.url,
                  alt: p.fileName,
                  width: img.naturalWidth,
                  height: img.naturalHeight,
                });
              img.onerror = () =>
                resolve({ src: p.url, alt: p.fileName, width: 1, height: 1 });
            })
        )
      );
      if (!cancelled) setAlbumPhotos(results);
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [photos]);

  const slides: Slide[] = albumPhotos.map((p) => ({ src: p.src, alt: p.alt }));

  return (
    <div>
      <PhotoAlbum
        photos={albumPhotos}
        layout="rows"
        targetRowHeight={200}
        onClick={({ index }: { index: number }) => {
          setCurrentIndex(index);
          setIsOpen(true);
        }}
        render={{ image: renderNextImage }}
      />

      {isOpen && (
        <Lightbox
          open
          close={() => setIsOpen(false)}
          index={currentIndex}
          slides={slides}
          plugins={[Captions, Thumbnails, Counter]}
          captions={{ descriptionTextAlign: "center" }}
          render={{
            slide: ({ slide }) => (
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <Image
                    src={slide?.src ?? ""}
                    alt={slide?.alt ?? ""}
                    fill
                    sizes="(max-width: 1024px) 100vw, 1024px"
                    style={{ objectFit: "contain" }}
                  />
                </div>
              </div>
            ),
          }}
        />
      )}
    </div>
  );
}
