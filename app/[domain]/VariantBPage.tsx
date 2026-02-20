import { ProductCardB } from "@/components/cards/ProductCardB";
import VariantBHeader from "@/components/headers/VariantBHeader";
import CategoryListView from "@/components/scroll_view/CategoryListView";
import { getProductsByTenant } from "@/lib/dal";
import { TenantPageProps } from "@/types/tenant";

export default async function VariantBPage({ tenant }: TenantPageProps) {
  const products = await getProductsByTenant(tenant.tenantId);
  const categories = Array.from(
    new Set(products.map((p) => p.productCategory).filter(Boolean)),
  ).sort((a, b) => a.localeCompare(b));

  return (
    <main className="min-h-screen bg-white">
      <VariantBHeader tenant={tenant} />
      <section className="mx-auto max-w-8xl px-3 md:px-5 py-4">
        <CategoryListView categories={categories} currentCategory="Accessories" />

        <div className="grid grid-cols-3 md:grid-cols-8 gap-4 pt-4">
          {products.map((product) => (
            <ProductCardB key={product.productId} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
