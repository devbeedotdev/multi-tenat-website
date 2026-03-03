"use client";

import { formatPrice } from "@/src/utils/string.utils";
import type { CartItem } from "@/types/cart";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";

function getUnitPrice(item: CartItem): number {
  return item.discountPrice != null && item.discountPrice > 0
    ? item.discountPrice
    : item.productAmount;
}

type CartItemCardVariantCProps = {
  item: CartItem;
  index: number;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
};

export default function CartItemCardVariantC({
  item,
  index,
  updateQuantity,
  removeFromCart,
}: CartItemCardVariantCProps) {
  const unitPrice = getUnitPrice(item);
  const currency = item.currency ?? "₦";
  const lineTotal = unitPrice * item.selectedQuantity;

  return (
    <article
      className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm animate-cart-item-in opacity-0"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gray-100">
        <Image
          src={item.mediaUrls[0]}
          alt={item.productName}
          fill
          className="object-cover"
          sizes="56px"
        />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
          {item.productName}
        </h3>
        <p className="mt-0.5 text-xs text-gray-500 line-clamp-1">
          {item.productCategory || "—"}
        </p>
        <p className="mt-1 text-sm font-semibold" style={{ color: "var(--primary)" }}>
          {currency}
          {formatPrice(lineTotal)}
        </p>
      </div>

      <div className="flex flex-col items-end gap-2">
        <div className="inline-flex items-center rounded-full bg-gray-100">
          <button
            type="button"
            onClick={() =>
              updateQuantity(item.productId, item.selectedQuantity - 1)
            }
            disabled={item.selectedQuantity <= 1}
            className="flex h-8 w-8 items-center justify-center rounded-l-full text-gray-600 transition active:scale-95 disabled:pointer-events-none disabled:opacity-40"
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="min-w-[1.75rem] text-center text-sm font-medium text-gray-900">
            {item.selectedQuantity}
          </span>
          <button
            type="button"
            onClick={() =>
              updateQuantity(item.productId, item.selectedQuantity + 1)
            }
            disabled={item.selectedQuantity >= item.quantityAvailable}
            className="flex h-8 w-8 items-center justify-center rounded-r-full text-gray-600 transition active:scale-95 disabled:pointer-events-none disabled:opacity-40"
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <button
          type="button"
          onClick={() => removeFromCart(item.productId)}
          className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition hover:bg-red-50 hover:text-red-600"
          aria-label={`Remove ${item.productName} from cart`}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}
