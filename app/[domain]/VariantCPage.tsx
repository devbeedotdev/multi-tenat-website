"use client";

import { ProductCardC } from "@/components/cards/ProductCardC";
import SearchProductForm from "@/components/forms/SearchForm";
import { products } from "@/lib/mock-db";
import { TenantPageProps } from "@/types/tenant";
import Image from "next/image";

import { Home, Menu, X } from "lucide-react";
import { useState } from "react";
import VariantCHeader from "@/components/headers/VariantCHeader";
import VariantCSidebar from "@/components/headers/VariantCSideBar";
import VariantCBody from "@/components/body/VariantCBody";

export default function VariantCPage({ tenant }: TenantPageProps) {
  const [isOpen, setIsOpen] = useState(false);

  // return (
  //   <main className="min-h-screen bg-gray-50 flex relative">
  //     {/* ================= MOBILE TOP BAR ================= */}
  //     <VariantCHeader tenant={tenant} onOpenSidebar={() =>  setIsOpen(true)}/>

  //     {/* ================= BACKDROP (Mobile Only) ================= */}
  //     {isOpen && (
  //       <div
  //         onClick={() => setIsOpen(false)}
  //         className="fixed inset-0 bg-black/40 z-40 md:hidden"
  //       />
  //     )}

  //     {/* ================= SIDEBAR ================= */}
  //     <VariantCSidebar
  //       tenant={tenant}
  //       isOpen={isOpen}
  //       onClose={() => setIsOpen(false)}
  //     />
     

  //     {/* ================= MAIN CONTENT ================= */}
  //     <section className="flex-1 md:w-4/5 px-2 md:px-6 py-1 md:ml-0 mt-16 md:mt-0 pt-5">
  //       {/* Sticky Search — Desktop Only */}
  //       <div className="hidden md:block sticky top-0 z-30 bg-gray-50 pb-4 pt-2">
  //         <SearchProductForm />
  //       </div>

  //       {/* Normal Header */}
  //       <header className=" ">
  //         <h1 className="text-2xl font-semibold">All Products</h1>
  //       </header>

  //       {/* Product Grid */}
  //       <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4 pt-4">

  //         {products.map((product) => (
  //           <ProductCardC key={product.productId} product={product} />
  //         ))}
  //       </div>
  //     </section>
  //   </main>
  // );

  return (
    <main className="min-h-screen bg-gray-50 flex relative">
      <VariantCHeader
        tenant={tenant}
        onOpenSidebar={() => setIsOpen(true)}
      />

      <VariantCSidebar
        tenant={tenant}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
      
      <VariantCBody />
    </main>
  );
}



