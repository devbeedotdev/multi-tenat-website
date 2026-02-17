import Image from "next/image";
import type { Product } from "@/types/product";

type ProductCardProps = {
  product: Product;
};

const primaryImage = (product: Product) =>
  product.productImageUrls[0] ??
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30";

export function ProductCardB({ product }: ProductCardProps) {
  return (
    <article className="flex w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-md shadow-black/5 ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-black/10 md:flex-row">
      <div className="relative w-full bg-slate-50 md:w-1/2">
        <div className="relative mx-4 my-4 aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100">
          <Image
            src={primaryImage(product)}
            alt={product.productName}
            fill
            sizes="(min-width: 1024px) 320px, 100vw"
            className="object-cover"
          />
        </div>
      </div>

      <div className="flex w-full flex-1 flex-col justify-between gap-4 px-6 py-5 md:w-1/2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {product.productName}
            </h3>
            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-400">
              {product.productCategory}
            </p>
          </div>

          <div className="flex flex-col items-end gap-1">
            {product.isPromo && (
              <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-700 backdrop-blur-sm">
                Promo
              </span>
            )}
            {product.isNegotiable && (
              <span className="rounded-full bg-slate-800/5 px-3 py-1 text-xs font-medium text-slate-700 backdrop-blur-sm">
                Negotiable
              </span>
            )}
          </div>
        </div>

        <p className="line-clamp-3 text-sm text-slate-600">
          {product.shortDescription}
        </p>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-semibold text-slate-900">
                ${product.discountPrice ?? product.productAmount}.00
              </p>
              {product.discountPrice && (
                <p className="text-xs text-slate-400 line-through">
                  ${product.productAmount}.00
                </p>
              )}
            </div>
            <p className="text-xs text-slate-500">
              Qty:{" "}
              <span className="font-medium text-slate-700">
                {product.quantityAvailable}
              </span>
            </p>
          </div>

          <button className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white">
            View Details
          </button>
        </div>
      </div>
    </article>
  );
}

