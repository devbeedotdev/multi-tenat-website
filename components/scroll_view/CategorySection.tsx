// "use client";

// import { getProductsAction } from "@/lib/actions";
// import { Product } from "@/types/product";
// import { useEffect, useState } from "react";
// import { ProductCardA } from "../cards/ProductCardA";

// type CategorySectionProps = {
//   tenantId: string;
//   category: string;
// };

// export default function CategorySection({
//   tenantId,
//   category,
// }: CategorySectionProps) {
//   const [products, setProducts] = useState<Product[]>([]);

//   useEffect(() => {
//     (async () => {
//       const data = await getProductsAction(tenantId, category);
//       setProducts(data);
//     })();
//   }, [tenantId, category]);

//   return (
//     <div className="mt-6">
//       <h3 className="text-xl font-semibold mb-2">{category}</h3>

//       {/* 1. Added flex-nowrap to ensure it stays in one line */}
//       <div className="flex flex-nowrap gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pt-2">
//         {products.slice(0, 10).map((product) => (
//           <div
//             key={product.productId}
//             /* 2. flex-none is CRITICAL here so it respects the min-w and doesn't stretch */
//             className="flex-none w-[180px] md:w-[220px] snap-start"
//           >
//             <ProductCardA product={product} />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// "use client";

// import { getProductsAction } from "@/lib/actions";
// import { Product } from "@/types/product";
// import { useEffect, useRef, useState } from "react";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { ProductCardA } from "../cards/ProductCardA";

// type CategorySectionProps = {
//   tenantId: string;
//   category: string;
// };

// export default function CategorySection({
//   tenantId,
//   category,
// }: CategorySectionProps) {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [canScrollLeft, setCanScrollLeft] = useState(false);
//   const [canScrollRight, setCanScrollRight] = useState(false);

//   const scrollRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     (async () => {
//       const data = await getProductsAction(tenantId, category);
//       setProducts(data);
//     })();
//   }, [tenantId, category]);

//   // 🔍 Detect scroll limits
//   useEffect(() => {
//     const container = scrollRef.current;
//     if (!container) return;

//     const updateScrollState = () => {
//       const { scrollLeft, scrollWidth, clientWidth } = container;

//       setCanScrollLeft(scrollLeft > 5);
//       setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
//     };

//     updateScrollState();
//     container.addEventListener("scroll", updateScrollState);

//     return () => container.removeEventListener("scroll", updateScrollState);
//   }, [products]);

//   // 🔁 Scroll Function
//   const scroll = (direction: "left" | "right") => {
//     if (!scrollRef.current) return;

//     const cardWidth = 220;
//     const gap = 16;
//     const itemsPerView = 5;

//     const scrollAmount = (cardWidth + gap) * itemsPerView;

//     scrollRef.current.scrollBy({
//       left: direction === "left" ? -scrollAmount : scrollAmount,
//       behavior: "smooth",
//     });
//   };

//   if (products.length === 0) return null;

//   return (
//     <div className="mt-10 relative">
//       <h3 className="text-xl font-semibold mb-4">{category}</h3>

//       {/* LEFT ARROW */}
//       {products.length > 5 && canScrollLeft && (
//         <button
//           onClick={() => scroll("left")}
//           className="hidden md:flex absolute left-0 top-[55%] -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-3"
//         >
//           <ChevronLeft className="w-5 h-5" />
//         </button>
//       )}

//       {/* SCROLL CONTAINER */}
//       <div
//         ref={scrollRef}
//         className="flex flex-nowrap gap-4 overflow-x-auto scrollbar-hide px-8"
//       >
//         {products.map((product) => (
//           <div
//             key={product.productId}
//             className="flex-none w-[180px] md:w-[220px]"
//           >
//             <ProductCardA product={product} />
//           </div>
//         ))}
//       </div>

//       {/* RIGHT ARROW */}
//       {products.length > 5 && canScrollRight && (
//         <button
//           onClick={() => scroll("right")}
//           className="hidden md:flex absolute right-0 top-[55%] -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-3"
//         >
//           <ChevronRight className="w-5 h-5" />
//         </button>
//       )}
//     </div>
//   );
// }

"use client";

import { getProductsAction } from "@/lib/actions";
import { Product } from "@/types/product";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ProductCardA } from "../cards/ProductCardA";

type CategorySectionProps = {
  tenantId: string;
  category: string;
};

export default function CategorySection({
  tenantId,
  category,
}: CategorySectionProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [viewAll, setViewAll] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      const data = await getProductsAction(tenantId, category);
      setProducts(data);
    })();
  }, [tenantId, category]);

  // Scroll detection (only relevant when NOT in viewAll)
  useEffect(() => {
    if (viewAll) return;

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
  }, [products, viewAll]);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;

    const cardWidth = 220;
    const gap = 16;
    const itemsPerView = 5;

    const scrollAmount = (cardWidth + gap) * itemsPerView;

    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (products.length === 0) return null;

  return (
    <div className="mt-12 relative">
      {/* Header with See All */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">{category}</h3>

        {products.length > 6 &&
          <button
            onClick={() => setViewAll(viewAll ? false : true)}
            className="text-sm font-medium text-primary hover:underline"
          >
            {viewAll ? "Show Less" : "See All"}
          </button>
        }
      </div>

      {/* ===== SEE ALL MODE ===== */}
      {viewAll ? (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {products.map((product) => (
            <ProductCardA key={product.productId} product={product} />
          ))}
        </div>
      ) : (
        <>
          {/* LEFT ARROW */}
          {products.length > 5 && canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="hidden md:flex absolute left-0 top-[60%] -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-3"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {/* Horizontal Scroll */}
          <div
            ref={scrollRef}
            className="flex flex-nowrap gap-4 overflow-x-auto scrollbar-hide px-8"
          >
            {products.map((product) => (
              <div
                key={product.productId}
                className="flex-none w-[180px] md:w-[220px]"
              >
                <ProductCardA product={product} />
              </div>
            ))}
          </div>

          {/* RIGHT ARROW */}
          {products.length > 5 && canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="hidden md:flex absolute right-0 top-[60%] -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-3"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </>
      )}
    </div>
  );
}
