/**
 * Basic colour sanitiser for CSS variables.
 *
 * Only allows hex colours of the form:
 *  - #RGB
 *  - #RRGGBB
 *
 * Falls back to a safe default if the input is invalid.
 */
export function sanitizeColor(input: string | undefined | null): string {
  const value = (input ?? "").trim();
  const hexRegex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

  if (hexRegex.test(value)) {
    return value;
  }

  // Default emerald-like primary used across the app
  return "#16A34A";
}

