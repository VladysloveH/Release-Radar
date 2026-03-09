import type { AppStoreEntry, FetchResult, LookupType } from "../types";

type LookupResponse = {
  resultCount: number;
  results: AppStoreEntry[];
};

const endpoint = "https://itunes.apple.com/lookup";

export async function fetchApp(
  lookupType: LookupType,
  lookupValue: string,
  country: string
): Promise<FetchResult> {
  const params = new URLSearchParams({
    country
  });

  if (lookupType === "id") {
    params.set("id", lookupValue.trim());
  } else {
    params.set("bundleId", lookupValue.trim());
  }

  const response = await fetch(`${endpoint}?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const payload = (await response.json()) as LookupResponse;
  const app = payload.results[0];

  if (!payload.resultCount || !app) {
    throw new Error("NOT_FOUND");
  }

  return {
    app,
    fetchedAt: new Date().toISOString()
  };
}
