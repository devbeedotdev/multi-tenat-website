"use client";

import SearchedProductBody from "@/components/body/SearchedProductBody";
import VariantBBody from "@/components/body/VariantBBody";
import VariantBHeader from "@/components/headers/VariantBHeader";
import { TenantPageProps } from "@/types/tenant";

export default async function VariantBPage({
  tenant,
  searchParams,
}: TenantPageProps) {
  return (
    <main className="min-h-screen bg-white">
      <VariantBHeader tenant={tenant} searchParams={searchParams} />
      {/* Products */}
      {searchParams?.search?.length ? (
        <SearchedProductBody tenant={tenant} searchParams={searchParams} />
      ) : (
        <VariantBBody tenant={tenant} />
      )}
      {/* <section className="mx-auto max-w-8xl px-3 md:px-5 py-4">
        <CategoryListView
          categories={categories}
          currentCategory="Accessories"
          onSelect={() => alert("nt")}
        />

        <div className="grid grid-cols-3 md:grid-cols-8 gap-4 pt-4">
          {products.map((product) => (
            <ProductCardB key={product.productId} product={product} />
          ))}
        </div>
      </section> */}
    </main>
  );
}
