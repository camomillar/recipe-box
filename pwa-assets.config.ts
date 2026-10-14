import { defineConfig, minimal2023Preset } from '@vite-pwa/assets-generator/config'

// The cream square is the icon itself: no padding, cream behind everything.
const bg = { background: '#FFFAE6' }

export default defineConfig({
  preset: {
    ...minimal2023Preset,
    transparent: { ...minimal2023Preset.transparent, padding: 0 },
    maskable: { ...minimal2023Preset.maskable, padding: 0, resizeOptions: bg },
    apple: { ...minimal2023Preset.apple, padding: 0, resizeOptions: bg },
  },
  images: ['public/logo.png'],
})
