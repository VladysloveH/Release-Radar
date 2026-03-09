import type { Locale } from "../strings";

export function formatDate(value: string | undefined, locale: Locale) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat(locale === "uk" ? "uk-UA" : "en-US", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}
