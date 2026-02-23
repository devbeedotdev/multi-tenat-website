import { getCategoriesByTenant } from "@/lib/dal";
import { TenantPageProps } from "@/types/tenant";
import VariantContainer from "./VariantContainer";

export default async function VariantCBody({ tenant }: TenantPageProps) {
  const categories = await getCategoriesByTenant(tenant.tenantId);

  return <VariantContainer tenant={tenant} categories={categories} />;

  // return (
  //   <section className="flex-1 min-w-0  px-2 md:px-3 py-1 mt-16 md:mt-0 pt-5">
  //     {/* Desktop Search */}

  // <div className="hidden md:block sticky top-0 z-30 bg-gray-50 pb-4 pt-2">
  //   <SearchProductForm />
  // </div>

  //     <div>
  //       <CategoryListView categories={categories} currentCategory="All" />
  //     </div>

  //     <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-1 pt-4">
  //       {products.map((product) => (
  //         <ProductCardC key={product.productId} product={product} />
  //       ))}
  //     </div>
  //   </section>
  // );
}
