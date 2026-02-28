"use client";

import { Cloud, ShoppingBag } from "lucide-react";
import Link from "next/link";

type CartEmptyStateProps = {
  domain: string;
  handleSyncWithCloudClick: () => void;
};
export default function CartEmptyState({
  domain,
  handleSyncWithCloudClick,
}: CartEmptyStateProps) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-slate-100 bg-white px-8 py-14 text-center shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
      {/* Icon */}

      <div
        className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl"
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--primary) 20%, transparent)",
        }}
      >
        <ShoppingBag className="h-9 w-9" style={{ color: "var(--primary)" }} />
      </div>

      {/* Heading */}
      <h2 className="text-xl font-semibold text-slate-900">
        Your cart is empty
      </h2>

      {/* Description */}
      <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-500">
        Looks like you haven’t added anything yet. Start exploring the store and
        add items to your cart.
      </p>

      {/* Primary CTA */}
      <Link
        href={`/${domain}`}
        className="mt-8 inline-flex w-full items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:scale-[1.02] hover:opacity-95 active:scale-[0.98]"
        style={{ backgroundColor: "var(--primary)" }}
      >
        Continue Shopping
      </Link>

      {/* Secondary CTA */}
      <button
        type="button"
        onClick={handleSyncWithCloudClick}
        className="mt-4 inline-flex items-center gap-2 text-sm font-medium transition hover:opacity-80"
        style={{ color: "var(--primary)" }}
      >
        <Cloud className="h-4 w-4" />
        Sync with Cloud
      </button>
    </div>
  );
}
