import type { ReactNode } from "react";
import Link from "next/link";

type AdminLayoutProps = {
  children: ReactNode;
  params: {
    domain: string;
  };
};

export default function AdminLayout({ children, params }: AdminLayoutProps) {
  const domain = params.domain;

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex min-h-screen">
        <aside className="hidden md:flex w-64 flex-col border-r border-slate-200 bg-slate-900 text-slate-50 px-6 py-8">
          <div className="mb-8">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Multi-tenant
            </div>
            <div className="mt-1 text-xl font-semibold tracking-tight">
              Admin Console
            </div>
          </div>

          <nav className="space-y-1 text-sm">
            <Link
              href={`/${domain}/admin/dashboard`}
              className="block rounded-lg px-3 py-2 font-medium text-slate-100 hover:bg-slate-800 hover:text-white"
            >
              Products
            </Link>
            <Link
              href={`/${domain}/admin/dashboard#account`}
              className="block rounded-lg px-3 py-2 font-medium text-slate-200 hover:bg-slate-800 hover:text-white"
            >
              Account Settings
            </Link>
          </nav>

          <div className="mt-6">
            <Link
              href={`/${domain}`}
              className="inline-flex items-center rounded-lg border border-slate-500/40 px-3 py-1.5 text-xs font-medium text-slate-100 hover:bg-slate-800 hover:text-white"
            >
              ← Back to site
            </Link>
          </div>

          <div className="mt-auto pt-8 text-xs text-slate-500">
            Secure admin access for tenant owners.
          </div>
        </aside>

        <main className="flex-1 px-4 py-6 md:px-10 md:py-10">{children}</main>
      </div>
    </div>
  );
}

