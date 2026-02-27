"use client";

import type { Product } from "@/types/product";
import type { Tenant, TenantVariant } from "@/types/tenant";
import { Minus, Phone, Plus, ShoppingCart } from "lucide-react";
import { useState } from "react";

type ProductActionBarProps = {
  tenant: Tenant;
  product: Product;
  variant?: TenantVariant;
  useSecondLayout?: boolean;
};

export default function ProductActionBar({
  tenant,
  product,
  useSecondLayout = false,
  variant = "A",
}: ProductActionBarProps) {
  const [quantity, setQuantity] = useState(1);
  const [hasRevealedPhone, setHasRevealedPhone] = useState(false);

  const maxQty = Math.max(1, product.quantityAvailable);

  const decrement = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const increment = () => {
    setQuantity((prev) => Math.min(maxQty, prev + 1));
  };

  const handleCallVendor = () => {
    if (!tenant.businessPhoneNumber) {
      return;
    }

    if (!hasRevealedPhone) {
      setHasRevealedPhone(true);
      return;
    }

    if (typeof window !== "undefined") {
      window.location.href = `tel:${tenant.businessPhoneNumber}`;
    }
  };

  const isMinusDisabled = quantity <= 1;
  const isPlusDisabled = quantity >= maxQty;

  const containerLayoutClass =
    variant === "A"
      ? "flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      : "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between";

  const primaryButtonClass =
    variant === "A"
      ? "inline-flex w-full gap-2 items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 md:w-auto"
      : "inline-flex w-full gap-2 items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 sm:w-auto";

  const secondaryButtonClass =
    variant === "A"
      ? "inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-50 md:w-auto"
      : "inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white/60 px-4 py-2.5 text-sm font-medium text-slate-700 backdrop-blur-sm transition hover:bg-white disabled:pointer-events-none disabled:opacity-50 sm:w-auto";

  return (
    <div className={containerLayoutClass}>
      {/* Quantity Selector */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Quantity
        </span>

        {useSecondLayout ? (
          <div className="inline-flex items-center gap-4">
            {/* Decrease Button */}
            <button
              type="button"
              onClick={decrement}
              disabled={isMinusDisabled}
              className={`group flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white transition-all duration-150
             ${
               isMinusDisabled
                 ? "opacity-100 cursor-not-allowed"
                 : "hover:border-gray-300 hover:shadow-sm active:scale-95"
             }`}
            >
              <Minus
                className={`h-5 w-5 transition-colors ${
                  isMinusDisabled
                    ? "text-gray-400"
                    : "text-gray-700 group-hover:text-black"
                }`}
              />
            </button>

            {/* Quantity Display */}
            <div className="min-w-[32px] text-center text-lg font-semibold text-gray-900">
              {quantity}
            </div>

            {/* Increase Button */}
            <button
              type="button"
              onClick={increment}
              disabled={isPlusDisabled}
              className={`group flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white transition-all duration-150
             ${
               isPlusDisabled
                 ? "opacity-100 cursor-not-allowed"
                 : "hover:border-gray-300 hover:shadow-sm active:scale-95"
             }`}
            >
              <Plus
                className={`h-5 w-5 transition-colors ${
                  isPlusDisabled
                    ? "text-gray-400"
                    : "text-gray-700 group-hover:text-black"
                }`}
              />
            </button>
          </div>
        ) : (
          <div className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-1">
            (
            <button
              type="button"
              onClick={decrement}
              disabled={isMinusDisabled}
              className={`flex h-8 w-8 items-center justify-center rounded-full transition ${
                isMinusDisabled
                  ? "opacity-40 pointer-events-none"
                  : "hover:bg-slate-100"
              }`}
            >
              <Minus className="h-4 w-4" />
            </button>
            )
            <span className="mx-3 w-8 text-center text-sm font-semibold text-slate-900">
              {quantity}
            </span>
            <button
              type="button"
              onClick={increment}
              disabled={isPlusDisabled}
              className={`flex h-8 w-8 items-center justify-center rounded-full transition ${
                isPlusDisabled
                  ? "opacity-40 pointer-events-none"
                  : "hover:bg-slate-100"
              }`}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        )}

        <span className="text-xs text-slate-500">of {maxQty} available</span>
      </div>

      {/* Primary & Secondary Actions */}
      {/* Primary & Secondary Actions */}
      <div
        className={
          useSecondLayout
            ? "flex items-center gap-3"
            : "flex flex-col gap-3 md:flex-row md:items-center md:justify-end"
        }
      >
        <button
          type="button"
          style={{ backgroundColor: "var(--primary)" }}
          className={
            useSecondLayout
              ? "inline-flex h-11 w-15 px-4 md:w-auto md:px-6 items-center justify-center rounded-xl text-white shadow-sm transition hover:opacity-95"
              : primaryButtonClass
          }
        >
          <ShoppingCart className="h-4 w-4" />

          {useSecondLayout && (
            <span className="hidden md:inline ml-2">Add to Cart</span>
          )}

          {!useSecondLayout && "Add to Cart"}
        </button>

        <button
          type="button"
          onClick={handleCallVendor}
          disabled={!tenant.businessPhoneNumber}
          className={secondaryButtonClass}
        >
          <Phone className="h-4 w-4" />
          {hasRevealedPhone && tenant.businessPhoneNumber
            ? tenant.businessPhoneNumber
            : "Call Vendor"}
        </button>
      </div>
    </div>
  );
}
