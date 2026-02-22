export function ProductCardASkeleton() {
  return (
    <article className="flex w-full flex-col overflow-hidden rounded-lg bg-white shadow-md">
      {/* Image Skeleton */}
      <div className="animate-pulse bg-slate-200 w-full sm:h-44 h-40" />

      {/* Content Skeleton */}
      <div className="flex flex-1 flex-col justify-between gap-3 p-3">
        <div className="flex flex-col gap-1">
          {/* Title */}
          <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
          <div className="mt-1 h-4 w-1/2 animate-pulse rounded bg-slate-200" />

          {/* Category */}
          <div className="mt-2 h-3 w-1/4 animate-pulse rounded bg-slate-100" />

          {/* Short Description */}
          <div className="mt-2 h-3 w-full animate-pulse rounded bg-slate-100" />
          <div className="mt-1 h-3 w-5/6 animate-pulse rounded bg-slate-100" />

          {/* Price */}
          <div className="mt-3 h-6 w-1/3 animate-pulse rounded bg-slate-200" />

          {/* Quantity */}
          <div className="mt-2 h-3 w-1/4 animate-pulse rounded bg-slate-100" />
        </div>

        {/* Button Skeleton */}
        <div className="mt-2 h-8 w-full animate-pulse rounded-lg bg-slate-200" />
      </div>
    </article>
  );
}

export function ProductGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: count }).map((_, idx) => (
        <ProductCardASkeleton key={idx} />
      ))}
    </div>
  );
}
