"use client";

import { PackagePlus, ShoppingBag } from "lucide-react";
import Link from "next/link";

type CartEmptyStateVariantCProps = {
  domain: string;
  handleSyncWithCloudClick: () => void;
};

export default function CartEmptyStateVariantC({
  domain,
  handleSyncWithCloudClick,
}: CartEmptyStateVariantCProps) {
  return (
    <div className="mx-auto flex max-w-sm flex-col items-center rounded-3xl bg-white p-8 text-center shadow-sm">
      {/* Ghost / clean icon */}
      <div
        className="mb-6 flex h-24 w-24 items-center justify-center rounded-full"
        style={{
          backgroundColor: "color-mix(in srgb, var(--primary) 12%, transparent)",
        }}
      >
        <PackagePlus
          className="h-12 w-12"
          style={{ color: "var(--primary)" }}
        />
      </div>

      <h2 className="text-xl font-bold text-gray-900">
        Your cart is empty
      </h2>
      <p className="mt-2 text-sm text-gray-500">
        Discover something you’ll love.
      </p>

      <Link
        href={`/${domain}`}
        className="mt-8 w-full rounded-lg py-4 text-center text-sm font-semibold text-white transition active:scale-[0.98]"
        style={{ backgroundColor: "var(--primary)" }}
      >
        Discover Products
      </Link>

      <button
        type="button"
        onClick={handleSyncWithCloudClick}
        className="mt-4 text-sm font-medium text-gray-500 underline underline-offset-2 transition hover:text-gray-700"
      >
        Sync with Cloud
      </button>
    </div>
  );
}
