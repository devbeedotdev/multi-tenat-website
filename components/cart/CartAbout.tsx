"use client";

import { useCart } from "@/context/CartContext";
import type { Tenant } from "@/types/tenant";
import { User } from "lucide-react";
import { useMemo, useState } from "react";
import PaymentMethodModal from "./PaymentMethodModal";

type CartAboutProps = {
  tenant: Tenant;
  domain: string;
};

function getUnitPrice(item: {
  discountPrice?: number;
  productAmount: number;
  selectedQuantity: number;
}): number {
  const unit =
    item.discountPrice != null && item.discountPrice > 0
      ? item.discountPrice
      : item.productAmount;
  return unit * item.selectedQuantity;
}

export default function CartAboutCard({ tenant, domain }: CartAboutProps) {
  const { items } = useCart();
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + getUnitPrice(item), 0);
  }, [items]);

  return (
    <>
      <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm md:p-6">
        <h2 className="text-lg font-bold text-slate-900 md:text-xl">About</h2>

        <div className="mt-2 flex items-center gap-2 text-slate-700">
          <User
            className="h-5 w-5 shrink-0"
            style={{ color: "var(--primary)" }}
          />
          <div>
            <p className="font-medium">{tenant.businessName}</p>
            <p className="text-xs text-slate-500">
              {tenant.businessPhoneNumber}
            </p>
          </div>
        </div>
        {items.length > 0 ? (
          <button
            type="button"
            onClick={() => setShowPaymentModal(true)}
            className="mt-4 flex w-full items-center justify-center rounded-lg px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
            style={{ backgroundColor: "var(--primary)" }}
          >
            Proceed to Payment
          </button>
        ) : (
          <button
            type="button"
            disabled
            className="mt-4 flex w-full cursor-not-allowed items-center justify-center rounded-lg px-4 py-3 text-sm font-semibold text-white opacity-50 shadow-sm"
            style={{ backgroundColor: "var(--primary)" }}
          >
            Proceed to Payment
          </button>
        )}
      </div>
      <PaymentMethodModal
        open={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        tenant={tenant}
        domain={domain}
      />
    </>
  );
}
