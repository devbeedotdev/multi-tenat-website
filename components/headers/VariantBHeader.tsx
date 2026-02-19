"use client";

import { TenantPageProps } from "@/types/tenant";
import { Headset, HelpCircle, Home } from "lucide-react";
import Image from "next/image";
import SearchProductForm from "../forms/SearchForm";

export default function VariantBHeader({ tenant }: TenantPageProps) {
  return (
    <div className="flex flex-col gap-2 px-3 md:px-4  py-2 bg-white sticky top-0 z-50 border-b shadow-sm">
      {/* Top Row: Logo and Action Buttons */}
      <div className="flex items-center justify-between w-full">
        {/* Logo: Smaller on mobile, larger on desktop */}
        {tenant.logoUrl ? (
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
        ) : (
          <button className="flex items-center gap-1 px-2 py-1 rounded-xl hover:bg-gray-100 transition">
            <Home className="w-4 h-4" />
            Home
          </button>
        )}

        {/* Action Buttons: Text hidden on mobile */}
        <div className="flex items-center gap-1 md:gap-3">
          <button
            onClick={() => alert("support")}
            className="flex items-center justify-center p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-700"
          >
            <Headset className="w-5 h-5 md:w-4 md:h-4 shrink-0" />
            <span className="hidden md:block ml-1.5 text-sm font-medium">
              Support
            </span>
          </button>

          <button
            onClick={() => alert("help")}
            className="flex items-center justify-center p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-700"
          >
            <HelpCircle className="w-5 h-5 md:w-4 md:h-4 shrink-0" />
            <span className="hidden md:block ml-1.5 text-sm font-medium">
              Help
            </span>
          </button>
        </div>
      </div>

      {/* Bottom Row: Search Form (Spans full width) */}
      <div className="w-full">
        {/* Passing a custom height class if your SearchProductForm accepts className */}
        <div className="h-10 md:h-12 w-full">
          <SearchProductForm height="h-10 md:h-12"/>
        </div>
      </div>
    </div>
  );
}
