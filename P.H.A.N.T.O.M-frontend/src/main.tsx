import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { initializeApi } from './utils/api'
import './index.css'

async function clearDevServiceWorkerCache() {
  if (!import.meta.env.DEV || !('serviceWorker' in navigator)) {
    return
  }

  const registrations = await navigator.serviceWorker.getRegistrations()
  await Promise.all(registrations.map((registration) => registration.unregister()))

  if ('caches' in window) {
    const keys = await caches.keys()
    await Promise.all(keys.map((key) => caches.delete(key)))
  }
}

clearDevServiceWorkerCache()
  .then(() => initializeApi())
  .finally(() => {
    ReactDOM.createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <App />
      </StrictMode>,
    )
  })

// Register PWA only in production — SW caching breaks Vite dev (stale bundles, hook errors)
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((error) => {
      console.warn('PWA Service Worker registration failed:', error)
    })
  })
}

declare global {
  interface Window {
    installPWA?: () => void
  }
}

if (typeof window !== 'undefined') {
  let deferredPrompt: Event | null = null
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt = e
  })
  window.installPWA = () => {
    const promptEvent = deferredPrompt as { prompt?: () => void; userChoice?: Promise<{ outcome: string }> } | null
    if (promptEvent?.prompt) {
      promptEvent.prompt()
      promptEvent.userChoice?.then(() => {
        deferredPrompt = null
      })
    }
  }
}
