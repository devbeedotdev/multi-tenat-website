"use client";

import { ProductCardB } from "@/components/cards/ProductCardB";
import { ProductCardC } from "@/components/cards/ProductCardC";
import { getProductsAction } from "@/lib/actions";
import { getRandomProducts } from "@/src/utils/string.utils";
import { Product } from "@/types/product";
import { Tenant } from "@/types/tenant";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Suspense, useEffect, useRef, useState, useTransition } from "react";
import { ProductCardA } from "../cards/ProductCardA";
import { ProductGridSkeleton } from "../cards/ProductCardASkeleton";
import CategoryAListView from "../scroll_view/CategoryAListView";
import CategorySection from "../scroll_view/CategorySection";

type VariantContainer = {
  tenant: Tenant;
  categories: string[];
};

export default function VariantContainer({
  tenant,
  categories,
}: VariantContainer) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [products, setProducts] = useState<Product[]>([]);
  const [isPending, startTransition] = useTransition();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

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

  useEffect(() => {
    startTransition(async () => {
      const data = await getProductsAction(tenant.tenantId, selectedCategory);
      setProducts(data);
    });
  }, [selectedCategory, tenant.tenantId]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const updateScrollState = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container;

      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
    };

    updateScrollState();
    container.addEventListener("scroll", updateScrollState);

    return () => container.removeEventListener("scroll", updateScrollState);
  }, [products]);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;

    const cardWidth = 220;
    const gap = 16;
    const itemsPerRow = 5;

    const scrollAmount = (cardWidth + gap) * itemsPerRow;

    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section
      className={
        tenant.variant === "A"
          ? "max-w-7xl mx-auto px-1 md:px-6 py-6"
          : tenant.variant === "B"
            ? "mx-auto max-w-8xl px-3 md:px-5 py-4"
            : "flex-1 min-w-0  px-2 md:px-3 "
      }
    >
      {/* Top Category Scroller */}

      <CategoryAListView
        categories={categories}
        currentCategory={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {/* 🔥 Highlighted Products - 2 Rows with Arrows */}
      <Suspense fallback={<ProductGridSkeleton tenant={tenant} />}>
        {products.length > 0 ? (
          <div className="relative pt-6">
            {/* LEFT ARROW */}
            {products.length > 10 && canScrollLeft && (
              <button
                onClick={() => scroll("left")}
                className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 
                         bg-white shadow-md rounded-full p-3 
                         transition-all duration-200 ease-in-out
                         hover:scale-110 hover:shadow-lg hover:bg-gray-50
                         active:scale-95 active:shadow-sm"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
            )}

            {/* SCROLL CONTAINER */}
            <div
              ref={scrollRef}
              className="overflow-x-auto scrollbar-hide scroll-smooth px-2 md:px-3"
            >
              <div
                className={`grid
                  grid-rows-1
                  ${products.length >= 5 ? "md:grid-rows-2" : "md:grid-rows-1"}
                  grid-flow-col
                  gap-2
                  auto-cols-[190px]
                  md:auto-cols-[220px]
                `}
              >
                {getRandomProducts(products, 20).map((product) => (
                  <div
                    key={product.productId}
                    className="w-[190px] md:w-[220px]"
                  >
                    {renderProductCard(product)}
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT ARROW */}
            {products.length > 10 && canScrollRight && (
              <button
                onClick={() => scroll("right")}
                aria-label="Scroll right"
                className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 
                         bg-white shadow-md rounded-full p-3 
                         transition-all duration-300 ease-out
                         hover:shadow-xl hover:scale-110 hover:bg-gray-50
                         active:scale-95 active:shadow-inner"
              >
                <ChevronRight
                  className="w-5 h-5 text-gray-800"
                  aria-hidden="true"
                />
              </button>
            )}
          </div>
        ) : (
          <ProductGridSkeleton tenant={tenant} />
        )}
      </Suspense>

      {/* Other Category Sections */}
      {products.length > 0 &&
        categories
          .filter((cat) => cat !== selectedCategory && cat !== "All") // 1. Remove unwanted items
          // 2. Limit the remaining list to 20
          .map((cat) => (
            <CategorySection key={cat} tenant={tenant} category={cat} />
          ))}
    </section>
  );
}
