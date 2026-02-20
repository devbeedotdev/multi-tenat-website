// import { ProductCardA } from "@/components/cards/ProductCardA";
// import VariantAHeader from "@/components/headers/VariantAHeader";
// import CategoryListView from "@/components/scroll_view/CategoryListView";
// import ProductRow from "@/components/rows/ProductRow";
// import {
//   getCategoriesByTenant,
//   getProductsByCategoryAndTenant,
// } from "@/lib/dal";
// import { TenantPageProps } from "@/types/tenant";

// type VariantAPageSearchParams = {
//   category?: string | string[];
// };

// type VariantAPageProps = TenantPageProps & {
//   searchParams?: VariantAPageSearchParams;
// };

// export default async function VariantAPage({
//   tenant,
//   searchParams,
// }: VariantAPageProps) {
//   const rawCategory = Array.isArray(searchParams?.category)
//     ? searchParams?.category[0]
//     : searchParams?.category;

//   const currentCategory =
//     rawCategory && rawCategory.trim().length > 0 ? rawCategory : "All";

// const [allCategories, currentCategoryProducts] = await Promise.all([
//   getCategoriesByTenant(tenant.tenantId),
//   getProductsByCategoryAndTenant(tenant.tenantId, currentCategory),
// ]);

//   const secondaryCategories = allCategories.filter(
//     (category) => category !== "All" && category !== currentCategory,
//   );

//   const rowsData = await Promise.all(
//     secondaryCategories.map(async (category) => ({
//       category,
//       products: await getProductsByCategoryAndTenant(tenant.tenantId, category),
//     })),
//   );

//   return (
//     <main className="min-h-screen bg-white">
//       <VariantAHeader tenant={tenant} />

//       <section className="max-w-6xl mx-auto px-1 py-6 space-y-8">
//         <CategoryListView
//           categories={allCategories}
//           currentCategory={currentCategory}
//         />

//         {/* Main category grid */}
//         <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-2">
//           {currentCategoryProducts.map((product) => (
//             <ProductCardA key={product.productId} product={product} />
//           ))}
//         </div>

//         {/* Additional category rows */}
//         <div className="space-y-8">
//           {rowsData.map(({ category, products }) => (
//             <ProductRow
//               key={category}
//               category={category}
//               products={products}
//             />
//           ))}
//         </div>
//       </section>
//     </main>
//   );
// }

import VariantABody from "@/components/body/VariantABody";
import VariantAHeader from "@/components/headers/VariantAHeader";
import { getProductsByTenant } from "@/lib/dal";
import { TenantPageProps } from "@/types/tenant";

export default async function VariantAPage({ tenant }: TenantPageProps) {
  const products = await getProductsByTenant(tenant.tenantId);

  return (
    <main className="min-h-screen bg-white">
      <VariantAHeader tenant={tenant} />

      {/* Products */}
      <VariantABody tenant={tenant} />
    </main>
  );
}
