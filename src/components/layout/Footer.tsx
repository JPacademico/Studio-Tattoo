import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { studio } from '@/data/studio'
import { Link } from '@/lib/router'
import { buttonStyles } from '@/components/ui/Button'
import { Reveal, RevealWords } from '@/components/ui/Reveal'
import { InstagramIcon, WhatsAppIcon } from '@/components/ui/BrandIcons'
import { waLink } from '@/lib/utils'

export function FinalCta() {
  return (
    <section className="relative overflow-hidden px-5 py-24 sm:px-8 sm:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-bone/15 to-transparent"
      />

      <div className="mx-auto flex max-w-[80rem] flex-col items-center gap-9 text-center">
        <h2 className="text-[clamp(2.4rem,7vw,5rem)] leading-[0.94] text-bone">
          <RevealWords text="Vamos criar algo" className="block" emberWords={['criar']} />
          <RevealWords text="permanente." className="block italic text-dust" delay={0.14} />
        </h2>

        <Reveal delay={0.15}>
          <p className="max-w-lg text-[0.95rem] leading-relaxed text-muted">
            Atendemos só com hora marcada. Conte sua ideia e a gente desenha uma peça feita pra
            durar a vida toda.
          </p>
        </Reveal>

        <Reveal delay={0.22}>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link to="/agendar?modo=agendar" className={buttonStyles('primary', 'lg', 'w-64 sm:w-auto')}>
              Agendar sessão
              <ArrowUpRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
            <Link to="/agendar?modo=planejar" className={buttonStyles('outline', 'lg', 'w-64 sm:w-auto')}>
              Só quero planejar
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export function Footer() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  const wordmarkY = useTransform(scrollYProgress, [0, 1], ['22%', '0%'])

  return (
    <footer
      ref={ref}
      className="relative overflow-hidden border-t border-bone/8 bg-void pt-16 pb-[max(1.5rem,env(safe-area-inset-bottom))]"
    >
      <div className="mx-auto max-w-[80rem] px-5 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <p className="font-display text-2xl text-bone">{studio.name}</p>
            <p className="mt-3 max-w-xs text-[0.85rem] leading-relaxed text-muted">
              {studio.intro}
            </p>

            <div className="mt-6 flex gap-2">
              <a
                href={waLink(studio.whatsapp, 'Olá! Vim pelo site do Studio Junior Tattoo.')}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp do estúdio"
                className="grid size-10 place-items-center rounded-full border border-ember/30 bg-ember/[0.06] text-ember transition-colors hoverable:hover:border-ember hoverable:hover:text-ember-bright"
              >
                <WhatsAppIcon size={17} />
              </a>
              <a
                href={`https://instagram.com/${studio.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram do estúdio"
                className="grid size-10 place-items-center rounded-full border border-ember/30 bg-ember/[0.06] text-ember transition-colors hoverable:hover:border-ember hoverable:hover:text-ember-bright"
              >
                <InstagramIcon size={17} />
              </a>
            </div>
          </div>

          <nav aria-label="Navegação do rodapé">
            <p className="eyebrow">Navegar</p>
            <ul className="mt-4 space-y-2.5">
              {[
                { label: 'Sobre nós', to: '/#sobre' },
                { label: 'Galeria', to: '/galeria' },
                { label: 'Processo', to: '/#processo' },
                { label: 'Dúvidas', to: '/#faq' },
                { label: 'Planejar / Agendar', to: '/agendar' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-[0.85rem] text-dust transition-colors hoverable:hover:text-bone"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="eyebrow">Funcionamento</p>
            <dl className="mt-4 space-y-2">
              {studio.hours.map((h) => (
                <div key={h.days} className="text-[0.85rem]">
                  <dt className="text-dust">{h.days}</dt>
                  <dd className="text-muted tabular-nums">{h.time}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-bone/8 pt-6 text-[0.72rem] text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {studio.name}. Todos os direitos reservados.
          </p>
          <p>
            Protótipo — dados e imagens são fictícios.{' '}
            <span className="text-muted/70">Aracaju, Sergipe.</span>
          </p>
        </div>
      </div>

      {/* Oversized wordmark bleeding off the bottom edge */}
      <motion.p
        aria-hidden
        style={reduced ? undefined : { y: wordmarkY }}
        className="pointer-events-none mt-8 w-full text-center font-display text-[clamp(3rem,15.5vw,15rem)] leading-[0.8] tracking-[-0.02em] whitespace-nowrap text-bone/[0.07] select-none"
      >
        STUDIO JUNIOR
      </motion.p>
    </footer>
  )
}
