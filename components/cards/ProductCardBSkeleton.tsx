export function ProductCardBSkeleton() {
    return (
      <div className="flex flex-col overflow-hidden rounded-xl bg-white shadow-sm animate-pulse">
        {/* Image Skeleton */}
        <div className="relative w-full h-36 sm:h-40 md:h-44 bg-slate-200" />
  
        {/* Content Skeleton */}
        <div className="flex flex-col gap-2 p-3">
          {/* Product Name Lines */}
          <div className="h-4 w-3/4 bg-slate-200 rounded" />
          <div className="h-4 w-1/2 bg-slate-200 rounded" />
  
          {/* Category */}
          <div className="h-3 w-1/4 bg-slate-100 rounded mt-1" />
  
          {/* Price & Quantity Section */}
          <div className="mt-2 flex items-center justify-between">
            <div className="flex flex-col gap-2 w-full">
              <div className="flex items-baseline gap-2">
                {/* Main Price */}
                <div className="h-5 w-20 bg-slate-200 rounded" />
                {/* Discount Price */}
                <div className="h-4 w-12 bg-slate-100 rounded" />
              </div>
              
              {/* Quantity info */}
              <div className="h-3 w-24 bg-slate-100 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  