import { AdminStoreSettingsForm } from "@/components/admin/AdminStoreSettingsForm";
import { updateTenantSettings } from "@/app/[domain]/admin/actions";
import { getTenantByDomain } from "@/lib/dal";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type SearchParams = {
  settingsSaved?: string;
};

async function requireAdminTenantForDomain(domain: string) {
  const normalizedDomain = domain.toLowerCase();
  const cookieStore = cookies();
  const session = cookieStore.get("admin_session")?.value;

  if (!session || session !== normalizedDomain) {
    redirect(`/${normalizedDomain}/admin/login`);
  }

  const tenantResult = await getTenantByDomain(session);
  if (!tenantResult.ok || !tenantResult.data) {
    redirect(`/${normalizedDomain}/admin/login`);
  }

  return tenantResult.data;
}

export default async function AdminSettingsPage({
  params,
  searchParams,
}: {
  params: { domain: string };
  searchParams: SearchParams;
}) {
  const domain = params.domain.toLowerCase();
  const tenant = await requireAdminTenantForDomain(domain);
  const settingsSaved = searchParams.settingsSaved === "1";
  const cookieStore = cookies();
  const isSuperAdmin =
    cookieStore.get("super_admin_session")?.value != null;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 border-b border-slate-200 pb-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold text-slate-900">
            Store settings
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Configure your business identity, branding, and payment details for{" "}
            <span className="font-medium text-slate-700">
              {tenant.businessName}
            </span>{" "}
            (<span className="font-mono text-xs">{tenant.tenantId}</span>)
          </p>
        </div>

        <a
          href={`/${domain}/admin/dashboard`}
          className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          ← Back to dashboard
        </a>
      </header>

      {settingsSaved && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          Settings saved successfully. Your storefront will now use the updated
          branding.
        </div>
      )}

      <form action={updateTenantSettings.bind(null, domain)}>
        <AdminStoreSettingsForm tenant={tenant} isSuperAdmin={isSuperAdmin} />
      </form>
    </div>
  );
}

