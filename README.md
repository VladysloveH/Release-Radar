# Release Radar

Release Radar is a static React app for tracking App Store releases by `App ID` or `Bundle ID`.

It lets you:
- check the current App Store status for an app
- save apps to a local watchlist in the browser
- keep `waiting` entries for apps that are not available in App Store lookup yet
- refresh the watchlist on page open or manually
- switch language and theme with persisted preferences

The project is built with React, TypeScript, and Vite, and is configured for deployment to GitHub Pages.

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

## Preview the production build

```bash
npm run preview
```

## Deploy to GitHub Pages

1. Push the repository to GitHub.
2. Open `Settings -> Pages` in the repository.
3. Set `Build and deployment -> Source` to `GitHub Actions`.
4. Push changes to `main`.
5. Wait for `.github/workflows/deploy.yml` to finish successfully.

The app uses Vite and ships as a fully static site.

## Notes

- App Store requests use JSONP instead of direct `fetch` so the app can work on GitHub Pages without a backend.
- Watchlist data, selected language, and selected theme are stored in `localStorage`.
