"use client";

import { getProductsAction } from "@/lib/actions";
import { Product } from "@/types/product";
import { Tenant } from "@/types/tenant";
import { Suspense, useEffect, useState, useTransition } from "react";
import { ProductCardA } from "../cards/ProductCardA";
import { ProductGridSkeleton } from "../cards/ProductCardASkeleton";
import CategoryAListView from "../scroll_view/CategoryAListView";
import CategorySection from "./CategorySection";

type CategoryAContainer = {
  tenant: Tenant;
  categories: string[];
};

export default function CategoryAContainer({
  tenant,
  categories,
}: CategoryAContainer) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const [products, setProducts] = useState<Product[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const data = await getProductsAction(tenant.tenantId, selectedCategory);

      setProducts(data);
    });
  }, [selectedCategory, tenant.tenantId]);

  return (
    <section className="max-w-6xl mx-auto px-1 py-6">
      {/* Top Category Scroller */}
      <CategoryAListView
        categories={categories}
        currentCategory={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {/* Highlighted Products - 2 Rows */}

      <Suspense fallback={<ProductGridSkeleton />}>
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-4">
            {products.slice(0, 10).map((product) => (
              <ProductCardA key={product.productId} product={product} />
            ))}
          </div>
        ) : (
          <ProductGridSkeleton />
        )}
      </Suspense>

      {/* Other Category Sections */}
      {products.length > 0 &&
        categories
          .filter((cat) => cat !== selectedCategory && cat !== "All")
          .map((cat) => (
            <CategorySection
              key={cat}
              tenantId={tenant.tenantId}
              category={cat}
            />
          ))}
    </section>
  );
}
