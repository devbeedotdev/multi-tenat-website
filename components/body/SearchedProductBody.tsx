import { getProductsBySearchAndTenant, getProductsByTenant } from "@/lib/dal";
import { Product } from "@/types/product";
import { TenantPageProps } from "@/types/tenant";
import { ProductCardA } from "../cards/ProductCardA";
import { ProductCardB } from "../cards/ProductCardB";
import { ProductCardC } from "../cards/ProductCardC";
import SuggestedScroller from "../scroll_view/SuggestedProductScroller";

export default async function SearchedProductBody({
  tenant,
  searchParams,
}: TenantPageProps) {
  const allProducts = await getProductsByTenant(tenant.tenantId);

  const searchedProducts = await getProductsBySearchAndTenant(
    tenant.tenantId,
    searchParams?.search,
  );
  const renderProductCard = (product: Product) => {
    switch (tenant.variant) {
      case "A":
        return <ProductCardA product={product} />;
      case "B":
        return <ProductCardB product={product} />;
      case "C":
        return <ProductCardC product={product} />;
      default:
        return null; // Avoid calling notFound() inside a map loop
    }
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-4 px-1 md:px-6">
      {/* Header */}
      <h2 className="px-4 pt-4 text-lg font-semibold text-gray-800">
        Searched Product
      </h2>

      {searchedProducts.length > 0 ? (
        <div
          className="grid 
               grid-cols-2 
               md:grid-cols-3 
               lg:grid-cols-5 
               gap-4 
               pt-2
               p-4"
        >
          {searchedProducts.map((product) => (
            <div key={product.productId} className="w-full flex justify-center">
              {renderProductCard(product)}
            </div>
          ))}
        </div>
      ) : (
        <p className="px-4 text-gray-500">No products found.</p>
      )}

      {/* Suggested Section */}
      <h2 className="px-4 text-lg font-semibold text-gray-800">
        Suggested Product
      </h2>
      <SuggestedScroller
        tenant={tenant}
        products={allProducts.slice().reverse().slice(0, 10)}
      />
    </div>
  );
}
