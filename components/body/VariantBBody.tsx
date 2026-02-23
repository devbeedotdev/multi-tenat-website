import { getCategoriesByTenant } from "@/lib/dal";
import { TenantPageProps } from "@/types/tenant";
import VariantContainer from "./VariantContainer";

export default async function VariantBBody({ tenant }: TenantPageProps) {
  const categories = await getCategoriesByTenant(tenant.tenantId);

  return <VariantContainer tenant={tenant} categories={categories} />;
}
