import CartAPage from "@/components/cart/pages/CartAPage";
import { getTenantConfig } from "@/lib/dal";
import { notFound } from "next/navigation";

type CartPageProps = {
  params: { domain: string };
};

export default async function CartPage({ params }: CartPageProps) {
  const { domain } = params;
  const tenant = await getTenantConfig(domain);

  if (!tenant) {
    notFound();
  }

  switch (tenant.variant) {
    case "A":
      return CartAPage({ tenant, domain });
    case "B":
    case "C":
      return (
        <main className="min-h-screen flex items-center justify-center bg-white">
          <h1 className="text-2xl font-semibold text-slate-800">Coming Soon</h1>
        </main>
      );
    default:
      notFound();
  }
}
