import { z } from "zod";

import type { Product } from "@/types/product";
import type { ProductDetailItem } from "@/types/product-detail";

export const zProductDetailItem = z.record(
  z.string(),
  z.union([z.string(), z.number(), z.boolean(), z.array(z.string())]),
);

export const zProductSchema = z.object({
  productId: z.string(),
  tenantId: z.string(),
  productName: z.string().min(1),
  productCategory: z.string().min(1),
  productAmount: z.number().nonnegative(),
  discountPrice: z.number().optional(),
  isDetailsTabular: z.boolean(),
  quantityAvailable: z.number().int().nonnegative(),
  isNegotiable: z.boolean(),
  isPromo: z.boolean(),
  isBestSelling: z.boolean(),
  productDetails: z.array(zProductDetailItem),
  mediaUrls: z.array(z.string().url()).min(1),
  shortDescription: z.string(),
  fullDescription: z.string(),
  currency: z.string().optional(),
});

export const zAdminProductPayload = z.object({
  productName: z.string().min(1),
  productCategory: z.string().min(1),
  productAmount: z.coerce.number().nonnegative(),
  quantityAvailable: z.coerce.number().int().nonnegative(),
  currency: z.string().optional(),
  isPromo: z.boolean(),
  isNegotiable: z.boolean(),
  isBestSelling: z.boolean(),
  isDetailsTabular: z.boolean(),
  mediaUrls: z.array(z.string().url()).min(1),
  videoUrl: z.string().optional(),
  shortDescription: z.string(),
  fullDescription: z.string(),
  productDetails: z.array(zProductDetailItem).default([]),
});

export const zProductCollection = z.array(zProductSchema);

