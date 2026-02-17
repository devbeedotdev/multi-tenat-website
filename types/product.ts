export interface Product {
  productId: string;
  productName: string;
  productCategory: string;
  productAmount: number;
  discountPrice?: number;
  quantityAvailable: number;
  isNegotiable: boolean;
  isPromo: boolean;
  isBestSelling: boolean;
  productImageUrls: string[];
  videoUrl?: string;
  shortDescription: string;
  fullDescription: string;
}

