import VariantCHeader from "@/components/headers/VariantCHeader";
import { getProductsByTenant } from "@/lib/dal";
import { getRandomProducts } from "@/src/utils/string.utils";
import type { Tenant } from "@/types/tenant";
import CartPageContentVariantC from "../CartPageContentVariantC";

type CartCPageProps = {
  tenant: Tenant;
  domain: string;
};

export default async function CartCPage({ tenant, domain }: CartCPageProps) {
  const products = await getProductsByTenant(tenant.tenantId);
  const suggestedProducts = getRandomProducts(products, 20);
  return (
    <main className="relative flex min-h-screen bg-gray-50">
      <VariantCHeader tenant={tenant} showSearchField={false} />
      <section className="flex-1 min-w-0 pt-16 md:pt-0">
        <CartPageContentVariantC
          tenant={tenant}
          domain={domain}
          suggestedProducts={suggestedProducts}
        />
      </section>
    </main>
  );
}
