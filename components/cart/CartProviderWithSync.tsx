"use client";

import { ToastProvider } from "@/context/ToastContext";
import { CartProvider } from "@/context/CartContext";
import { syncCartToCloud } from "@/lib/actions";
import type { TenantVariant } from "@/types/tenant";
import type { ReactNode } from "react";
import CartFAB from "./CartFAB";

type CartProviderWithSyncProps = {
  children: ReactNode;
  domain: string;
  variant?: TenantVariant;
};

export default function CartProviderWithSync({
  children,
  domain,
  variant = "A",
}: CartProviderWithSyncProps) {
  return (
    <ToastProvider>
      <CartProvider domain={domain} syncCartToCloud={syncCartToCloud}>
        {children}
        <CartFAB domain={domain} variant={variant} />
      </CartProvider>
    </ToastProvider>
  );
}
