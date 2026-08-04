import { useRef } from 'react'
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import type { MotionValue } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { heroPieces, studio } from '@/data/studio'
import { photo, photoSrcSet } from '@/lib/images'
import { Link } from '@/lib/router'
import { buttonStyles } from '@/components/ui/Button'
import { useHasFinePointer } from '@/hooks'
import { cn, isEmberWord } from '@/lib/utils'

export function Hero() {
  const reduced = useReducedMotion()
  const fine = useHasFinePointer()
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  // The whole fan drifts up and dissolves as you scroll past it.
  const fanY = useTransform(scrollYProgress, [0, 1], ['0%', '-24%'])
  const fanOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0])
  const copyY = useTransform(scrollYProgress, [0, 1], ['0%', '38%'])

  // Pointer parallax, spring-smoothed so it glides instead of snapping.
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const px = useSpring(pointerX, { stiffness: 60, damping: 20, mass: 0.6 })
  const py = useSpring(pointerY, { stiffness: 60, damping: 20, mass: 0.6 })

  function handlePointerMove(event: React.PointerEvent<HTMLElement>) {
    if (!fine || reduced) return
    const rect = event.currentTarget.getBoundingClientRect()
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5)
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5)
  }

  return (
    <section
      ref={sectionRef}
      id="inicio"
      onPointerMove={handlePointerMove}
      onPointerLeave={() => {
        pointerX.set(0)
        pointerY.set(0)
      }}
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-5 pt-24 pb-24 sm:px-8 sm:pt-28"
    >
      <BackdropGlow />

      <motion.div
        style={reduced ? undefined : { y: copyY }}
        className="relative z-20 mx-auto max-w-3xl text-center"
      >
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7 }}
          className="eyebrow"
        >
          Aracaju · Sergipe · desde {studio.founded}
        </motion.p>

        <h1 className="mt-5 text-[clamp(2.6rem,9vw,5.5rem)] leading-[0.92] text-bone">
          <HeroLine text="A tatuagem que" delay={0.25} emberWords={['tatuagem']} />
          <HeroLine text="você não vai" delay={0.35} />
          <HeroLine text="se arrepender." delay={0.45} italic />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="mx-auto mt-6 max-w-md text-[0.95rem] leading-relaxed text-dust"
        >
          {studio.intro}
        </motion.p>
      </motion.div>

      {/* Fanned-out work — the visual spine of the section. */}
      <motion.div
        style={reduced ? undefined : { y: fanY, opacity: fanOpacity }}
        className="relative z-10 mt-8 flex w-full max-w-[80rem] justify-center sm:mt-12"
      >
        <div
          className="flex items-end justify-center"
          style={{ perspective: '1400px' }}
          aria-hidden
        >
          {heroPieces.map((id, i) => (
            <FanCard
              key={id}
              photoId={id}
              index={i}
              total={heroPieces.length}
              px={px}
              py={py}
              reduced={Boolean(reduced)}
            />
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.95, duration: 0.8 }}
        className="relative z-20 mt-9 flex flex-col items-center gap-3 sm:flex-row"
      >
        <Link to="/agendar?modo=agendar" className={buttonStyles('primary', 'lg', 'w-64 sm:w-auto')}>
          Agendar sessão
          <ArrowUpRight
            size={16}
            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </Link>
        <Link to="/galeria" className={buttonStyles('outline', 'lg', 'w-64 sm:w-auto')}>
          Ver os trabalhos
        </Link>
      </motion.div>

      <ScrollCue />
    </section>
  )
}

