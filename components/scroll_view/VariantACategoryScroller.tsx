"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";

const categories = [
  "All",
  "Shoes",
  "Bags",
  "Hats",
  "Watches",
  "Clothing",
  "Accessories",
  "Electronics",
  "Jewelry",
  "Sports",
  "Beauty",
  "Bags",
  "Hats",
  "Watches",
  "Clothing",
  "Accessories",
  "Electronics",
  "Jewelry",
  "Sports",
  "Beauty",
  "Bags",
  "Hats",
  "Watches",
  "Clothing",
  "Accessories",
  "Electronics",
  "Jewelry",
  "Sports",
  "Beauty",
];

export default function CategoryScroller() {
  const [selected, setSelected] = useState("All");
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;

    const scrollAmount = 180;

    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="w-full py-1">
      <h2 className="text-lg md:text-[25px] font-bold mb-4 md:mb-5 px-2 tracking-tight text-gray-900">
        Categories
      </h2>

      <div className="flex items-center gap-2 ">
        {/* Left Arrow */}
        <button
          onClick={() => scroll("left")}
          className="flex-shrink-0 bg-gray-100 hover:bg-gray-200 transition rounded-full md:p-3 p-2"
        >
          <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
        </button>

        {/* Scrollable Categories */}
        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto scrollbar-hide flex-1"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelected(cat)}
              className={`whitespace-nowrap px-3 py-1.5 text-sm rounded-full border transition ${
                selected === cat
                  ? "bg-primary text-white border-primary"
                  : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll("right")}
          className="flex-shrink-0 bg-gray-100 hover:bg-gray-200 transition rounded-full md:p-3 p-2"
        >
          <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      </div>
    </div>
  );
}
