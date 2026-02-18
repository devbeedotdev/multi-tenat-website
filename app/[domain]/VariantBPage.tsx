import { ProductCardB } from "@/components/cards/ProductCardB";
import { products } from "@/lib/mock-db";
import { TenantPageProps } from "@/types/tenant";
import Image from "next/image";

export default function VariantBPage({ tenant }: TenantPageProps) {
  return (
    <main className="min-h-screen bg-gray-100 px-6 py-12">
      <section className="mx-auto max-w-7xl space-y-8">
        <header className="text-center space-y-2">
          <Image src="/images/logo.jpeg" alt="logo" width={60} height={60} />
          <h1 className="text-5xl font-extrabold">
            {tenant.websiteDisplayName}
          </h1>
        </header>

        <div className="grid grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCardB key={product.productId} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
