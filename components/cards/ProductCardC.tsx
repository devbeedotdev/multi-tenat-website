import Image from "next/image";
import type { Product } from "@/types/product";

type ProductCardProps = {
  product: Product;
};

const primaryImage = (product: Product) =>
  product.productImageUrls[0] ??
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30";

export function ProductCardC({ product }: ProductCardProps) {
  return (
    <article className="flex w-full max-w-sm flex-col gap-3 bg-transparent">
      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
        <Image
          src={primaryImage(product)}
          alt={product.productName}
          fill
          sizes="(min-width: 1024px) 320px, 100vw"
          className="object-cover"
        />
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500">
        <span className="truncate">{product.productCategory}</span>
        {product.isPromo && (
          <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-700">
            Promo
          </span>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <h3 className="truncate text-sm font-semibold text-slate-900">
          {product.productName}
        </h3>
        <p className="text-sm font-semibold text-slate-900">
          ${product.discountPrice ?? product.productAmount}.00
        </p>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>Qty: {product.quantityAvailable}</span>
        {product.isNegotiable && (
          <span className="rounded-full border border-slate-200 px-2 py-0.5 text-[11px]">
            Negotiable
          </span>
        )}
      </div>

      <button className="mt-1 inline-flex w-full items-center justify-center rounded-full bg-primary px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white">
        View Product
      </button>
    </article>
  );
}

