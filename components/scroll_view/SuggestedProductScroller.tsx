"use client";

import type { Product } from "@/types/product";
import { Tenant } from "@/types/tenant";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ProductCardA } from "../cards/ProductCardA";
import { ProductCardB } from "../cards/ProductCardB";
import { ProductCardC } from "../cards/ProductCardC";

interface SuggestedScrollerProps {
  products: Product[];
  tenant: Tenant;
}

export default function SuggestedScroller({
  products,
  tenant,
}: SuggestedScrollerProps) {
  const renderProductCard = (product: Product) => {
    switch (tenant.variant) {
      case "A":
        return <ProductCardA product={product} />;
      case "B":
        return <ProductCardB product={product} />;
      case "C":
        return <ProductCardC product={product} />;
      default:
        return null; // Avoid calling notFound() inside a map loop
    }
  };

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  function updateScrollState() {
    const el = scrollRef.current;
    if (!el) return;

    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 5);
  }

  function scroll(direction: "left" | "right") {
    const el = scrollRef.current;
    if (!el) return;

    const scrollAmount = el.clientWidth * 0.8;

    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  }

  useEffect(() => {
    updateScrollState();
  }, []);

  return (
    <div className="relative group pb-6">
      {/* Gradient fades */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-4 bg-gradient-to-r from-white to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-5 bg-gradient-to-l from-white to-transparent z-10" />

      {/* LEFT ARROW */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          disabled={!canScrollLeft}
          className={`absolute left-1 top-1/2 -translate-y-1/2 z-20
        rounded-full bg-white/80 backdrop-blur-md shadow-md
        p-2 transition hover:scale-110 active:scale-95
       `}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {/* RIGHT ARROW */}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          disabled={!canScrollRight}
          className={`absolute right-2 top-1/2 -translate-y-1/2 z-20
      rounded-full bg-white/80 backdrop-blur-md shadow-md
      p-2 transition hover:scale-110 active:scale-95
      `}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* Scroll Container */}
      <div
        ref={scrollRef}
        onScroll={updateScrollState}
        className="flex flex-nowrap overflow-x-auto gap-4 p-4 pt-2 scrollbar-hide snap-x snap-mandatory scroll-smooth"
      >
        {products.map((product) => (
          <div
            key={product.productId}
            className="flex-none w-[180px] md:w-[220px] snap-start"
          >
            {renderProductCard(product)}
          </div>
        ))}
      </div>
    </div>
  );
}
