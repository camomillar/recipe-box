import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
// Fonts are bundled with the app (no Google Fonts requests). Latin covers English and Portuguese.
import '@fontsource/darumadrop-one/latin-400.css'
import '@fontsource/outfit/latin-500.css'
import '@fontsource/outfit/latin-600.css'
import '@fontsource/dm-sans/latin-400.css'
import '@fontsource/dm-sans/latin-500.css'
import '@fontsource/dm-sans/latin-700.css'
import './index.css'
import App from './App.tsx'

registerSW({ immediate: true })

// Ask the browser not to evict our IndexedDB data under storage pressure.
navigator.storage?.persist?.()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
