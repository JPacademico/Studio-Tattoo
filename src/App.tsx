import { Suspense, lazy, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLocation } from '@/lib/router'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Atmosphere, ScrollProgress } from '@/components/ui/Atmosphere'
import { ReloadPrompt } from '@/components/pwa/ReloadPrompt'
import { WhatsAppFab } from '@/components/whatsapp/WhatsAppFab'
import { HomePage } from '@/pages/HomePage'

/**
 * The home page ships in the entry chunk — it's the LCP route and must not
 * wait on a second round trip. Everything else is split out and warmed on
 * idle, so a click still feels instant without inflating first load.
 */
const loadGallery = () => import('@/pages/GalleryPage')
const loadBooking = () => import('@/pages/BookingPage')
const loadNotFound = () => import('@/pages/NotFoundPage')

const GalleryPage = lazy(() => loadGallery().then((m) => ({ default: m.GalleryPage })))
const BookingPage = lazy(() => loadBooking().then((m) => ({ default: m.BookingPage })))
const NotFoundPage = lazy(() => loadNotFound().then((m) => ({ default: m.NotFoundPage })))

function renderRoute(pathname: string) {
  // Tolerate a trailing slash so /agendar/ isn't a 404.
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname

  switch (path) {
    case '':
    case '/':
      return { key: 'home', element: <HomePage /> }
    case '/galeria':
      return { key: 'galeria', element: <GalleryPage /> }
    case '/agendar':
      return { key: 'agendar', element: <BookingPage /> }
    default:
      return { key: 'nf', element: <NotFoundPage /> }
  }
}

function useIdlePrefetch() {
  useEffect(() => {
    const warm = () => {
      void loadGallery()
      void loadBooking()
    }

    // Safari only shipped requestIdleCallback recently — fall back to a timer.
    if (typeof window.requestIdleCallback === 'function') {
      const handle = window.requestIdleCallback(warm, { timeout: 3000 })
      return () => window.cancelIdleCallback(handle)
    }

    const handle = window.setTimeout(warm, 1500)
    return () => window.clearTimeout(handle)
  }, [])
}

export function App() {
  const { pathname } = useLocation()
  const route = renderRoute(pathname)
  const isHome = route.key === 'home'
  useIdlePrefetch()

  return (
    <>
      <Atmosphere />
      <ScrollProgress />
      <Header />

      <div className="relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={route.key}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
          >
            <Suspense fallback={<RouteFallback />}>{route.element}</Suspense>
          </motion.div>
        </AnimatePresence>

        <Footer />
      </div>

      {/* Only on the home page — the booking flow and gallery already have
          their own contextual WhatsApp entry points. */}
      {isHome && <WhatsAppFab />}
      <ReloadPrompt />
    </>
  )
}

/** Holds the viewport height so the footer doesn't jump while a route loads. */
function RouteFallback() {
  return (
    <div className="grid min-h-svh place-items-center" role="status" aria-label="Carregando">
      <span className="size-8 animate-spin rounded-full border-2 border-bone/15 border-t-ember" />
    </div>
  )
}
