import type { ReactNode } from "react";
import type { Metadata } from "next";
import { getTenantByDomain } from "@/lib/mock-db";

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

  return {
    title: tenant.websiteDisplayName,
    icons: {
      icon: [{ url: tenant.logoUrl }],
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
      <style dangerouslySetInnerHTML={{ __html: `body { --primary: ${tenant.primaryColor}; }` }} />
      {children}
    </>
  );
}

