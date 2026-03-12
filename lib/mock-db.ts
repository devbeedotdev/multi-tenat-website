import type { CartItem } from "@/types/cart";
import type { Product } from "@/types/product";
import type { SuperAdmin } from "@/types/super-admin";
import type { Tenant } from "@/types/tenant";

/** Cloud carts keyed by normalized phone number (digits only) for cross-device sync */
export const cloudCarts: Record<string, CartItem[]> = {};

/** Cloud cart passwords keyed by normalized phone (mock: plain; production would use hashes) */
export const cloudCartPasswords: Record<string, string> = {};

export const tenants: Record<string, Tenant> = {
  "client.com": {
    businessName: "Localhost Demo Store - First",
    accountName: "Ayeni Abolaji Hamzat",
    variant: "A",
    tenantId: "client.com",
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
    seoTitle: "Jumia Nigeria – Localhost Demo Store",
    seoDescription:
      "Explore the Localhost Demo Store with Jumia Nigeria – a playground for testing modern multi-tenant ecommerce experiences.",
    seoKeywords:
      "ecommerce, demo store, localhost, jumia nigeria, multi-tenant, online shopping",
    updatedAt: Date.now().toString(),
    createdAt: Date.now().toString(),
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
    seoTitle: "Pari Pulse – Client A Boutique",
    seoDescription:
      "Pari Pulse is a modern boutique experience for fashion-forward shoppers, powered by our multi-tenant ecommerce engine.",
    seoKeywords:
      "pari pulse, client a, boutique, fashion, ecommerce, multi-tenant",
    updatedAt: Date.now().toString(),
    createdAt: Date.now().toString(),
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
    seoTitle: "Customer Shop – Customer-First Marketplace",
    seoDescription:
      "Customer Shop is a trusted, customer-first marketplace showcasing a wide range of everyday products.",
    seoKeywords:
      "customer shop, marketplace, online store, ecommerce, multi-tenant",
    updatedAt: Date.now().toString(),
    createdAt: Date.now().toString(),
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
    seoTitle: "Another Store – Alternative Shopping Experience",
    seoDescription:
      "Another Store offers a different shopping experience with unique products and bold branding.",
    seoKeywords:
      "another store, alternative shopping, ecommerce, online store, multi-tenant",
    updatedAt: Date.now().toString(),
    createdAt: Date.now().toString(),
  },
};

export const superAdmin: SuperAdmin = {
  /** Main platform domain that owns the super admin console */
  domain: "getcheapecommerce.com",
  /** Login identifier for the super admin */
  email: "superadmin@getcheapecommerce.com",
  /** Plain-text password for mock purposes only */
  password: "SuperAdmin@123",
  /** Primary WhatsApp contact for the platform (format: 234...) */
  phoneNumber: "23409025570361",
  /** SEO + marketing copy for the main landing page */
  landingSeoTitle:
    "GetCheapEcommerce – Launch a Professional Online Store in 30 Minutes for ₦50,000",
  landingSeoDescription:
    "Get a beautiful, conversion-focused ecommerce website for just ₦50,000 and start selling online in under 30 minutes. Done‑for‑you setup, mobile‑ready storefronts, WhatsApp checkout, inventory management and a friendly admin dashboard included.",
  landingSeoKeywords:
    "ecommerce website, online store, nigeria ecommerce, cheap ecommerce, affordable online shop, launch store fast, getcheapecommerce, whatsapp checkout, small business ecommerce, sell online in nigeria, 50000 naira website",
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
