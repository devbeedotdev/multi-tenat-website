"use client";

/**
 * Skeleton for Variant B cart: split-screen layout with editorial-style cards.
 * Prevents layout shift while CartContext hydrates and syncs.
 */
export default function VariantBSkeleton() {
  return (
    <div className="min-h-[60vh] bg-white">
      <div className="mx-auto w-full max-w-7xl px-3 py-6 pb-24 md:px-6 md:pb-6">
        <div className="grid gap-8 lg:grid-cols-[1fr,360px]">
          {/* Left: ghost item cards (compact horizontal layout) */}
          <div className="min-w-0 space-y-3">
            <div className="h-7 w-28 rounded bg-neutral-200 animate-pulse font-serif" aria-hidden />
            <ul className="mt-4 flex flex-col gap-3" role="list" aria-busy="true" aria-label="Loading cart">
              {[1, 2, 3].map((i) => (
                <li key={i}>
                  <div className="flex gap-3 rounded-lg border border-neutral-100 bg-white p-3">
                    <div className="h-20 w-20 shrink-0 rounded-lg bg-neutral-200 animate-pulse md:h-24 md:w-24" />
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="h-3.5 w-3/4 rounded bg-neutral-200 animate-pulse" />
                      <div className="h-3 w-1/2 rounded bg-neutral-200 animate-pulse" />
                      <div className="h-3 w-1/4 rounded bg-neutral-200 animate-pulse" />
                      <div className="mt-2 h-6 w-24 rounded-full bg-neutral-200 animate-pulse" />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: order summary list (hairline style) */}
          <div className="hidden lg:block">
            <div className="sticky top-24 space-y-4">
              <div className="h-6 w-32 rounded bg-neutral-200 animate-pulse font-serif" aria-hidden />
              <div className="space-y-0">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex justify-between border-b-[0.5px] border-neutral-200 py-3"
                  >
                    <div className="h-4 w-24 rounded bg-neutral-200 animate-pulse" />
                    <div className="h-4 w-16 rounded bg-neutral-200 animate-pulse" />
                  </div>
                ))}
              </div>
              <div className="flex justify-between border-b-[0.5px] border-neutral-200 py-4">
                <div className="h-4 w-12 rounded bg-neutral-200 animate-pulse" />
                <div className="h-5 w-20 rounded bg-neutral-200 animate-pulse" />
              </div>
              <div className="h-12 w-full rounded-full bg-neutral-200 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile bottom bar placeholder */}
      <div className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-between border-t border-neutral-200 bg-white/95 px-4 py-3 backdrop-blur-sm md:hidden">
        <div className="h-6 w-20 rounded bg-neutral-200 animate-pulse" />
        <div className="h-11 w-28 rounded-full bg-neutral-200 animate-pulse" />
      </div>
    </div>
  );
}
