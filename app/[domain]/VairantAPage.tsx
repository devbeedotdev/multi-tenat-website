import { ProductCardA } from "@/components/cards/ProductCardA";
import VariantAHeader from "@/components/headers/VariantAHeader";
import CategoryListView from "@/components/scroll_view/CategoryListView";
import { getProductsByTenant } from "@/lib/dal";
import { TenantPageProps } from "@/types/tenant";

export default async function VariantAPage({ tenant }: TenantPageProps) {
  const products = await getProductsByTenant(tenant.tenantId);

  return (
    <main className="min-h-screen bg-white">
      <VariantAHeader tenant={tenant} />

      {/* Products */}
      <section className="max-w-6xl mx-auto px-1 py-6">
        <CategoryListView />
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-4">
          {products.map((product) => (
            <ProductCardA key={product.productId} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
