import { ProductCardC } from "@/components/cards/ProductCardC";
import { products } from "@/lib/mock-db";
import { TenantPageProps } from "@/types/tenant";

export default function VariantCPage({ tenant }: TenantPageProps) {
  return (
    <main className="min-h-screen bg-gray-50  px-4 py-10">
      <section className="mx-auto max-w-5xl space-y-10">
        <header>
          <h1 className="text-3xl font-semibold">{tenant.businessName}</h1>
          <p className="text-gray-400">{tenant.businessDescription}</p>
        </header>

        <div className="grid grid-cols-2 gap-4">
          {products.map((product) => (
            <ProductCardC key={product.productId} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
