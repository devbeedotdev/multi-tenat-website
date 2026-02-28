"use client";

import { useCart } from "@/context/CartContext";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

type CartFABProps = {
  domain: string;
};

export default function CartFAB({ domain }: CartFABProps) {
  const { items } = useCart();
  const count = items.reduce((sum, item) => sum + item.selectedQuantity, 0);

  return (
    <Link
      href={`/${domain}/cart`}
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)]"
      style={{
        backgroundColor: "var(--primary)",
        color: "white",
      }}
      aria-label={count > 0 ? `View cart (${count} items)` : "View cart"}
    >
      <ShoppingCart className="h-6 w-6" />
      {count > 0 && (
        <span
          className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white px-1 text-xs font-bold"
          style={{ backgroundColor: "var(--primary)", color: "white" }}
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
