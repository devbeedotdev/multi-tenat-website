import type { TenantVariant } from "@/types/tenant";

type NoProductProps = {
  variant: TenantVariant;
  tenantName?: string;
  contactPhone?: string;
};

export function NoProduct({ variant, tenantName, contactPhone }: NoProductProps) {
  const title = tenantName || "This store";

  const contactHref = contactPhone
    ? `https://wa.me/${contactPhone.replace(/\D/g, "")}`
    : "#";

  if (variant === "A") {
    // Minimalist
    return (
      <section className="flex flex-col items-center justify-center py-16 text-center text-slate-600">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-50 ring-1 ring-slate-200">
          <span className="text-2xl">🛍️</span>
        </div>
        <h2 className="text-base font-semibold text-slate-900">
          No products found
        </h2>
        <p className="mt-1 max-w-sm text-xs text-slate-500">
          {title} hasn&apos;t added any products yet. You can reach out to the
          vendor directly to ask about available items.
        </p>
        {contactPhone && (
          <a
            href={contactHref}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-slate-800"
          >
            Contact vendor
          </a>
        )}
      </section>
    );
  }

  if (variant === "B") {
    // Modern / bold
    return (
      <section className="py-16">
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-10 text-slate-50 shadow-lg">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
                Store update
              </p>
              <h2 className="text-xl font-semibold md:text-2xl">
                {title} is getting ready
              </h2>
              <p className="text-sm text-slate-200/80">
                The vendor is currently setting up products and pricing. Please
                check back soon to see the full catalog.
              </p>
            </div>
            <div className="mt-4 flex shrink-0 items-center justify-center md:mt-0">
              <div className="relative h-20 w-20 rounded-2xl bg-emerald-400/10 ring-1 ring-emerald-300/40">
                <div className="absolute inset-3 rounded-xl bg-gradient-to-br from-emerald-400 to-sky-400 opacity-80" />
                <div className="absolute inset-0 flex items-center justify-center text-3xl">
                  🧱
                </div>
              </div>
            </div>
          </div>
          <p className="mt-4 text-[11px] text-slate-300/80">
            Tip: You can save this page or share it with others – new products
            will appear here automatically once the store goes live.
          </p>
        </div>
      </section>
    );
  }

  // Variant C – playful / banner style
  return (
    <section className="mt-4 rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/70 px-4 py-6 text-sm text-emerald-900 shadow-sm">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
            Store is stocking up
          </p>
          <h2 className="text-base font-semibold">
            {title} is preparing fresh products
          </h2>
          <p className="text-xs text-emerald-900/80">
            You&apos;re early! The shelves are still being arranged. As soon as
            the vendor adds items, they&apos;ll appear here with prices and
            photos.
          </p>
        </div>
        <div className="mt-3 flex items-center gap-2 md:mt-0">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-sm font-semibold text-white">
            ✨
          </span>
          <span className="text-[11px] text-emerald-900/80">
            Check back later today or bookmark this page.
          </span>
        </div>
      </div>
    </section>
  );
}

