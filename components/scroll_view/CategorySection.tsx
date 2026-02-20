"use client";

import { getProductsAction } from "@/lib/actions";
import { Product } from "@/types/product";
import { useEffect, useState } from "react";
import { ProductCardA } from "../cards/ProductCardA";

type CategorySectionProps = {
  tenantId: string;
  category: string;
};

export default function CategorySection({
  tenantId,
  category,
}: CategorySectionProps) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    (async () => {
      const data = await getProductsAction(tenantId, category);
      setProducts(data);
    })();
  }, [tenantId, category]);

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-2">{category}</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {products.slice(0, 10).map((product) => (
          <ProductCardA key={product.productId} product={product} />
        ))}
      </div>
    </div>
  );
}
