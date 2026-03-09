"use client";

import { uploadProductMedia } from "@/lib/services/media";
import type { Tenant, TenantVariant } from "@/types/tenant";
import { useRef, useState } from "react";

type AdminStoreSettingsFormProps = {
  tenant: Tenant;
  /** When true, branding fields that are normally locked become editable. */
  isSuperAdmin?: boolean;
};

export function AdminStoreSettingsForm({
  tenant,
  isSuperAdmin = false,
}: AdminStoreSettingsFormProps) {
  const [businessName, setBusinessName] = useState(tenant.businessName);
  const [websiteDisplayName, setWebsiteDisplayName] = useState(
    tenant.websiteDisplayName,
  );
  const [businessEmail, setBusinessEmail] = useState(tenant.businessEmail);
  const [businessPhoneNumber, setBusinessPhoneNumber] = useState(
    tenant.businessPhoneNumber,
  );
  const [businessDescription, setBusinessDescription] = useState(
    tenant.businessDescription,
  );

  const [variant, setVariant] = useState<TenantVariant>(tenant.variant);
  const [primaryColor, setPrimaryColor] = useState(tenant.primaryColor);
  const [logoUrl, setLogoUrl] = useState(tenant.logoUrl ?? "");
  const [favIcon, setFavIcon] = useState(tenant.favIcon);
  const [currency, setCurrency] = useState(tenant.currency);

  const [isLogoHorizontal, setIsLogoHorizontal] = useState(
    tenant.isLogoHorizontal,
  );

  const [accountName, setAccountName] = useState(tenant.accountName);
  const [bankAccountNumber, setBankAccountNumber] = useState(
    tenant.bankAccountNumber,
  );
  const [bankName, setBankName] = useState(tenant.bankName);

  const isVariantLocked = !isSuperAdmin && !!tenant.variant;
  const isCurrencyLocked = !isSuperAdmin && !!tenant.currency;

  const isPrimaryColorLocked =
    !isSuperAdmin && typeof tenant.primaryColor === "string"
      ? tenant.primaryColor.trim().length > 0
      : false;

  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const faviconInputRef = useRef<HTMLInputElement | null>(null);

  const handlePickLogo = () => {
    logoInputRef.current?.click();
  };

  const handlePickFavicon = () => {
    faviconInputRef.current?.click();
  };

  const handleLogoFilesSelected = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;
    const urls = await uploadProductMedia(files);
    if (urls[0]) {
      setLogoUrl(urls[0]);
    }
  };

  const handleFaviconFilesSelected = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;
    const urls = await uploadProductMedia(files);
    if (urls[0]) {
      setFavIcon(urls[0]);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
      <div className="space-y-6">
        {/* Group 1: Business Identity */}
        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
              Business identity
            </h2>
            <p className="text-[11px] text-slate-500">
              Control how your store is introduced to customers.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1 md:col-span-2">
              <label className="block text-xs font-medium text-slate-700">
                Tenant ID (domain)
              </label>
              <input
                value={tenant.tenantId}
                readOnly
                className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-700">
                Business name
              </label>
              <input
                name="businessName"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-700">
                Website display name
              </label>
              <input
                name="websiteDisplayName"
                value={websiteDisplayName}
                onChange={(e) => setWebsiteDisplayName(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-700">
                Business email
              </label>
              <input
                type="email"
                name="businessEmail"
                value={businessEmail}
                onChange={(e) => setBusinessEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-700">
                Business phone (format: 234...)
              </label>
              <input
                name="businessPhoneNumber"
                value={businessPhoneNumber}
                onChange={(e) => setBusinessPhoneNumber(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="block text-xs font-medium text-slate-700">
                Business description
              </label>
              <textarea
                name="businessDescription"
                value={businessDescription}
                onChange={(e) => setBusinessDescription(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
              />
            </div>
          </div>
        </section>

        {/* Group 2: Branding & UI */}
        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
              Branding & UI
            </h2>
            <p className="text-[11px] text-slate-500">
              Choose your storefront variant and colors.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-700">
                Variant
              </label>
              <select
                name="variant"
                value={variant}
                onChange={(e) => setVariant(e.target.value as TenantVariant)}
                disabled={isVariantLocked}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300 disabled:cursor-not-allowed disabled:bg-slate-50"
              >
                <option value="A">Variant A</option>
                <option value="B">Variant B</option>
                <option value="C">Variant C</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-700">
                Primary color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  name="primaryColor"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  disabled={isPrimaryColorLocked}
                  className="h-9 w-12 cursor-pointer rounded border border-slate-200 bg-white disabled:cursor-not-allowed disabled:bg-slate-50"
                />
                <input
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  disabled={isPrimaryColorLocked}
                  className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-mono text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300 disabled:cursor-not-allowed disabled:bg-slate-50"
                />
              </div>
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="block text-xs font-medium text-slate-700">
                Logo URL
              </label>
              <div className="flex flex-wrap items-center gap-3">
                <input
                  name="logoUrl"
                  value={logoUrl}
                  disabled={true}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                />
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoFilesSelected}
                />
                <button
                  type="button"
                  onClick={handlePickLogo}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                >
                  Upload logo
                </button>
              </div>
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="block text-xs font-medium text-slate-700">
                Favicon URL
              </label>
              <div className="flex flex-wrap items-center gap-3">
                <input
                  name="favIcon"
                  value={favIcon}
                  disabled={true}
                  onChange={(e) => setFavIcon(e.target.value)}
                  className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                />
                <input
                  ref={faviconInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFaviconFilesSelected}
                />
                <button
                  type="button"
                  onClick={handlePickFavicon}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                >
                  Upload favicon
                </button>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 md:col-span-2">
              {/* Logo Orientation - wrapped in a div for layout */}
              <div className="flex-1 space-y-1">
                <label className="block text-xs font-medium text-slate-700">
                  Logo orientation
                </label>
                <select
                  name="isLogoHorizontal"
                  value={isLogoHorizontal ? "yes" : "no"}
                  onChange={(e) =>
                    setIsLogoHorizontal(e.target.value === "yes")
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                >
                  <option value="no">Stacked / square</option>
                  <option value="yes">Horizontal / wide</option>
                </select>
              </div>

              {/* Account Name - wrapped in a div for layout */}
              <div className="flex-1 space-y-1">
                <label className="block text-xs font-medium text-slate-700">
                  Currency
                </label>
                <select
                  name="currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  disabled={isCurrencyLocked}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                >
                  <option value="₦">₦</option>
                  <option value="$">$</option>
                  <option value="€">€</option>
                  <option value="£">£</option>
                  <option value="¥">¥</option>
                  <option value="₹">₹</option>
                  <option value="₩">₩</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Group 3: Payment Info */}
        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
              Payment info (bank transfer)
            </h2>
            <p className="text-[11px] text-slate-500">
              These details appear in the checkout bank-transfer instructions.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1 md:col-span-2">
              <label className="block text-xs font-medium text-slate-700">
                Account name
              </label>
              <input
                name="accountName"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-700">
                Bank account number
              </label>
              <input
                name="bankAccountNumber"
                value={bankAccountNumber}
                onChange={(e) => setBankAccountNumber(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-700">
                Bank name
              </label>
              <input
                name="bankName"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
              />
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            style={{ backgroundColor: primaryColor }}
          >
            Save settings
          </button>
        </div>
      </div>

      {/* Live preview */}
      <aside className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
          Theme preview
        </h2>
        <p className="text-[11px] text-slate-500">
          This is a simplified preview of how your storefront header and accent
          color will look.
        </p>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div
            className="flex items-center justify-between px-4 py-3 text-xs font-medium text-white"
            style={{ backgroundColor: primaryColor }}
          >
            <span className="truncate">
              {websiteDisplayName || businessName || "Your Store Name"}
            </span>
            <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] uppercase tracking-wide">
              Variant {variant}
            </span>
          </div>
          <div className="space-y-2 px-4 py-3">
            <div className="flex items-center gap-2 text-[11px] text-slate-600">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-[10px] font-semibold text-slate-600">
                {businessName ? businessName[0]?.toUpperCase() : "S"}
              </span>
              <div className="min-w-0">
                <p className="truncate font-medium">
                  {businessName || "Sample Store"}
                </p>
                <p className="truncate text-[10px] text-slate-500">
                  {businessDescription ||
                    "Short description of your brand appears here."}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-500">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 text-[9px] font-semibold text-emerald-700">
                ₦
              </span>
              <span>Primary CTA and badges will use this color.</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
