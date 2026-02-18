import Image from "next/image";
import Link from "next/link";

import {
  capitalizeFirstWords,
  formatPrice,
  toUpper,
} from "@/src/utils/string.utils";

import type { Product, ProductCardProps } from "@/types/product";

const primaryImage = (product: Product) =>
  product.productImageUrls[0] ??
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30";

export function ProductCardB({ product }: ProductCardProps) {
  const price = product.discountPrice ?? product.productAmount;
  const currency = product.currency ?? "₦";

  return (
    <Link href={`/products/${product.productId}`} className="group block">
      <article className="flex flex-col overflow-hidden rounded-xl bg-white shadow-sm transition hover:shadow-md hover:-translate-y-1">
        {/* Image */}
        <div className="relative w-full h-36 sm:h-40 md:h-44 overflow-hidden bg-slate-100">
          <Image
            src={primaryImage(product)}
            alt={product.productName}
            fill
            sizes="(max-width: 640px) 160px, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* {product.isPromo && (
            <div className="absolute left-2 top-2">
              <Image
                src="/assets/promo.png"
                alt="Promo"
                width={36}
                height={36}
                className="object-contain drop-shadow-md rotate-12"
              />
            </div> */}
          {/* )} */}
        </div>

        {/* Content */}
        <div className="flex flex-col gap-1 p-3">
          {/* Product Name */}
          <h3 className="line-clamp-2 text-sm font-semibold text-slate-900">
            {capitalizeFirstWords(product.productName)}
          </h3>

          {/* Category */}
          <p className="text-[11px] uppercase tracking-wide text-slate-400">
            {toUpper(product.productCategory)}
          </p>

          {/* Price & Quantity */}
          <div className="mt-1 flex items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-2">
                <p className="text-sm font-bold text-slate-900">
                  {currency}
                  {formatPrice(price)}
                </p>

                {product.discountPrice && (
                  <p className="text-xs text-slate-400 line-through">
                    {currency}
                    {formatPrice(product.productAmount)}
                  </p>
                )}
              </div>

              <p className="text-[11px] text-slate-500">
                {product.quantityAvailable > 0 ? (
                  <>
                    <span className="font-medium text-slate-700">
                      {formatPrice(product.quantityAvailable)}
                    </span>{" "}
                    Items left
                  </>
                ) : (
                  <span className="italic font-medium text-red-500">
                    Out of stock
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
