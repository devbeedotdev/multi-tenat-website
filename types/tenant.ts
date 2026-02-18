export type TenantVariant = "A" | "B" | "C";

export type Tenant = {
  businessName: string;
  variant: TenantVariant;
  primaryColor: string;
  businessDescription: string;
  websiteDisplayName: string;
  favIcon: string;
  logoUrl? : string
};

export type TenantPageProps = {
  tenant: Tenant;
};
