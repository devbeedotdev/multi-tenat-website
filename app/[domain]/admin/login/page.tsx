import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "crypto";
import {
  createPasswordReset,
  getTenantByDomain,
  getValidPasswordReset,
  updateAdminPassword,
  verifyAdminCredentials,
} from "@/lib/dal";
import { sendAdminOTP } from "@/lib/services/email";

type SearchParams = {
  mode?: string;
  step?: string;
  sent?: string;
  error?: string;
  reset?: string;
};

async function handleLogin(domain: string, formData: FormData) {
  "use server";

  const normalizedDomain = domain.toLowerCase();
  const password = String(formData.get("password") || "");

  const tenant = await verifyAdminCredentials(normalizedDomain, password);

  if (!tenant) {
    redirect(
      `/${normalizedDomain}/admin/login?error=${encodeURIComponent(
        "Invalid password for this domain",
      )}`,
    );
  }

  const cookieStore = cookies();
  cookieStore.set("admin_session", tenant.tenantId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  redirect(`/${normalizedDomain}/admin/dashboard`);
}

async function startPasswordReset(domain: string, _formData: FormData) {
  "use server";

  const normalizedDomain = domain.toLowerCase();
  const tenant = getTenantByDomain(normalizedDomain);

  if (!tenant) {
    redirect(
      `/${normalizedDomain}/admin/login?mode=forgot&error=${encodeURIComponent(
        "Tenant not found for this domain",
      )}`,
    );
  }

  const otpPlain = Math.floor(100000 + Math.random() * 900000).toString();
  const otpHash = crypto.createHash("sha256").update(otpPlain).digest("hex");

  await createPasswordReset(tenant.tenantId, otpHash);

  if (tenant.businessEmail) {
    await sendAdminOTP(tenant.businessEmail, otpPlain);
  }

  redirect(
    `/${normalizedDomain}/admin/login?mode=forgot&step=verify&sent=1`,
  );
}

async function completePasswordReset(domain: string, formData: FormData) {
  "use server";

  const normalizedDomain = domain.toLowerCase();
  const otp = String(formData.get("otp") || "").trim();
  const newPassword = String(formData.get("newPassword") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");

  if (!otp || !newPassword || !confirmPassword) {
    redirect(
      `/${normalizedDomain}/admin/login?mode=forgot&step=verify&error=${encodeURIComponent(
        "All fields are required",
      )}`,
    );
  }

  if (newPassword !== confirmPassword) {
    redirect(
      `/${normalizedDomain}/admin/login?mode=forgot&step=verify&error=${encodeURIComponent(
        "Passwords do not match",
      )}`,
    );
  }

  const record = await getValidPasswordReset(normalizedDomain);
  if (!record) {
    redirect(
      `/${normalizedDomain}/admin/login?mode=forgot&step=verify&error=${encodeURIComponent(
        "OTP has expired or is invalid",
      )}`,
    );
  }

  const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
  if (otpHash !== record.otpHash) {
    redirect(
      `/${normalizedDomain}/admin/login?mode=forgot&step=verify&error=${encodeURIComponent(
        "Invalid OTP",
      )}`,
    );
  }

  const updatedTenant = await updateAdminPassword(normalizedDomain, newPassword);
  if (!updatedTenant) {
    redirect(
      `/${normalizedDomain}/admin/login?mode=forgot&step=verify&error=${encodeURIComponent(
        "Unable to update password",
      )}`,
    );
  }

  redirect(
    `/${normalizedDomain}/admin/login?reset=${encodeURIComponent(
      "Password updated successfully. You can now log in.",
    )}`,
  );
}

export default async function AdminLoginPage({
  params,
  searchParams,
}: {
  params: { domain: string };
  searchParams: SearchParams;
}) {
  const activeDomain = params.domain.toLowerCase();

  const cookieStore = cookies();
  const existingSession = cookieStore.get("admin_session")?.value;

  if (existingSession && existingSession === activeDomain) {
    redirect(`/${activeDomain}/admin/dashboard`);
  }

  const mode = searchParams.mode ?? "login";
  const step = searchParams.step ?? "request";
  const error = searchParams.error as string | undefined;
  const resetMessage = searchParams.reset as string | undefined;
  const sent = searchParams.sent === "1";

  const tenant = getTenantByDomain(activeDomain);

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 shadow-lg border border-slate-200">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold text-slate-900">
            {tenant ? `${tenant.websiteDisplayName} Admin` : "Admin Console"}
          </h1>
          <p className="text-sm text-slate-500">
            Domain:{" "}
            <span className="font-medium text-slate-800">
              {activeDomain}
            </span>
          </p>
        </div>

        {resetMessage && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            {resetMessage}
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
            {error}
          </div>
        )}

        {mode === "login" && (
          <form
            action={handleLogin.bind(null, activeDomain)}
            className="space-y-4"
          >
            <div className="space-y-1">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700"
              >
                Admin password
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
              style={{ backgroundColor: "var(--primary)" }}
            >
              Sign in
            </button>

            <div className="flex items-center justify-between pt-2 text-xs text-slate-500">
              <span>Admin access for this tenant</span>
              <a
                href={`/${activeDomain}/admin/login?mode=forgot`}
                className="font-medium text-slate-700 hover:text-slate-900"
              >
                Forgot password?
              </a>
            </div>
          </form>
        )}

        {mode === "forgot" && step === "request" && (
          <form
            action={startPasswordReset.bind(null, activeDomain)}
            className="space-y-4"
          >
            <p className="text-xs text-slate-500">
              We&apos;ll generate a one-time password (OTP) and send it to the
              email associated with{" "}
              <span className="font-semibold text-slate-800">
                {tenant?.businessEmail ?? activeDomain}
              </span>
              .
            </p>

            <button
              type="submit"
              className="mt-2 w-full rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.99]"
              style={{ backgroundColor: "var(--primary)" }}
            >
              Send OTP
            </button>

            <a
              href={`/${activeDomain}/admin/login`}
              className="block w-full rounded-xl border border-slate-200 bg-white py-2.5 text-center text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              Back to login
            </a>
          </form>
        )}

        {mode === "forgot" && step === "verify" && (
          <form
            action={completePasswordReset.bind(null, activeDomain)}
            className="space-y-4"
          >
            {sent && (
              <div className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-800">
                OTP sent to the email associated with{" "}
                <strong>{tenant?.businessEmail ?? activeDomain}</strong>.
              </div>
            )}

            <div className="space-y-1">
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-slate-700"
              >
                One-Time Password (OTP)
              </label>
              <input
                id="otp"
                name="otp"
                inputMode="numeric"
                maxLength={6}
                placeholder="Enter 6-digit code"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-slate-700"
              >
                New password
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-slate-700"
              >
                Confirm new password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
              />
            </div>

            <button
              type="submit"
              className="mt-2 w-full rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.99]"
              style={{ backgroundColor: "var(--primary)" }}
            >
              Update password
            </button>

            <a
              href={`/${activeDomain}/admin/login`}
              className="block w-full rounded-xl border border-slate-200 bg-white py-2.5 text-center text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              Back to login
            </a>
          </form>
        )}
      </div>
    </main>
  );
}

