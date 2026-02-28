import type { Product } from "./product";
import type { Tenant, TenantVariant } from "./tenant";

export type SearchProductFormProps = {
  initialSearch?: string;
  height?: string;
  useAutoSearch?: boolean;
  isClearButtonActive?: boolean;
};

export type WhatsappMessageBoxProps = {
  tenant: Tenant;
  product: Product;
};

export type SuggestedScrollerProps = {
  products: Product[];
  tenant: Tenant;
};

export type VariantContainerProps = {
  tenant: Tenant;
  categories: string[];
};

export type VariantCTopBarProps = {
  tenant: Tenant;
  showSearchField?: boolean;
  onOpenSidebar: () => void;
};

export type ProductActionBarProps = {
  tenant: Tenant;
  product: Product;
  variant?: TenantVariant;
  useSecondLayout?: boolean;
};

