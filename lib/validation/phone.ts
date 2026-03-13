export function normalizeNigerianPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");

  // Allow empty values to be handled by callers (optional phone fields).
  if (!digits) {
    return "";
  }

  if (digits.length !== 11) {
    throw new Error("Phone number must be exactly 11 digits.");
  }

  if (!digits.startsWith("0")) {
    throw new Error(
      "Phone number must start with 0 (Nigerian mobile format, e.g. 080...).",
    );
  }

  // Convert leading 0 to country code 234 (e.g. 080... -> 23480...)
  return `234${digits.slice(1)}`;
}

