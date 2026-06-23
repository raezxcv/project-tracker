/**
 * Formats an ISO date string (YYYY-MM-DD) into a human-readable format.
 * Example: "2026-07-31" → "31 Jul 2026"
 */
export function formatDate(iso: string): string {
  if (!iso) return "—";
  // Append T00:00:00 to avoid timezone offset shifting the date
  const date = new Date(iso + "T00:00:00");
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * Returns true if the given due date is in the past (before today).
 */
export function isOverdue(dueDate: string): boolean {
  if (!dueDate) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(dueDate + "T00:00:00") < today;
}
