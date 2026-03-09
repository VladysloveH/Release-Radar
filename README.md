# Release Radar

Статичний React-сайт для GitHub Pages, який перевіряє App Store Lookup API, показує поточну версію застосунку і локально зберігає список для моніторингу.

## Запуск

```bash
npm install
npm run dev
```

## Збірка

```bash
npm run build
```

## Публікація на GitHub Pages

1. Запуш `main` у GitHub.
2. У GitHub відкрий `Settings -> Pages`.
3. У `Build and deployment` вибери `GitHub Actions`.
4. Дочекайся виконання workflow `.github/workflows/deploy.yml`.

Сайт використовує `base: "./"` у Vite, тому підходить для репозиторного GitHub Pages без ручного редагування шляху.
