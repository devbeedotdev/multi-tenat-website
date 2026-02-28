"use client";

import { ToastProvider } from "@/context/ToastContext";
import { CartProvider } from "@/context/CartContext";
import { syncCartToCloud } from "@/lib/actions";
import type { ReactNode } from "react";
import CartFAB from "./CartFAB";

type CartProviderWithSyncProps = {
  children: ReactNode;
  domain: string;
};

export default function CartProviderWithSync({
  children,
  domain,
}: CartProviderWithSyncProps) {
  return (
    <ToastProvider>
      <CartProvider domain={domain} syncCartToCloud={syncCartToCloud}>
        {children}
        <CartFAB domain={domain} />
      </CartProvider>
    </ToastProvider>
  );
}
