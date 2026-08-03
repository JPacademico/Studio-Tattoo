import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { artists } from '@/data/studio'
import { formatLongDate, isDayAvailable, startOfToday, toISODate } from '@/lib/availability'
import { SmartImage } from '@/components/ui/SmartImage'
import { cn } from '@/lib/utils'

/** Scans forward for the first bookable day so each card can advertise it. */
function nextOpening(artistId: string): string | null {
  const cursor = startOfToday()
  for (let i = 0; i < 45; i++) {
    if (isDayAvailable(artistId, cursor)) return toISODate(cursor)
    cursor.setDate(cursor.getDate() + 1)
  }
  return null
}

export function ArtistPicker({
  value,
  onChange,
  layoutId = 'artist-selection',
}: {
  value: string | null
  onChange: (id: string) => void
  layoutId?: string
}) {
  const openings = useMemo(
    () => Object.fromEntries(artists.map((a) => [a.id, nextOpening(a.id)])),
    [],
  )

  return (
    <div
      role="radiogroup"
      aria-label="Escolha o artista"
      className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
    >
      {artists.map((artist, i) => {
        const selected = value === artist.id
        const opening = openings[artist.id]

        return (
          <motion.button
            key={artist.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(artist.id)}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              'group relative overflow-hidden rounded-2xl border text-left transition-colors duration-300',
              selected
                ? 'border-bone/40 bg-bone/[0.07]'
                : 'border-bone/10 bg-coal/40 hoverable:hover:border-bone/25',
            )}
          >
            {selected && (
              <motion.span
                layoutId={layoutId}
                transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-ember"
              />
            )}

            <div className="relative">
              <SmartImage
                photoId={artist.photoId}
                alt=""
                width={360}
                height={300}
                sizes="(max-width: 640px) 90vw, 22vw"
                className="aspect-[6/5] w-full"
                imgClassName={cn(
                  'transition-all duration-700',
                  selected ? 'grayscale-0 scale-[1.03]' : 'grayscale-[55%] group-hover:grayscale-0',
                )}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-coal via-coal/20 to-transparent"
              />

              <motion.span
                aria-hidden
                initial={false}
                animate={{
                  scale: selected ? 1 : 0,
                  opacity: selected ? 1 : 0,
                }}
                transition={{ type: 'spring', stiffness: 500, damping: 26 }}
                className="absolute top-3 right-3 grid size-6 place-items-center rounded-full bg-ember text-bone"
              >
                <Check size={13} strokeWidth={3} />
              </motion.span>
            </div>

            <div className="p-4">
              <h3 className="font-display text-[1.35rem] leading-none text-bone">{artist.name}</h3>
              <p className="mt-1.5 text-[0.72rem] text-ember-bright">{artist.role}</p>

              <ul className="mt-3 flex flex-wrap gap-1">
                {artist.specialties.slice(0, 2).map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border border-bone/10 px-2 py-0.5 text-[0.65rem] text-muted"
                  >
                    {tag}
                  </li>
                ))}
              </ul>

              <p className="mt-3 border-t border-bone/8 pt-3 text-[0.72rem] text-muted">
                {opening ? (
                  <>
                    Próxima vaga:{' '}
                    <span className="text-dust">{formatLongDate(opening)}</span>
                  </>
                ) : (
                  'Agenda cheia nos próximos 45 dias'
                )}
              </p>
            </div>
          </motion.button>
        )
      })}
    </div>
  )
}
