"use client";

import SearchProductForm from "@/components/forms/SearchForm";
import type { VariantCTopBarProps } from "@/types/components";
import { Home, Menu } from "lucide-react";
import Image from "next/image";

export default function VariantCTopBar({
  tenant,
  showSearchField = true,
  onOpenSidebar,
}: VariantCTopBarProps) {
  return (
    <div className="md:hidden fixed top-0 left-0 right-0 gap-3 bg-white z-40 border-b p-3 flex items-center justify-between">
      <button onClick={onOpenSidebar}>
        <Menu className="w-6 h-6" />
      </button>
      {tenant.logoUrl ? (
        <div className="flex-shrink-0">
          {tenant.isLogoHorizontal ? (
            <Image
              src={tenant.logoUrl}
              width={130}
              height={50}
              className="h-8 md:h-10 w-auto object-contain"
              alt="Logo"
            />
          ) : (
            <div className="relative w-12 h-12 rounded-full border-2 border-primary p-0.5">
              <div className="relative w-full h-full rounded-full overflow-hidden">
                <Image
                  src={tenant.logoUrl}
                  alt="Logo"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        <button className="flex items-center gap-1 px-2 py-1 rounded-xl hover:bg-gray-100 transition">
          <Home className="w-4 h-4" />
          Home
        </button>
      )}

      {showSearchField && <SearchProductForm height="h-10" />}
    </div>
  );
}
