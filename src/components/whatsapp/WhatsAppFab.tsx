import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { artists, studio } from '@/data/studio'
import { SmartImage } from '@/components/ui/SmartImage'
import { WhatsAppIcon } from '@/components/ui/BrandIcons'
import { waLink } from '@/lib/utils'

/**
 * Fixed WhatsApp launcher for the home page. Bottom-left, not bottom-right —
 * the toast viewport already lives at bottom-right (bottom-6 on desktop) and
 * would otherwise stack on top of this.
 */
export function WhatsAppFab() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <div className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-4 z-[140] sm:left-6">
      <AnimatePresence>
        {open && (
          <>
            {/* No backdrop-blur here: filtering the entire viewport every frame
                of the open/close spring is what caused the jank — a plain
                dimming layer reads almost the same and costs nothing to composite. */}
            <motion.button
              key="backdrop"
              type="button"
              aria-label="Fechar"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 -z-10 cursor-default bg-void/45"
            />

            <motion.div
              key="panel"
              role="dialog"
              aria-modal="true"
              aria-label="Escolha quem chamar no WhatsApp"
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.96, transition: { duration: 0.18 } }}
              transition={{ type: 'spring', stiffness: 340, damping: 30 }}
              // bg-coal/97 is already near-opaque, so the backdrop-blur this used
              // to carry was paying full compositing cost for almost no visible
              // difference — dropped for a smoother open animation.
              className="absolute bottom-[3.75rem] left-0 w-[19rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-bone/12 bg-coal shadow-[0_30px_80px_-18px_rgb(0_0_0/0.85)]"
            >
              <div className="flex items-center justify-between border-b border-bone/8 p-4 pb-3">
                <div>
                  <p className="text-[0.9rem] font-medium text-bone">Fale com a gente</p>
                  <p className="mt-0.5 text-[0.72rem] text-muted">Escolha quem quer chamar</p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Fechar"
                  className="grid size-7 shrink-0 place-items-center rounded-full text-muted transition-colors hoverable:hover:bg-bone/10 hoverable:hover:text-bone"
                >
                  <X size={14} />
                </button>
              </div>

              <ul className="max-h-[19rem] overflow-y-auto p-1.5">
                {artists.map((artist) => {
                  const firstName = artist.name.split(' ')[0]
                  return (
                    <li key={artist.id}>
                      <a
                        href={waLink(
                          artist.whatsapp,
                          `Olá, ${firstName}! Vim pelo site do Studio Junior e queria falar sobre uma tatuagem.`,
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 rounded-xl p-2 transition-colors hoverable:hover:bg-bone/[0.06]"
                      >
                        <SmartImage
                          photoId={artist.photoId}
                          alt=""
                          width={88}
                          height={88}
                          className="size-11 shrink-0 rounded-full border border-bone/10"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[0.85rem] text-bone">
                            {artist.name}
                          </span>
                          <span className="block truncate text-[0.7rem] text-muted">
                            {artist.role}
                          </span>
                        </span>
                        <WhatsAppIcon size={16} className="shrink-0 text-[#25D366]" />
                      </a>
                    </li>
                  )
                })}
              </ul>

              <div className="border-t border-bone/8 p-1.5">
                <a
                  href={waLink(
                    studio.whatsapp,
                    'Olá! Vim pelo site do Studio Junior Tattoo e queria falar com vocês.',
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl p-2 transition-colors hoverable:hover:bg-bone/[0.06]"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-full border border-bone/10 bg-bone/[0.04] text-ember">
                    <WhatsAppIcon size={17} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[0.85rem] text-bone">Fale com o estúdio</span>
                    <span className="block truncate text-[0.7rem] text-muted">
                      Ainda não sei com quem falar
                    </span>
                  </span>
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Fechar contatos do WhatsApp' : 'Falar no WhatsApp'}
        aria-expanded={open}
        whileTap={{ scale: 0.92 }}
        className="relative grid size-14 place-items-center rounded-full bg-[#25D366] text-bone shadow-[0_14px_34px_-10px_rgb(0_0_0/0.7)] transition-transform hoverable:hover:scale-105"
      >
        {!open && (
          <span
            aria-hidden
            className="absolute inset-0 rounded-full bg-[#25D366]/60 animate-pulse-ring"
          />
        )}
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="close"
              initial={{ opacity: 0, rotate: -45 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 45 }}
              transition={{ duration: 0.18 }}
              className="grid place-items-center"
            >
              <X size={24} />
            </motion.span>
          ) : (
            <motion.span
              key="icon"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.18 }}
              className="grid place-items-center"
            >
              <WhatsAppIcon size={26} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  )
}
