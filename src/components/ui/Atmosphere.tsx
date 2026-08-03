import { motion, useScroll, useSpring } from 'framer-motion'
import { useReveal } from '@/components/ui/Reveal'
import { cn } from '@/lib/utils'

/**
 * Page-wide mood layer: drifting haze, vignette and film grain.
 *
 * Perf notes, learned the hard way:
 *  - No `mix-blend-mode`. A fixed, full-viewport blended layer forces the
 *    compositor to re-blend the entire screen on every scroll frame.
 *  - The haze uses radial gradients rather than `filter: blur()`, and only
 *    animates where there's a real pointer — phones get it static, so no
 *    oversized layer is being transformed during touch scrolling.
 */
export function Atmosphere() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div
        className="absolute -top-[15%] -left-[8%] size-[46vmax] opacity-70 hoverable:animate-drift"
        style={{
          background: 'radial-gradient(circle, rgb(212 64 42 / 0.08) 0%, transparent 62%)',
          animationDuration: '26s',
        }}
      />
      <div
        className="absolute top-[38%] -right-[12%] size-[40vmax] opacity-60 hoverable:animate-drift"
        style={{
          background: 'radial-gradient(circle, rgb(140 150 190 / 0.06) 0%, transparent 60%)',
          animationDuration: '34s',
          animationDirection: 'reverse',
        }}
      />

      <div className="absolute inset-0 vignette" />

      <div className="absolute inset-0 grain-overlay opacity-[0.045]" />
    </div>
  )
}

/** Ink-line progress bar pinned to the top of the viewport. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, restDelta: 0.001 })

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[120] h-[2px] origin-left bg-gradient-to-r from-ember via-ember-bright to-ember"
    />
  )
}

/** Hairline that a needle "tattoos" across on reveal — CSS dash-offset, no JS. */
export function NeedleDivider({ className }: { className?: string }) {
  const { ref, shown } = useReveal<HTMLDivElement>(0.5)

  return (
    <div ref={ref} className={className} aria-hidden>
      <svg viewBox="0 0 1200 12" className="h-3 w-full" preserveAspectRatio="none">
        <path
          d="M0 6 Q 300 1, 600 6 T 1200 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className={cn('sjt-draw', shown && 'is-visible')}
        />
      </svg>
    </div>
  )
}
