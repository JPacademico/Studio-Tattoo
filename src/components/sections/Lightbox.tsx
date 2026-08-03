import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import type { GalleryPiece } from '@/types'
import { artistById } from '@/data/studio'
import { SmartImage } from '@/components/ui/SmartImage'
import { useLockBodyScroll } from '@/hooks'
import { Link } from '@/lib/router'
import { buttonStyles } from '@/components/ui/Button'

type LightboxProps = {
  pieces: GalleryPiece[]
  index: number | null
  onClose: () => void
  onNavigate: (index: number) => void
}

export function Lightbox({ pieces, index, onClose, onNavigate }: LightboxProps) {
  const open = index !== null && index >= 0 && index < pieces.length
  useLockBodyScroll(open)

  useEffect(() => {
    if (!open || index === null) return

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowRight') onNavigate((index + 1) % pieces.length)
      if (event.key === 'ArrowLeft') onNavigate((index - 1 + pieces.length) % pieces.length)
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, index, pieces.length, onClose, onNavigate])

  if (typeof document === 'undefined') return null

  const piece = open ? pieces[index] : null
  const artist = piece ? artistById(piece.artistId) : undefined

  return createPortal(
    <AnimatePresence>
      {open && piece && (
        <motion.div
          key="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={piece.alt}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[180] flex items-center justify-center bg-void/92 backdrop-blur-xl"
          onClick={onClose}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="absolute top-[max(1rem,env(safe-area-inset-top))] right-4 z-10 grid size-11 place-items-center rounded-full border border-bone/15 bg-ink/60 text-bone transition-colors hoverable:hover:bg-bone hoverable:hover:text-ink"
          >
            <X size={18} />
          </button>

          <NavButton
            side="left"
            onClick={() => onNavigate((index! - 1 + pieces.length) % pieces.length)}
          />
          <NavButton side="right" onClick={() => onNavigate((index! + 1) % pieces.length)} />

          <motion.figure
            key={piece.id}
            initial={{ opacity: 0, scale: 0.94, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            onDragEnd={(_, info) => {
              if (info.offset.x < -80) onNavigate((index! + 1) % pieces.length)
              else if (info.offset.x > 80) onNavigate((index! - 1 + pieces.length) % pieces.length)
            }}
            onClick={(event) => event.stopPropagation()}
            className="mx-4 flex max-h-[86svh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-bone/10 bg-coal sm:flex-row"
          >
            <SmartImage
              photoId={piece.photoId}
              alt={piece.alt}
              width={900}
              height={1120}
              sizes="(max-width: 640px) 92vw, 46vw"
              className="max-h-[52svh] w-full shrink-0 sm:max-h-none sm:w-1/2"
            />

            <figcaption className="flex flex-1 flex-col justify-center gap-4 p-6 sm:p-8">
              <div>
                <p className="eyebrow">{piece.style}</p>
                <h3 className="mt-3 font-display text-[2rem] leading-none text-bone">
                  {artist?.name}
                </h3>
                <p className="mt-2 text-[0.78rem] text-muted">{artist?.role}</p>
              </div>

              <p className="text-[0.9rem] leading-relaxed text-dust">{piece.alt}.</p>

              <dl className="grid grid-cols-2 gap-3 border-t border-bone/8 pt-4 text-[0.78rem]">
                <div>
                  <dt className="text-muted">Sessão</dt>
                  <dd className="mt-1 text-bone">{piece.date}</dd>
                </div>
                <div>
                  <dt className="text-muted">Peça</dt>
                  <dd className="mt-1 text-bone">
                    {index! + 1} de {pieces.length}
                  </dd>
                </div>
              </dl>

              <Link
                to={`/agendar?modo=agendar&artista=${piece.artistId}`}
                className={buttonStyles('primary', 'md', 'mt-1 w-full sm:w-auto')}
              >
                Quero algo assim
              </Link>
            </figcaption>
          </motion.figure>

          <p className="absolute bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 text-[0.68rem] text-muted">
            Arraste ou use ← → para navegar
          </p>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

function NavButton({ side, onClick }: { side: 'left' | 'right'; onClick: () => void }) {
  const Icon = side === 'left' ? ChevronLeft : ChevronRight
  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation()
        onClick()
      }}
      aria-label={side === 'left' ? 'Anterior' : 'Próxima'}
      className={`absolute top-1/2 z-10 hidden size-12 -translate-y-1/2 place-items-center rounded-full border border-bone/12 bg-ink/50 text-bone transition-colors hoverable:hover:bg-bone hoverable:hover:text-ink lg:grid ${
        side === 'left' ? 'left-6' : 'right-6'
      }`}
    >
      <Icon size={20} />
    </button>
  )
}
