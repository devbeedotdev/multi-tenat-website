import VariantAHeader from "@/components/headers/VariantAHeader";
import { getProductsByTenant } from "@/lib/dal";
import { getRandomProducts } from "@/src/utils/string.utils";
import type { Tenant } from "@/types/tenant";
import CartPageContent from "../CartPageContent";

type CartAPageProps = {
  tenant: Tenant;
  domain: string;
};

export default async function CartAPage({ tenant, domain }: CartAPageProps) {
  const products = await getProductsByTenant(tenant.tenantId);
  const suggestedProducts = getRandomProducts(products, 20);
  return (
    <main className="min-h-screen bg-white">
      <VariantAHeader tenant={tenant} showSearchField={false} />
      <CartPageContent
        tenant={tenant}
        domain={domain}
        suggestedProducts={suggestedProducts}
      />
    </main>
  );
}
