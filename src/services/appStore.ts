import type { AppStoreEntry, FetchResult, LookupType } from "../types";

type LookupResponse = {
  resultCount: number;
  results: AppStoreEntry[];
};

const endpoint = "https://itunes.apple.com/lookup";

function requestJsonp<T>(url: string) {
  return new Promise<T>((resolve, reject) => {
    const callbackName = `releaseRadarJsonp_${crypto.randomUUID().replace(/-/g, "")}`;
    const script = document.createElement("script");
    const callbackStore = window as unknown as Record<string, unknown>;
    const timeoutId = window.setTimeout(() => {
      cleanup();
      reject(new Error("TIMEOUT"));
    }, 12000);

    function cleanup() {
      window.clearTimeout(timeoutId);
      delete callbackStore[callbackName];
      script.remove();
    }

    callbackStore[callbackName] = (payload: T) => {
      cleanup();
      resolve(payload);
    };

    script.onerror = () => {
      cleanup();
      reject(new Error("NETWORK_ERROR"));
    };

    script.src = `${url}${url.includes("?") ? "&" : "?"}callback=${callbackName}`;
    document.body.appendChild(script);
  });
}

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

  const payload = await requestJsonp<LookupResponse>(`${endpoint}?${params.toString()}`);
  const app = payload.results[0];

  if (!payload.resultCount || !app) {
    throw new Error("NOT_FOUND");
  }

  return {
    app,
    fetchedAt: new Date().toISOString()
  };
}
