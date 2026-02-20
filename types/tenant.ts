export type TenantVariant = "A" | "B" | "C";

export type Tenant = {
  businessName: string;
  tenantId: string;
  variant: TenantVariant;
  primaryColor: string;
  businessDescription: string;
  websiteDisplayName: string;
  favIcon: string;
  logoUrl?: string;
  isLogoHorizontal: boolean;
};

export type TenantPageProps = {
  tenant: Tenant;
};
