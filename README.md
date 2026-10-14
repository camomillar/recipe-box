# Recipe Box

A personal recipe app you can install on your phone's home screen. Recipes and photos live on the device (IndexedDB), and it works offline.

Built with Vite + React + TypeScript, Dexie and vite-plugin-pwa. Fonts are bundled (no Google Fonts requests).

**App:** https://camomillar.github.io/recipe-box/

## Como instalar no celular

É grátis, sem cadastro e funciona até sem internet. Abra o link acima no celular e siga os passos.

### No iPhone (use o Safari)

1. Abra o link no **Safari**.
2. Toque em **Compartilhar** na barra de baixo. Em iPhones mais novos, ele pode estar dentro do botão **⋯**.
3. Role a lista e toque em **Adicionar à Tela de Início**.
4. Toque em **Adicionar**, no canto de cima.

### No Android (use o Chrome)

1. Abra o link no **Chrome**.
2. Toque no menu **⋮** no canto de cima.
3. Toque em **Instalar app** ou **Adicionar à tela inicial**.
4. Confirme em **Instalar**.

Prontinho, chef! Abra o Recipe Box pelo ícone do gatinho na tela inicial.

Suas receitas e fotos ficam só no seu celular. De vez em quando, faça um backup pelo menu **⋯** do app.

## Install on your phone

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
