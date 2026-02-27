import { getTenantByDomain } from "@/lib/dal";
import { notFound } from "next/navigation";
import VariantAProductDetailPage from "./product_detail_pages/VariantAProductDetailPage";
import VariantBProductDetailPage from "./product_detail_pages/VariantBProductDetailPage";
import VariantCProductDetailPage from "./product_detail_pages/VariantCProductDetailPage";

export type ProductPageParams = {
  params: {
    domain: string;
    id: string;
  };
};

export default async function ProductDetailPage({ params }: ProductPageParams) {
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
      return <VariantAProductDetailPage tenant={tenant} params={params} />;

    case "B":
      return <VariantBProductDetailPage tenant={tenant} params={params} />;

    case "C":
      return <VariantCProductDetailPage tenant={tenant} params={params} />;

    default:
      notFound();
  }
}
