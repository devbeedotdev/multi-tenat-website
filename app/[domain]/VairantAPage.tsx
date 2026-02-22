import VariantABody from "@/components/body/VariantABody";
import VariantAHeader from "@/components/headers/VariantAHeader";
import { getProductsByTenant } from "@/lib/dal";
import { TenantPageProps } from "@/types/tenant";

export default async function VariantAPage({ tenant }: TenantPageProps) {
  const products = await getProductsByTenant(tenant.tenantId);

  return (
    <main className="min-h-screen bg-white">
      <VariantAHeader tenant={tenant} />

      {/* Products */}
      <VariantABody tenant={tenant} />
    </main>
  );
}
