"use client";

import { TenantPageProps } from "@/types/tenant";
import { Headset, HelpCircle, Home } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import SearchProductForm from "../forms/SearchForm";

type VariantAHeaderProps = TenantPageProps;

export default function VariantAHeader({
  tenant,
  searchParams,
  showSearchField = true,
}: VariantAHeaderProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchValue, setSearchValue] = useState(searchParams?.search ?? "");

  useEffect(() => {
    const handleScroll = () => {
      setIsCollapsed(window.scrollY > 80);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`sticky top-0 z-50 pt-2 bg-white transition-all duration-300 ${
        isCollapsed ? "py-1 shadow-md" : "py-0"
      }`}
    >
      <div className="mx-auto max-w-7xl px-2 md:px-6 transition-all duration-300">
        {/* Header Row */}
        <div
          className={`flex items-center transition-all duration-300 ${
            showSearchField
              ? isCollapsed
                ? "justify-start"
                : "justify-between"
              : "justify-between"
          }`}
        >
          {/* Logo */}
          <div className="flex items-center gap-3">
            {tenant.logoUrl ? (
              <div className="flex-shrink-0">
                {tenant.isLogoHorizontal ? (
                  <div className="flex items-center">
                    <Image
                      src={tenant.logoUrl}
                      width={120}
                      height={40}
                      className="h-7 md:h-10 w-auto object-contain transition-all duration-300"
                      alt="Horizontal Logo"
                      priority
                    />
                  </div>
                ) : (
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
                )}
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
              showSearchField
                ? isCollapsed
                  ? "flex-1 ml-0 md:ml-10"
                  : "gap-3"
                : "gap-3"
            }`}
          >
            {/* Collapsed Search (ONLY if enabled) */}
            {showSearchField && (
              <div
                className={`transition-all duration-500 ease-in-out overflow-hidden ${
                  isCollapsed ? "opacity-100 ml-4 flex-1" : "opacity-0 w-0"
                }`}
              >
                <SearchProductForm
                  initialSearch={searchParams?.search}
                  controlledValue={searchValue}
                  onControlledChange={setSearchValue}
                />
              </div>
            )}

            {/* Support */}
            <button
              onClick={() => alert("support")}
              className={`flex items-center overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out rounded-xl hover:bg-gray-100
              ${
                showSearchField && isCollapsed
                  ? "w-0 p-0 opacity-0 pointer-events-none"
                  : "w-auto px-1 py-2 opacity-100"
              }
              lg:w-auto lg:px-2 lg:py-2 lg:opacity-100 lg:pointer-events-auto`}
            >
              <Headset className="w-4 h-4 shrink-0" />
              <span className="ml-1 text-sm">Support</span>
            </button>

            {/* Help */}
            <button
              onClick={() => alert("support")}
              className={`flex items-center overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out rounded-xl hover:bg-gray-100
              ${
                showSearchField && isCollapsed
                  ? "w-0 p-0 opacity-0 pointer-events-none"
                  : "w-auto px-1 py-2 opacity-100"
              }
              lg:w-auto lg:px-2 lg:py-2 lg:opacity-100 lg:pointer-events-auto`}
            >
              <HelpCircle className="w-4 h-4 shrink-0" />
              <span className="ml-1 text-sm">Help</span>
            </button>
          </div>
        </div>

        {/* Original Search (ONLY if enabled) */}
        {showSearchField && (
          <div
            className={`mt-2 w-full transition-all duration-300 ease-in-out ${
              isCollapsed
                ? "max-h-0 opacity-0 overflow-hidden"
                : "max-h-20 opacity-100"
            }`}
          >
            <SearchProductForm
              initialSearch={searchParams?.search}
              useAutoSearch={false}
              controlledValue={searchValue}
              onControlledChange={setSearchValue}
            />
          </div>
        )}
      </div>
    </div>
  );
}
