"use client";

import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/src/utils/string.utils";
import type { CartItem } from "@/types/cart";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";

function getUnitPrice(item: CartItem): number {
  return item.discountPrice != null && item.discountPrice > 0
    ? item.discountPrice
    : item.productAmount;
}

export default function CartSummarySection() {
  const { items, updateQuantity, removeFromCart } = useCart();

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-slate-900 md:text-xl">
        Cart Summary
      </h2>

      <ul className="flex flex-col gap-4" role="list">
        {items.map((item) => {
          const unitPrice = getUnitPrice(item);
          const currency = item.currency ?? "₦";
          return (
            <li key={item.productId}>
              <article className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                {/* Top row: thumbnail (left) + content (right) */}
                <div className="flex gap-4">
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-100 md:h-28 md:w-28">
                    <Image
                      src={item.mediaUrls[0]}
                      alt={item.productName}
                      fill
                      className="object-cover"
                      sizes="112px"
                    />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <h3 className="font-semibold text-slate-900">
                      {item.productName}
                    </h3>
                    <p className="text-sm text-slate-500 line-clamp-2">
                      {item.productCategory || item.shortDescription || "—"}
                    </p>
                    <p className="text-sm font-medium text-slate-700">
                      {currency}
                      {formatPrice(unitPrice)}
                      <span className="font-normal text-slate-500"> / unit</span>
                    </p>
                  </div>
                </div>

                {/* Bottom row: quantity selector + remove */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
                  <div className="inline-flex items-center rounded-lg border border-slate-200 bg-white">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          item.selectedQuantity - 1,
                        )
                      }
                      disabled={item.selectedQuantity <= 1}
                      className="flex h-9 w-9 items-center justify-center rounded-l-md transition hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-50"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-4 w-4 text-slate-600" />
                    </button>
                    <span className="min-w-[2rem] px-2 text-center text-sm font-medium text-slate-900">
                      {item.selectedQuantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          item.selectedQuantity + 1,
                        )
                      }
                      disabled={
                        item.selectedQuantity >= item.quantityAvailable
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-r-md transition hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-50"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-4 w-4 text-slate-600" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.productId)}
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                    aria-label={`Remove ${item.productName} from cart`}
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </button>
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
