import SearchedProductBody from "@/components/body/SearchedProductBody";
import VariantCBody from "@/components/body/VariantCBody";
import SearchProductForm from "@/components/forms/SearchForm";
import VariantCHeader from "@/components/headers/VariantCHeader";
import { TenantPageProps } from "@/types/tenant";

export default async function VariantCPage({
  tenant,
  searchParams,
}: TenantPageProps) {
  return (
    <main className="min-h-screen bg-gray-50 flex relative">
      <VariantCHeader tenant={tenant} />
      <section className="flex-1 min-w-0  px-2 md:px-3 py-1 mt-16 md:mt-0 pt-5">
        {/* Desktop Search */}

        <div className="hidden md:block sticky top-0 z-30 bg-gray-50 pb-4 pt-2">
          <SearchProductForm useAutoSearch={false} />
        </div>
        {searchParams?.search?.length ? (
          <SearchedProductBody tenant={tenant} searchParams={searchParams} />
        ) : (
          <VariantCBody tenant={tenant} />
        )}
      </section>
    </main>
  );
}
