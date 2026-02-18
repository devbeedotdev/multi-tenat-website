import type { Product, ProductCardProps } from "@/types/product";
import Image from "next/image";

import {
  capitalize,
  capitalizeFirstWords,
  formatPrice,
  toUpper,
} from "@/src/utils/string.utils";

const primaryImage = (product: Product) =>
  product.productImageUrls[0] ??
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30";

export function ProductCardC({ product }: ProductCardProps) {
  const price =
    product.discountPrice == undefined || product.discountPrice === 0
      ? product.productAmount
      : product.discountPrice;
  const currency = product.currency ?? "₦";

  return (
    <div className="group relative rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      {/* Top Section */}
      <div className="flex flex-row gap-3">
        {/* Product Image */}
        <div className="relative w-2/4 h-24 rounded-xl overflow-hidden bg-gray-100">
          <Image
            src={primaryImage(product)}
            alt={product.productName}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Product Details Column */}
        <div className="w-3/5 flex flex-col justify-between">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">
              {capitalizeFirstWords(product.productName)}
            </h3>

            {/* Category */}
            <p className="text-xs text-gray-500">
              {toUpper(product.productCategory)}
            </p>

            {/* Promo Tag */}
            {product.isPromo && (
              <span className="inline-block text-[10px] font-semibold text-white bg-red-500 px-2 py-0.5 rounded-full">
                Promo
              </span>
            )}
          </div>

          {product.quantityAvailable > 0 ? (
            <span className="text-xs font-medium text-amber-600">
              Qty left: {formatPrice(product.quantityAvailable)}
            </span>
          ) : (
            <span className="italic text-xs font-medium text-red-500">
              Out of stock
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="mt-3">
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
          {capitalize(product.shortDescription)}
        </p>
      </div>

      {/* Price */}
      <div className="mt-3 flex items-baseline gap-2">
        <p className="text-[15px] font-bold text-gray-900">
          {currency}
          {formatPrice(price)}
        </p>

        {product.discountPrice !== undefined && product.discountPrice > 0 && (
          <p className="text-[11px] text-gray-400 line-through">
            {currency}
            {formatPrice(product.productAmount)}
          </p>
        )}
      </div>

      {/* Negotiable Overlay */}
      {product.isNegotiable && (
        <span className="absolute bottom-13 right-3 text-[10px] font-medium text-slate-600 bg-slate-100/60 px-2 py-0.5 rounded-md backdrop-blur-sm pointer-events-none">
          {capitalize("negotiable")}
        </span>
      )}

      {/* Button */}
      <button className="mt-5 w-full rounded-lg bg-primary py-2 text-xs font-semibold text-white transition hover:opacity-90">
        View Product
      </button>
    </div>
  );
}
