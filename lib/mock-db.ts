import type { Product } from "@/types/product";
import { Tenant } from "@/types/tenant";

export const tenants: Record<string, Tenant> = {
  localhost: {
    businessName: "Localhost Demo Store - First",
    variant: "A",
    tenantId: "localhost",
    primaryColor: "#964B00",
    isLogoHorizontal: false,
    businessDescription:
      "A development tenant for local testing and UI exploration.",
    websiteDisplayName: "Jumia Nigeria",
    logoUrl: "/images/logo.jpeg",
    favIcon:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=64&h=64&q=80",
  },
  "client-a.com": {
    businessName: "Client A Boutique - Second",
    isLogoHorizontal: true,
    logoUrl: "/images/paripulse.png",
    tenantId: "client-a.com",
    variant: "B",
    primaryColor: "#10B981",
    businessDescription: "A modern boutique experience tailored for Client A.",
    websiteDisplayName: "Pari Pulse",
    favIcon:
      "https://images.unsplash.com/photo-1454625233598-f29d597eea1e?ixlib=rb-4.1.0&auto=format&fit=crop&w=800&q=80",
  },
  "client-b.com": {
    businessName: "Client B Outfitters - Third",
    isLogoHorizontal: true,
    logoUrl: "/images/paripulse.png",
    variant: "C",
    tenantId: "client-b.com",
    primaryColor: "#000000",
    businessDescription: "An energetic brand presence for Client B.",
    websiteDisplayName: "Jiji Nigeria",
    favIcon:
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=64&h=64&q=80",
  },
};

export function getTenantByDomain(domain: string): Tenant | undefined {
  const normalized = domain.split(":")[0].toLowerCase();
  return tenants[normalized];
}

export const categories = [
  "All",
  "Shoes",
  "Bags",
  "Hats",
  "Watches",
  "Clothing",
  "Accessories",
  "Electronics",
  "Jewelry",
  "Sports",
  "Beauty",
  "Home & Kitchen",
  "Furniture",
  "Groceries",
  "Health",
  "Baby Products",
  "Toys",
  "Automotive",
  "Books",
  "Office Supplies",
  "Pet Supplies",
  "Gaming",
  "Mobile Phones",
  "Laptops",
  "Tablets",
  "Cameras",
  "Audio Equipment",
  "Smart Home",
  "Lighting",
  "Outdoor",
  "Fitness",
  "Skincare",
  "Haircare",
  "Fragrances",
  "Men’s Fashion",
  "Women’s Fashion",
  "Kids’ Fashion",
  "Underwear",
  "Sunglasses",
  "Backpacks",
  "Travel & Luggage",
  "Appliances",
  "Tools",
  "Art & Crafts",
  "Stationery",
  "Musical Instruments",
  "Garden",
  "Luxury",
  "Digital Products",
  "Gift Items",
];

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30";

const productCategories = categories.filter((c) => c !== "All");

export const products: Product[] = Array.from({ length: 40 }, (_, i) => {
  const category = productCategories[i % productCategories.length];

  return {
    productId: `prod-${i + 1}`,
    productName: `${category} Item ${i + 1}`,
    productCategory: category,
    productAmount: 100 + (i % 10) * 600000,
    discountPrice: i % 3 === 0 ? 10 : 0,
    quantityAvailable: 5 + (i % 12),
    isNegotiable: i % 2 === 0,
    isPromo: i % 4 === 0,
    isBestSelling: i % 5 === 0,
    productImageUrls: [PLACEHOLDER_IMAGE],
    shortDescription: `Premium ${category.toLowerCase()} designed for everyday use, combining quality materials with modern styling and long-lasting performance.`,
    fullDescription: `This high-quality ${category.toLowerCase()} item is built with durability and style in mind. Perfect for both casual and premium use cases. Designed for comfort, reliability, and long-term performance.`,
    videoUrl: undefined,
  };
});
