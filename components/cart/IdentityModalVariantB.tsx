"use client";

import { Eye, EyeOff, X } from "lucide-react";
import { useState } from "react";

const PASSWORD_HELPER =
  "Use the same password to sync across devices, or create one for your first cart.";

type IdentityModalVariantBProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (cartId: string, cartName: string, password: string) => void;
  errorMessage?: string;
};

export default function IdentityModalVariantB({
  open,
  onClose,
  onSubmit,
  errorMessage = "",
}: IdentityModalVariantBProps) {
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
        className="absolute inset-0 bg-black/30"
        aria-hidden
        onClick={onClose}
      />
      <div
        className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="identity-modal-title-b"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2
            id="identity-modal-title-b"
            className="font-serif text-2xl font-medium text-neutral-900"
          >
            Save your cart
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-600"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="mb-6 text-sm text-neutral-500">
          Enter your details to sync across devices.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="identity-b-name" className="sr-only">
              Name
            </label>
            <input
              id="identity-b-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full border-0 border-b border-neutral-200 bg-transparent px-0 py-2.5 text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none focus:ring-0"
              autoComplete="name"
            />
          </div>
          <div>
            <label htmlFor="identity-b-phone" className="sr-only">
              Phone number
            </label>
            <input
              id="identity-b-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone number"
              className="w-full border-0 border-b border-neutral-200 bg-transparent px-0 py-2.5 text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none focus:ring-0"
              autoComplete="tel"
            />
          </div>
          <div>
            <label htmlFor="identity-b-password" className="sr-only">
              Password
            </label>
            <div className="relative">
              <input
                id="identity-b-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (min 4 characters)"
                className="w-full border-0 border-b border-neutral-200 bg-transparent px-0 py-2.5 pr-9 text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none focus:ring-0"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            <p className="mt-2 text-xs text-neutral-500">{PASSWORD_HELPER}</p>
          </div>
          {(error || errorMessage) && (
            <p className="text-sm text-red-600" role="alert">
              {error || errorMessage}
            </p>
          )}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-full border border-neutral-200 py-3 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-full py-3 text-sm font-medium text-white transition hover:opacity-95"
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
