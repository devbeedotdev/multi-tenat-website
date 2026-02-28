"use client";

import { Eye, EyeOff, Lock, Phone, User, X } from "lucide-react";
import { useState } from "react";

const PASSWORD_HELPER =
  "Use the same password to sync across devices, or create one for your first cart.";

type IdentityModalVariantCProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (cartId: string, cartName: string, password: string) => void;
  errorMessage?: string;
};

export default function IdentityModalVariantC({
  open,
  onClose,
  onSubmit,
  errorMessage = "",
}: IdentityModalVariantCProps) {
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
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center md:p-4">
      <div
        className="absolute inset-0 bg-black/40"
        aria-hidden
        onClick={onClose}
      />
      <div
        className="relative w-full max-w-md rounded-t-3xl bg-white p-6 shadow-xl md:rounded-2xl md:rounded-t-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="identity-modal-title-c"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2
            id="identity-modal-title-c"
            className="text-lg font-bold text-gray-900"
          >
            Save your cart
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="mb-5 text-sm text-gray-500">
          Enter your details to sync across devices.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="identity-c-name" className="sr-only">
              Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                id="identity-c-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-3 text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200"
                autoComplete="name"
              />
            </div>
          </div>
          <div>
            <label htmlFor="identity-c-phone" className="sr-only">
              Phone number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                id="identity-c-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number"
                className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-3 text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200"
                autoComplete="tel"
              />
            </div>
          </div>
          <div>
            <label htmlFor="identity-c-password" className="sr-only">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                id="identity-c-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (min 4 characters)"
                className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-10 text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            <p className="mt-1.5 text-xs text-gray-500">{PASSWORD_HELPER}</p>
          </div>
          {(error || errorMessage) && (
            <p className="text-sm text-red-600" role="alert">
              {error || errorMessage}
            </p>
          )}
          <button
            type="submit"
            className="w-full rounded-xl py-4 text-sm font-semibold text-white transition active:scale-[0.98]"
            style={{ backgroundColor: "var(--primary)" }}
          >
            Join & Save Cart
          </button>
        </form>
      </div>
    </div>
  );
}
