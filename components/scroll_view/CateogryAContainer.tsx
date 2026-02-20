"use client";

import { getProductsAction } from "@/lib/actions";
import { Tenant } from "@/types/tenant";
import { useEffect, useState, useTransition } from "react";
import { ProductCardA } from "../cards/ProductCardA";
import CategoryAListView from "../scroll_view/CategoryAListView";

type CategoryAContainer = {
  tenant: Tenant;
  categories: string[];
};

export default function CategoryAContainer({ tenant, categories }: CategoryAContainer) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const [products, setProducts] = useState<any[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const data = await getProductsAction(tenant.tenantId, selectedCategory);

      setProducts(data);
    });
  }, [selectedCategory, tenant.tenantId]);

  return (
    <section className="max-w-6xl mx-auto px-1 py-6">
      <CategoryAListView
        categories={categories}
        currentCategory={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {isPending && <div className="py-6 text-center">Loading products...</div>}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-4">
        {products.map((product) => (
          <ProductCardA key={product.productId} product={product} />
        ))}
      </div>
    </section>
  );
}
