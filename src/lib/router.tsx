import { createContext, useContext, useEffect, useState } from 'react'
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from 'react'

/**
 * A ~90 line History API router. The site has two routes, so pulling in a
 * routing library would cost more bytes than it saves. Handles: push/replace,
 * back/forward, in-page hash anchors, and cross-page anchors (`/#galeria`).
 */

export type Location = { pathname: string; search: string; hash: string }

const NAV_EVENT = 'sjt:navigate'

function readLocation(): Location {
  const { pathname, search, hash } = window.location
  return { pathname, search, hash }
}

const RouterContext = createContext<Location>({ pathname: '/', search: '', hash: '' })

function reducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Anchors may not exist yet if we just switched pages — retry across a few frames. */
function scrollToHash(hash: string, attempts = 0): void {
  let el: Element | null = null
  try {
    el = document.querySelector(hash)
  } catch {
    return
  }

  if (el) {
    el.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' })
    return
  }
  if (attempts < 25) requestAnimationFrame(() => scrollToHash(hash, attempts + 1))
}

export function navigate(to: string, options: { replace?: boolean } = {}): void {
  const url = new URL(to, window.location.href)
  const samePage = url.pathname === window.location.pathname

  // Re-clicking the current in-page anchor should still scroll.
  if (samePage && url.hash && url.hash === window.location.hash) {
    scrollToHash(url.hash)
    return
  }

  const method = options.replace ? 'replaceState' : 'pushState'
  window.history[method]({}, '', url)
  window.dispatchEvent(new Event(NAV_EVENT))

  if (url.hash) {
    scrollToHash(url.hash)
  } else if (!samePage) {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<Location>(readLocation)

  useEffect(() => {
    const sync = () => setLocation(readLocation())
    window.addEventListener('popstate', sync)
    window.addEventListener(NAV_EVENT, sync)
    return () => {
      window.removeEventListener('popstate', sync)
      window.removeEventListener(NAV_EVENT, sync)
    }
  }, [])

  // A deep link that lands with a hash still has to wait for paint.
  useEffect(() => {
    if (window.location.hash) scrollToHash(window.location.hash)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <RouterContext.Provider value={location}>{children}</RouterContext.Provider>
}

export function useLocation(): Location {
  return useContext(RouterContext)
}

export function useSearchParam(key: string): string | null {
  const { search } = useLocation()
  return new URLSearchParams(search).get(key)
}

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }

export function Link({ to, onClick, children, ...rest }: LinkProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event)
    // Let the browser handle modified clicks (new tab, download, …).
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return
    }
    event.preventDefault()
    navigate(to)
  }

  return (
    <a href={to} onClick={handleClick} {...rest}>
      {children}
    </a>
  )
}
