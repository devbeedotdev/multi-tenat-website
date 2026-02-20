import { getTenantByDomain } from "@/lib/dal";
import { notFound } from "next/navigation";
import VariantAPage from "./VairantAPage";
import VariantBPage from "./VariantBPage";
import VariantCPage from "./VariantCPage";

type DomainPageSearchParams = {
  category?: string | string[];
};

type DomainPageProps = {
  params: {
    domain: string;
  };
  searchParams?: DomainPageSearchParams;
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
      return <VariantAPage tenant={tenant} />;

    case "B":
      return <VariantBPage tenant={tenant} />;

    case "C":
      return <VariantCPage tenant={tenant} />;

    default:
      notFound();
  }
}
