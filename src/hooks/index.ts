import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches,
  )

  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}

/** True on real pointer devices — gates hover-only flourishes like the cursor. */
export function useHasFinePointer(): boolean {
  return useMediaQuery('(hover: hover) and (pointer: fine)')
}

/**
 * Freezes the page behind a modal. Compensates for the scrollbar so the
 * layout doesn't jump, and pins `top` so iOS Safari doesn't lose the position.
 */
export function useLockBodyScroll(locked: boolean): void {
  useLayoutEffect(() => {
    if (!locked) return

    const { body } = document
    const scrollY = window.scrollY
    const gutter = window.innerWidth - document.documentElement.clientWidth
    const prev = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      paddingRight: body.style.paddingRight,
    }

    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.width = '100%'
    if (gutter > 0) body.style.paddingRight = `${gutter}px`

    return () => {
      body.style.position = prev.position
      body.style.top = prev.top
      body.style.width = prev.width
      body.style.paddingRight = prev.paddingRight
      window.scrollTo(0, scrollY)
    }
  }, [locked])
}

/** Fires once when the element first enters the viewport. */
export function useInViewOnce<T extends Element>(rootMargin = '200px'): [
  (node: T | null) => void,
  boolean,
] {
  const [seen, setSeen] = useState(false)
  const observer = useRef<IntersectionObserver | null>(null)

  const ref = useCallback(
    (node: T | null) => {
      observer.current?.disconnect()
      if (!node || seen) return

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            setSeen(true)
            observer.current?.disconnect()
          }
        },
        { rootMargin },
      )
      observer.current.observe(node)
    },
    [seen, rootMargin],
  )

  useEffect(() => () => observer.current?.disconnect(), [])

  return [ref, seen]
}

/** Persists state to localStorage, tolerating private-mode write failures. */
export function usePersistentState<T>(
  key: string,
  initial: T,
): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(() => {
    try {
      const raw = window.localStorage.getItem(key)
      return raw ? ({ ...initial, ...JSON.parse(raw) } as T) : initial
    } catch {
      return initial
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state))
    } catch {
      /* Safari private mode throws on write — non-fatal for a draft. */
    }
  }, [key, state])

  return [state, setState]
}

/** Tracks whether the page has been scrolled past a threshold. */
export function useScrolled(threshold = 24): boolean {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        setScrolled(window.scrollY > threshold)
        frame = 0
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [threshold])

  return scrolled
}
