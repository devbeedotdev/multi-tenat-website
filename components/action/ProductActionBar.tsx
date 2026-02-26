"use client";

import type { Product } from "@/types/product";
import type { Tenant } from "@/types/tenant";
import { Minus, Phone, Plus, ShoppingCart } from "lucide-react";
import { useState } from "react";

type ProductActionBarProps = {
  tenant: Tenant;
  product: Product;
};

export default function ProductActionBar({
  tenant,
  product,
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

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      {/* Quantity Selector */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Quantity
        </span>

        <div className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-1">
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

        <span className="text-xs text-slate-500">of {maxQty} available</span>
      </div>

      {/* Primary & Secondary Actions */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-end">
        <button
          type="button"
          style={{ backgroundColor: "var(--primary)" }}
          className="inline-flex w-full gap-2 items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 md:w-auto"
        >
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </button>

        <button
          type="button"
          onClick={handleCallVendor}
          disabled={!tenant.businessPhoneNumber}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-50 md:w-auto"
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
