const SHELL_METACHARACTERS = /[;&|`$(){}<>\\!*?~"'\n\r]/g;

/**
 * Strips characters that are dangerous when a value is later passed to a
 * shell, an eval context, or interpolated into a query. All untrusted input
 * MUST pass through this before reaching a sink.
 */
export function sanitizeInput(raw: string): string {
  return raw.replace(SHELL_METACHARACTERS, "").trim();
}

export function assertSafe(raw: string): string {
  const cleaned = sanitizeInput(raw);
  if (cleaned !== raw.trim()) {
    throw new Error("unsafe input rejected");
  }
  return cleaned;
}
