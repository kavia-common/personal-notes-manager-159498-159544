export type DateStyle = "short" | "medium" | "long";

/**
 * PUBLIC_INTERFACE
 * Format an ISO date string to a user-friendly local string.
 */
export function formatDate(iso: string, style: DateStyle = "short"): string {
  try {
    const date = new Date(iso);
    const opts: Intl.DateTimeFormatOptions =
      style === "long"
        ? { dateStyle: "long", timeStyle: "short" }
        : style === "medium"
        ? { dateStyle: "medium", timeStyle: "short" }
        : { dateStyle: "short", timeStyle: "short" };
    return new Intl.DateTimeFormat(undefined, opts).format(date);
  } catch {
    return iso;
  }
}
