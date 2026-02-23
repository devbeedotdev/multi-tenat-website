import { getTenantByDomain } from "@/lib/dal";
import { TenantPageProps } from "@/types/tenant";
import { notFound } from "next/navigation";
import VariantAPage from "./VairantAPage";
import VariantBPage from "./VariantBPage";
import VariantCPage from "./VariantCPage";

type DomainPageProps = {
  params: {
    domain: string;
  };
  searchParams?: TenantPageProps["searchParams"];
};

export default async function DomainHomePage({
  params,
  searchParams,
}: DomainPageProps) {
  const tenant = getTenantByDomain(params.domain);
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
