"use client";

import { Tenant } from "@/types/tenant";
import { X } from "lucide-react";
import Image from "next/image";

type VariantCSideBarProps = {
  tenant: Tenant;
  isOpen: boolean;
  onClose: () => void;
};

export default function VariantCSidebar({
  tenant,
  isOpen,
  onClose,
}: VariantCSideBarProps) {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      <aside
        className={`
          fixed md:sticky top-0 left-0 h-screen 
          w-64 md:w-15
          bg-white border-r border-gray-200
          p-6 z-50
          pl-3
          md:p-5
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Mobile Close */}
        <div className="flex justify-between items-center md:hidden mb-6">
          <h2 className="font-semibold text-lg">{tenant.businessName}</h2>
          <button onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Desktop Title */}
        <div className="hidden md:block mb-10">
          <h2 className="text-xl font-semibold">{tenant.businessName}</h2>
        </div>

        <nav className="flex flex-col gap-4 text-gray-700">
          <button className="text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition">
            Home
          </button>
          <button className="text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition">
            Cart
          </button>
          <button className="text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition">
            Categories
          </button>
          <button className="text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition">
            Support
          </button>
          <button className="text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition">
            Help
          </button>
        </nav>

        {/* Logo */}
        <div className="flex items-center gap-3">
          {tenant.logoUrl && (
            <div className="flex-shrink-0">
              {tenant.logoUrl &&
                (tenant.isLogoHorizontal ? (
                  /* 1. Horizontal/Rectangular Orientation */
                  <div className="flex items-center">
                    <Image
                      src={tenant.logoUrl}
                      width={120} // Base width for aspect ratio
                      height={40} // Base height for aspect ratio
                      className="h-7 md:h-10 w-auto object-contain transition-all duration-300"
                      alt="Horizontal Logo"
                      priority // Ensures logo loads fast
                    />
                  </div>
                ) : (
                  /* 2. Round/Circle Orientation */
                  <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-primary p-0.5 transition-all duration-300 hover:scale-105">
                    <div className="relative w-full h-full rounded-full overflow-hidden bg-white">
                      <Image
                        src={tenant.logoUrl}
                        alt="Round Logo"
                        fill
                        sizes="(max-width: 768px) 40px, 56px"
                        className="object-cover"
                      />
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
