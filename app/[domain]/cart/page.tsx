import CartAPage from "@/components/cart/pages/CartAPage";
import CartBPage from "@/components/cart/pages/CartBPage";
import CartCPage from "@/components/cart/pages/CartCPage";
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
      return CartBPage({ tenant, domain });
    case "C":
      return CartCPage({ tenant, domain });
    default:
      notFound();
  }
}
