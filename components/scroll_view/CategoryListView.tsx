// "use client";

// import { CategoryListViewProps } from "@/types/product";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useRef } from "react";

// export default function CategoryListView({
//   categories = [],
//   currentCategory,
//   onSelect
// }: CategoryListViewProps) {

//   const scrollRef = useRef<HTMLDivElement>(null);

//   const scroll = (direction: "left" | "right") => {
//     if (!scrollRef.current) return;
//     const scrollAmount = 180;
//     scrollRef.current.scrollBy({
//       left: direction === "left" ? -scrollAmount : scrollAmount,
//       behavior: "smooth",
//     });
//   };

//   return (
//     <div className="w-full py-1">
//       <h2 className="text-lg md:text-[25px] font-bold mb-4 md:mb-5 px-1 tracking-tight text-gray-900">
//         Categories
//       </h2>

//       <div className="flex items-center gap-2">
//         {/* Left Arrow - Hidden on mobile, flex on desktop */}
//         <button
//           onClick={() => scroll("left")}
//           className="hidden md:flex flex-shrink-0 bg-gray-100 hover:bg-gray-200 transition rounded-full p-3 items-center justify-center"
//         >
//           <ChevronLeft className="w-5 h-5" />
//         </button>

//         {/* Scrollable Categories */}
//         <div
//           ref={scrollRef}
//           className="flex gap-2 overflow-x-auto scrollbar-hide flex-1 px-2 md:px-0"
//         >
//           {categories.map((cat) => {
//             const isActive =
//               currentCategory.toLowerCase() === cat.toLowerCase();

//             return (
//               <button
//                 key={cat}
//                 onClick={() => onSelect(cat)}
//                 className={`whitespace-nowrap px-4 py-2 text-sm rounded-full border transition ${
//                   isActive
//                     ? "text-white border-transparent shadow-sm" // Remove bg-primary class
//                     : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
//                 }`}
//                 style={isActive ? { backgroundColor: "var(--primary)" } : {}} // Use the variable
//               >
//                 {cat}
//               </button>
//             );
//           })}
//         </div>

//         {/* Right Arrow - Hidden on mobile, flex on desktop */}
//         <button
//           onClick={() => scroll("right")}
//           className="hidden md:flex flex-shrink-0 bg-gray-100 hover:bg-gray-200 transition rounded-full p-3 items-center justify-center"
//         >
//           <ChevronRight className="w-5 h-5" />
//         </button>
//       </div>
//     </div>
//   );
// }
