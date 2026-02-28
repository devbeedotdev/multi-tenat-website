"use client";

/**
 * Skeleton for Variant C cart: app-style single column with card list and bottom bar.
 * Prevents layout shift while CartContext hydrates and syncs.
 */
export default function VariantCSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-8">
      <div className="mx-auto w-full max-w-2xl px-3 py-6 md:px-6">
        <div className="h-7 w-24 rounded-lg bg-gray-200 animate-pulse" aria-hidden />
        <ul className="mt-4 flex flex-col gap-3" role="list" aria-busy="true" aria-label="Loading cart">
          {[1, 2, 3, 4].map((i) => (
            <li key={i}>
              <div className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm">
                <div className="h-14 w-14 shrink-0 rounded-xl bg-gray-200 animate-pulse" />
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-gray-200 animate-pulse" />
                  <div className="h-3 w-1/2 rounded bg-gray-200 animate-pulse" />
                  <div className="h-4 w-16 rounded bg-gray-200 animate-pulse" />
                </div>
                <div className="h-8 w-24 rounded-full bg-gray-200 animate-pulse" />
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom bar placeholder */}
      <div className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-between gap-4 border-t border-gray-200 bg-white px-4 py-4 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] md:max-w-2xl md:left-1/2 md:right-auto md:-translate-x-1/2 md:rounded-t-2xl md:px-6">
        <div className="h-10 w-20 rounded bg-gray-200 animate-pulse" />
        <div className="h-12 flex-1 max-w-[200px] rounded-xl bg-gray-200 animate-pulse" />
      </div>
    </div>
  );
}