function HeroLine({
  text,
  delay,
  italic,
  emberWords,
}: {
  text: string
  delay: number
  italic?: boolean
  emberWords?: readonly string[]
}) {
  const words = text.split(' ')

  return (
    <span className="block overflow-hidden">
      <motion.span
        initial={{ y: '108%' }}
        animate={{ y: '0%' }}
        transition={{ delay, duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className={cn('block', italic && 'italic text-dust')}
      >
        {emberWords
          ? words.map((word, i) => (
              <span
                key={`${word}-${i}`}
                className={isEmberWord(word, emberWords) ? 'text-ember-bright' : undefined}
              >
                {word}
                {i < words.length - 1 ? ' ' : ''}
              </span>
            ))
          : text}
      </motion.span>
    </span>
  )
}

type FanCardProps = {
  photoId: string
  index: number
  total: number
  px: MotionValue<number>
  py: MotionValue<number>
  reduced: boolean
}

function FanCard({ photoId, index, total, px, py, reduced }: FanCardProps) {
  // -1 (far left) … 0 (centre) … 1 (far right)
  const t = (index - (total - 1) / 2) / ((total - 1) / 2)
  const rotate = t * 13
  const lift = Math.abs(t) ** 1.7 * 40
  const depth = 1 - Math.abs(t) * 0.45

  const x = useTransform(px, (v) => v * 46 * depth)
  const y = useTransform(py, (v) => v * 26 * depth)

  // The outermost pair is dead weight on a phone — drop it under `sm`.
  const hideOnMobile = Math.abs(t) > 0.66

  return (
    <motion.div
      initial={{ opacity: 0, y: 90, rotate: 0, scale: 0.85 }}
      animate={{ opacity: 1, y: lift, rotate, scale: 1 }}
      transition={{
        delay: 0.5 + Math.abs(t) * 0.12,
        duration: 1.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={reduced ? undefined : { x, translateY: y }}
      className={cn(
        '-mx-3 shrink-0 sm:-mx-4',
        hideOnMobile && 'hidden sm:block',
        Math.abs(t) > 0.99 && 'hidden md:block',
      )}
    >
      <div
        className="relative overflow-hidden rounded-xl border border-bone/12 bg-ash shadow-[0_30px_70px_-24px_rgb(0_0_0/0.95)]"
        style={{
          width: 'clamp(5.25rem, 11.5vw, 9.5rem)',
          aspectRatio: '3 / 4.2',
          zIndex: Math.round(10 - Math.abs(t) * 8),
        }}
      >
        <img
          src={photo(photoId, { w: 260, h: 364 })}
          srcSet={photoSrcSet(photoId, { w: 260, h: 364 })}
          sizes="(max-width: 640px) 30vw, 15vw"
          alt=""
          width={260}
          height={364}
          loading={Math.abs(t) < 0.5 ? 'eager' : 'lazy'}
          fetchPriority={Math.abs(t) < 0.35 ? 'high' : 'auto'}
          decoding="async"
          className="size-full object-cover"
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `linear-gradient(${t * 40 + 180}deg, transparent 35%, rgb(5 5 6 / ${0.25 + Math.abs(t) * 0.4}))`,
          }}
        />
      </div>
    </motion.div>
  )
}

function BackdropGlow() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-0">
      {/* Static: this is a 120vw layer sitting in the LCP viewport — animating
          it competed with the hero's own entrance for compositor budget. */}
      <div
        className="absolute top-[8%] left-1/2 h-[46vh] w-[120vw] -translate-x-1/2 opacity-70"
        style={{
          background: 'radial-gradient(60% 50% at 50% 50%, rgb(38 38 46 / 0.9), transparent 70%)',
        }}
      />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-ink to-transparent" />
    </div>
  )
}

/** Only rendered on viewports tall enough that it can't collide with the CTAs. */
function ScrollCue() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5, duration: 1 }}
      className="pointer-events-none absolute bottom-5 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-2 [@media(min-height:820px)]:sm:flex"
      aria-hidden
    >
      <span className="eyebrow text-[0.6rem]">Role</span>
      <span className="relative block h-10 w-px overflow-hidden bg-bone/15">
        {/* CSS keyframes rather than a motion loop: an infinite JS animation
            keeps a rAF alive for the whole session. */}
        <span className="absolute inset-x-0 top-0 h-4 animate-scan bg-ember" />
      </span>
    </motion.div>
  )
}
