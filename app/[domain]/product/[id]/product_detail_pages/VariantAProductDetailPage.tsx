import ProductActionBar from "@/components/action/ProductActionBar";
import WhatsappMessageBox from "@/components/forms/WhatsappMessageBox";
import VariantAHeader from "@/components/headers/VariantAHeader";
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
import { Tenant } from "@/types/tenant";
import Link from "next/link";
import { notFound } from "next/navigation";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30";

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

export type ProductDetailPageProps = {

  params: {
    domain: string;
    id: string;
  };
  tenant: Tenant;
};

export default async function VariantAProductDetailPage({

  tenant,
  params,
}: ProductDetailPageProps) {
  const product = await getProductById(tenant.tenantId, params.id);

  // Enforce multi-tenant isolation – product must belong to this tenant
  if (!product) {
    notFound();
  }

  const { effective, currency } = getDisplayPrice(product);

  const media =
    product.mediaUrls?.length && product.mediaUrls[0]
      ? product.mediaUrls
      : [PLACEHOLDER_IMAGE];

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
      <VariantAHeader tenant={tenant} showSearchField={false} />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-3 py-6 md:px-6">
        {/* Breadcrumb */}
        <nav className="sticky top-[60px] md:top-[65px] z-40 bg-white flex items-center gap-2 text-xs text-slate-500 md:text-sm py-2">
          <Link
            href={`/${params.domain}`}
            className="cursor-pointer hover:text-slate-800 transition-colors"
          >
            Home
          </Link>

          <span className="text-slate-300">/</span>

          <span className="font-medium text-slate-700">Product Page</span>
        </nav>
        {/* Top: Media then Info (single column on all breakpoints) */}
        <section className="flex flex-col gap-6">
          {/* Media */}
          <MediaGallery
            media={media}
            className="max-w-3xl mx-auto xl:max-w-3xl 2xl:max-w-4xl"
          />

          {/* Product Info */}
          <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm md:p-6">
            {/* Title + Category */}
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  {product.productCategory}
                </p>
                <h1 className="mt-1 text-xl font-semibold text-slate-900 md:text-2xl">
                  {capitalizeFirstWords(product.productName)}
                </h1>
              </div>

              {/* Promo / Negotiable / Stock */}
              <div className="mt-3 flex flex-wrap gap-2 md:mt-0 md:justify-end">
                {product.isPromo && (
                  <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                    Promo
                  </span>
                )}
                {product.isNegotiable && (
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
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

            {/* Price row */}
            <div className="mt-5 flex flex-wrap items-baseline gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-baseline gap-3">
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

            {/* Action Bar: quantity + vendor contact */}
            <div className="mt-5">
              <ProductActionBar tenant={tenant} product={product} />
            </div>

            {/* Message box */}
            <WhatsappMessageBox tenant={tenant} product={product} />

            {/* Product details table */}
            <ProductDetailDescription product={product} />
          </div>
        </section>

        {/* Related Products */}
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
    </main>
  );
}
