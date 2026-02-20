import type { Product } from "@/types/product";
import SearchProductForm from "../forms/SearchForm";
import CategoryListView from "../scroll_view/CategoryListView";
import { ProductCardC } from "../cards/ProductCardC";

type VariantCBodyProps = {
  products: Product[];
};

export default function VariantCBody({ products }: VariantCBodyProps) {
  const categories = Array.from(
    new Set(products.map((p) => p.productCategory).filter(Boolean)),
  ).sort((a, b) => a.localeCompare(b));

  return (
    <section className="flex-1 min-w-0  px-2 md:px-3 py-1 mt-16 md:mt-0 pt-5">
      {/* Desktop Search */}

      <div className="hidden md:block sticky top-0 z-30 bg-gray-50 pb-4 pt-2">
        <SearchProductForm />
      </div>

      <div>
        <CategoryListView categories={categories} currentCategory="All" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-1 pt-4">
        {products.map((product) => (
          <ProductCardC key={product.productId} product={product} />
        ))}
      </div>
    </section>
  );
}
