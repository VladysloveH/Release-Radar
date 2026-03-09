import { useEffect, useMemo, useState } from "react";
import { fetchApp } from "./services/appStore";
import { strings } from "./strings";
import type { Locale, Theme } from "./strings";
import type {
  AppStoreEntry,
  CheckOutcome,
  LookupType,
  WatchRecord,
  WatchStatus
} from "./types";
import { formatDate } from "./utils/format";
import {
  loadLocale,
  loadTheme,
  loadWatchlist,
  saveLocale,
  saveTheme,
  saveWatchlist
} from "./utils/storage";

const defaultCountry = "us";
const waitingIconSrc = "waiting-app-icon.png";

function createKey(lookupType: LookupType, lookupValue: string, country: string) {
  return `${lookupType}:${lookupValue.trim().toLowerCase()}:${country.trim().toLowerCase()}`;
}

function getReleaseReferenceDate(app: WatchRecord["app"]) {
  return app.currentVersionReleaseDate || app.releaseDate || "";
}

function createWaitingApp(lookupType: LookupType, lookupValue: string): AppStoreEntry {
  return {
    trackId: lookupType === "id" ? Number(lookupValue) || 0 : 0,
    bundleId: lookupType === "bundleId" ? lookupValue : "",
    trackName: lookupValue,
    sellerName: "—",
    version: "—",
    currentVersionReleaseDate: ""
  };
}

function getAppArtwork(record: WatchRecord) {
  if (record.lastStatus === "waiting") {
    return waitingIconSrc;
  }

  return record.app.artworkUrl100 || waitingIconSrc;
}

function isLiveRecord(record: WatchRecord) {
  return record.lastStatus !== "waiting" && !isPreRelease(record.app);
}

function isPreRelease(app: WatchRecord["app"]) {
  const releaseDate = app.releaseDate || app.currentVersionReleaseDate;

  if (!releaseDate) {
    return false;
  }

  return new Date(releaseDate).getTime() > Date.now();
}

function getStatus(record: WatchRecord, previous?: WatchRecord): WatchStatus {
  if (!previous) {
    return "first-seen";
  }

  const wasPreRelease = isPreRelease(previous.app);
  const isNowPreRelease = isPreRelease(record.app);

  if (wasPreRelease && !isNowPreRelease) {
    return "released";
  }

  const versionChanged = previous.app.version !== record.app.version;
  const releaseDateChanged = getReleaseReferenceDate(previous.app) !== getReleaseReferenceDate(record.app);

  return versionChanged || releaseDateChanged ? "updated" : "unchanged";
}

function getStatusLabel(status: WatchStatus, locale: Locale) {
  const copy = strings[locale];

  switch (status) {
    case "waiting":
      return copy.statusWaiting;
    case "first-seen":
      return copy.statusFirstSeen;
    case "updated":
      return copy.statusUpdated;
    case "released":
      return copy.statusReleased;
    case "error":
      return copy.statusError;
    default:
      return copy.statusUpToDate;
  }
}

function getStatusTone(status: WatchStatus) {
  switch (status) {
    case "waiting":
      return "is-waiting";
    case "updated":
      return "is-hot";
    case "released":
      return "is-live";
    case "error":
      return "is-danger";
    case "first-seen":
      return "is-fresh";
    default:
      return "is-calm";
  }
}

function getErrorMessage(error: unknown, locale: Locale) {
  const copy = strings[locale];

  if (error instanceof Error && error.message === "NOT_FOUND") {
    return copy.formErrorNotFound;
  }

  return copy.formErrorGeneric;
}

