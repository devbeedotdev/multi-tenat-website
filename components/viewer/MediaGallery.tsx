"use client";

import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type MediaGalleryProps = {
  media: string[];
  className?: string;
};

const isVideo = (url: string) => {
  return /\.(mp4|webm|ogg)$/i.test(url);
};

export default function MediaGallery({ media, className }: MediaGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const fullscreenRef = useRef<HTMLDivElement>(null);

  const activeItem = media[activeIndex];

  const scrollToIndex = (index: number) => {
    if (!fullscreenRef.current) return;

    fullscreenRef.current.scrollTo({
      left: index * window.innerWidth,
      behavior: "smooth",
    });
  };

  const next = () => {
    const newIndex = (activeIndex + 1) % media.length;
    setActiveIndex(newIndex);

    if (isFullscreen) {
      scrollToIndex(newIndex);
    }
  };

  const prev = () => {
    const newIndex = activeIndex === 0 ? media.length - 1 : activeIndex - 1;
    setActiveIndex(newIndex);

    if (isFullscreen) {
      scrollToIndex(newIndex);
    }
  };

  // Auto-scroll to active item when fullscreen opens
  useEffect(() => {
    if (isFullscreen && fullscreenRef.current) {
      fullscreenRef.current.scrollTo({
        left: activeIndex * window.innerWidth,
        behavior: "auto",
      });
    }
  }, [isFullscreen]);

  const handleScroll = () => {
    if (!fullscreenRef.current) return;

    const scrollLeft = fullscreenRef.current.scrollLeft;
    const width = window.innerWidth;
    const index = Math.round(scrollLeft / width);

    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  if (!media?.length) return null;

  return (
    <>
      <div className={`w-full ${className}`}>
        {/* MAIN PREVIEW */}
        <div className="relative w-full aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden">
          {media.length > 1 && (
            <>
              <button
                onClick={prev}
                className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                onClick={next}
                className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          <div
            className="flex h-full overflow-x-auto snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            style={{ WebkitOverflowScrolling: "touch" }}
            onScroll={(e) => {
              const container = e.currentTarget;
              const width = container.clientWidth;
              const index = Math.round(container.scrollLeft / width);
              if (index !== activeIndex) {
                setActiveIndex(index);
              }
            }}
          >
            {media.map((item, index) => {
              const video = isVideo(activeItem);

              return (
                <div
                  key={index}
                  className="relative min-w-full h-full snap-center flex items-center justify-center cursor-pointer"
                  onClick={() => setIsFullscreen(true)}
                >
                  {video ? (
                    <>
                      <video
                        src={activeItem}
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <Play size={48} className="text-white fill-white" />
                      </div>
                    </>
                  ) : (
                    <Image
                      src={activeItem}
                      alt="preview"
                      fill
                      className="object-contain"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* THUMBNAILS */}
        <div className="flex justify-center mt-4">
          <div className="flex gap-2 overflow-x-auto px-2 w-full md:w-auto">
            {media.map((item, index) => {
              const video = isVideo(item);

              return (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`relative shrink-0 w-10 h-10 md:w-20 md:h-20 rounded-md overflow-hidden border-2 ${
                    activeIndex === index
                      ? "border-primary"
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
                        <Play size={12} className="text-white fill-white" />
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
      </div>

      {/* FULLSCREEN */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black z-50">
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 text-white z-50"
          >
            <X size={28} />
          </button>

          {/* Desktop Navigation */}
          {media.length > 1 && (
            <>
              <button
                onClick={prev}
                className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 z-50 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-3 rounded-full"
              >
                <ChevronLeft size={28} />
              </button>

              <button
                onClick={next}
                className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 z-50 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-3 rounded-full"
              >
                <ChevronRight size={28} />
              </button>
            </>
          )}

          <div
            ref={fullscreenRef}
            onScroll={handleScroll}
            className="flex h-full overflow-x-auto snap-x snap-mandatory scroll-smooth"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {media.map((item, index) => {
              const video = isVideo(item);

              return (
                <div
                  key={index}
                  className="min-w-full h-full flex items-center justify-center snap-center"
                >
                  {video ? (
                    <video
                      src={item}
                      controls
                      // autoPlay={index === activeIndex}
                      className="max-h-[90%] max-w-[95%]"
                    />
                  ) : (
                    <Image
                      src={item}
                      alt="fullscreen"
                      width={1200}
                      height={900}
                      className="object-contain max-h-[90%] w-auto"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
