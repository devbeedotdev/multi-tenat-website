"use client";

import { createTenantAction } from "@/lib/actions";
import { useState } from "react";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Creating tenant..." : "Create tenant"}
    </button>
  );
}

export function SuperAdminCreateTenantModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
      >
        + Create new tenant
      </button>

      {open && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between gap-2 pb-3">
              <div className="space-y-0.5">
                <h2 className="text-sm font-semibold text-slate-900">
                  Create new tenant
                </h2>
                <p className="text-xs text-slate-500">
                  Provision a new storefront for a vendor. You can customise
                  branding after creation.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-xs font-medium text-slate-500 hover:text-slate-700"
              >
                Close
              </button>
            </div>

            <form action={createTenantAction} className="space-y-3">
              <div className="space-y-1">
                <label className="block text-[11px] font-medium text-slate-700">
                  Tenant ID (domain)
                </label>
                <input
                  name="tenantId"
                  placeholder="example-shop.com"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                />
                <p className="text-[10px] text-slate-500">
                  Lowercase, no spaces. This will be used as the tenant
                  identifier and domain slug.
                </p>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-medium text-slate-700">
                  Business name
                </label>
                <input
                  name="businessName"
                  placeholder="Vendor business name"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-medium text-slate-700">
                  Business email
                </label>
                <input
                  name="businessEmail"
                  type="email"
                  placeholder="owner@example.com"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-medium text-slate-700">
                  Business phone (11-digit Nigerian mobile)
                </label>
                <input
                  name="businessPhoneNumber"
                  placeholder="08012345678"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                />
                <p className="text-[10px] text-slate-500">
                  Enter 11 digits, we&apos;ll store it as 23480... for WhatsApp and
                  SMS.
                </p>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-medium text-slate-700">
                  Admin password
                </label>
                <input
                  name="adminPassword"
                  type="password"
                  placeholder="Temporary admin password"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-medium text-slate-700">
                  Primary color (hex)
                </label>
                <input
                  name="primaryColor"
                  placeholder="#16A34A"
                  defaultValue="#16A34A"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-mono text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <SubmitButton />
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
