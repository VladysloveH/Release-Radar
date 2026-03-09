export type Locale = "en" | "uk";
export type Theme = "dark" | "light";

type Copy = {
  appName: string;
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  languageLabel: string;
  languageEnglish: string;
  languageUkrainian: string;
  themeLabel: string;
  themeDark: string;
  themeLight: string;
  lookupTypeLabel: string;
  lookupById: string;
  lookupByBundleId: string;
  lookupValueLabel: string;
  lookupValuePlaceholderId: string;
  lookupValuePlaceholderBundleId: string;
  countryLabel: string;
  checkButton: string;
  checkingButton: string;
  watchButton: string;
  updateWatchButton: string;
  resultTitle: string;
  watchlistTitle: string;
  watchlistDescription: string;
  emptyWatchlist: string;
  refreshAll: string;
  refreshingAll: string;
  autoRefreshing: string;
  removeWatch: string;
  lastChecked: string;
  releaseDate: string;
  version: string;
  seller: string;
  statusUpToDate: string;
  statusWaiting: string;
  statusUpdated: string;
  statusReleased: string;
  statusFirstSeen: string;
  statusError: string;
  prereleaseLabel: string;
  liveLabel: string;
  expectedReleaseDate: string;
  neverChecked: string;
  newVersionLabel: string;
  noResultTitle: string;
  noResultDescription: string;
  formErrorEmpty: string;
  formErrorNotFound: string;
  waitingDescription: string;
  addWaitingButton: string;
  formErrorGeneric: string;
  saveSuccess: string;
  updateSuccess: string;
  duplicateWatch: string;
  updatedNow: string;
  watchCountLabel: string;
  resultBadgeFound: string;
  resultBadgeTracked: string;
  openInStore: string;
  footerText: string;
};

