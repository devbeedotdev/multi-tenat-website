import { ProductCardA } from "@/components/cards/ProductCardA";
import { ProductCardB } from "@/components/cards/ProductCardB";
import { ProductCardC } from "@/components/cards/ProductCardC";
import { getTenantByDomain, products } from "@/lib/mock-db";
import Image from "next/image";
import VariantAPage from "./VairantAPage";
import VariantBPage from "./VariantBPage";
import VariantCPage from "./VariantCPage";

type DomainPageProps = {
  params: {
    domain: string;
  };
};
export default function DomainHomePage({ params }: DomainPageProps) {
  const tenant = getTenantByDomain(params.domain);

  if (!tenant) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-semibold">
          Tenant not found
        </h1>
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
      return <VariantAPage tenant={tenant} />;
  }
}