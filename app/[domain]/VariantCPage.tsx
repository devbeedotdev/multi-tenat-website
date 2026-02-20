import VariantCBody from "@/components/body/VariantCBody";
import VariantCHeader from "@/components/headers/VariantCHeader";
import { getProductsByTenant } from "@/lib/dal";
import { TenantPageProps } from "@/types/tenant";

export default async function VariantCPage({ tenant }: TenantPageProps) {
  const products = await getProductsByTenant(tenant.tenantId);

  return (
    <main className="min-h-screen bg-gray-50 flex relative">
      <VariantCHeader tenant={tenant} />

      <VariantCBody products={products} />
    </main>
  );
}
