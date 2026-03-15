import { NoProduct } from "@/components/empty/NoProduct";
import { getProductsByTenant, getTenantByDomain } from "@/lib/dal";
import type { Tenant } from "@/types/tenant";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";

function isTenantSettingsComplete(tenant: Tenant): boolean {
  const requiredFields = [
    tenant.businessName,
    tenant.websiteDisplayName,
    tenant.businessEmail,
    tenant.businessPhoneNumber,
    tenant.businessDescription,
    tenant.primaryColor,
    tenant.accountName,
    tenant.bankAccountNumber,
    tenant.bankName,
  ];

  const allFilled = requiredFields.every(
    (value) => typeof value === "string" && value.trim().length > 0,
  );

  const phoneLooksValid =
    typeof tenant.businessPhoneNumber === "string" &&
    tenant.businessPhoneNumber.trim().startsWith("234");

  return allFilled && phoneLooksValid;
}

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
  const tenant = tenantResult.data;

  if (!isTenantSettingsComplete(tenant)) {
    redirect(`/${normalizedDomain}/admin/settings?incomplete=1`);
  }

  return tenant;
}

async function handleLogout(domain: string) {
  "use server";

  const normalizedDomain = domain.toLowerCase();
  const cookieStore = cookies();
  cookieStore.delete("admin_session");
  redirect(`/${normalizedDomain}/admin/login`);
}

export default async function AdminDashboardPage({
  params,
  searchParams,
}: {
  params: { domain: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const domain = params.domain.toLowerCase();
  const tenant = await requireAdminTenantForDomain(domain);
  const products = await getProductsByTenant(tenant.tenantId);

  const error = searchParams.error as string | undefined;
  const success = searchParams.success as string | undefined;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 border-b border-slate-200 pb-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold text-slate-900">
            Products Power-Table
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Managing products for{" "}
            <span className="font-medium text-slate-700">
              {tenant.businessName}
            </span>{" "}
            (<span className="font-mono text-xs">{tenant.tenantId}</span>)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href={`/${domain}/admin/settings`}
            className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            Store settings
          </a>
          <a
            href="#add-product"
            className="inline-flex items-center rounded-xl px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:opacity-95"
            style={{ backgroundColor: tenant.primaryColor }}
          >
            + Add new product
          </a>
          <form action={handleLogout.bind(null, domain)}>
            <button
              type="submit"
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      {(error || success) && (
        <div id="alerts" className="space-y-2">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              {success}
            </div>
          )}
        </div>
      )}

      <AdminDashboardClient
        initialProducts={products}
        tenant={tenant}
        domain={domain}
        bulkFormId="bulk-update-form"
        bulkPayloadInputId="bulk-update-payload"
        addFormId="add-product-form"
        addPayloadInputId="add-product-payload"
        deleteFormId="delete-product-form"
      />
    </div>
  );
}