export const strings: Record<Locale, Copy> = {
  en: {
    appName: "Release Radar",
    heroEyebrow: "App Store monitor",
    heroTitle: "Track App Store releases with a cleaner watchlist.",
    heroDescription:
      "Search by App ID or Bundle ID, inspect the latest version, and keep a lightweight watchlist in your browser.",
    languageLabel: "Language",
    languageEnglish: "English",
    languageUkrainian: "Ukrainian",
    themeLabel: "Appearance",
    themeDark: "Dark",
    themeLight: "Light",
    lookupTypeLabel: "Lookup type",
    lookupById: "App ID",
    lookupByBundleId: "Bundle ID",
    lookupValueLabel: "Value",
    lookupValuePlaceholderId: "For example 123456789",
    lookupValuePlaceholderBundleId: "For example com.example.app",
    countryLabel: "Store country",
    checkButton: "Check now",
    checkingButton: "Checking...",
    watchButton: "Add to watchlist",
    updateWatchButton: "Update record",
    resultTitle: "Current result",
    watchlistTitle: "Watchlist",
    watchlistDescription:
      "Entries are stored locally in your browser. Refresh them later to detect a new version or release date.",
    emptyWatchlist: "Your watchlist is empty.",
    refreshAll: "Refresh all",
    refreshingAll: "Refreshing...",
    autoRefreshing: "Refreshing watchlist on open...",
    removeWatch: "Remove",
    lastChecked: "Last checked",
    releaseDate: "Release date",
    version: "Version",
    seller: "Developer",
    statusUpToDate: "No changes",
    statusWaiting: "Waiting",
    statusUpdated: "Update detected",
    statusReleased: "Now released",
    statusFirstSeen: "First capture",
    statusError: "Error",
    prereleaseLabel: "Pre-release",
    liveLabel: "Live",
    expectedReleaseDate: "Expected release",
    neverChecked: "Not checked yet",
    newVersionLabel: "New version",
    noResultTitle: "No app selected yet",
    noResultDescription: "Run a lookup to see the latest App Store metadata and update status here.",
    formErrorEmpty: "Enter an App ID or Bundle ID.",
    formErrorNotFound: "App not found in the App Store.",
    waitingDescription: "This app is not visible in App Store lookup yet. You can still save it and keep waiting for release.",
    addWaitingButton: "Add as waiting",
    formErrorGeneric: "Unable to load data from the App Store.",
    saveSuccess: "App added to your watchlist.",
    updateSuccess: "Watchlist entry updated.",
    duplicateWatch: "This app is already in your watchlist.",
    updatedNow: "Updated just now",
    watchCountLabel: "Tracked apps",
    resultBadgeFound: "Found",
    resultBadgeTracked: "Tracked",
    openInStore: "Open in App Store",
    footerText: "Powered by the public App Store Lookup API."
  },
  uk: {
    appName: "Release Radar",
    heroEyebrow: "App Store watcher",
    heroTitle: "Слідкуй за релізами в App Store через компактний моніторинг.",
    heroDescription:
      "Шукай за App ID або Bundle ID, перевіряй актуальну версію та веди легкий список моніторингу прямо в браузері.",
    languageLabel: "Мова",
    languageEnglish: "Англійська",
    languageUkrainian: "Українська",
    themeLabel: "Тема",
    themeDark: "Темна",
    themeLight: "Світла",
    lookupTypeLabel: "Тип пошуку",
    lookupById: "App ID",
    lookupByBundleId: "Bundle ID",
    lookupValueLabel: "Значення",
    lookupValuePlaceholderId: "Наприклад 123456789",
    lookupValuePlaceholderBundleId: "Наприклад com.example.app",
    countryLabel: "Країна Store",
    checkButton: "Перевірити",
    checkingButton: "Перевіряю...",
    watchButton: "Додати в моніторинг",
    updateWatchButton: "Оновити запис",
    resultTitle: "Поточний результат",
    watchlistTitle: "Моніторинг",
    watchlistDescription:
      "Записи зберігаються локально в браузері. Оновлюй їх пізніше, щоб побачити нову версію або зміну дати релізу.",
    emptyWatchlist: "Список моніторингу порожній.",
    refreshAll: "Оновити все",
    refreshingAll: "Оновлюю...",
    autoRefreshing: "Оновлюю список при відкритті...",
    removeWatch: "Видалити",
    lastChecked: "Остання перевірка",
    releaseDate: "Дата релізу",
    version: "Версія",
    seller: "Розробник",
    statusUpToDate: "Без змін",
    statusWaiting: "Очікування",
    statusUpdated: "Є оновлення",
    statusReleased: "Застосунок вийшов",
    statusFirstSeen: "Перше зчитування",
    statusError: "Помилка",
    prereleaseLabel: "Ще не вийшов",
    liveLabel: "В App Store",
    expectedReleaseDate: "Очікувана дата релізу",
    neverChecked: "Ще не перевірявся",
    newVersionLabel: "Нова версія",
    noResultTitle: "Ще нічого не вибрано",
    noResultDescription: "Запусти пошук, і тут з’являться актуальні дані App Store та статус оновлення.",
    formErrorEmpty: "Введи App ID або Bundle ID.",
    formErrorNotFound: "Застосунок не знайдено в App Store.",
    waitingDescription: "Цей застосунок ще не з'явився у відповіді App Store lookup. Його все одно можна додати в список очікування.",
    addWaitingButton: "Додати як waiting",
    formErrorGeneric: "Не вдалося завантажити дані з App Store.",
    saveSuccess: "Застосунок додано до моніторингу.",
    updateSuccess: "Запис моніторингу оновлено.",
    duplicateWatch: "Цей застосунок уже є у списку моніторингу.",
    updatedNow: "Щойно оновлено",
    watchCountLabel: "Відстежувані застосунки",
    resultBadgeFound: "Знайдено",
    resultBadgeTracked: "У списку",
    openInStore: "Відкрити в App Store",
    footerText:
      "Працює через публічний App Store Lookup API і підходить для статичного хостингу на GitHub Pages."
  }
};
