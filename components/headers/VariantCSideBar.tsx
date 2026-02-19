"use client";

import { Tenant } from "@/types/tenant";
import { X } from "lucide-react";

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
        </nav>
      </aside>
    </>
  );
}
