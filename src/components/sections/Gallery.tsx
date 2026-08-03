import { useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { artistById, artists, gallery } from '@/data/studio'
import type { GalleryPiece } from '@/types'
import { SmartImage } from '@/components/ui/SmartImage'
import { Reveal, RevealWords } from '@/components/ui/Reveal'
import { cn } from '@/lib/utils'
import { Lightbox } from './Lightbox'

const FILTERS = [{ id: 'all', label: 'Todos' }, ...artists.map((a) => ({ id: a.id, label: a.name.split(' ')[0] }))]

export function Gallery() {
  const [filter, setFilter] = useState('all')
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const reduced = useReducedMotion()

  const pieces = useMemo(
    () => (filter === 'all' ? gallery : gallery.filter((p) => p.artistId === filter)),
    [filter],
  )

  return (
    // Extra gutter on top of the usual page padding: the polaroids are rotated
    // and their sticky notes hang off the edge, so they need room to breathe.
    <section
      id="galeria"
      className="relative scroll-mt-24 px-8 pt-10 pb-24 sm:px-12 sm:pt-12 sm:pb-28"
    >
      <div className="mx-auto max-w-[78rem]">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Reveal>
              <p className="eyebrow">Galeria</p>
            </Reveal>
            <h2 className="mt-4 text-[clamp(2.2rem,5.5vw,3.6rem)] leading-[0.95] text-bone">
              <RevealWords text="No mural" className="block" />
              <RevealWords text="do estúdio" className="block italic text-dust" delay={0.12} />
            </h2>
          </div>

          <Reveal delay={0.1}>
            <div
              role="group"
              aria-label="Filtrar galeria por artista"
              className="flex flex-wrap gap-1.5"
            >
              {FILTERS.map((f) => {
                const isActive = filter === f.id
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFilter(f.id)}
                    aria-pressed={isActive}
                    className={cn(
                      'relative rounded-full px-3.5 py-1.5 text-[0.76rem] transition-colors duration-300',
                      isActive ? 'text-ink' : 'text-dust hoverable:hover:text-bone',
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="gallery-filter"
                        className="absolute inset-0 rounded-full bg-bone"
                        transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                      />
                    )}
                    <span className="relative">{f.label}</span>
                  </button>
                )
              })}
            </div>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-7 sm:gap-y-14 lg:grid-cols-4 lg:gap-x-9">
          <AnimatePresence mode="popLayout" initial={false}>
            {pieces.map((piece, i) => (
              <Polaroid
                key={piece.id}
                piece={piece}
                index={i}
                reduced={Boolean(reduced)}
                onOpen={() => setOpenIndex(i)}
              />
            ))}
          </AnimatePresence>
        </div>

        {pieces.length === 0 && (
          <p className="mt-16 text-center text-sm text-muted">
            Nenhuma peça publicada por aqui ainda.
          </p>
        )}
      </div>

      <Lightbox
        pieces={pieces}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onNavigate={setOpenIndex}
      />
    </section>
  )
}

type PolaroidProps = {
  piece: GalleryPiece
  index: number
  reduced: boolean
  onOpen: () => void
}

function Polaroid({ piece, index, reduced, onOpen }: PolaroidProps) {
  const artist = artistById(piece.artistId)
  // Stagger the columns vertically so the wall reads as pinned, not gridded.
  const columnLift = [0, 42, 14, 58][index % 4]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40, rotate: 0, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, rotate: reduced ? 0 : piece.tilt, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.22 } }}
      transition={{ duration: 0.75, delay: (index % 6) * 0.05, ease: [0.16, 1, 0.3, 1] }}
      whileHover={reduced ? undefined : { rotate: 0, y: -10, scale: 1.035, zIndex: 20 }}
      style={{ marginTop: columnLift }}
      className="relative"
    >
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Ampliar: ${piece.alt}, por ${artist?.name ?? 'artista do estúdio'}`}
        className="group block w-full cursor-zoom-in text-left"
      >
        <div className="paper relative rounded-[3px] p-2 pb-9 shadow-[0_22px_45px_-18px_rgb(0_0_0/0.9)] sm:p-2.5 sm:pb-11">
          <Tape className="-top-2 -left-2 -rotate-12 sm:-top-2.5 sm:-left-3" />
          <Tape className="-top-2 -right-2 rotate-[8deg] sm:-top-2.5 sm:-right-3" />

          <SmartImage
            photoId={piece.photoId}
            alt={piece.alt}
            width={380}
            height={470}
            sizes="(max-width: 640px) 44vw, (max-width: 1024px) 30vw, 23vw"
            className="aspect-[4/5] w-full bg-neutral-800"
            imgClassName="grayscale-[35%] transition-all duration-700 group-hover:grayscale-0"
          />

          {/* Date only — the bottom-right corner is left clear for the sticky
              note to overlap, the way it does on the real studio wall. The
              artist is surfaced by the filter chips and the lightbox. */}
          <div className="absolute inset-x-3 bottom-2">
            <span className="font-hand font-mediumtext-[1.05rem] leading-none text-neutral-800">
              {piece.date}
            </span>
          </div>
        </div>
      </button>

      {piece.note && (
        <motion.div
          initial={{ opacity: 0, scale: 0.7, rotate: 0 }}
          whileInView={{ opacity: 1, scale: 1, rotate: piece.tilt > 0 ? -11 : 9 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 260, damping: 18 }}
          className="pointer-events-none absolute -right-3 -bottom-4 z-10 grid size-[4.6rem] place-items-center bg-note p-2 shadow-[0_10px_22px_-8px_rgb(0_0_0/0.7)] sm:-right-5 sm:size-[5.4rem]"
        >
          <span className="text-center font-hand font-mediumtext-[0.92rem] leading-[1.05] text-neutral-800 sm:text-[1.05rem]">
            {piece.note}
          </span>
        </motion.div>
      )}
    </motion.div>
  )
}

/** Strip of translucent tape holding the polaroid to the wall. */
function Tape({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        'absolute z-10 h-5 w-12 bg-bone/25 shadow-sm backdrop-blur-[1px] sm:h-7 sm:w-20',
        className,
      )}
      style={{
        maskImage:
          'linear-gradient(to right, transparent, black 6%, black 94%, transparent), linear-gradient(black, black)',
        WebkitMaskImage:
          'linear-gradient(to right, transparent, black 6%, black 94%, transparent), linear-gradient(black, black)',
      }}
    />
  )
}
