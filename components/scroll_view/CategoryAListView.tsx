


"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

type CategoryListViewProps = {
  categories: string[];
  currentCategory: string;
  onSelect: (category: string) => void;
};

export default function CategoryAListView({
  categories,
  currentCategory,
  onSelect,
}: CategoryListViewProps) {

  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;

    scrollRef.current.scrollBy({
      left: direction === "left" ? -180 : 180,
      behavior: "smooth",
    });
  };

  return (
    <div className="w-full py-1">
      <h2 className="text-lg md:text-[25px] font-bold mb-4 md:mb-5 px-1 tracking-tight text-gray-900">
        Categories
      </h2>

      <div className="flex items-center gap-2">
        <button
          onClick={() => scroll("left")}
          className="hidden md:flex bg-gray-100 hover:bg-gray-200 rounded-full p-3"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto scrollbar-hide flex-1 px-2 md:px-0"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelect(cat)}
              className={`whitespace-nowrap px-4 py-2 text-sm rounded-full border transition ${
                currentCategory === cat
                  ? "bg-primary text-white border-primary shadow-sm"
                  : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          className="hidden md:flex bg-gray-100 hover:bg-gray-200 rounded-full p-3"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
