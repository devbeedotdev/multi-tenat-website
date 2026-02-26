import VariantAHeader from "@/components/headers/VariantAHeader";
import SuggestedScroller from "@/components/scroll_view/SuggestedProductScroller";
import MediaGallery from "@/components/viewer/MediaGallery";
import {
  getProductById,
  getProductsByCategoryAndTenant,
  getTenantByDomain,
} from "@/lib/dal";
import {
  capitalizeFirstWords,
  formatPrice,
  getRandomProducts,
} from "@/src/utils/string.utils";
import type { Product } from "@/types/product";
import type { Tenant } from "@/types/tenant";
import { notFound } from "next/navigation";

type ProductPageParams = {
  params: {
    domain: string;
    id: string;
  };
};

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

export default async function VariantAProductPage({
  params,
}: ProductPageParams) {
  const tenant: Tenant | undefined = getTenantByDomain(params.domain);

  if (!tenant) {
    notFound();
  }

  const product = await getProductById(tenant.tenantId, params.id);

  // Enforce multi-tenant isolation – product must belong to this tenant
  if (!product) {
    notFound();
  }

  const { effective, currency } = getDisplayPrice(product);

  const media =
    product.productImageUrls?.length && product.productImageUrls[0]
      ? product.productImageUrls
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
      <VariantAHeader tenant={tenant} />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-3 py-6 md:px-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 md:text-sm">
          <span className="cursor-pointer hover:text-slate-800">Home</span>
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

            {/* Action + quantity */}
            <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <button
                style={{ backgroundColor: "var(--primary)" }}
                className="inline-flex w-full items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 md:w-auto"
              >
                Order via WhatsApp
              </button>

              <div className="flex items-center gap-4 text-sm text-slate-700">
                <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Quantity Available
                </span>
                <span className="rounded-lg border border-slate-200 px-3 py-1 text-sm font-semibold">
                  {product.quantityAvailable}
                </span>
              </div>
            </div>

            {/* Message box */}
            <div className="mt-6 space-y-2">
              <label
                htmlFor="vendor-message"
                className="flex items-center gap-2 text-xs font-medium text-slate-700 md:text-sm"
              >
                Send vendor a direct message
              </label>
              <div className="flex flex-col gap-3 md:flex-row">
                <textarea
                  id="vendor-message"
                  placeholder="Write a message to vendor..."
                  className="min-h-[80px] flex-1 resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-200"
                />
                <button
                  type="button"
                  className="mt-2 w-full rounded-lg bg-slate-900 px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 md:mt-0 md:w-auto"
                >
                  Send
                </button>
              </div>
            </div>

            {/* Product details table */}
            <div className="mt-8">
              <h2 className="text-sm font-semibold text-slate-900 md:text-base">
                Product Detail
              </h2>
              <div className="mt-3 overflow-hidden rounded-xl border border-slate-100">
                <dl className="divide-y divide-slate-100 text-sm text-slate-700">
                  <div className="grid grid-cols-2 bg-slate-50 px-4 py-3 md:grid-cols-3">
                    <dt className="font-medium text-slate-500">Category</dt>
                    <dd className="col-span-1 font-semibold md:col-span-2">
                      {product.productCategory}
                    </dd>
                  </div>
                  <div className="grid grid-cols-2 px-4 py-3 md:grid-cols-3">
                    <dt className="font-medium text-slate-500">
                      Short Description
                    </dt>
                    <dd className="col-span-1 md:col-span-2">
                      {product.shortDescription}
                    </dd>
                  </div>
                  <div className="grid grid-cols-2 bg-slate-50 px-4 py-3 md:grid-cols-3">
                    <dt className="font-medium text-slate-500">
                      Full Description
                    </dt>
                    <dd className="col-span-1 md:col-span-2">
                      {product.fullDescription}
                    </dd>
                  </div>
                  <div className="grid grid-cols-2 px-4 py-3 md:grid-cols-3">
                    <dt className="font-medium text-slate-500">Negotiable</dt>
                    <dd className="col-span-1 md:col-span-2">
                      {product.isNegotiable ? "Yes" : "No"}
                    </dd>
                  </div>
                  <div className="grid grid-cols-2 bg-slate-50 px-4 py-3 md:grid-cols-3">
                    <dt className="font-medium text-slate-500">Promo</dt>
                    <dd className="col-span-1 md:col-span-2">
                      {product.isPromo ? "Yes" : "No"}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
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
