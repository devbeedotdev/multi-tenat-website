"use client";

import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { processCheckout } from "@/lib/services/payments";
import { formatPrice } from "@/src/utils/string.utils";
import type { CartItem } from "@/types/cart";
import type { Tenant } from "@/types/tenant";
import { ArrowLeft, Building2, CreditCard, Loader2, X } from "lucide-react";
import { useCallback, useState } from "react";

type View = "choice" | "bank_transfer" | "paystack_loading";

function getUnitPrice(item: CartItem): number {
  return item.discountPrice != null && item.discountPrice > 0
    ? item.discountPrice
    : item.productAmount;
}

function buildWhatsAppBankTransferMessage(
  tenant: Tenant,
  items: CartItem[],
  total: number,
  userName: string,
): string {
  const lines = items.map((item) => {
    const unit = getUnitPrice(item);
    const lineTotal = unit * item.selectedQuantity;
    return `${item.selectedQuantity}x ${item.productName} (₦${formatPrice(lineTotal)})`;
  });
  return [
    `Hello ${tenant.businessName}, I just made a Bank Transfer for my order:`,
    "",
    ...lines,
    "",
    `Total: ₦${formatPrice(total)}`,
    `Name: ${userName}`,
  ].join("\n");
}

type PaymentMethodModalProps = {
  open: boolean;
  onClose: () => void;
  tenant: Tenant;
  domain: string;
};

export default function PaymentMethodModal({
  open,
  onClose,
  tenant,
}: PaymentMethodModalProps) {
  const { items, cartId, cartName, clearCart, syncCartToCloud } = useCart();
  const { showToast } = useToast();
  const [view, setView] = useState<View>("choice");
  const [isPaystackProcessing, setIsPaystackProcessing] = useState(false);

  const total = items.reduce(
    (sum, item) => sum + getUnitPrice(item) * item.selectedQuantity,
    0,
  );

  const handlePaystackPayment = useCallback(async () => {
    if (!cartId || !syncCartToCloud) return;
    setIsPaystackProcessing(true);
    setView("paystack_loading");

    const result = await processCheckout(tenant, items, total);

    if (result.success) {
      showToast("Payment Successful!");
      await syncCartToCloud(cartId, []);
      clearCart();
      setIsPaystackProcessing(false);
      onClose();
    } else {
      setIsPaystackProcessing(false);
      setView("choice");
      showToast("Unable to process payment. Please try again.");
    }
  }, [
    cartId,
    syncCartToCloud,
    clearCart,
    showToast,
    onClose,
    tenant,
    items,
    total,
  ]);

  const handleBankTransferConfirm = useCallback(() => {
    if (!tenant.businessPhoneNumber || items.length === 0) return;
    const phone = tenant.businessPhoneNumber.replace(/\D/g, "");
    const message = buildWhatsAppBankTransferMessage(
      tenant,
      items,
      total,
      cartName ?? "Customer",
    );
    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${phone}?text=${encoded}`;
    window.open(url, "_blank", "noopener,noreferrer");
    onClose();
  }, [tenant, items, total, cartName, onClose]);

  const handleClose = useCallback(() => {
    if (!isPaystackProcessing) {
      setView("choice");
      onClose();
    }
  }, [onClose, isPaystackProcessing]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50"
        aria-hidden
        onClick={handleClose}
      />
      <div
        className="relative w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-modal-title"
      >
        {view === "choice" && (
          <>
            <div className="mb-4 flex items-center justify-between">
              <h2
                id="payment-modal-title"
                className="text-lg font-semibold text-slate-900"
              >
                Choose payment method
              </h2>
              <button
                type="button"
                onClick={handleClose}
                className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mb-4 text-sm text-slate-600">
              Select how you would like to pay for your order.
            </p>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => setView("bank_transfer")}
                className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-slate-300 hover:bg-slate-50"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100" style={{ color: "var(--primary)" }}>
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Local Bank Transfer</p>
                  <p className="text-xs text-slate-500">Pay manually to the business account</p>
                </div>
              </button>
              <button
                type="button"
                onClick={handlePaystackPayment}
                className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-slate-300 hover:bg-slate-50"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100" style={{ color: "var(--primary)" }}>
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Pay with Card/Bank (Paystack)</p>
                  <p className="text-xs text-slate-500">Secure online payment</p>
                </div>
              </button>
            </div>
          </>
        )}

        {view === "bank_transfer" && (
          <>
            <div className="mb-4 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setView("choice")}
                className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Back"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h2 id="payment-modal-title" className="text-lg font-semibold text-slate-900">
                Bank account details
              </h2>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Account name
              </p>
              <p className="mt-1 font-medium text-slate-900">{tenant.accountName}</p>
              <p className="mt-3 text-xs font-medium uppercase tracking-wide text-slate-500">
                Account number
              </p>
              <p className="mt-1 font-medium text-slate-900">{tenant.bankAccountNumber}</p>
              <p className="mt-3 text-xs font-medium uppercase tracking-wide text-slate-500">
                Bank
              </p>
              <p className="mt-1 font-medium text-slate-900">{tenant.bankName}</p>
            </div>
            <p className="mt-3 text-xs text-slate-500">
              After transferring ₦{formatPrice(total)}, click below to notify the business via WhatsApp.
            </p>
            <button
              type="button"
              onClick={handleBankTransferConfirm}
              className="mt-4 flex w-full items-center justify-center rounded-lg px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
              style={{ backgroundColor: "var(--primary)" }}
            >
              I&apos;ve Sent the Money
            </button>
          </>
        )}

        {view === "paystack_loading" && (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2
              className="h-12 w-12 animate-spin"
              style={{ color: "var(--primary)" }}
            />
            <p className="mt-4 text-sm font-medium text-slate-700">
              Processing Payment...
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Please wait while we complete your payment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
