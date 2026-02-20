// "use client";

// import { getProductsAction } from "@/lib/actions";
// import { Product } from "@/types/product";
// import { Tenant } from "@/types/tenant";
// import { Suspense, useEffect, useState, useTransition } from "react";
// import { ProductCardA } from "../cards/ProductCardA";
// import { ProductGridSkeleton } from "../cards/ProductCardASkeleton";
// import CategoryAListView from "../scroll_view/CategoryAListView";
// import CategorySection from "./CategorySection";

// type CategoryAContainer = {
//   tenant: Tenant;
//   categories: string[];
// };

// export default function CategoryAContainer({
//   tenant,
//   categories,
// }: CategoryAContainer) {
//   const [selectedCategory, setSelectedCategory] = useState<string>("All");

//   const [products, setProducts] = useState<Product[]>([]);
//   const [isPending, startTransition] = useTransition();

//   useEffect(() => {
//     startTransition(async () => {
//       const data = await getProductsAction(tenant.tenantId, selectedCategory);

//       setProducts(data);
//     });
//   }, [selectedCategory, tenant.tenantId]);

//   return (
//     <section className="max-w-6xl mx-auto px-1 py-6">
//       {/* Top Category Scroller */}
//       <CategoryAListView
//         categories={categories}
//         currentCategory={selectedCategory}
//         onSelect={setSelectedCategory}
//       />

//       {/* Highlighted Products - 2 Rows */}

//       <Suspense fallback={<ProductGridSkeleton />}>
//         {products.length > 0 ? (
//           <div className="flex gap-4 overflow-x-auto scrollbar-hide pt-4">
//             {products.slice(0, 10).map((product) => (
//               <div
//                 key={product.productId}
//                 className="min-w-[180px] md:min-w-[220px]"
//               >
//                 <ProductCardA product={product} />
//               </div>
//             ))}
//           </div>
//         ) : (
//           <ProductGridSkeleton />
//         )}
//       </Suspense>

//       {/* Other Category Sections */}
//       {products.length > 0 &&
//         categories
//           .filter((cat) => cat !== selectedCategory && cat !== "All")
//           .map((cat) => (
//             <CategorySection
//               key={cat}
//               tenantId={tenant.tenantId}
//               category={cat}
//             />
//           ))}
//     </section>
//   );
// }

"use client";

import { getProductsAction } from "@/lib/actions";
import { Product } from "@/types/product";
import { Tenant } from "@/types/tenant";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Suspense, useEffect, useRef, useState, useTransition } from "react";
import { ProductCardA } from "../cards/ProductCardA";
import { ProductGridSkeleton } from "../cards/ProductCardASkeleton";
import CategoryAListView from "../scroll_view/CategoryAListView";
import CategorySection from "./CategorySection";

type CategoryAContainer = {
  tenant: Tenant;
  categories: string[];
};

export default function CategoryAContainer({
  tenant,
  categories,
}: CategoryAContainer) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [products, setProducts] = useState<Product[]>([]);
  const [isPending, startTransition] = useTransition();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

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
    <section className="max-w-6xl mx-auto px-1 py-6">
      {/* Top Category Scroller */}
      <CategoryAListView
        categories={categories}
        currentCategory={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {/* 🔥 Highlighted Products - 2 Rows with Arrows */}
      <Suspense fallback={<ProductGridSkeleton />}>
        {products.length > 0 ? (
          <div className="relative pt-6">
            {/* LEFT ARROW */}
            {products.length > 10 && canScrollLeft && (
              <button
                onClick={() => scroll("left")}
                className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-3"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            {/* SCROLL CONTAINER */}
            <div
              ref={scrollRef}
              className="overflow-x-auto scrollbar-hide scroll-smooth px-8"
            >
              <div
  className={`grid ${
    products.length > 5
      ? "grid-rows-2 grid-flow-col"
      : "grid-rows-1 grid-flow-col"
  } gap-4 auto-cols-max`}
>
                {products.slice(0, 20).map((product) => (
                  <div
                    key={product.productId}
                    className="w-[180px] md:w-[220px]"
                  >
                    <ProductCardA product={product} />
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT ARROW */}
            {products.length > 10 && canScrollRight && (
              <button
                onClick={() => scroll("right")}
                className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-3"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        ) : (
          <ProductGridSkeleton />
        )}
      </Suspense>

      {/* Other Category Sections */}
      {products.length > 0 &&
        categories
          .filter((cat) => cat !== selectedCategory && cat !== "All")
          .map((cat) => (
            <CategorySection
              key={cat}
              tenantId={tenant.tenantId}
              category={cat}
            />
          ))}
    </section>
  );
}
