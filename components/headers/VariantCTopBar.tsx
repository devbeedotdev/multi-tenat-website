"use client";

import SearchProductForm from "@/components/forms/SearchForm";
import { Tenant } from "@/types/tenant";
import { Home, Menu } from "lucide-react";
import Image from "next/image";

type VariantCTopBarProps = {
  tenant: Tenant;
  onOpenSidebar: () => void;
};

export default function VariantCTopBar({
  tenant,
  onOpenSidebar,
}: VariantCTopBarProps) {
  return (
    <div className="md:hidden fixed top-0 left-0 right-0 gap-3 bg-white z-40 border-b p-3 flex items-center justify-between">
      <button onClick={onOpenSidebar}>
        <Menu className="w-6 h-6" />
      </button>

      {tenant.logoUrl ? (
        tenant.isLogoHorizontal ? (
          <Image
            src={tenant.logoUrl}
            width={120}
            height={40}
            className="h-7 w-auto object-contain"
            alt="Logo"
            priority
          />
        ) : (
          <div className="relative w-12 h-12 rounded-full border-2 border-primary p-0.5">
            <div className="relative w-full h-full rounded-full overflow-hidden bg-white">
              <Image
                src={tenant.logoUrl}
                alt="Logo"
                fill
                sizes="40px"
                className="object-contain"
              />
            </div>
          </div>
        )
      ) : (
        <button className="flex items-center gap-1 px-2 py-1 rounded-xl hover:bg-gray-100 transition">
          <Home className="w-4 h-4" />
          Home
        </button>
      )}

      <SearchProductForm height="h-10" />
    </div>
  );
}
