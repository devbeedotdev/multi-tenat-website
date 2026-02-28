"use client";

import { useCart } from "@/context/CartContext";
import type { Tenant } from "@/types/tenant";
import { MessageCircle, Phone } from "lucide-react";
import { useState } from "react";

type ContactVendorCardProps = {
  tenant: Tenant;
};

export default function ContactVendorCard({ tenant }: ContactVendorCardProps) {
  const { clearCart, cartId, syncCartToCloud } = useCart();
  const [hasRevealedPhone, setHasRevealedPhone] = useState(false);

  const handleCallVendor = () => {
    if (!tenant.businessPhoneNumber) return;
    if (!hasRevealedPhone) {
      setHasRevealedPhone(true);
      return;
    }
    if (typeof window !== "undefined") {
      window.location.href = `tel:${tenant.businessPhoneNumber}`;
    }
  };

  const handleSendAutomatedMessage = async () => {
    if (cartId && syncCartToCloud) {
      await syncCartToCloud(cartId, []);
    }
    clearCart();
  };

  return (
    <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm md:p-6">
      <h2 className="text-lg font-bold text-slate-900 md:text-xl">
        Contact Details
      </h2>

      <div className="mt-4 flex flex-col gap-3">
        <button
          type="button"
          onClick={handleCallVendor}
          disabled={!tenant.businessPhoneNumber}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-50"
        >
          <Phone className="h-4 w-4" style={{ color: "var(--primary)" }} />
          {hasRevealedPhone && tenant.businessPhoneNumber
            ? tenant.businessPhoneNumber
            : "Call Vendor"}
        </button>

        <button
          type="button"
          onClick={handleSendAutomatedMessage}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-semibold transition hover:opacity-90"
          style={{
            borderColor: "var(--primary)",
            color: "var(--primary)",
            backgroundColor: "transparent",
          }}
        >
          <MessageCircle className="h-4 w-4" />
          Send Automated Message to Vendor
        </button>
      </div>

      <p className="mt-3 text-xs text-slate-500">
        Note: This sends a message containing the cart to the vendor and you can
        continue the payment process there. Sending will clear the current cart
        for privacy.
      </p>
    </div>
  );
}
