"use client";

import { TenantPageProps } from "@/types/tenant";
import { Headset, HelpCircle, Home } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import SearchProductForm from "../forms/SearchForm";

export default function VariantAHeader({ tenant }: TenantPageProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsCollapsed(window.scrollY > 80);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`sticky top-0 z-50 pt-2  bg-white transition-all duration-300 ${
        isCollapsed ? "py-1 shadow-md " : "py-0"
      }`}
    >
      <div className="mx-auto max-w-7xl px-2 md:px-6 transition-all duration-300">
        {/* Header Row */}
        <div
          className={`flex items-center transition-all duration-300 ${
            isCollapsed ? "justify-start" : "justify-between"
          }`}
        >
          {/* Logo */}
          <div className="flex items-center gap-3">
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
              <button className="flex items-center gap-1 px-2 py-2 rounded-xl hover:bg-gray-100 transition">
                <Home className="w-4 h-4" />
                {!isCollapsed && <span>Home</span>}
              </button>
            )}
          </div>

          {/* Right Side */}
          <div
            className={`flex items-center text-gray-600 font-medium transition-all duration-300 ${
              isCollapsed ? "flex-1 ml-0 md:ml-10" : "gap-3"
            }`}
          >
            {/* Search moves into header when collapsed */}
            <div
              className={`transition-all duration-500 ease-in-out overflow-hidden ${
                isCollapsed ? "opacity-100 ml-4 flex-1" : "opacity-0 w-0"
              }`}
            >
              {/* Added w-full and max-w-xl to keep it centered or stretched */}
              <SearchProductForm />
            </div>

            {/* Support & Help Buttons (Logic remains same) */}
            <div className="flex items-center"></div>
            {/* Support */}
            <button
              onClick={() => alert("support")}
              className={`flex items-center overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out rounded-xl hover:bg-gray-100
    /* Mobile/Collapsed Logic */
    ${
      isCollapsed
        ? "w-0 p-0 opacity-0 pointer-events-none"
        : "w-auto px-1 py-2 opacity-100"
    }
    /* Large Screen Override: Always visible */
    lg:w-auto lg:px-2 lg:py-2 lg:opacity-100 lg:pointer-events-auto
  `}
            >
              <Headset className="w-4 h-4 shrink-0" />
              <span className="ml-1 text-sm">Support</span>
            </button>
            {/* Help */}
            <button
              onClick={() => alert("support")}
              className={`flex items-center overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out rounded-xl hover:bg-gray-100
    /* Mobile/Collapsed Logic */
    ${
      isCollapsed
        ? "w-0 p-0 opacity-0 pointer-events-none"
        : "w-auto px-1 py-2 opacity-100"
    }
    /* Large Screen Override: Always visible */
    lg:w-auto lg:px-2 lg:py-2 lg:opacity-100 lg:pointer-events-auto
  `}
            >
              <HelpCircle className="w-4 h-4 shrink-0" />
              <span className="ml-1 text-sm">Help</span>
            </button>
          </div>
        </div>

        {/* Original Search Bar (Visible only when NOT collapsed) */}
        <div
          className={`mt-2 w-full transition-all duration-300 ease-in-out ${
            isCollapsed
              ? "max-h-0 opacity-0 overflow-hidden"
              : "max-h-20 opacity-100"
          }`}
        >
          {/* Added w-full here to ensure the flex container spans the whole width */}
          <SearchProductForm />
        </div>
      </div>
    </div>
  );
}
