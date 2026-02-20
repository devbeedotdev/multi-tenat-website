"use client";

import { useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/types/product";
import { ProductCardA } from "@/components/cards/ProductCardA";

type ProductRowProps = {
  category: string;
  products: Product[];
};

export default function ProductRow({ category, products }: ProductRowProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 260;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const handleSeeAll = () => {
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    params.set("category", category);
    const queryString = params.toString();
    const search = queryString ? `?${queryString}` : "";

    router.push(search, { scroll: true });
  };

  if (!products.length) {
    return null;
  }

  return (
    <section className="space-y-3">
      <header className="flex items-center justify-between px-1">
        <h3 className="text-lg font-semibold text-gray-900">{category}</h3>
        <button
          type="button"
          onClick={handleSeeAll}
          className="text-sm font-medium text-white px-3 py-1.5 rounded-full"
          style={{ backgroundColor: "var(--primary)" }}
        >
          See all
        </button>
      </header>

      <div className="relative group">
        {/* Left chevron - desktop only */}
        <button
          type="button"
          onClick={() => scroll("left")}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow rounded-full p-2 items-center justify-center transition group-hover:opacity-100 opacity-0"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Scroll container */}
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto scrollbar-hide px-1 py-2"
        >
          {products.map((product) => (
            <div key={product.productId} className="flex-shrink-0 w-40">
              <ProductCardA product={product} />
            </div>
          ))}
        </div>

        {/* Right chevron - desktop only */}
        <button
          type="button"
          onClick={() => scroll("right")}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow rounded-full p-2 items-center justify-center transition group-hover:opacity-100 opacity-0"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}

