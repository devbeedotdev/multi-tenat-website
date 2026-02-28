"use client";

import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/src/utils/string.utils";
import type { CartItem } from "@/types/cart";
import { Loader2 } from "lucide-react";

function getUnitPrice(item: CartItem): number {
  return item.discountPrice != null && item.discountPrice > 0
    ? item.discountPrice
    : item.productAmount;
}

export default function CartTotalCard() {
  const { items, isSyncing } = useCart();
  const total = items.reduce((sum, item) => {
    const unit = getUnitPrice(item);
    return sum + unit * item.selectedQuantity;
  }, 0);
  const currency = items[0]?.currency ?? "₦";

  return (
    <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm md:p-5">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        Total
      </h2>
      <div className="mt-2 flex items-center gap-2">
        <p className="text-xl font-bold text-slate-900 md:text-2xl">
          {currency}
          {formatPrice(total)}
        </p>
        {isSyncing && (
          <span className="flex items-center gap-1 text-xs text-slate-500" aria-live="polite">
            <Loader2 className="h-3.5 w-3.5 animate-spin" style={{ color: "var(--primary)" }} />
            Syncing...
          </span>
        )}
      </div>
    </div>
  );
}
