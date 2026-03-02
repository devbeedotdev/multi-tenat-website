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
      <header className="flex items-center justify-between border-b border-slate-200 bg-white/80 px-4 py-3 text-xs text-slate-600 backdrop-blur md:px-8">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            Admin Console
          </span>
          <span className="text-slate-400">/</span>
          <span className="font-mono text-[11px] text-slate-700">
            {domain}
          </span>
        </div>
        <Link
          href={`/${domain}`}
          className="inline-flex items-center rounded-lg border border-slate-300 px-3 py-1.5 text-[11px] font-medium text-slate-700 hover:bg-slate-50"
        >
          ← Back to site
        </Link>
      </header>
      <main className="min-h-[calc(100vh-48px)] w-full px-3 py-4 md:px-6 md:py-6 lg:px-8 lg:py-8">
        {children}
      </main>
    </div>
  );
}

