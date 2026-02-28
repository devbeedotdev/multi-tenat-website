import type { Tenant } from "./tenant";

export type SearchParams = {
  category?: string;
  search?: string;
};

export type DomainPageProps = {
  params: {
    domain: string;
  };
  searchParams?: SearchParams;
};

export type ProductPageParams = {
  params: {
    domain: string;
    id: string;
  };
};

export type ProductDetailPageProps = {
  tenant: Tenant;
  params: {
    domain: string;
    id: string;
  };
};

