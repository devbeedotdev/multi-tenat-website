


"use client";

import { Tenant } from "@/types/tenant";
import {
  Headset,
  HelpCircle,
  Home,
  Info,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
  const pathname = usePathname();

  // Check active route
  const isActive = (path: string) => {
    return pathname === path;
  };

  // Button styles
  const navItemClass = (path: string) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
     ${
       isActive(path)
         ? "bg-primary text-white"
         : "text-gray-700 hover:bg-gray-100"
     }`;

  // Icon styles
  const iconClass = (path: string) =>
    `w-5 h-5 transition-colors ${
      isActive(path)
        ? "text-white"
        : "text-gray-500 group-hover:text-primary"
    }`;

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
          w-64 md:w-56
          bg-white border-r border-gray-200
          p-6 z-50
          flex flex-col
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Mobile Header */}
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

        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          <Link href="/" className="group" onClick={onClose}>
            <div className={navItemClass("/")}>
              <Home className={iconClass("/")} />
              <span>Home</span>
            </div>
          </Link>

          <Link href="/about" className="group" onClick={onClose}>
            <div className={navItemClass("/about")}>
              <Info className={iconClass("/about")} />
              <span>About</span>
            </div>
          </Link>

          <Link href="/support" className="group" onClick={onClose}>
            <div className={navItemClass("/support")}>
              <Headset className={iconClass("/support")} />
              <span>Support</span>
            </div>
          </Link>

          <Link href="/help" className="group" onClick={onClose}>
            <div className={navItemClass("/help")}>
              <HelpCircle className={iconClass("/help")} />
              <span>Help</span>
            </div>
          </Link>
        </nav>

        {/* Logo Section */}
        <div className="mt-auto pt-10 flex items-center gap-3">
          {tenant.logoUrl && (
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
          )}
        </div>
      </aside>
    </>
  );
}