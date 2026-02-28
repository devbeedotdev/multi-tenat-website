"use client";

/**
 * Skeleton UI that mirrors Variant A Cart Summary layout.
 * Shown while CartContext is hydrating from localStorage and/or syncing with getCartById.
 */
export default function CartSummarySkeleton() {
  return (
    <div className="min-h-[60vh] bg-slate-50">
      <div className="mx-auto w-full max-w-6xl px-3 py-6 pb-24 md:px-6 lg:pb-6">
      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        {/* Left column: ghost cart item cards */}
        <div className="min-w-0 space-y-4">
          <div className="h-7 w-32 rounded bg-slate-200 animate-pulse" aria-hidden />
          <ul className="flex flex-col gap-4" role="list" aria-busy="true" aria-label="Loading cart">
            {[1, 2, 3].map((i) => (
              <li key={i}>
                <article className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                  <div className="flex gap-4">
                    <div className="h-24 w-24 shrink-0 rounded-lg bg-slate-200 animate-pulse md:h-28 md:w-28" />
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="h-4 w-3/4 rounded bg-slate-200 animate-pulse" />
                      <div className="h-3 w-1/2 rounded bg-slate-200 animate-pulse" />
                      <div className="h-3 w-1/4 rounded bg-slate-200 animate-pulse" />
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
                    <div className="h-9 w-28 rounded-lg bg-slate-200 animate-pulse" />
                    <div className="h-8 w-16 rounded bg-slate-200 animate-pulse" />
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>

        {/* Right column: sidebar (Total + Order Summary / Proceed to Payment) */}
        <div className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm md:p-5">
            <div className="h-3 w-14 rounded bg-slate-200 animate-pulse" aria-hidden />
            <div className="mt-2 h-8 w-24 rounded bg-slate-200 animate-pulse" aria-hidden />
          </div>
          <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm md:p-6">
            <div className="h-5 w-24 rounded bg-slate-200 animate-pulse" aria-hidden />
            <div className="mt-3 h-3 w-full rounded bg-slate-200 animate-pulse" aria-hidden />
            <div className="mt-2 h-3 w-2/3 rounded bg-slate-200 animate-pulse" aria-hidden />
            <div className="mt-4 h-12 w-full rounded-lg bg-slate-200 animate-pulse" aria-hidden />
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
