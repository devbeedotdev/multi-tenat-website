import type { CartItem } from "@/types/cart";
import type { Product } from "@/types/product";
import { Tenant } from "@/types/tenant";

/** Cloud carts keyed by normalized phone number (digits only) for cross-device sync */
export const cloudCarts: Record<string, CartItem[]> = {};

/** Cloud cart passwords keyed by normalized phone (mock: plain; production would use hashes) */
export const cloudCartPasswords: Record<string, string> = {};

export const tenants: Record<string, Tenant> = {
  "client.com": {
    businessName: "Localhost Demo Store - First",
    accountName: "Ayeni Abolaji Hamzat",
    variant: "A",
    tenantId: "localhost",
    businessPhoneNumber: "23409025570361",
    businessEmail: "admin@localhost",
    currency: "$",
    adminPassword: "Pass@123",
    bankAccountNumber: "2104259047",
    bankName: "UBA Bank",
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
    accountName: "Olabisi Ayeni",
    currency: "$",
    isLogoHorizontal: true,
    businessPhoneNumber: "23408089474706",
    businessEmail: "admin@client-a.com",
    adminPassword: "Pass@123",
    bankAccountNumber: "6558608577",
    bankName: "Fidelity Bank",
    logoUrl: "/images/paripulse.png",
    tenantId: "client-a.com",
    variant: "B",
    primaryColor: "#10B981",
    businessDescription: "A modern boutique experience tailored for Client A.",
    websiteDisplayName: "Pari Pulse",
    favIcon:
      "https://images.unsplash.com/photo-1454625233598-f29d597eea1e?ixlib=rb-4.1.0&auto=format&fit=crop&w=800&q=80",
  },
  "getcheapecommerce.com": {
    businessName: "Arike's Online Store",
    currency: "$",
    accountName: "Arike Olaniyi Precious",
    bankAccountNumber: "9025570361",
    bankName: "Opay Wallet",
    isLogoHorizontal: false,
    businessPhoneNumber: "23408055456053",
    businessEmail: "admin@client-b.com",
    adminPassword: "Pass@123",
    logoUrl: "/images/logo.jpg",
    variant: "C",
    tenantId: "client-b.com",
    primaryColor: "#000000",
    businessDescription: "An energetic brand presence for Client B.",
    websiteDisplayName: "Jiji Nigeria",
    favIcon:
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=64&h=64&q=80",
  },
  "customer-shop.com": {
    businessName: "Customer Shop",
    accountName: "Customer Shop Owner",
    currency: "$",
    tenantId: "customer-shop.com",
    businessPhoneNumber: "23408000000001",
    businessEmail: "admin@customer-shop.com",
    adminPassword: "Pass@123",
    bankAccountNumber: "1234567890",
    bankName: "Customer Bank",
    primaryColor: "#2563EB",
    isLogoHorizontal: true,
    variant: "A",
    businessDescription: "Your trusted customer-first marketplace.",
    websiteDisplayName: "Customer Shop",
    logoUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    favIcon:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=64&h=64&q=80",
  },
  "another-store.com": {
    businessName: "Another Store",
    accountName: "Another Store Owner",
    currency: "€",
    tenantId: "another-store.com",
    businessPhoneNumber: "23408000000002",
    businessEmail: "admin@another-store.com",
    adminPassword: "Pass@123",
    bankAccountNumber: "0987654321",
    bankName: "Another Bank",
    primaryColor: "#DC2626",
    isLogoHorizontal: false,
    variant: "B",
    businessDescription:
      "A different shopping experience with unique offerings.",
    websiteDisplayName: "Another Store",
    logoUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    favIcon:
      "https://images.unsplash.com/photo-1454625233598-f29d597eea1e?auto=format&fit=crop&w=64&h=64&q=80",
  },
};

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

const productCategories = categories.filter((c) => c !== "All");
const tenantKeys = Object.keys(tenants);

export const products: Product[] = Array.from({ length: 60 }, (_, i) => {
  const category = productCategories[i % productCategories.length];
  const tenantKey = tenantKeys[i % tenantKeys.length];

  return {
    productId: `prod-${tenantKey}-${i + 1}`,
    tenantId: tenantKey,
    productName: `${category} Item ${i + 1}`,
    productCategory: i === 0 ? "Shoes" : "Accessories",
    productAmount: 100 + (i % 10) * 600000,
    discountPrice: i % 3 === 0 ? 10 : 0,
    quantityAvailable: 5 + (i % 12),
    isDetailsTabular: true,
    isNegotiable: i % 2 === 0,
    isPromo: i % 4 === 0,
    isBestSelling: i % 5 === 0,
    mediaUrls: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
      "https://images.unsplash.com/photo-1461988320302-91bde64fc8e4",
      "https://images.unsplash.com/photo-1520975916090-3105956dac38",
      "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
    ],
    productDetails: [
      { RAM: "8GB" },
      { Storage: "128GB" },
      { Processor: "A15 Bionic" },
      { Camera: "12MP" },
      { Battery: "3000mAh" },
      { Display: "6.1 inches" },
      { Resolution: "1170 x 2556 pixels" },
      { "Refresh Rate": "120Hz" },
      { Connectivity: "Wi-Fi, Bluetooth, NFC" },
      { Sensors: "Face ID, Touch ID" },
      {
        "Key Features": [
          "Smart Control",
          "Durable Battery",
          "Smart Control",
          "Durable Battery",
          "Smart Control",
          "Durable Battery",
        ],
      },
    ],
    shortDescription: `Premium ${category.toLowerCase()} designed for everyday use, combining quality materials with modern styling and long-lasting performance.`,
    fullDescription: `This high-quality ${category.toLowerCase()} item is built with durability and style in mind. Perfect for both casual and premium use cases. Designed for comfort, reliability, and long-term performance.`,
  };
});
