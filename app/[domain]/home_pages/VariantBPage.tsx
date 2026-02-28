"use client";

import SearchedProductBody from "@/components/body/SearchedProductBody";
import VariantBBody from "@/components/body/VariantBBody";
import VariantBHeader from "@/components/headers/VariantBHeader";
import { TenantPageProps } from "@/types/tenant";

export default async function VariantBPage({
  tenant,
  searchParams,
}: TenantPageProps) {
  return (
    <main className="min-h-screen bg-white">
      <VariantBHeader tenant={tenant} searchParams={searchParams} />
      {/* Products */}
      {searchParams?.search?.length ? (
        <SearchedProductBody tenant={tenant} searchParams={searchParams} />
      ) : (
        <VariantBBody tenant={tenant} />
      )}
    </main>
  );
}
