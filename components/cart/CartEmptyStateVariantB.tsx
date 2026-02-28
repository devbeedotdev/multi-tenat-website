"use client";

import { Cloud } from "lucide-react";
import Link from "next/link";

type CartEmptyStateVariantBProps = {
  domain: string;
  handleSyncWithCloudClick: () => void;
};

export default function CartEmptyStateVariantB({
  domain,
  handleSyncWithCloudClick,
}: CartEmptyStateVariantBProps) {
  return (
    <div className="relative mx-auto flex max-w-lg flex-col items-center overflow-hidden rounded-2xl bg-white py-20 text-center">
      {/* Faint "00" background */}
      <span
        className="pointer-events-none absolute inset-0 select-none font-serif text-[12rem] font-extralight leading-none text-neutral-100"
        aria-hidden
      >
        00
      </span>

      <div className="relative">
        <h2 className="font-serif text-4xl font-medium text-neutral-900 md:text-5xl">
          Your cart is empty
        </h2>
        <p className="mt-4 text-sm text-neutral-500">
          Add pieces you love and they’ll appear here.
        </p>

        <Link
          href={`/${domain}`}
          className="mt-10 inline-block font-serif text-sm font-medium underline underline-offset-4 transition hover:text-neutral-600"
          style={{ color: "var(--primary)" }}
        >
          Return to Collection
        </Link>

        <button
          type="button"
          onClick={handleSyncWithCloudClick}
          className="mt-6 flex w-full items-center justify-center gap-2 text-sm font-medium transition hover:opacity-80"
          style={{ color: "var(--primary)" }}
        >
          <Cloud className="h-4 w-4" />
          Sync with Cloud
        </button>
      </div>
    </div>
  );
}
