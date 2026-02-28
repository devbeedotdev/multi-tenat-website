"use client";

import { X } from "lucide-react";

type ConflictDialogProps = {
  open: boolean;
  onClose: () => void;
  onMerge: () => void;
  onOverwrite: () => void;
};

export default function ConflictDialog({
  open,
  onClose,
  onMerge,
  onOverwrite,
}: ConflictDialogProps) {
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
        aria-labelledby="conflict-dialog-title"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 id="conflict-dialog-title" className="text-lg font-semibold text-slate-900">
            Existing cart found
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
        <p className="text-sm text-slate-600 mb-6">
          We found an existing cart for this number. What would you like to do?
        </p>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => {
              onMerge();
              onClose();
            }}
            className="w-full rounded-lg border px-4 py-3 text-sm font-semibold transition hover:opacity-90"
            style={{
              borderColor: "var(--primary)",
              color: "var(--primary)",
              backgroundColor: "transparent",
            }}
          >
            Merge – Combine with existing cart
          </button>
          <button
            type="button"
            onClick={() => {
              onOverwrite();
              onClose();
            }}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Overwrite – Replace with current selection
          </button>
        </div>
      </div>
    </div>
  );
}
