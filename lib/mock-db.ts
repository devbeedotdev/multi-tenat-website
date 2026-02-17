import type { Product } from "@/types/product";

export type TenantVariant = "A" | "B" | "C";

export type Tenant = {
  businessName: string;
  variant: TenantVariant;
  primaryColor: string;
  businessDescription: string;
  websiteDisplayName: string;
  logoUrl: string;
};

export const tenants: Record<string, Tenant> = {
  localhost: {
    businessName: "Localhost Demo Store",
    variant: "A",
    primaryColor: "#2563EB",
    businessDescription:
      "A development tenant for local testing and UI exploration.",
    websiteDisplayName: "Jumia Nigeria",
    logoUrl:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=64&h=64&q=80",
  },
  "client-a.com": {
    businessName: "Client A Boutique",
    variant: "B",
    primaryColor: "#16A34A",
    businessDescription: "A modern boutique experience tailored for Client A.",
    websiteDisplayName: "Pari Pulse",
    logoUrl:
      "https://images.unsplash.com/photo-1454625233598-f29d597eea1e?ixlib=rb-4.1.0&auto=format&fit=crop&w=800&q=80",
  },
  "client-b.com": {
    businessName: "Client B Outfitters",
    variant: "C",
    primaryColor: "#DB2777",
    businessDescription: "An energetic brand presence for Client B.",
    websiteDisplayName: "Jiji Nigeria",
    logoUrl:
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=64&h=64&q=80",
  },
};

export function getTenantByDomain(domain: string): Tenant | undefined {
  const normalized = domain.split(":")[0].toLowerCase();
  return tenants[normalized];
}

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30";

