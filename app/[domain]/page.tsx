import { ProductCardA } from "@/components/cards/ProductCardA";
import { ProductCardB } from "@/components/cards/ProductCardB";
import { ProductCardC } from "@/components/cards/ProductCardC";
import { getTenantByDomain, products } from "@/lib/mock-db";

type DomainPageProps = {
  params: {
    domain: string;
  };
};

export default function DomainHomePage({ params }: DomainPageProps) {
  const tenant = getTenantByDomain(params.domain);

  if (!tenant) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold">Tenant not found</h1>
          <p className="text-gray-500">
            No configuration was found for domain: <code>{params.domain}</code>
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <section className="mx-auto max-w-6xl space-y-6">
        <header className="space-y-2 text-center md:text-left">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            {tenant.websiteDisplayName}
          </p>
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
            {tenant.businessName}
          </h1>
          <p className="text-sm text-gray-600 md:max-w-2xl">
            {tenant.businessDescription}
          </p>
        </header>

        <div
          className={`grid gap-3 ${
            tenant.variant === "A"
              ? "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
              : 
              tenant.variant === "B"
                ? "grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                : "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
          }`}
        >
          {products.map((product) => {
            const Card =
              tenant.variant === "A"
                ? ProductCardA
                : tenant.variant === "B"
                  ? ProductCardB
                  : ProductCardC;

            return <Card key={product.productId} product={product} />;
          })}
        </div>
      </section>
    </main>
  );
}
