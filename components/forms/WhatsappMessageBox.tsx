"use client";

import { useState } from "react";

import type { WhatsappMessageBoxProps } from "@/types/components";
import { Mail } from "lucide-react";

export default function WhatsappMessageBox({
  tenant,
  product,
}: WhatsappMessageBoxProps) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function handleSend() {
    if (!message.trim()) {
      setError("Please write a message before sending.");
      return;
    }

    setError("");

    const phone = tenant.businessPhoneNumber.replace(/\D/g, "");

    const fullMessage = `Hello ${tenant.businessName}, I'm interested in "${product.productName}".\n\n${message}`;

    const encoded = encodeURIComponent(fullMessage);

    const whatsappUrl = `https://wa.me/+234${phone}?text=${encoded}`;

    window.open(whatsappUrl, "_blank");
  }

  return (
    <div className="mt-6 space-y-2">
      {/* Message box */}
      <div className="flex items-center gap-2">
        {" "}
        <Mail className="h-4 w-4 text-slate-700" />{" "}
        <label
          htmlFor="vendor-message"
          className="text-xs font-medium text-slate-700 md:text-sm"
        >
          {" "}
          Send vendor a direct message{" "}
        </label>{" "}
      </div>

      <div className="flex flex-col gap-3 md:flex-row">
        <div className="flex-1">
          <textarea
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              if (error) setError(""); // clear error while typing
            }}
            placeholder="Write a message to vendor..."
            className={`min-h-[80px] w-full resize-none rounded-lg border px-3 py-2 text-sm text-slate-800 outline-none focus:ring-1
              ${
                error
                  ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                  : "border-slate-200 focus:border-slate-400 focus:ring-slate-200"
              }
            `}
          />

          {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>

        <button
          type="button"
          onClick={handleSend}
          className="mt-2 w-full rounded-lg bg-slate-900 px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700 md:mt-0 md:w-auto"
        >
          Send
        </button>
      </div>
    </div>
  );
}