export const products: Product[] = [
  {
    productId: "prod-1",
    productName: "Classic Black Bomber Jacket",
    productCategory: "Outerwear",
    productAmount: 200,
    discountPrice: 6000000,
    quantityAvailable: 6,
    isNegotiable: true,
    isPromo: true,
    isBestSelling: true,
    productImageUrls: [PLACEHOLDER_IMAGE],
    shortDescription: "Timeless black bomber jacket with a clean, modern fit.",
    fullDescription:
      "This classic black bomber jacket pairs effortlessly with anything in your wardrobe. Featuring a tailored fit, smooth zipper closure, and soft inner lining, it's perfect for cool evenings and everyday wear.",
    videoUrl: undefined,
  },
  {
    productId: "prod-1",
    productName: "Classic Black Bomber Exclusive Jacket",
    productCategory: "Outerwear",
    productAmount: 200,
    discountPrice: 6000000,
    quantityAvailable: 0,
    isNegotiable: true,
    isPromo: false,
    isBestSelling: false,
    productImageUrls: [PLACEHOLDER_IMAGE],
    shortDescription: "Timeless black bomber jacket with a clean, modern fit.",
    fullDescription:
      "This classic black bomber jacket pairs effortlessly with anything in your wardrobe. Featuring a tailored fit, smooth zipper closure, and soft inner lining, it's perfect for cool evenings and everyday wear.",
    videoUrl: undefined,
  },
  {
    productId: "prod-1",
    productName: "Classic Black Bomber Jacket",
    productCategory: "Outerwear",
    productAmount: 200,
    discountPrice: 6000000,
    quantityAvailable: 6,
    isNegotiable: true,
    isPromo: true,
    isBestSelling: true,
    productImageUrls: [PLACEHOLDER_IMAGE],
    shortDescription: "Timeless black bomber jacket with a clean, modern fit.",
    fullDescription:
      "This classic black bomber jacket pairs effortlessly with anything in your wardrobe. Featuring a tailored fit, smooth zipper closure, and soft inner lining, it's perfect for cool evenings and everyday wear.",
    videoUrl: undefined,
  },
  {
    productId: "prod-1",
    productName: "Classic Black Bomber Jacket",
    productCategory: "Outerwear",
    productAmount: 200,
    discountPrice: 6000000,
    quantityAvailable: 0,
    isNegotiable: true,
    isPromo: false,
    isBestSelling: false,
    productImageUrls: [PLACEHOLDER_IMAGE],
    shortDescription: "Timeless black bomber jacket with a clean, modern fit.",
    fullDescription:
      "This classic black bomber jacket pairs effortlessly with anything in your wardrobe. Featuring a tailored fit, smooth zipper closure, and soft inner lining, it's perfect for cool evenings and everyday wear.",
    videoUrl: undefined,
  },
  {
    productId: "prod-1",
    productName: "Classic Black Bomber Jacket",
    productCategory: "Outerwear",
    productAmount: 200,
    currency: "$",
    discountPrice: 180.201,
    quantityAvailable: 6,
    isNegotiable: false,
    isPromo: false,
    isBestSelling: false,
    productImageUrls: [PLACEHOLDER_IMAGE],
    shortDescription: "Timeless black bomber jacket with a clean, modern fit.",
    fullDescription:
      "This classic black bomber jacket pairs effortlessly with anything in your wardrobe. Featuring a tailored fit, smooth zipper closure, and soft inner lining, it's perfect for cool evenings and everyday wear.",
    videoUrl: undefined,
  },
  {
    productId: "prod-1",
    productName: "Classic Black Bomber Jacket",
    productCategory: "Outerwear",
    productAmount: 200,
    discountPrice: 180.201,
    quantityAvailable: 6,
    isNegotiable: true,
    isPromo: true,
    isBestSelling: true,
    productImageUrls: [PLACEHOLDER_IMAGE],
    shortDescription: "Timeless black bomber jacket with a clean, modern fit.",
    fullDescription:
      "This classic black bomber jacket pairs effortlessly with anything in your wardrobe. Featuring a tailored fit, smooth zipper closure, and soft inner lining, it's perfect for cool evenings and everyday wear.",
    videoUrl: undefined,
  },
  {
    productId: "prod-1",
    productName: "Classic Black Bomber Jacket",
    productCategory: "Outerwear",
    productAmount: 200,
    discountPrice: 180.201,
    quantityAvailable: 0,
    isNegotiable: true,
    isPromo: false,
    isBestSelling: false,
    productImageUrls: [PLACEHOLDER_IMAGE],
    shortDescription: "Timeless black bomber jacket with a clean, modern fit.",
    fullDescription:
      "This classic black bomber jacket pairs effortlessly with anything in your wardrobe. Featuring a tailored fit, smooth zipper closure, and soft inner lining, it's perfect for cool evenings and everyday wear.",
    videoUrl: undefined,
  },
  {
    productId: "prod-1",
    productName: "Classic Black Bomber Jacket",
    productCategory: "Outerwear",
    productAmount: 200,
    discountPrice: 180,
    quantityAvailable: 6,
    isNegotiable: false,
    isPromo: false,
    isBestSelling: false,
    productImageUrls: [PLACEHOLDER_IMAGE],
    shortDescription: "Timeless black bomber jacket with a clean, modern fit.",
    fullDescription:
      "This classic black bomber jacket pairs effortlessly with anything in your wardrobe. Featuring a tailored fit, smooth zipper closure, and soft inner lining, it's perfect for cool evenings and everyday wear.",
    videoUrl: undefined,
  },
  {
    productId: "prod-1",
    productName: "Classic Black Bomber Jacket",
    productCategory: "Outerwear",
    productAmount: 200,
    discountPrice: undefined,
    quantityAvailable: 6,
    isNegotiable: false,
    isPromo: false,
    isBestSelling: false,
    productImageUrls: [PLACEHOLDER_IMAGE],
    shortDescription: "Timeless black bomber jacket with a clean, modern fit.",
    fullDescription:
      "This classic black bomber jacket pairs effortlessly with anything in your wardrobe. Featuring a tailored fit, smooth zipper closure, and soft inner lining, it's perfect for cool evenings and everyday wear.",
    videoUrl: undefined,
  },
  {
    productId: "prod-1",
    productName: "Classic Black Bomber Jacket",
    productCategory: "Outerwear",
    productAmount: 200,
    discountPrice: 180,
    quantityAvailable: 6,
    isNegotiable: true,
    isPromo: true,
    isBestSelling: true,
    productImageUrls: [PLACEHOLDER_IMAGE],
    shortDescription: "Timeless black bomber jacket with a clean, modern fit.",
    fullDescription:
      "This classic black bomber jacket pairs effortlessly with anything in your wardrobe. Featuring a tailored fit, smooth zipper closure, and soft inner lining, it's perfect for cool evenings and everyday wear.",
    videoUrl: undefined,
  },
  {
    productId: "prod-1",
    productName: "Classic Black Bomber Jacket",
    productCategory: "Outerwear",
    productAmount: 200,
    discountPrice: 180,
    quantityAvailable: 0,
    isNegotiable: true,
    isPromo: false,
    isBestSelling: false,
    productImageUrls: [PLACEHOLDER_IMAGE],
    shortDescription: "Timeless black bomber jacket with a clean, modern fit.",
    fullDescription:
      "This classic black bomber jacket pairs effortlessly with anything in your wardrobe. Featuring a tailored fit, smooth zipper closure, and soft inner lining, it's perfect for cool evenings and everyday wear.",
    videoUrl: undefined,
  },
  {
    productId: "prod-1",
    productName: "Classic Black Bomber Jacket",
    productCategory: "Outerwear",
    productAmount: 200,
    discountPrice: 180,
    quantityAvailable: 6,
    isNegotiable: false,
    isPromo: false,
    isBestSelling: false,
    productImageUrls: [PLACEHOLDER_IMAGE],
    shortDescription: "Timeless black bomber jacket with a clean, modern fit.",
    fullDescription:
      "This classic black bomber jacket pairs effortlessly with anything in your wardrobe. Featuring a tailored fit, smooth zipper closure, and soft inner lining, it's perfect for cool evenings and everyday wear.",
    videoUrl: undefined,
  },
  {
    productId: "prod-1",
    productName: "Classic Black Bomber Jacket",
    productCategory: "Outerwear",
    productAmount: 200,
    discountPrice: undefined,
    quantityAvailable: 6,
    isNegotiable: false,
    isPromo: false,
    isBestSelling: false,
    productImageUrls: [PLACEHOLDER_IMAGE],
    shortDescription: "Timeless black bomber jacket with a clean, modern fit.",
    fullDescription:
      "This classic black bomber jacket pairs effortlessly with anything in your wardrobe. Featuring a tailored fit, smooth zipper closure, and soft inner lining, it's perfect for cool evenings and everyday wear.",
    videoUrl: undefined,
  },
  {
    productId: "prod-1",
    productName: "Classic Black Bomber Jacket",
    productCategory: "Outerwear",
    productAmount: 200,
    discountPrice: undefined,
    quantityAvailable: 6,
    isNegotiable: false,
    isPromo: false,
    isBestSelling: false,
    productImageUrls: [PLACEHOLDER_IMAGE],
    shortDescription: "Timeless black bomber jacket with a clean, modern fit.",
    fullDescription:
      "This classic black bomber jacket pairs effortlessly with anything in your wardrobe. Featuring a tailored fit, smooth zipper closure, and soft inner lining, it's perfect for cool evenings and everyday wear.",
    videoUrl: undefined,
  },
  {
    productId: "prod-1",
    productName: "Classic Black Bomber Jacket",
    productCategory: "Outerwear",
    productAmount: 200,
    discountPrice: 180,
    quantityAvailable: 6,
    isNegotiable: false,
    isPromo: false,
    isBestSelling: false,
    productImageUrls: [PLACEHOLDER_IMAGE],
    shortDescription: "Timeless black bomber jacket with a clean, modern fit.",
    fullDescription:
      "This classic black bomber jacket pairs effortlessly with anything in your wardrobe. Featuring a tailored fit, smooth zipper closure, and soft inner lining, it's perfect for cool evenings and everyday wear.",
    videoUrl: undefined,
  },
  {
    productId: "prod-1",
    productName: "Classic Black Bomber Jacket",
    productCategory: "Outerwear",
    productAmount: 200,
    discountPrice: undefined,
    quantityAvailable: 6,
    isNegotiable: false,
    isPromo: false,
    isBestSelling: false,
    productImageUrls: [PLACEHOLDER_IMAGE],
    shortDescription: "Timeless black bomber jacket with a clean, modern fit.",
    fullDescription:
      "This classic black bomber jacket pairs effortlessly with anything in your wardrobe. Featuring a tailored fit, smooth zipper closure, and soft inner lining, it's perfect for cool evenings and everyday wear.",
    videoUrl: undefined,
  },
];
