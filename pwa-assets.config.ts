import { defineConfig, minimal2023Preset } from '@vite-pwa/assets-generator/config'

export default defineConfig({
  preset: {
    ...minimal2023Preset,
    // The mint square is the icon itself, so no padding and a mint background everywhere.
    transparent: { ...minimal2023Preset.transparent, padding: 0 },
    maskable: { ...minimal2023Preset.maskable, padding: 0, resizeOptions: { background: '#D3F1E4' } },
    apple: { ...minimal2023Preset.apple, padding: 0, resizeOptions: { background: '#D3F1E4' } },
  },
  images: ['public/favicon.svg'],
})
