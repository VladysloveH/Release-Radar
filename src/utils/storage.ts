import type { WatchRecord } from "../types";
import type { Locale, Theme } from "../strings";

const storageKey = "release-radar-watchlist";
const localeStorageKey = "release-radar-locale";
const themeStorageKey = "release-radar-theme";

export function loadWatchlist(): WatchRecord[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const rawValue = window.localStorage.getItem(storageKey);

    if (!rawValue) {
      return [];
    }

    const parsed = JSON.parse(rawValue) as WatchRecord[];

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed;
  } catch {
    return [];
  }
}

export function saveWatchlist(records: WatchRecord[]) {
  window.localStorage.setItem(storageKey, JSON.stringify(records));
}

export function loadLocale(): Locale {
  if (typeof window === "undefined") {
    return "en";
  }

  const value = window.localStorage.getItem(localeStorageKey);

  return value === "uk" ? "uk" : "en";
}

export function saveLocale(locale: Locale) {
  window.localStorage.setItem(localeStorageKey, locale);
}

export function loadTheme(): Theme {
  if (typeof window === "undefined") {
    return "dark";
  }

  const value = window.localStorage.getItem(themeStorageKey);

  return value === "light" ? "light" : "dark";
}

export function saveTheme(theme: Theme) {
  window.localStorage.setItem(themeStorageKey, theme);
}
