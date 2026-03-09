import CartProviderWithSync from "@/components/cart/CartProviderWithSync";
import { getTenantByDomain } from "@/lib/dal";
import type { Metadata } from "next";
import type { ReactNode } from "react";

type DomainLayoutProps = {
  children: ReactNode;
  params: {
    domain: string;
  };
};

export function generateMetadata({
  params,
}: {
  params: { domain: string };
}): Metadata {
  const tenant = getTenantByDomain(params.domain);

  if (!tenant) {
    return {
      title: "Tenant not found",
    };
  }

  const keywords =
    tenant.seoKeywords
      ?.split(",")
      .map((k) => k.trim())
      .filter(Boolean) ?? [];

  return {
    title: tenant.seoTitle || tenant.websiteDisplayName,
    description: tenant.seoDescription || tenant.businessDescription,
    keywords: keywords.length ? keywords : undefined,
    icons: {
      icon: [{ url: tenant.favIcon }],
    },
  };
}

export default function DomainLayout({ children, params }: DomainLayoutProps) {
  const tenant = getTenantByDomain(params.domain);

  if (!tenant) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold">Tenant not found</h1>
          <p className="text-gray-500">
            No configuration was found for domain: <code>{params.domain}</code>
          </p>
        </div>
      </main>
    );
  }

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `body { --primary: ${tenant.primaryColor}; }`,
        }}
      />
      <CartProviderWithSync domain={params.domain} variant={tenant.variant}>
        {children}
      </CartProviderWithSync>
    </>
  );
}
