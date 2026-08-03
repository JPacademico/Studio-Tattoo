import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App'
import { RouterProvider } from '@/lib/router'
import { ToastProvider } from '@/components/ui/Toast'

const container = document.getElementById('root')
if (!container) throw new Error('#root não encontrado')

createRoot(container).render(
  <StrictMode>
    <RouterProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </RouterProvider>
  </StrictMode>,
)

// Fade out the pre-React splash once the first paint has landed.
requestAnimationFrame(() => {
  const boot = document.getElementById('boot')
  if (!boot) return
  boot.style.opacity = '0'
  setTimeout(() => boot.remove(), 450)
})
