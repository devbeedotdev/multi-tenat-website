import { Product } from "@/types/product";
import { Tenant } from "@/types/tenant";
import SuggestedScroller from "../scroll_view/SuggestedProductScroller";

interface CardRelatedProductsSectionProps {
  tenant: Tenant;
  products: Product[]; // replace with your actual product type
}

export default function CardRelatedProductsSection({
  tenant,
  products,
}: CardRelatedProductsSectionProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="px-1 md:px-4 text-lg font-semibold text-gray-800 mb-3 md:mb-5">
        Related Products
      </h2>

      <SuggestedScroller tenant={tenant} products={products} />
    </section>
  );
}
