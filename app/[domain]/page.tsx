import { getTenantByDomain } from "@/lib/dal";
import type { DomainPageProps } from "@/types/page";
import { notFound } from "next/navigation";
import VariantAPage from "./home_pages/VairantAPage";
import VariantBPage from "./home_pages/VariantBPage";
import VariantCPage from "./home_pages/VariantCPage";

export default async function DomainHomePage({
  params,
  searchParams,
}: DomainPageProps) {
  const tenantResult = await getTenantByDomain(params.domain);
  const tenant = tenantResult.ok ? tenantResult.data : null;
  if (!tenant) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-semibold">Tenant not found</h1>
      </main>
    );
  }

  switch (tenant.variant) {
    case "A":
      return <VariantAPage tenant={tenant} searchParams={searchParams} />;

    case "B":
      return <VariantBPage tenant={tenant} searchParams={searchParams} />;

    case "C":
      return <VariantCPage tenant={tenant} searchParams={searchParams} />;

    default:
      notFound();
  }
}
