import {
  getAllTenants,
  getSuperAdminSettings,
  isMainPlatformDomain,
  updateSuperAdminSettings,
  verifySuperAdminPassword,
} from "@/lib/dal";
import type { Tenant } from "@/types/tenant";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

const SUPER_ADMIN_COOKIE = "super_admin_session";

async function handleSuperAdminLogin(formData: FormData) {
  "use server";

  const password = String(formData.get("password") || "");
  const hostHeader = headers().get("host") ?? "";

  if (!isMainPlatformDomain(hostHeader)) {
    redirect(
      "/super-admin?error=Super admin is only available on the main domain",
    );
  }

  const isValid = await verifySuperAdminPassword(password);
  if (!isValid) {
    redirect(
      `/super-admin?error=${encodeURIComponent(
        "Invalid super admin credentials",
      )}`,
    );
  }

  const cookieStore = cookies();
  cookieStore.set(SUPER_ADMIN_COOKIE, "active", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  redirect("/super-admin");
}

async function handleImpersonateTenant(formData: FormData) {
  "use server";

  const cookieStore = cookies();
  const superSession = cookieStore.get(SUPER_ADMIN_COOKIE)?.value;
  if (!superSession) {
    redirect("/super-admin?error=Super admin session required");
  }

  const tenantId = String(formData.get("tenantId") || "").toLowerCase();
  if (!tenantId) {
    redirect("/super-admin?error=Missing tenantId");
  }

  cookieStore.set("admin_session", tenantId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  redirect(`/${tenantId}/admin/dashboard`);
}

async function handleUpdateTenant(formData: FormData) {
  "use server";

  const { updateTenantInDB } = await import("@/lib/dal");

  const cookieStore = cookies();
  const superSession = cookieStore.get(SUPER_ADMIN_COOKIE)?.value;
  if (!superSession) {
    redirect("/super-admin?error=Super admin session required");
  }

  const tenantId = String(formData.get("tenantId") || "").toLowerCase();
  if (!tenantId) {
    redirect("/super-admin?error=Missing tenantId");
  }

  const get = (key: string, fallback: string): string =>
    String(formData.get(key) ?? fallback).trim();

  const updates: Partial<Tenant> = {
    businessName: get("businessName", ""),
    websiteDisplayName: get("websiteDisplayName", ""),
    businessEmail: get("businessEmail", ""),
    businessPhoneNumber: get("businessPhoneNumber", ""),
    businessDescription: get("businessDescription", ""),
    primaryColor: get("primaryColor", ""),
    variant: get("variant", "A") as Tenant["variant"],
    logoUrl: get("logoUrl", ""),
    favIcon: get("favIcon", ""),
    accountName: get("accountName", ""),
    bankAccountNumber: get("bankAccountNumber", ""),
    bankName: get("bankName", ""),
    currency: get("currency", "₦"),
    seoTitle: get("seoTitle", ""),
    seoDescription: get("seoDescription", ""),
    seoKeywords: get("seoKeywords", ""),
  };

  await updateTenantInDB(tenantId, updates);

  redirect(`/super-admin?updated=${encodeURIComponent(tenantId)}`);
}

async function handleUpdatePlatformSettings(formData: FormData) {
  "use server";

  const cookieStore = cookies();
  const superSession = cookieStore.get(SUPER_ADMIN_COOKIE)?.value;
  if (!superSession) {
    redirect("/super-admin?error=Super admin session required");
  }

  const get = (key: string, fallback: string): string =>
    String(formData.get(key) ?? fallback).trim();

  const result = await updateSuperAdminSettings({
    phoneNumber: get("phoneNumber", ""),
    landingSeoTitle: get("landingSeoTitle", ""),
    landingSeoDescription: get("landingSeoDescription", ""),
    landingSeoKeywords: get("landingSeoKeywords", ""),
  });
  if (!result.ok) {
    redirect(`/super-admin?error=${encodeURIComponent(result.error)}`);
  }

  redirect("/super-admin?updated=platform");
}

export default async function SuperAdminPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const cookieStore = cookies();
  const superSession = cookieStore.get(SUPER_ADMIN_COOKIE)?.value;
  const error = searchParams.error as string | undefined;
  const updatedTenantId = searchParams.updated as string | undefined;

  if (!superSession) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
        <div className="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 shadow-lg border border-slate-200">
          <div className="space-y-1 text-center">
            <h1 className="text-2xl font-semibold text-slate-900">
              Super Admin Login
            </h1>
            <p className="text-sm text-slate-500">
              Access the multi-tenant control plane for{" "}
              <span className="font-medium">getcheapecommerce.com</span>.
            </p>
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
              {error}
            </div>
          )}

          <form action={handleSuperAdminLogin} className="space-y-4">
            <div className="space-y-1">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700"
              >
                Super admin password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
              />
            </div>

            <button
              type="submit"
              className="mt-2 w-full rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.99]"
            >
              Sign in as Super Admin
            </button>
          </form>
        </div>
      </main>
    );
  }

  const platformSettingsResult = await getSuperAdminSettings();
  const platformSettings = platformSettingsResult.ok ? platformSettingsResult.data : { domain: "", email: "", phoneNumber: "" };
  const tenants = await getAllTenants();

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <header className="flex flex-col gap-3 border-b border-slate-200 pb-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-slate-900">
              Super Admin – Tenants Overview
            </h1>
            <p className="text-sm text-slate-500">
              View and manage all tenants, including branding, SEO, and product access.
            </p>
          </div>
        </header>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
            {error}
          </div>
        )}

        {updatedTenantId && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            {updatedTenantId === "platform" ? (
              <>Platform settings updated successfully.</>
            ) : (
              <>
                Tenant <span className="font-mono">{updatedTenantId}</span> updated
                successfully.
              </>
            )}
          </div>
        )}

        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="space-y-1">
              <h2 className="text-sm font-semibold text-slate-900">
                Platform landing page & SEO
              </h2>
              <p className="text-xs text-slate-500">
                Control the marketing copy, SEO and WhatsApp number for{" "}
                <span className="font-medium">{platformSettings.domain}</span>.
              </p>
            </div>
          </div>

          <form action={handleUpdatePlatformSettings} className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <label className="space-y-1 md:col-span-2">
                <span className="block text-[11px] font-medium text-slate-700">
                  WhatsApp phone (format: 234...)
                </span>
                <input
                  name="phoneNumber"
                  defaultValue={platformSettings.phoneNumber ?? ""}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                />
              </label>

              <label className="space-y-1 md:col-span-2">
                <span className="block text-[11px] font-medium text-slate-700">
                  Landing page SEO title
                </span>
                <input
                  name="landingSeoTitle"
                  defaultValue={platformSettings.landingSeoTitle ?? ""}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                />
              </label>

              <label className="space-y-1 md:col-span-2">
                <span className="block text-[11px] font-medium text-slate-700">
                  Landing page SEO description
                </span>
                <textarea
                  name="landingSeoDescription"
                  defaultValue={platformSettings.landingSeoDescription ?? ""}
                  rows={3}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                />
              </label>

              <label className="space-y-1 md:col-span-2">
                <span className="block text-[11px] font-medium text-slate-700">
                  Landing page SEO keywords (comma-separated)
                </span>
                <input
                  name="landingSeoKeywords"
                  defaultValue={platformSettings.landingSeoKeywords ?? ""}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                />
              </label>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
              >
                Save platform settings
              </button>
            </div>
          </form>
        </section>

        <div className="grid gap-4 md:grid-cols-2">
          {tenants.map((tenant) => (
            <section
              key={tenant.tenantId}
              className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="space-y-1">
                  <h2 className="text-sm font-semibold text-slate-900">
                    {tenant.websiteDisplayName}
                  </h2>
                  <p className="text-xs text-slate-500">
                    <span className="font-mono">{tenant.tenantId}</span>
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center">
                  <form action={handleImpersonateTenant}>
                    <input
                      type="hidden"
                      name="tenantId"
                      value={tenant.tenantId}
                    />
                    <button
                      type="submit"
                      className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                    >
                      Open products
                    </button>
                  </form>

                  <details className="group w-full sm:w-auto">
                    <summary className="list-none">
                      <button
                        type="button"
                        className="w-full rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800 group-open:rounded-b-none"
                      >
                        Edit tenant
                      </button>
                    </summary>
                    <div className="mt-2 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-900 group-open:rounded-t-none">
                      <form action={handleUpdateTenant} className="space-y-3">
                        <input
                          type="hidden"
                          name="tenantId"
                          value={tenant.tenantId}
                        />

                        <div className="grid gap-2 md:grid-cols-2">
                          <label className="space-y-1">
                            <span className="block text-[11px] font-medium text-slate-700">
                              Business name
                            </span>
                            <input
                              name="businessName"
                              defaultValue={tenant.businessName}
                              className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                            />
                          </label>

                          <label className="space-y-1">
                            <span className="block text-[11px] font-medium text-slate-700">
                              Website display name
                            </span>
                            <input
                              name="websiteDisplayName"
                              defaultValue={tenant.websiteDisplayName}
                              className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                            />
                          </label>

                          <label className="space-y-1">
                            <span className="block text-[11px] font-medium text-slate-700">
                              Business email
                            </span>
                            <input
                              name="businessEmail"
                              type="email"
                              defaultValue={tenant.businessEmail}
                              className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                            />
                          </label>

                          <label className="space-y-1">
                            <span className="block text-[11px] font-medium text-slate-700">
                              Business phone
                            </span>
                            <input
                              name="businessPhoneNumber"
                              defaultValue={tenant.businessPhoneNumber}
                              className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                            />
                          </label>
                        </div>

                        <label className="space-y-1">
                          <span className="block text-[11px] font-medium text-slate-700">
                            Business description
                          </span>
                          <textarea
                            name="businessDescription"
                            defaultValue={tenant.businessDescription}
                            rows={2}
                            className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                          />
                        </label>

                        <div className="grid gap-2 md:grid-cols-2">
                          <label className="space-y-1">
                            <span className="block text-[11px] font-medium text-slate-700">
                              Variant
                            </span>
                            <select
                              name="variant"
                              defaultValue={tenant.variant}
                              className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                            >
                              <option value="A">A</option>
                              <option value="B">B</option>
                              <option value="C">C</option>
                            </select>
                          </label>

                          <label className="space-y-1">
                            <span className="block text-[11px] font-medium text-slate-700">
                              Primary color
                            </span>
                            <input
                              name="primaryColor"
                              defaultValue={tenant.primaryColor}
                              className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-mono text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                            />
                          </label>
                        </div>

                        <div className="grid gap-2 md:grid-cols-2">
                          <label className="space-y-1">
                            <span className="block text-[11px] font-medium text-slate-700">
                              Logo URL
                            </span>
                            <input
                              name="logoUrl"
                              defaultValue={tenant.logoUrl ?? ""}
                              className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                            />
                          </label>

                          <label className="space-y-1">
                            <span className="block text-[11px] font-medium text-slate-700">
                              Favicon URL
                            </span>
                            <input
                              name="favIcon"
                              defaultValue={tenant.favIcon}
                              className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                            />
                          </label>
                        </div>

                        <div className="grid gap-2 md:grid-cols-2">
                          <label className="space-y-1">
                            <span className="block text-[11px] font-medium text-slate-700">
                              Account name
                            </span>
                            <input
                              name="accountName"
                              defaultValue={tenant.accountName}
                              className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                            />
                          </label>

                          <label className="space-y-1">
                            <span className="block text-[11px] font-medium text-slate-700">
                              Bank account
                            </span>
                            <input
                              name="bankAccountNumber"
                              defaultValue={tenant.bankAccountNumber}
                              className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                            />
                          </label>

                          <label className="space-y-1">
                            <span className="block text-[11px] font-medium text-slate-700">
                              Bank name
                            </span>
                            <input
                              name="bankName"
                              defaultValue={tenant.bankName}
                              className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                            />
                          </label>

                          <label className="space-y-1">
                            <span className="block text-[11px] font-medium text-slate-700">
                              Currency
                            </span>
                            <input
                              name="currency"
                              defaultValue={tenant.currency}
                              className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                            />
                          </label>
                        </div>

                        <div className="space-y-1">
                          <span className="block text-[11px] font-medium text-slate-700">
                            SEO title
                          </span>
                          <input
                            name="seoTitle"
                            defaultValue={tenant.seoTitle ?? ""}
                            className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                          />
                        </div>

                        <div className="space-y-1">
                          <span className="block text-[11px] font-medium text-slate-700">
                            SEO description
                          </span>
                          <textarea
                            name="seoDescription"
                            defaultValue={tenant.seoDescription ?? ""}
                            rows={2}
                            className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                          />
                        </div>

                        <div className="space-y-1">
                          <span className="block text-[11px] font-medium text-slate-700">
                            SEO keywords (comma-separated)
                          </span>
                          <input
                            name="seoKeywords"
                            defaultValue={tenant.seoKeywords ?? ""}
                            className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                          />
                        </div>

                        <div className="flex justify-end pt-1">
                          <button
                            type="submit"
                            className="inline-flex items-center rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800"
                          >
                            Save tenant
                          </button>
                        </div>
                      </form>
                    </div>
                  </details>
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}

