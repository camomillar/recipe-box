# Recipe Box

<p align="center"><img src="design/banner.png" alt="The Recipe Box cat chef holding a whisk and a mixing bowl" width="600"></p>

A personal recipe app you can install on your phone's home screen. Recipes and photos live on the device (IndexedDB), and it works offline.

Built with Vite + React + TypeScript, Dexie and vite-plugin-pwa. Fonts are bundled (no Google Fonts requests).

**App:** https://camomillar.github.io/recipe-box/

## Install on your phone

It's free, there's no sign-up, and it works offline. Open the link above on your phone and follow the steps.

### iPhone (Safari)

1. Open the link in **Safari**.
2. Tap **Share** in the bottom bar. On newer iPhones it may be inside the **⋯** button.
3. Scroll down and tap **Add to Home Screen**.
4. Tap **Add** in the top corner.

### Android (Chrome)

1. Open the link in **Chrome**.
2. Tap the **⋮** menu in the top corner.
3. Tap **Install app** or **Add to Home screen**.
4. Confirm with **Install**.

Recipes and photos are stored only on that phone. Use the **⋯** menu in the app to back up to a file now and then, and to restore it.

## Develop

```bash
npm install
npm run dev     # http://localhost:5173/recipe-box/
npm test        # caption parser tests
npm run build
```

`npm run icons` regenerates the PNG app icons from `public/logo.png`.

## Deploy

Every push to `main` builds and deploys to GitHub Pages via `.github/workflows/deploy.yml`.
