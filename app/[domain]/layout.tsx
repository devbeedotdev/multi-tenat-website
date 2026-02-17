import type { ReactNode, CSSProperties } from "react";
import { getTenantByDomain } from "@/lib/mock-db";

type DomainLayoutProps = {
  children: ReactNode;
  params: {
    domain: string;
  };
};

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

  const themeStyle = {
    "--primary": tenant.primaryColor,
  } as CSSProperties;

  return (
    <div style={themeStyle}>
      {children}
    </div>
  );
}

