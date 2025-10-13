"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Counter from "yet-another-react-lightbox/plugins/counter";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
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

export default function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = photos.map((p) => ({ src: p.url, alt: p.fileName }));

  return (
    <div>
      <div
        style={{
          columnWidth: 300,
          columnGap: "1rem",
        }}
      >
        {photos.map(({ url, fileName }, index) => (
          <div key={url} style={{ breakInside: "avoid", marginBottom: "1rem" }}>
            <button
              onClick={() => {
                setCurrentIndex(index);
                setIsOpen(true);
              }}
              type="button"
              style={{
                display: "block",
                padding: 0,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                width: "100%",
              }}
              aria-label={`Open ${fileName}`}
            >
              <Image
                src={url}
                alt={fileName}
                width={300}
                height={300}
                style={{ width: "100%", height: "auto" }}
              />
            </button>
          </div>
        ))}
      </div>

      {isOpen && (
        <Lightbox
          open
          close={() => setIsOpen(false)}
          index={currentIndex}
          slides={slides}
          plugins={[Captions, Thumbnails, Counter]}
          captions={{ descriptionTextAlign: "center" }}
        />
      )}
    </div>
  );
}
