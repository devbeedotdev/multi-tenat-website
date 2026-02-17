export type TenantVariant = "A" | "B" | "C";

export type Tenant = {
  businessName: string;
  variant: TenantVariant;
  primaryColor: string;
  businessDescription: string;
  websiteDisplayName: string;
};

export const tenants: Record<string, Tenant> = {
  localhost: {
    businessName: "Localhost Demo Store",
    variant: "A",
    primaryColor: "#2563EB",
    businessDescription:
      "A development tenant for local testing and UI exploration.",
    websiteDisplayName: "Jumia Nigeria",
  },
  "client-a.com": {
    businessName: "Client A Boutique",
    variant: "B",
    primaryColor: "#16A34A",
    businessDescription: "A modern boutique experience tailored for Client A.",
    websiteDisplayName: "Pari Pulse",
  },
  "client-b.com": {
    businessName: "Client B Outfitters",
    variant: "C",
    primaryColor: "#DB2777",
    businessDescription: "An energetic brand presence for Client B.",
    websiteDisplayName: "Jiji Nigeria",
  },
};

export function getTenantByDomain(domain: string): Tenant | undefined {
  const normalized = domain.split(":")[0].toLowerCase();
  return tenants[normalized];
}
