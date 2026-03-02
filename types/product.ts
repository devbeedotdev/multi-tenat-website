import { ProductDetailItem } from "./product-detail";
import { Tenant } from "./tenant";

export interface Product {
  productId: string;
  tenantId: string;
  productName: string;
  productCategory: string;
  productAmount: number;
  discountPrice?: number;
  isDetailsTabular: boolean;
  quantityAvailable: number;
  isNegotiable: boolean;
  isPromo: boolean;
  isBestSelling: boolean;
  productDetails: ProductDetailItem[];
  mediaUrls: string[];
  videoUrl?: string;
  shortDescription: string;
  fullDescription: string;
  currency?: string;
}

export type ProductCardProps = {
  product: Product;
};

export type CategoryListViewProps = {
  categories: string[];
  currentCategory: string;
  onSelect: (category: string) => void;
};

export type CategorySectionProps = {
  tenant: Tenant;
  category: string;
};
