"use client";

import { useCallback, useMemo, useState } from "react";
import Lightbox, { type Slide } from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Counter from "yet-another-react-lightbox/plugins/counter";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import "yet-another-react-lightbox/plugins/counter.css";
import { Button } from "@/components/ui/button";

type PhotoItem = {
  url: string;
  fileName: string;
  width: number;
  height: number;
};

type PhotoGroup = {
  folderName: string;
  photos: PhotoItem[];
};

type PhotosSlideshowProps = {
  groups: PhotoGroup[];
};

export default function PhotosSlideshow({ groups }: PhotosSlideshowProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [shuffleKey, setShuffleKey] = useState(0);

  const allSlides: Slide[] = useMemo(() => {
    return groups.flatMap((group) =>
      group.photos.map((p) => ({
        src: p.url,
        alt: p.fileName,
      }))
    );
  }, [groups]);

  function shuffleArray<T>(input: T[]): T[] {
    const arr = [...input];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
    return arr;
  }

  const slides: Slide[] = useMemo(() => {
    // reference shuffleKey to satisfy exhaustive-deps and force re-shuffle
    void shuffleKey;
    return shuffleArray(allSlides);
  }, [allSlides, shuffleKey]);

  const openFullscreenAndPlay = useCallback(async () => {
    try {
      setShuffleKey((k) => k + 1);
      if (typeof document !== "undefined" && document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      // ignore fullscreen errors; user can toggle via UI button
    } finally {
      setIsOpen(true);
    }
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    try {
      if (typeof document !== "undefined" && document.exitFullscreen) {
        if (document.fullscreenElement) {
          void document.exitFullscreen();
        }
      }
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className="flex items-center justify-between mb-4">
      <div />
      <Button onClick={openFullscreenAndPlay} variant="secondary">
        Play all (fullscreen)
      </Button>
      {isOpen && (
        <Lightbox
          open
          close={handleClose}
          slides={slides}
          plugins={[Captions, Counter, Fullscreen, Slideshow]}
          captions={{ descriptionTextAlign: "center" }}
          slideshow={{ autoplay: true, delay: 6000 }}
        />
      )}
    </div>
  );
}


