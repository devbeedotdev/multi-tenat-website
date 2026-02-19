import { ProductCardB } from "@/components/cards/ProductCardB";
import VariantBHeader from "@/components/headers/VariantBHeader";
import { products } from "@/lib/mock-db";
import { TenantPageProps } from "@/types/tenant";

export default function VariantBPage({ tenant }: TenantPageProps) {
  return (
    <main className="min-h-screen bg-white">
      <VariantBHeader tenant={tenant} />
      <section className="mx-auto max-w-6xl px-1 py-6">
        

        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 pt-4">
          {products.map((product) => (
            <ProductCardB key={product.productId} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
