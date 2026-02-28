import VariantBHeader from "@/components/headers/VariantBHeader";
import { getProductsByTenant } from "@/lib/dal";
import { getRandomProducts } from "@/src/utils/string.utils";
import type { Tenant } from "@/types/tenant";
import CartPageContentVariantB from "../CartPageContentVariantB";

type CartBPageProps = {
  tenant: Tenant;
  domain: string;
};

export default async function CartBPage({ tenant, domain }: CartBPageProps) {
  const products = await getProductsByTenant(tenant.tenantId);
  const suggestedProducts = getRandomProducts(products, 20);
  return (
    <main className="min-h-screen bg-white">
      <VariantBHeader tenant={tenant} showSearchField={false} />
      
      <CartPageContentVariantB
        tenant={tenant}
        domain={domain}
        suggestedProducts={suggestedProducts}
      />
    </main>
  );
}
