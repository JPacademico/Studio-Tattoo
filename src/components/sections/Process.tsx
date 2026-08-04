import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { processSteps } from '@/data/studio'
import { SmartImage } from '@/components/ui/SmartImage'
import { Reveal, RevealWords } from '@/components/ui/Reveal'
import { cn } from '@/lib/utils'

type Point = { x: number; y: number }

/** Catmull-Rom through the pin centres, emitted as cubic béziers. */
function smoothPath(points: Point[], tension = 0.34): string {
  if (points.length < 2) return ''
  let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] ?? p2

    const c1x = p1.x + ((p2.x - p0.x) / 6) * tension * 3
    const c1y = p1.y + ((p2.y - p0.y) / 6) * tension * 3
    const c2x = p2.x - ((p3.x - p1.x) / 6) * tension * 3
    const c2y = p2.y - ((p3.y - p1.y) / 6) * tension * 3

    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`
  }

  return d
}

export function Process() {
  const containerRef = useRef<HTMLDivElement>(null)
  const pinRefs = useRef<Array<HTMLSpanElement | null>>([])
  const [path, setPath] = useState('')
  const [box, setBox] = useState({ w: 0, h: 0 })
  const reduced = useReducedMotion()

  /**
   * The connector is measured from the real pin positions rather than hard-coded,
   * so it stays correct at every breakpoint and after fonts/images reflow.
   */
  const measure = useCallback(() => {
    const container = containerRef.current
    if (!container) return

    const base = container.getBoundingClientRect()
    const points = pinRefs.current
      .filter((el): el is HTMLSpanElement => Boolean(el))
      .map((el) => {
        const r = el.getBoundingClientRect()
        return { x: r.left - base.left + r.width / 2, y: r.top - base.top + r.height / 2 }
      })

    if (points.length < 2) return
    setBox({ w: base.width, h: base.height })
    setPath(smoothPath(points))
  }, [])

  useLayoutEffect(() => {
    measure()
    const container = containerRef.current
    if (!container) return

    const observer = new ResizeObserver(measure)
    observer.observe(container)
    return () => observer.disconnect()
  }, [measure])

  // Late-loading webfonts shift the cards; re-measure once they settle.
  useEffect(() => {
    if (!('fonts' in document)) return
    document.fonts.ready.then(measure).catch(() => {})
  }, [measure])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.85', 'end 0.55'],
  })
  const drawn = useSpring(scrollYProgress, { stiffness: 90, damping: 26, restDelta: 0.001 })

  return (
    <section id="processo" className="relative scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-[80rem]">
        <div ref={containerRef} className="relative">
          {/* The zigzag leaves the first row's left half empty on large screens —
              the intro slots straight into it instead of stacking above. */}
          <div className="mb-14 max-w-xl lg:absolute lg:top-3 lg:left-0 lg:z-10 lg:mb-0 lg:w-[42%] lg:max-w-none lg:pr-10">
            <Reveal>
              <p className="eyebrow">Como funciona</p>
            </Reveal>
            <h2 className="mt-4 text-[clamp(2.2rem,5.5vw,3.6rem)] leading-[0.95] text-bone">
              <RevealWords text="Da ideia" className="block" emberWords={['ideia']} />
              <RevealWords text="até a pele" className="block italic text-dust" delay={0.12} />
            </h2>
            <Reveal delay={0.1}>
              <p className="mt-6 text-[0.95rem] leading-relaxed text-muted">
                Três etapas, do primeiro "tô pensando em fazer" até a tatuagem pronta. Você sabe o
                que vai acontecer em cada uma delas.
              </p>
            </Reveal>
          </div>

          {/* Drawn connector, sized to the measured container */}
          {path && box.w > 0 && (
            <svg
              aria-hidden
              width={box.w}
              height={box.h}
              viewBox={`0 0 ${box.w} ${box.h}`}
              className="pointer-events-none absolute inset-0 hidden overflow-visible lg:block"
            >
              <path
                d={path}
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeDasharray="5 7"
                className="text-bone/8"
              />
              <motion.path
                d={path}
                fill="none"
                stroke="var(--color-ember)"
                strokeWidth={1.5}
                strokeDasharray="5 7"
                strokeLinecap="round"
                style={{ pathLength: reduced ? 1 : drawn }}
              />
            </svg>
          )}

          <ol className="relative grid gap-10 sm:gap-14 lg:grid-cols-2 lg:gap-x-20 lg:gap-y-6">
            {processSteps.map((step, i) => (
              <StepCard
                key={step.number}
                step={step}
                index={i}
                total={processSteps.length}
                progress={drawn}
                reduced={Boolean(reduced)}
                pinRef={(el) => {
                  pinRefs.current[i] = el
                }}
              />
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

type StepCardProps = {
  step: (typeof processSteps)[number]
  index: number
  total: number
  progress: ReturnType<typeof useSpring>
  reduced: boolean
  pinRef: (el: HTMLSpanElement | null) => void
}

function StepCard({ step, index, total, progress, reduced, pinRef }: StepCardProps) {
  // The pin ignites just as the drawn line reaches it.
  const threshold = index / Math.max(1, total - 1)
  const pinScale = useTransform(progress, [threshold - 0.12, threshold], [0.6, 1], {
    clamp: true,
  })
  const pinOpacity = useTransform(progress, [threshold - 0.12, threshold], [0.25, 1], {
    clamp: true,
  })

  // Alternate the column and drop every other card so the line has to travel.
  const isRight = index % 2 === 0

  return (
    <motion.li
      initial={{ opacity: 0, y: 46 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'relative',
        // Rows are pinned explicitly: auto-placement will happily pull an item
        // back into an earlier row once a column is skipped, which breaks the
        // staircase. With fixed rows + uniform card heights the negative
        // margins below are safe — same-column cards are always two rows apart.
        isRight ? 'lg:col-start-2' : 'lg:col-start-1',
        index === 0 && 'lg:row-start-1',
        index === 1 && 'lg:row-start-2 lg:-mt-32',
        index === 2 && 'lg:row-start-3 lg:-mt-40',
      )}
    >
      {/* Uniform height on lg: the cards overlap by fixed negative margins, and
          that only stays collision-free if every row is the same height. */}
      <article className="relative flex flex-col overflow-hidden rounded-2xl border border-bone/10 bg-gradient-to-b from-coal to-ink p-5 shadow-[0_28px_60px_-30px_rgb(0_0_0/0.9)] sm:p-6 lg:h-[27rem]">
        {/* Pin head */}
        <motion.span
          ref={pinRef}
          aria-hidden
          style={reduced ? undefined : { scale: pinScale, opacity: pinOpacity }}
          className="absolute top-5 right-5 z-10 block size-3 rounded-full bg-ember shadow-[0_0_0_4px_rgb(212_64_42/0.16),0_6px_14px_rgb(0_0_0/0.6)]"
        >
          <span className="absolute inset-0 animate-pulse-ring rounded-full bg-ember/60" />
        </motion.span>

        <div className="flex items-start gap-4">
          <span className="font-display text-[2.6rem] leading-none text-bone/85 tabular-nums">
            {step.number}
          </span>
          <div className="mt-1 h-px flex-1 bg-gradient-to-r from-bone/20 to-transparent" />
        </div>

        <h3 className="mt-4 font-sans text-[1.02rem] font-medium tracking-tight text-bone">
          {step.title}
        </h3>
        <p className="mt-2.5 text-[0.88rem] leading-relaxed text-muted">{step.body}</p>

        <SmartImage
          photoId={step.photoId}
          alt=""
          width={520}
          height={230}
          sizes="(max-width: 1024px) 90vw, 30vw"
          className="mt-5 aspect-[16/7] w-full rounded-xl border border-bone/8 lg:aspect-auto lg:min-h-0 lg:flex-1"
          imgClassName="grayscale-[45%] opacity-85"
        />
      </article>
    </motion.li>
  )
}