export function App() {
  const [locale, setLocale] = useState<Locale>(() => loadLocale());
  const [theme, setTheme] = useState<Theme>(() => loadTheme());
  const [lookupType, setLookupType] = useState<LookupType>("bundleId");
  const [lookupValue, setLookupValue] = useState("");
  const [country, setCountry] = useState(defaultCountry);
  const [watchlist, setWatchlist] = useState<WatchRecord[]>(() => loadWatchlist());
  const [activeResult, setActiveResult] = useState<CheckOutcome>();
  const [formError, setFormError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [isRefreshingAll, setIsRefreshingAll] = useState(false);
  const [isBootRefreshing, setIsBootRefreshing] = useState(false);
  const [waitingDraft, setWaitingDraft] = useState<WatchRecord>();
  const copy = strings[locale];

  const trackedKeys = useMemo(() => new Set(watchlist.map((item) => item.key)), [watchlist]);

  useEffect(() => {
    saveLocale(locale);
  }, [locale]);

  useEffect(() => {
    saveTheme(theme);
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  async function runLookup() {
    const normalizedValue = lookupValue.trim();
    const normalizedCountry = country.trim().toLowerCase() || defaultCountry;

    if (!normalizedValue) {
      setFormError(copy.formErrorEmpty);
      setInfoMessage("");
      return;
    }

    setIsChecking(true);
    setFormError("");
    setInfoMessage("");
    setWaitingDraft(undefined);

    try {
      const response = await fetchApp(lookupType, normalizedValue, normalizedCountry);
      const key = createKey(lookupType, normalizedValue, normalizedCountry);
      const previous = watchlist.find((item) => item.key === key);
      const record: WatchRecord = {
        key,
        lookupType,
        lookupValue: normalizedValue,
        country: normalizedCountry,
        app: response.app,
        lastFetchedAt: response.fetchedAt,
        lastStatus: "first-seen"
      };

      record.lastStatus = getStatus(record, previous);
      setActiveResult({
        record,
        previous
      });
    } catch (error) {
      setActiveResult(undefined);
      const message = getErrorMessage(error, locale);
      setFormError(message);

      if (error instanceof Error && error.message === "NOT_FOUND") {
        const key = createKey(lookupType, normalizedValue, normalizedCountry);
        const previous = watchlist.find((item) => item.key === key);
        setWaitingDraft({
          key,
          lookupType,
          lookupValue: normalizedValue,
          country: normalizedCountry,
          app: previous?.app ?? createWaitingApp(lookupType, normalizedValue),
          lastFetchedAt: new Date().toISOString(),
          lastStatus: "waiting",
          lastError: undefined
        });
      }
    } finally {
      setIsChecking(false);
    }
  }

  function syncWatchlist(nextWatchlist: WatchRecord[]) {
    setWatchlist(nextWatchlist);
    saveWatchlist(nextWatchlist);
  }

  function saveCurrentResult() {
    if (!activeResult) {
      return;
    }

    if (trackedKeys.has(activeResult.record.key)) {
      const nextWatchlist = watchlist.map((item) =>
        item.key === activeResult.record.key ? activeResult.record : item
      );
      syncWatchlist(nextWatchlist);
      setInfoMessage(copy.updateSuccess);
      return;
    }

    syncWatchlist([activeResult.record, ...watchlist]);
    setInfoMessage(copy.saveSuccess);
  }

  function saveWaitingRecord() {
    if (!waitingDraft) {
      return;
    }

    if (trackedKeys.has(waitingDraft.key)) {
      const nextWatchlist = watchlist.map((item) =>
        item.key === waitingDraft.key
          ? {
              ...item,
              lastFetchedAt: waitingDraft.lastFetchedAt,
              lastStatus: "waiting" as const,
              lastError: undefined
            }
          : item
      );
      syncWatchlist(nextWatchlist);
      setInfoMessage(copy.updateSuccess);
      return;
    }

    syncWatchlist([waitingDraft, ...watchlist]);
    setInfoMessage(copy.saveSuccess);
  }

  async function refreshWatch(record: WatchRecord) {
    try {
      const response = await fetchApp(record.lookupType, record.lookupValue, record.country);
      const nextRecord: WatchRecord = {
        ...record,
        app: response.app,
        lastFetchedAt: response.fetchedAt,
        lastError: undefined,
        lastStatus: "unchanged"
      };

      nextRecord.lastStatus = getStatus(nextRecord, record);
      return nextRecord;
    } catch (error) {
      if (error instanceof Error && error.message === "NOT_FOUND" && record.lastStatus === "waiting") {
        return {
          ...record,
          lastFetchedAt: new Date().toISOString(),
          lastStatus: "waiting" as const,
          lastError: undefined
        };
      }

      return {
        ...record,
        lastFetchedAt: new Date().toISOString(),
        lastStatus: "error" as const,
        lastError: getErrorMessage(error, locale)
      };
    }
  }

  async function refreshAll() {
    if (!watchlist.length) {
      return;
    }

    setIsRefreshingAll(true);
    setInfoMessage("");
    const refreshed = await Promise.all(watchlist.map((item) => refreshWatch(item)));
    syncWatchlist(refreshed);
    setIsRefreshingAll(false);
  }

  useEffect(() => {
    let isCancelled = false;

    async function refreshOnOpen() {
      if (!watchlist.length) {
        return;
      }

      setIsBootRefreshing(true);
      const refreshed = await Promise.all(watchlist.map((item) => refreshWatch(item)));

      if (isCancelled) {
        return;
      }

      syncWatchlist(refreshed);
      setIsBootRefreshing(false);
    }

    void refreshOnOpen();

    return () => {
      isCancelled = true;
    };
  }, []);

  function removeWatch(key: string) {
    const nextWatchlist = watchlist.filter((item) => item.key !== key);
    syncWatchlist(nextWatchlist);
  }

  const activeIsTracked = activeResult ? trackedKeys.has(activeResult.record.key) : false;

  return (
    <div className="shell">
      <section className="panel top-panel">
        <div className="top-panel-head">
          <div className="brand-block">
            <span className="eyebrow">{copy.heroEyebrow}</span>
            <div className="brand-row">
              <h1>{copy.appName}</h1>
              <span className="watch-count">
                {watchlist.length} {copy.watchCountLabel}
              </span>
            </div>
          </div>
          <div className="toolbar-grid">
            <div className="control-group">
              <span>{copy.languageLabel}</span>
              <div className="pill-switch" role="tablist" aria-label={copy.languageLabel}>
                <button
                  aria-selected={locale === "en"}
                  className={locale === "en" ? "is-selected" : ""}
                  onClick={() => setLocale("en")}
                  role="tab"
                  type="button"
                >
                  EN
                </button>
                <button
                  aria-selected={locale === "uk"}
                  className={locale === "uk" ? "is-selected" : ""}
                  onClick={() => setLocale("uk")}
                  role="tab"
                  type="button"
                >
                  UA
                </button>
              </div>
            </div>
            <div className="control-group">
              <span>{copy.themeLabel}</span>
              <div className="pill-switch" role="tablist" aria-label={copy.themeLabel}>
                <button
                  aria-selected={theme === "dark"}
                  className={theme === "dark" ? "is-selected" : ""}
                  onClick={() => setTheme("dark")}
                  role="tab"
                  type="button"
                >
                  {copy.themeDark}
                </button>
                <button
                  aria-selected={theme === "light"}
                  className={theme === "light" ? "is-selected" : ""}
                  onClick={() => setTheme("light")}
                  role="tab"
                  type="button"
                >
                  {copy.themeLight}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="top-panel-search">
          <div className="field-group segmented">
            <label>{copy.lookupTypeLabel}</label>
            <div className="segmented-control">
              <button
                className={lookupType === "id" ? "is-selected" : ""}
                onClick={() => setLookupType("id")}
                type="button"
              >
                {copy.lookupById}
              </button>
              <button
                className={lookupType === "bundleId" ? "is-selected" : ""}
                onClick={() => setLookupType("bundleId")}
                type="button"
              >
                {copy.lookupByBundleId}
              </button>
            </div>
          </div>

          <div className="form-grid">
            <label className="field-group">
              <span>{copy.lookupValueLabel}</span>
              <input
                onChange={(event) => setLookupValue(event.target.value)}
                placeholder={
                  lookupType === "id"
                    ? copy.lookupValuePlaceholderId
                    : copy.lookupValuePlaceholderBundleId
                }
                type="text"
                value={lookupValue}
              />
            </label>

            <label className="field-group compact">
              <span>{copy.countryLabel}</span>
              <input
                maxLength={2}
                onChange={(event) => setCountry(event.target.value)}
                type="text"
                value={country}
              />
            </label>
          </div>

          <div className="actions">
            <button className="primary" onClick={runLookup} type="button">
              {isChecking ? copy.checkingButton : copy.checkButton}
            </button>

            {activeResult ? (
              <button className="secondary" disabled={isChecking} onClick={saveCurrentResult} type="button">
                {activeIsTracked ? copy.updateWatchButton : copy.watchButton}
              </button>
            ) : waitingDraft ? (
              <button className="secondary" disabled={isChecking} onClick={saveWaitingRecord} type="button">
                {copy.addWaitingButton}
              </button>
            ) : null}
          </div>

          {formError ? <p className="message error">{formError}</p> : null}
          {waitingDraft ? <p className="message info">{copy.waitingDescription}</p> : null}
          {isBootRefreshing ? <p className="message info">{copy.autoRefreshing}</p> : null}
          {infoMessage ? <p className="message success">{infoMessage}</p> : null}
        </div>
      </section>

      {activeResult ? (
        <section className="panel result-panel">
          <div className="section-head">
            <h2>{copy.resultTitle}</h2>
            {activeResult ? <span className="chip">{copy.resultBadgeFound}</span> : null}
            {activeIsTracked ? <span className="chip alt">{copy.resultBadgeTracked}</span> : null}
          </div>

          <article className="result-card">
            <img
              alt={activeResult.record.app.trackName}
              className="app-icon"
              src={getAppArtwork(activeResult.record)}
            />
            <div className="result-body">
              <div className="result-topline">
                <h3>{activeResult.record.app.trackName}</h3>
                <span className={`status ${getStatusTone(activeResult.record.lastStatus)}`}>
                  {getStatusLabel(activeResult.record.lastStatus, locale)}
                </span>
              </div>
              <div className="meta-row">
                {activeResult.record.lastStatus !== "waiting" ? (
                  <span className={`chip ${isPreRelease(activeResult.record.app) ? "alt" : ""}`}>
                    {isPreRelease(activeResult.record.app) ? copy.prereleaseLabel : copy.liveLabel}
                  </span>
                ) : null}
              </div>
              <dl>
                <div>
                  <dt>{copy.version}</dt>
                  <dd>{activeResult.record.app.version}</dd>
                </div>
                <div>
                  <dt>{isPreRelease(activeResult.record.app) ? copy.expectedReleaseDate : copy.releaseDate}</dt>
                  <dd>{formatDate(getReleaseReferenceDate(activeResult.record.app), locale)}</dd>
                </div>
                <div>
                  <dt>{copy.seller}</dt>
                  <dd>{activeResult.record.app.sellerName}</dd>
                </div>
                <div>
                  <dt>{copy.lastChecked}</dt>
                  <dd>{formatDate(activeResult.record.lastFetchedAt, locale)}</dd>
                </div>
              </dl>
              {activeResult.previous && activeResult.previous.app.version !== activeResult.record.app.version ? (
                <p className="message spotlight">
                  {copy.newVersionLabel}: {activeResult.previous.app.version} →{" "}
                  {activeResult.record.app.version}
                </p>
              ) : null}
              {activeResult.record.app.trackViewUrl ? (
                <a
                  className="store-link"
                  href={activeResult.record.app.trackViewUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  {copy.openInStore}
                </a>
              ) : null}
            </div>
          </article>
        </section>
      ) : null}

      <section className="panel watchlist-panel">
        <div className="section-head">
          <div>
            <h2>{copy.watchlistTitle}</h2>
            <p>{copy.watchlistDescription}</p>
          </div>
          <button className="secondary" disabled={isRefreshingAll || !watchlist.length} onClick={refreshAll} type="button">
            {isRefreshingAll ? copy.refreshingAll : copy.refreshAll}
          </button>
        </div>

        <div className="watchlist">
          {watchlist.length ? (
            watchlist.map((record) => (
              <article className="watch-card" key={record.key}>
                <div className="watch-main">
                  <img
                    alt={record.app.trackName}
                    className="watch-icon"
                    src={getAppArtwork(record)}
                  />
                  <div className="watch-copy">
                    <h3>{record.app.trackName}</h3>
                    <p className="watch-meta">
                      {record.lookupType === "id" ? copy.lookupById : copy.lookupByBundleId}:{" "}
                      {record.lookupValue}
                    </p>
                    <div className="watch-tags">
                      <span className={`status ${getStatusTone(record.lastStatus)}`}>
                        {getStatusLabel(record.lastStatus, locale)}
                      </span>
                      {record.lastStatus !== "waiting" ? (
                        <span className={`chip ${isPreRelease(record.app) ? "alt" : ""}`}>
                          {isPreRelease(record.app) ? copy.prereleaseLabel : copy.liveLabel}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="watch-side">
                  <p>
                    {record.app.version !== "—"
                      ? `${copy.version}: ${record.app.version}`
                      : isLiveRecord(record)
                        ? copy.liveLabel
                        : formatDate(record.lastFetchedAt, locale)}
                  </p>
                  {record.app.version !== "—" ? <p>{formatDate(record.lastFetchedAt, locale)}</p> : null}
                  <button className="ghost subtle" onClick={() => removeWatch(record.key)} type="button">
                    {copy.removeWatch}
                  </button>
                </div>

                {record.lastError ? <p className="message error">{record.lastError}</p> : null}
              </article>
            ))
          ) : (
            <div className="empty-watchlist">{copy.emptyWatchlist}</div>
          )}
        </div>
      </section>

      <footer className="footer">
        <p>{copy.footerText}</p>
      </footer>
    </div>
  );
}
