export function ProductCardCSkeleton() {
    return (
      <div className="group relative rounded-2xl border border-gray-200 bg-white p-4 shadow-sm animate-pulse">
        {/* Top Section */}
        <div className="flex flex-row gap-3">
          {/* Product Image Skeleton */}
          <div className="relative w-2/4 h-24 rounded-xl bg-gray-200" />
  
          {/* Product Details Column Skeleton */}
          <div className="w-3/5 flex flex-col justify-between py-1">
            <div className="space-y-2">
              {/* Title lines */}
              <div className="h-3 w-full bg-gray-200 rounded" />
              <div className="h-3 w-2/3 bg-gray-200 rounded" />
  
              {/* Category */}
              <div className="h-2 w-1/2 bg-gray-100 rounded" />
            </div>
  
            {/* Quantity info */}
            <div className="h-2 w-1/3 bg-gray-100 rounded" />
          </div>
        </div>
  
        {/* Description Skeleton */}
        <div className="mt-4 space-y-2">
          <div className="h-3 w-full bg-gray-100 rounded" />
          <div className="h-3 w-5/6 bg-gray-100 rounded" />
        </div>
  
        {/* Price Skeleton */}
        <div className="mt-4 flex items-baseline gap-2">
          <div className="h-5 w-20 bg-gray-200 rounded" />
          <div className="h-3 w-12 bg-gray-100 rounded" />
        </div>
  
        {/* Button Skeleton */}
        <div className="mt-5 w-full h-8 rounded-lg bg-gray-200" />
      </div>
    );
  }
  