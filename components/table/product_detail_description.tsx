import { Product } from "@/types/product";
import { ProductDetailItem } from "@/types/product-detail";
import ProductDetailsColLayout from "./product_detail_col_layout";
import ProductDetailsTablularLayout from "./product_detail_table";

export type ProductDetailsDescriptionProps = {
  title?: string;
  isTabular?: boolean;
  product: Product; // required
  className?: string;
};

export default function ProductDetailDescription({
  title,
  isTabular = true,
  className,
  product,
}: ProductDetailsDescriptionProps) {
  const coreDetails: ProductDetailItem[] = [
    { Category: product.productCategory },
    { "Short Description": product.shortDescription },
    { "Full Description": product.fullDescription },
    { Negotiable: product.isNegotiable },
    { Promo: product.isPromo },
  ];

  // 🔥 No Object.entries here
  const dynamicDetails: ProductDetailItem[] = product.productDetails ?? [];

  const mergedDetails: ProductDetailItem[] = [
    ...coreDetails,
    ...dynamicDetails,
  ];

  const LayoutComponent = isTabular
    ? ProductDetailsTablularLayout
    : ProductDetailsColLayout;

  return (
    <LayoutComponent
      details={mergedDetails}
      title={title}
      className={className}
    />
  );
}
