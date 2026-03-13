"use client";

import {
  MAIN_DOMAIN,
  PLATFORM_BRAND_NAME,
  PLATFORM_LOGO_URL,
  PLATFORM_FAVICON_URL,
  PLATFORM_MARKETING_LINE,
} from "@/lib/config/platform";
import { processCheckout } from "@/lib/services/payments";
import type { Result } from "../../types/result";
import type { LandingOrder } from "@/types/order";
import type { Tenant } from "@/types/tenant";
import { Loader2, X } from "lucide-react";
import { useState } from "react";

type CreateLandingOrderInput = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  businessName: string;
};

type LandingOrderModalProps = {
  open: boolean;
  onClose: () => void;
  createOrderAction: (
    input: CreateLandingOrderInput,
  ) => Promise<Result<LandingOrder>>;
  completePaymentAction: (
    orderId: string,
    paystackReference: string,
  ) => Promise<Result<LandingOrder>>;
};

export default function LandingOrderModal({
  open,
  onClose,
  createOrderAction,
  completePaymentAction,
}: LandingOrderModalProps) {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!open) return null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isSubmitting) return;

    setErrorMessage(null);
    setSuccessMessage(null);

    if (!customerName || !customerEmail || !customerPhone || !businessName) {
      setErrorMessage("Please fill in all fields to continue.");
      return;
    }

    setIsSubmitting(true);

    try {
      const createResult = await createOrderAction({
        customerName,
        customerEmail,
        customerPhone,
        businessName,
      });

      if (!createResult.ok) {
        setErrorMessage(
          createResult.error ||
            "We could not create your order. Please try again.",
        );
        setIsSubmitting(false);
        return;
      }

      const order = createResult.data;

      const tenantLike: Tenant = {
        tenantId: MAIN_DOMAIN,
        businessName: PLATFORM_BRAND_NAME,
        accountName: PLATFORM_BRAND_NAME,
        businessPhoneNumber: customerPhone,
        businessEmail: customerEmail,
        adminPassword: "",
        variant: "A",
        primaryColor: "#16A34A",
        businessDescription: PLATFORM_MARKETING_LINE,
        websiteDisplayName: PLATFORM_BRAND_NAME,
        bankAccountNumber: "",
        bankName: "",
        favIcon: PLATFORM_FAVICON_URL,
        isLogoHorizontal: true,
        logoUrl: PLATFORM_LOGO_URL,
        currency: "₦",
        createdAt: new Date().toISOString(),
      };

      const amount = 50000;
      const result = await processCheckout(tenantLike, [], amount);

      if (!result.success) {
        setErrorMessage(
          "Unable to process payment at the moment. Please check your network and try again.",
        );
        setIsSubmitting(false);
        return;
      }

      const paystackReference = `PSK-${Date.now()}`;
      const paymentResult = await completePaymentAction(
        order.orderId,
        paystackReference,
      );

      if (!paymentResult.ok) {
        setErrorMessage(
          paymentResult.error ||
            "Your payment was successful, but we could not complete your order. Please contact support.",
        );
        setIsSubmitting(false);
        return;
      }

      setSuccessMessage(
        "Payment successful! Your ecommerce website order has been received. We will contact you shortly.",
      );
      setIsSubmitting(false);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      setErrorMessage(
        "A network error occurred while processing your order. Please check your connection and try again.",
      );
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setCustomerName("");
    setCustomerEmail("");
    setCustomerPhone("");
    setBusinessName("");
    setErrorMessage(null);
    setSuccessMessage(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      <div
        className="absolute inset-0 bg-black/50"
        aria-hidden
        onClick={handleClose}
      />
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Order your ecommerce website
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Fill in your details and we&apos;ll deliver your store in about 30
              minutes after successful payment.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-full p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close order form"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <label className="space-y-1">
              <span className="block text-xs font-medium text-slate-700">
                Your name
              </span>
              <input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-400"
                placeholder="E.g. Adaeze Okafor"
              />
            </label>

            <label className="space-y-1">
              <span className="block text-xs font-medium text-slate-700">
                Email address
              </span>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-400"
                placeholder="you@example.com"
              />
            </label>

            <label className="space-y-1">
              <span className="block text-xs font-medium text-slate-700">
                Phone number (WhatsApp)
              </span>
              <input
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-400"
                placeholder="Format: 234..."
              />
            </label>

            <label className="space-y-1">
              <span className="block text-xs font-medium text-slate-700">
                Business name
              </span>
              <input
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-400"
                placeholder="E.g. Lagos Fashion Hub"
              />
            </label>
          </div>

          <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
            You&apos;ll be charged <span className="font-semibold">₦50,000</span>{" "}
            for a full ecommerce website, including product catalog, cart,
            orders, WhatsApp checkout and admin dashboard.
          </div>

          {errorMessage && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
              {successMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-80"
          >
            {isSubmitting && (
              <Loader2 className="h-4 w-4 animate-spin text-white" />
            )}
            {isSubmitting ? "Processing payment..." : "Pay ₦50,000 and order website"}
          </button>
        </form>
      </div>
    </div>
  );
}

