"use client";

import { formatPrice } from "@/src/utils/string.utils";
import type { CartItem } from "@/types/cart";
import { Minus, Plus, X } from "lucide-react";
import Image from "next/image";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30";

function getUnitPrice(item: CartItem): number {
  return item.discountPrice != null && item.discountPrice > 0
    ? item.discountPrice
    : item.productAmount;
}

type CartItemCardVariantBProps = {
  item: CartItem;
  index: number;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
};

export default function CartItemCardVariantB({
  item,
  index,
  updateQuantity,
  removeFromCart,
}: CartItemCardVariantBProps) {
  const unitPrice = getUnitPrice(item);
  const currency = item.currency ?? "₦";

  return (
    <article
      className="group relative flex gap-0 overflow-hidden rounded-lg border border-neutral-100 bg-white py-3 animate-cart-item-in opacity-0"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Bigger Remove Button */}
      <button
        type="button"
        onClick={() => removeFromCart(item.productId)}
        className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-neutral-500 shadow-md transition hover:bg-white hover:text-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-300"
        aria-label={`Remove ${item.productName} from cart`}
      >
        <X className="h-4 w-4" strokeWidth={2.5} />
      </button>

      {/* Left Column (Image + Counter) */}
      <div className="flex flex-col items-center">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-neutral-100 md:h-24 md:w-24">
          <Image
            src={item.mediaUrls?.[0] || PLACEHOLDER_IMAGE}
            alt={item.productName}
            fill
            className="object-cover"
            sizes="96px"
          />
        </div>

        {/* Quantity Control Under Image */}
        <div className="mt-3 ml-4">
          <div className="inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50 px-1 shadow-sm">
            <button
              type="button"
              onClick={() =>
                updateQuantity(item.productId, item.selectedQuantity - 1)
              }
              disabled={item.selectedQuantity <= 1}
              className="flex h-8 w-8 items-center justify-center rounded-l-full text-neutral-600 transition hover:bg-neutral-100 active:scale-95 disabled:pointer-events-none disabled:opacity-40"
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </button>

            <span className="min-w-[2rem] px-2 text-center text-sm font-semibold text-neutral-900">
              {item.selectedQuantity}
            </span>

            <button
              type="button"
              onClick={() =>
                updateQuantity(item.productId, item.selectedQuantity + 1)
              }
              disabled={item.selectedQuantity >= item.quantityAvailable}
              className="flex h-8 w-8 items-center justify-center rounded-r-full text-neutral-600 transition hover:bg-neutral-100 active:scale-95 disabled:pointer-events-none disabled:opacity-40"
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Right Column (Details) */}
      <div className="min-w-0 flex-1">
        <h3 className="font-serif text-sm font-semibold leading-snug text-neutral-900 md:text-base">
          {item.productName}
        </h3>

        <p className="mt-1 text-xs text-neutral-500 line-clamp-1">
          {item.productCategory || item.shortDescription || "—"}
        </p>

        <p className="mt-2 text-sm font-semibold text-neutral-900">
          {currency}
          {formatPrice(unitPrice)}
          <span className="ml-1 text-xs font-normal text-neutral-500">
            / unit
          </span>
        </p>
      </div>
    </article>
  );
}
