import {
  capitalize,
  capitalizeFirstWords,
  formatPrice,
  toUpper,
} from "@/src/utils/string.utils";
import type { Product, ProductCardProps } from "@/types/product";
import Image from "next/image";

const primaryImage = (product: Product) =>
  product.productImageUrls[0] ??
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30";

export function ProductCardA({ product }: ProductCardProps) {
  const price =
    product.discountPrice == undefined || product.discountPrice === 0
      ? product.productAmount
      : product.discountPrice;

  const currency = product.currency ?? "₦";

  return (
    <article className="group relative flex w-full flex-col overflow-hidden rounded-lg bg-white shadow-md transition hover:shadow-xl">
      {/* Image */}
      <div className="relative w-full sm:h-44 h-40 overflow-hidden bg-slate-100">
        <Image
          src={primaryImage(product)}
          alt={product.productName}
          fill
          sizes="(max-width: 640px) 160px, 300px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Promo Badge Top Right */}
        {product.isPromo && (
          <div className="absolute right-2 top-2">
            <Image
              src="/images/promo.png"
              alt="Promo"
              width={40}
              height={40}
              className="object-contain drop-shadow-md rotate-12"
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between gap-3 p-3 relative">
        {/* Top Info */}
        <div className="flex flex-col gap-1">
          {/* Title */}
          <h3 className="line-clamp-1 text-sm font-semibold text-slate-900">
            {capitalizeFirstWords(product.productName)}
          </h3>

          {/* Category */}
          <p className="text-[11px] uppercase tracking-wide text-slate-400">
            {toUpper(product.productCategory)}
          </p>

          {/* Short Description */}
          <p className="text-[12px] text-slate-600 line-clamp-2">
            {capitalize(product.shortDescription)}
          </p>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <p className="text-base font-bold text-slate-900">
              {currency}
              {formatPrice(price)}
            </p>
            {product.discountPrice !== undefined &&
              product.discountPrice > 0 && (
                <p className="text-xs text-slate-400 line-through">
                  {currency}
                  {formatPrice(product.productAmount)}
                </p>
              )}
          </div>

          {/* Quantity */}
          <p className="text-[11px] text-slate-500">
            {product.quantityAvailable > 0 ? (
              <>
                Qty left:{" "}
                <span className="font-medium text-slate-700">
                  {formatPrice(product.quantityAvailable)}
                </span>
              </>
            ) : (
              <span className="italic font-medium text-red-500">
                Out of stock
              </span>
            )}
          </p>
        </div>

        {/* Negotiable overlay (does not affect layout) */}
        {product.isNegotiable && (
          <span className="absolute bottom-12 right-3 text-[10px] font-medium text-slate-600 bg-slate-100/60 px-2 py-0.5 rounded-md backdrop-blur-sm pointer-events-none">
            Negotiable
          </span>
        )}

        {/* Button at bottom */}
        <button className="mt-2 w-full rounded-lg bg-primary py-2 text-xs font-semibold text-white transition hover:opacity-90">
          View Product
        </button>
      </div>
    </article>
  );
}
