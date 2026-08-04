import { Fragment, useEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { cn, isEmberWord } from '@/lib/utils'

/**
 * Scroll reveals, driven by ONE shared IntersectionObserver and plain CSS
 * transitions.
 *
 * These primitives are used ~40 times across the site. Giving each one its own
 * motion component and its own observer meant dozens of JS-driven animations
 * competing for the main thread on every scroll. Compositor-only transitions
 * (opacity + transform) cost the main thread nothing once started, and a single
 * observer replaces the whole fleet.
 */

type Registration = { fire: () => void; amount: number }

const registry = new Map<Element, Registration>()
let observer: IntersectionObserver | null = null

function ensureObserver(): IntersectionObserver | null {
  if (observer) return observer
  if (typeof IntersectionObserver === 'undefined') return null

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const registration = registry.get(entry.target)
        if (!registration) continue

        let reveal = false

        if (entry.isIntersecting) {
          // An element taller than the viewport can never reach a high ratio,
          // so it would otherwise stay hidden forever.
          const isTall = entry.boundingClientRect.height > window.innerHeight * 0.75
          reveal = entry.intersectionRatio >= (isTall ? 0.02 : registration.amount)
        } else if (entry.boundingClientRect.bottom < 0) {
          // Already scrolled clean past it. A fast flick or an anchor jump can
          // skip an element between callbacks; without this it would stay
          // invisible until the user happened to scroll back up to it.
          reveal = true
        }

        if (reveal) {
          registration.fire()
          observer?.unobserve(entry.target)
          registry.delete(entry.target)
        }
      }
    },
    {
      threshold: [0, 0.02, 0.1, 0.2, 0.3, 0.4, 0.5, 0.65],
      rootMargin: '0px 0px -6% 0px',
    },
  )

  return observer
}

/** Returns a ref to attach and whether the element has entered the viewport. */
export function useReveal<T extends HTMLElement>(amount = 0.2) {
  const ref = useRef<T | null>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node || shown) return

    const io = ensureObserver()
    if (!io) {
      // No IntersectionObserver — show everything rather than hiding content.
      setShown(true)
      return
    }

    registry.set(node, { fire: () => setShown(true), amount })
    io.observe(node)

    return () => {
      registry.delete(node)
      io.unobserve(node)
    }
  }, [amount, shown])

  return { ref, shown }
}

type Direction = 'up' | 'down' | 'left' | 'right' | 'none'

const OFFSET: Record<Direction, [string, string]> = {
  up: ['0px', '34px'],
  down: ['0px', '-34px'],
  left: ['40px', '0px'],
  right: ['-40px', '0px'],
  none: ['0px', '0px'],
}

export function Reveal({
  children,
  className,
  delay = 0,
  direction = 'up',
  amount = 0.2,
}: {
  children: ReactNode
  className?: string
  delay?: number
  direction?: Direction
  amount?: number
}) {
  const { ref, shown } = useReveal<HTMLDivElement>(amount)
  const [x, y] = OFFSET[direction]

  return (
    <div
      ref={ref}
      className={cn('sjt-reveal', shown && 'is-visible', className)}
      style={
        {
          '--reveal-x': x,
          '--reveal-y': y,
          transitionDelay: `${delay}s`,
        } as CSSProperties
      }
    >
      {children}
    </div>
  )
}

/** Splits a line into words that rise out of their own clipping mask. */
export function RevealWords({
  text,
  className,
  delay = 0,
  emberWords,
}: {
  text: string
  className?: string
  delay?: number
  /** Words (matched case/punctuation-insensitively) to render in the ember accent. */
  emberWords?: readonly string[]
}) {
  const { ref, shown } = useReveal<HTMLSpanElement>(0.3)
  const words = text.split(' ')

  return (
    <span ref={ref} className={cn('sjt-words', shown && 'is-visible', className)}>
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span className="sjt-word-mask">
            <span
              className={cn(
                'sjt-word',
                emberWords && isEmberWord(word, emberWords) && 'text-ember-bright',
              )}
              style={{ transitionDelay: `${delay + i * 0.06}s` }}
            >
              {word}
            </span>
          </span>
          {/* The separator lives outside the mask: `overflow: hidden` makes the
              mask a formatting context, which strips a trailing space. */}
          {i < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </span>
  )
}
