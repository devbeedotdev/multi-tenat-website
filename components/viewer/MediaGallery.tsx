"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

type MediaGalleryProps = {
  media: string[];
  className?: string;
};

const isVideo = (url: string) => {
  return /\.(mp4|webm|ogg)$/i.test(url);
};

export default function MediaGallery({
  media,
  className,
}: MediaGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const activeItem = media[activeIndex];

  const next = () => {
    setActiveIndex((prev) => (prev + 1) % media.length);
  };

  const prev = () => {
    setActiveIndex((prev) =>
      prev === 0 ? media.length - 1 : prev - 1
    );
  };

  if (!media?.length) return null;

  return (
    <div className={`w-full ${className}`}>
      {/* MAIN PREVIEW */}
      <div className="relative w-full aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">

        {/* LEFT ARROW */}
        {media.length > 1 && (
          <button
            onClick={prev}
            className="absolute left-4 z-10 bg-white/80 backdrop-blur p-2 rounded-full shadow"
          >
            <ChevronLeft size={20} />
          </button>
        )}

        {/* ACTIVE MEDIA */}
        {isVideo(activeItem) ? (
          <video
            key={activeItem}
            src={activeItem}
            controls
            className="w-full h-full object-contain"
          />
        ) : (
          <Image
            src={activeItem}
            alt="preview"
            fill
            className="object-contain"
          />
        )}

        {/* RIGHT ARROW */}
        {media.length > 1 && (
          <button
            onClick={next}
            className="absolute right-4 z-10 bg-white/80 backdrop-blur p-2 rounded-full shadow"
          >
            <ChevronRight size={20} />
          </button>
        )}
      </div>

      {/* THUMBNAILS */}
      <div className="flex gap-4 mt-4 overflow-x-auto">
        {media.map((item, index) => {
          const video = isVideo(item);

          return (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`relative min-w-[100px] h-[100px] rounded-md overflow-hidden border-2 ${
                activeIndex === index
                  ? "border-black"
                  : "border-transparent"
              }`}
            >
              {video ? (
                <>
                  <video
                    src={item}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <Play
                      size={24}
                      className="text-white fill-white"
                    />
                  </div>
                </>
              ) : (
                <Image
                  src={item}
                  alt="thumbnail"
                  fill
                  className="object-cover"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}