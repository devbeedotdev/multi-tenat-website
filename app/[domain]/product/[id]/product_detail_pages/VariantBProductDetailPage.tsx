import ProductActionBar from "@/components/action/ProductActionBar";
import WhatsappMessageBox from "@/components/forms/WhatsappMessageBox";
import VariantBHeader from "@/components/headers/VariantBHeader";
import SuggestedScroller from "@/components/scroll_view/SuggestedProductScroller";
import ProductDetailDescription from "@/components/table/product_detail_description";
import MediaGallery from "@/components/viewer/MediaGallery";
import { getProductById, getProductsByCategoryAndTenant } from "@/lib/dal";
import {
  capitalizeFirstWords,
  formatPrice,
  getRandomProducts,
} from "@/src/utils/string.utils";
import type { Product } from "@/types/product";
import type { ProductDetailPageProps } from "@/types/page";
import Link from "next/link";
import { notFound } from "next/navigation";

function getDisplayPrice(product: Product) {
  const effective =
    product.discountPrice == null || product.discountPrice === 0
      ? product.productAmount
      : product.discountPrice;

  const currency = product.currency ?? "₦";

  return {
    effective,
    currency,
  };
}

export default async function VariantBProductDetailPage({
  tenant,
  params,
}: ProductDetailPageProps) {
  const product = await getProductById(tenant.tenantId, params.id);

  if (!product) {
    notFound();
  }

  const { effective, currency } = getDisplayPrice(product);

  const media = product.mediaUrls;

  const categoryProducts = await getProductsByCategoryAndTenant(
    tenant.tenantId,
    product.productCategory,
  );

  const relatedProducts = getRandomProducts(
    categoryProducts.filter((p) => p.productId !== product.productId),
    15,
  );

  return (
    <main className="min-h-screen bg-white">
      <VariantBHeader tenant={tenant} showSearchField={false} />

      <div className="mx-auto flex w-full max-w-7xl 2xl:max-w-[80%] flex-col gap-8 px-3 pt-4 md:px-6 md:pb-8 pb-[max(12rem,env(safe-area-inset-bottom)+10rem)]">
        {/* Mobile: title + price above image */}
        <section className="md:hidden space-y-4">
        <Breadcrumb domain={params.domain} />
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              {product.productCategory}
            </p>
            <h1 className="text-xl font-semibold text-slate-900">
              {capitalizeFirstWords(product.productName)}
            </h1>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">
                {currency}
                {formatPrice(effective)}
              </span>
              {product.discountPrice != null && product.discountPrice > 0 && (
                <span className="text-sm text-slate-400 line-through">
                  {currency}
                  {formatPrice(product.productAmount)}
                </span>
              )}
            </div>
          </div>
         

          <MediaGallery media={media} className="w-full" />
        </section>
        {/* Breadcrumb */}
        <Breadcrumb domain={params.domain} />

        {/* Desktop / tablet split-pane */}
        <section className="hidden md:grid md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)] md:gap-12 items-start">
          {/* Left: sticky media */}
          <div className="space-y-4 md:sticky md:top-28">
            <MediaGallery media={media} className="w-full" />
          </div>

          {/* Right: editorial info */}
          <div className="space-y-6">
            {/* Title, price, badges */}
            <div className="space-y-3 border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  {product.productCategory}
                </p>
                <h1 className="text-2xl font-semibold text-slate-900">
                  {capitalizeFirstWords(product.productName)}
                </h1>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-slate-900">
                  {currency}
                  {formatPrice(effective)}
                </span>
                {product.discountPrice != null && product.discountPrice > 0 && (
                  <span className="text-sm text-slate-400 line-through">
                    {currency}
                    {formatPrice(product.productAmount)}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {product.isPromo && (
                  <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                    Promo
                  </span>
                )}
                {product.isNegotiable && (
                  <span className="inline-flex items-center rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                    Negotiable
                  </span>
                )}
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                    product.quantityAvailable > 0
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {product.quantityAvailable > 0
                    ? `In stock: ${product.quantityAvailable}`
                    : "Out of stock"}
                </span>
              </div>
            </div>

            {/* Desktop action bar */}
            <div className="hidden md:block">
              <ProductActionBar tenant={tenant} product={product} variant="B" />
            </div>

            {/* Description as editorial body */}
            <div className="space-y-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Overview
              </h2>
              <p className="text-sm leading-relaxed text-slate-700">
                {product.shortDescription}
              </p>
              <p className="text-sm leading-relaxed text-slate-700">
                {product.fullDescription}
              </p>
            </div>

            {/* Structured details (uses existing table component) */}
            <ProductDetailDescription product={product} />

            {/* Whatsapp contact box */}
            <WhatsappMessageBox tenant={tenant} product={product} />
          </div>
        </section>

        {/* Mobile: editorial body below image */}
        <section className="md:hidden space-y-6 pt-2">
          <div className="flex flex-wrap gap-2">
            {product.isPromo && (
              <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                Promo
              </span>
            )}
            {product.isNegotiable && (
              <span className="inline-flex items-center rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                Negotiable
              </span>
            )}
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                product.quantityAvailable > 0
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {product.quantityAvailable > 0
                ? `In stock: ${product.quantityAvailable}`
                : "Out of stock"}
            </span>
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Overview
            </h2>
            <p className="text-sm leading-relaxed text-slate-700">
              {product.shortDescription}
            </p>
            <p className="text-sm leading-relaxed text-slate-700">
              {product.fullDescription}
            </p>
          </div>

          <ProductDetailDescription product={product} />

          <WhatsappMessageBox tenant={tenant} product={product} />
        </section>

        {/* Related products, shared for both layouts */}
        {relatedProducts.length > 0 && (
          <section className="mt-4 border-t border-slate-100 pt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900 md:text-lg">
                Related Products
              </h2>
            </div>
            <div className="mt-3">
              <SuggestedScroller tenant={tenant} products={relatedProducts} />
            </div>
          </section>
        )}
      </div>

      {/* Floating mobile action bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-md md:hidden pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto max-w-7xl px-3 py-3">
          <ProductActionBar tenant={tenant} product={product} variant="B" />
        </div>
      </div>
    </main>
  );
}

function Breadcrumb({ domain }: { domain: string }) {
  return (
    <nav className="flex items-center gap-2 text-xs text-slate-500">
      <Link
        href={`/${domain}`}
        className="hover:text-slate-800 transition-colors"
      >
        Home
      </Link>
      <span className="text-slate-300">/</span>
      <span className="font-medium text-slate-700">Product</span>
    </nav>
  );
}
