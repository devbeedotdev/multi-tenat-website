import { getCategoriesByTenant } from "@/lib/dal";
import { TenantPageProps } from "@/types/tenant";
import CategoryAContainer from "../scroll_view/CateogryAContainer";

export default async function VariantABody({ tenant }: TenantPageProps) {
  const categories = await getCategoriesByTenant(tenant.tenantId);

  return <CategoryAContainer tenant={tenant} categories={categories} />;
}
