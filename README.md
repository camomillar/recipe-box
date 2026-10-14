# Recipe Box

A personal recipe app you can install on your phone's home screen. Recipes and photos live on the device (IndexedDB), and it works offline.

Built with Vite + React + TypeScript, Dexie, vite-plugin-pwa and Tesseract.js (on-device screenshot reading, loaded only when used).

## Develop

```bash
npm install
npm run dev     # http://localhost:5173/recipe-box/
npm test        # caption parser tests
npm run build
```

`npm run icons` regenerates the PNG app icons from `public/favicon.svg`.

## Deploy

Every push to `main` builds and deploys to GitHub Pages via `.github/workflows/deploy.yml`.

## Install on iPhone

Open the site in Safari → Share → Add to Home Screen.

Your recipes are stored only on that phone. Use the ⋯ menu on the home screen to back up to a JSON file now and then, and to restore it.
