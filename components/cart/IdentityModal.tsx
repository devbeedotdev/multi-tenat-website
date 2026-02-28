"use client";

import { Eye, EyeOff, X } from "lucide-react";
import { useState } from "react";

type IdentityModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (cartId: string, cartName: string, password: string) => void;
  /** Server error e.g. "Incorrect Password" */
  errorMessage?: string;
};

export default function IdentityModal({
  open,
  onClose,
  onSubmit,
  errorMessage = "",
}: IdentityModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const trimmedName = name.trim();
    const trimmedPhone = phone.replace(/\D/g, "");
    if (!trimmedName) {
      setError("Please enter your name.");
      return;
    }
    if (!trimmedPhone || trimmedPhone.length < 10) {
      setError("Please enter a valid phone number.");
      return;
    }
    if (!password || password.length < 4) {
      setError("Please enter a password (at least 4 characters).");
      return;
    }
    setError("");
    onSubmit(trimmedPhone, trimmedName, password);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50"
        aria-hidden
        onClick={onClose}
      />
      <div
        className="relative w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="identity-modal-title"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 id="identity-modal-title" className="text-lg font-semibold text-slate-900">
            Add to cart
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="text-sm text-slate-600 mb-4">
          Enter your name, phone number, and password to continue. This secures your cart across devices.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="identity-name" className="block text-sm font-medium text-slate-700 mb-1">
              Name
            </label>
            <input
              id="identity-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              autoComplete="name"
            />
          </div>
          <div>
            <label htmlFor="identity-phone" className="block text-sm font-medium text-slate-700 mb-1">
              Phone number
            </label>
            <input
              id="identity-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 08012345678"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              autoComplete="tel"
            />
          </div>
          <div>
            <label htmlFor="identity-password" className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="identity-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 4 characters"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="mt-1.5 text-xs text-slate-500">
              Use the same password to sync across devices, or create one for your first cart.
            </p>
          </div>
          {(error || errorMessage) && (
            <p className="text-sm text-red-600" role="alert">
              {error || errorMessage}
            </p>
          )}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg px-4 py-2 text-sm font-semibold text-white transition hover:opacity-95"
              style={{ backgroundColor: "var(--primary)" }}
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
