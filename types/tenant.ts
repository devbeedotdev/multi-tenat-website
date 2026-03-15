export type TenantVariant = "A" | "B" | "C";

export type Tenant = {
  businessName: string;
  tenantId: string;
  accountName: string;
  businessPhoneNumber: string;
  businessEmail: string;
  adminPassword: string;
  variant: TenantVariant;
  primaryColor: string;
  businessDescription: string;
  websiteDisplayName: string;
  bankAccountNumber: string;
  bankName: string;
  favIcon: string;
  logoUrl?: string;
  isLogoHorizontal: boolean;
  currency: string;
  /** Optional SEO metadata for the tenant storefront */
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  createdAt: string;

  currentPlan?: "Starter" | "Advanced";
  imageSizeLimit?: number;
  videoSizeLimit?: number;
  cloudinaryName?: string;
  cloudinaryKey?: string;
  cloudinarySecret?: string;
};

export type TenantPageProps = {
  tenant: Tenant;
  showSearchField?: boolean;

  searchParams?: { category?: string; search?: string };
};
