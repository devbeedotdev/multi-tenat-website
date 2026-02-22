import SearchedProductBody from "@/components/body/SearchedProductBody";
import VariantABody from "@/components/body/VariantABody";
import VariantAHeader from "@/components/headers/VariantAHeader";
import { TenantPageProps } from "@/types/tenant";

export default async function VariantAPage({
  tenant,
  searchParams,
}: TenantPageProps) {
  console.log(`Hello - ${searchParams?.search}`);
  return (
    <main className="min-h-screen bg-white">
      <VariantAHeader tenant={tenant} searchParams={searchParams} />

      {/* Products */}
      {searchParams?.search?.length ? (
        <SearchedProductBody tenant={tenant} searchParams={searchParams} />
      ) : (
        <VariantABody tenant={tenant} />
      )}
    </main>
  );
}
