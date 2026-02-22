import { getCategoriesByTenant } from "@/lib/dal";
import { TenantPageProps } from "@/types/tenant";
import VariantAContainer from "../scroll_view/VariantAContainer";

export default async function VariantABody({ tenant }: TenantPageProps) {
  const categories = await getCategoriesByTenant(tenant.tenantId);

  return <VariantAContainer tenant={tenant} categories={categories} />;
}
