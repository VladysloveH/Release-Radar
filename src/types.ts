export type LookupType = "id" | "bundleId";

export type AppStoreEntry = {
  trackId: number;
  bundleId: string;
  trackName: string;
  sellerName: string;
  version: string;
  releaseDate?: string;
  currentVersionReleaseDate: string;
  artworkUrl100?: string;
  trackViewUrl?: string;
  primaryGenreName?: string;
};

export type FetchResult = {
  app: AppStoreEntry;
  fetchedAt: string;
};

export type WatchStatus = "waiting" | "first-seen" | "updated" | "released" | "unchanged" | "error";

export type WatchRecord = {
  key: string;
  lookupType: LookupType;
  lookupValue: string;
  country: string;
  app: AppStoreEntry;
  lastFetchedAt: string;
  lastStatus: WatchStatus;
  lastError?: string;
};

export type CheckOutcome = {
  record: WatchRecord;
  previous?: WatchRecord;
};
