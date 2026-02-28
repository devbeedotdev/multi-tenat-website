"use client";

import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/src/utils/string.utils";
import type { CartItem } from "@/types/cart";
import type { Tenant } from "@/types/tenant";

function getUnitPrice(item: CartItem): number {
  return item.discountPrice != null && item.discountPrice > 0
    ? item.discountPrice
    : item.productAmount;
}

type OrderSummaryPanelVariantBProps = {
  tenant: Tenant;
  domain: string;
  onPayNowClick: () => void;
};

export default function OrderSummaryPanelVariantB({
  tenant,
  domain: _domain,
  onPayNowClick,
}: OrderSummaryPanelVariantBProps) {
  const { items } = useCart();

  const subtotal = items.reduce(
    (sum, item) => sum + getUnitPrice(item) * item.selectedQuantity,
    0,
  );
  const currency = items[0]?.currency ?? "₦";

  return (
    <>
      <div className="font-sans">
        <h2 className="font-serif text-xl font-medium text-neutral-900">
          Order summary
        </h2>
        <ul className="mt-4 list-none" role="list">
          {items.map((item) => {
            const lineTotal =
              getUnitPrice(item) * item.selectedQuantity;
            return (
              <li
                key={item.productId}
                className="flex justify-between border-b-[0.5px] border-neutral-200 py-3 first:pt-0"
              >
                <span className="text-sm text-neutral-700">
                  {item.productName} × {item.selectedQuantity}
                </span>
                <span className="text-sm font-medium text-neutral-900">
                  {currency}
                  {formatPrice(lineTotal)}
                </span>
              </li>
            );
          })}
        </ul>
        <div
          className="flex justify-between border-b-[0.5px] border-neutral-200 py-4 font-medium"
        >
          <span className="font-serif text-neutral-900">Total</span>
          <span className="text-neutral-900">
            {currency}
            {formatPrice(subtotal)}
          </span>
        </div>
        <button
          type="button"
          onClick={onPayNowClick}
          disabled={items.length === 0}
          className="mt-6 w-full rounded-full py-3.5 text-sm font-medium text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
          style={{ backgroundColor: "var(--primary)" }}
        >
          Pay Now
        </button>
      </div>
    </>
  );
}
