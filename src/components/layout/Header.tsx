import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { Link, useLocation } from '@/lib/router'
import { useLockBodyScroll, useScrolled } from '@/hooks'
import { studio } from '@/data/studio'
import { cn, waLink } from '@/lib/utils'
import { buttonStyles } from '@/components/ui/Button'
import { WhatsAppIcon } from '@/components/ui/BrandIcons'
import { Wordmark } from './Logo'

type NavItem = {
  label: string
  to: string
  /** Set for in-page anchors on the home page — drives the scroll-spy. */
  hash?: string
  /** Set for standalone routes — active purely from the pathname. */
  route?: string
}

const NAV: NavItem[] = [
  { label: 'Sobre nós', to: '/#sobre', hash: 'sobre' },
  { label: 'Galeria', to: '/galeria', route: '/galeria' },
  { label: 'Processo', to: '/#processo', hash: 'processo' },
  { label: 'Onde estamos', to: '/#contato', hash: 'contato' },
]

// Module-level so the identity is stable: passing a fresh array into
// useActiveSection would tear down and rebuild the observer every render.
const SECTION_IDS = NAV.flatMap((item) => (item.hash ? [item.hash] : []))

/** Highlights the nav item whose section currently owns the viewport. */
function useActiveSection(ids: string[], enabled: boolean): string | null {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    if (!enabled) {
      setActive(null)
      return
    }

    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el))

    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id)
      },
      // Band across the middle of the screen: whichever section sits there wins.
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.1, 0.5, 1] },
    )

    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [ids, enabled])

  return active
}

export function Header() {
  const scrolled = useScrolled(24)
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const isHome = pathname === '/'

  const active = useActiveSection(SECTION_IDS, isHome)

  const isCurrent = (item: NavItem) =>
    item.route ? pathname.replace(/\/+$/, '') === item.route : isHome && active === item.hash

  useLockBodyScroll(menuOpen)

  // Any route change closes the sheet.
  useEffect(() => setMenuOpen(false), [pathname])

  // Escape is expected to close an overlay.
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[300] focus:rounded-full focus:bg-bone focus:px-4 focus:py-2 focus:text-sm focus:text-ink"
      >
        Pular para o conteúdo
      </a>

      <header
        className={cn(
          'fixed inset-x-0 top-0 z-[110] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
          'pt-[env(safe-area-inset-top)]',
          // Lighter blur than it looks like it needs: the header is always on
          // screen, and backdrop-filter is re-evaluated every scroll frame.
          // A more opaque background buys back the same legibility for free.
          scrolled || !isHome
            ? 'border-b border-bone/8 bg-ink/85 backdrop-blur-md'
            : 'border-b border-transparent bg-transparent',
        )}
      >
        <div className="mx-auto flex h-16 max-w-[86rem] items-center justify-between gap-4 px-5 sm:h-[4.5rem] sm:px-8">
          <Link to="/" aria-label="Studio Junior Tattoo — início" className="shrink-0">
            <Wordmark />
          </Link>

          <nav aria-label="Seções do site" className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) => {
              const isActive = isCurrent(item)
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'relative rounded-full px-4 py-2 text-[0.82rem] font-normal transition-colors duration-300',
                    isActive ? 'text-bone' : 'text-dust hoverable:hover:text-bone',
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-bone/[0.08] ring-1 ring-bone/10"
                      transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                    />
                  )}
                  <span className="relative">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={waLink(studio.whatsapp, 'Olá! Vim pelo site do Studio Junior Tattoo.')}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Falar no WhatsApp"
              className="hidden size-10 place-items-center rounded-full border border-bone/15 text-dust transition-colors hoverable:hover:border-bone/40 hoverable:hover:text-bone sm:grid"
            >
              <WhatsAppIcon size={17} />
            </a>

            {/* Wrapper does the hiding: a `hidden` passed into buttonStyles would
                collide with the button's own `inline-flex` in the same layer. */}
            <div className="hidden sm:block">
              <Link to="/agendar" className={buttonStyles('primary', 'sm')}>
                Planejar / Agendar
                <ArrowUpRight
                  size={14}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </div>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menu"
              aria-expanded={menuOpen}
              className="grid size-10 place-items-center rounded-full border border-bone/15 text-bone transition-colors hoverable:hover:bg-bone/10 lg:hidden"
            >
              <Menu size={18} />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="menu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28 }}
          className="fixed inset-0 z-[130] lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navegação"
        >
          <motion.div
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 bg-ink"
          >
            <div className="absolute inset-0 grain-overlay opacity-[0.06]" aria-hidden />
            <div
              aria-hidden
              className="absolute -top-24 left-1/2 size-[80vmin] -translate-x-1/2 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgb(212 64 42 / 0.13), transparent 65%)',
              }}
            />

            <div className="relative flex h-full flex-col pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
              <div className="flex h-16 items-center justify-between px-5">
                <Wordmark />
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Fechar menu"
                  className="grid size-10 place-items-center rounded-full border border-bone/15 text-bone"
                >
                  <X size={18} />
                </button>
              </div>

              <nav className="flex flex-1 flex-col justify-center px-6" aria-label="Menu principal">
                <ul className="space-y-1">
                  {NAV.map((item, i) => (
                    <motion.li
                      key={item.label}
                      initial={{ opacity: 0, y: 26 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.18 + i * 0.07, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <Link
                        to={item.to}
                        onClick={onClose}
                        className="flex items-baseline justify-between border-b border-bone/8 py-4 font-display text-[2.4rem] leading-none text-bone"
                      >
                        {item.label}
                        <span className="eyebrow text-muted">
                          0{i + 1}
                        </span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>

                <motion.div
                  initial={{ opacity: 0, y: 26 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-9 flex flex-col gap-3"
                >
                  <Link
                    to="/agendar"
                    onClick={onClose}
                    className={buttonStyles('primary', 'lg', 'w-full')}
                  >
                    Planejar / Agendar
                    <ArrowUpRight size={16} />
                  </Link>
                  <a
                    href={waLink(studio.whatsapp, 'Olá! Vim pelo site do Studio Junior Tattoo.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonStyles('outline', 'lg', 'w-full')}
                  >
                    <WhatsAppIcon size={17} />
                    Chamar no WhatsApp
                  </a>
                </motion.div>
              </nav>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.62 }}
                className="px-6 pb-6 text-center text-[0.72rem] text-muted"
              >
                {studio.address.street} · {studio.address.district} · {studio.address.city}/
                {studio.address.state}
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
