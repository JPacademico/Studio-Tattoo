import { ArrowUpRight, CalendarDays } from 'lucide-react'
import { artists } from '@/data/studio'
import type { Artist } from '@/types'
import { SmartImage } from '@/components/ui/SmartImage'
import { Reveal, RevealWords, useReveal } from '@/components/ui/Reveal'
import { InstagramIcon, WhatsAppIcon } from '@/components/ui/BrandIcons'
import { Link } from '@/lib/router'
import { cn, waLink } from '@/lib/utils'

export function Artists() {
  return (
    <section
      id="artistas"
      className="relative scroll-mt-24 px-5 pt-16 pb-14 sm:px-8 sm:pt-20 sm:pb-16"
    >
      <div className="mx-auto max-w-[80rem]">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Reveal>
              <p className="eyebrow">Quem tatua</p>
            </Reveal>
            <h2 className="mt-4 text-[clamp(2.2rem,5.5vw,3.6rem)] leading-[0.95] text-bone">
              <RevealWords text="Quatro mãos," className="block" />
              <RevealWords text="quatro traços." className="block italic text-dust" delay={0.12} />
            </h2>
          </div>

          <Reveal delay={0.1}>
            <p className="max-w-xs text-[0.88rem] leading-relaxed text-muted sm:text-right">
              Cada artista tem agenda e estilo próprios. Escolha quem combina com a sua ideia — ou
              mande mensagem e a gente indica.
            </p>
          </Reveal>
        </div>

        {/* Snap-scroll carousel on phones, grid from md up. */}
        <div className="mt-12 -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:-mx-8 sm:px-8 md:mx-0 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 lg:grid-cols-4">
          {artists.map((artist, i) => (
            <ArtistCard key={artist.id} artist={artist} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ArtistCard({ artist, index }: { artist: Artist; index: number }) {
  const { ref, shown } = useReveal<HTMLElement>(0.15)

  return (
    <article
      ref={ref}
      style={{ transitionDelay: `${index * 0.08}s` }}
      className={cn(
        'sjt-reveal group relative w-[78vw] shrink-0 snap-start overflow-hidden rounded-2xl border border-bone/10 bg-coal/60 sm:w-[19rem] md:w-auto',
        shown && 'is-visible',
      )}
    >
      <div className="relative overflow-hidden">
        <SmartImage
          photoId={artist.photoId}
          alt={`${artist.name}, ${artist.role}`}
          width={420}
          height={520}
          sizes="(max-width: 768px) 78vw, 22vw"
          className="aspect-[4/5] w-full"
          imgClassName="transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-coal via-coal/25 to-transparent"
        />

        <span className="absolute top-3 left-3 rounded-full border border-bone/15 bg-ink/70 px-2.5 py-1 text-[0.65rem] tracking-wider text-dust backdrop-blur-sm">
          desde {artist.since}
        </span>

        <div className="absolute inset-x-4 bottom-4">
          <h3 className="font-display text-[1.6rem] leading-none text-bone">{artist.name}</h3>
          <p className="mt-1.5 text-[0.72rem] tracking-wide text-ember-bright">{artist.role}</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-4">
        <p className="text-[0.83rem] leading-relaxed text-muted">{artist.bio}</p>

        <ul className="flex flex-wrap gap-1.5">
          {artist.specialties.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-bone/10 bg-bone/[0.04] px-2.5 py-1 text-[0.68rem] text-dust"
            >
              {tag}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex items-center gap-2 border-t border-bone/8 pt-3">
          <Link
            to={`/agendar?modo=agendar&artista=${artist.id}`}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-bone/[0.07] px-3 py-2.5 text-[0.75rem] font-medium text-bone ring-1 ring-bone/10 transition-colors hoverable:hover:bg-bone hoverable:hover:text-ink"
          >
            <CalendarDays size={13} />
            Ver agenda
          </Link>

          <a
            href={waLink(
              artist.whatsapp,
              `Olá, ${artist.name.split(' ')[0]}! Vi seu trabalho no site do Studio Junior e queria planejar uma tatuagem.`,
            )}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Falar com ${artist.name} no WhatsApp`}
            className="grid size-9 shrink-0 place-items-center rounded-full border border-bone/12 text-dust transition-colors hoverable:hover:border-ember hoverable:hover:text-ember-bright"
          >
            <WhatsAppIcon size={15} />
          </a>

          <a
            href={`https://instagram.com/${artist.instagram}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Instagram de ${artist.name}`}
            className="grid size-9 shrink-0 place-items-center rounded-full border border-bone/12 text-dust transition-colors hoverable:hover:border-bone/40 hoverable:hover:text-bone"
          >
            <InstagramIcon size={15} />
          </a>
        </div>
      </div>

      <ArrowUpRight
        size={14}
        aria-hidden
        className="pointer-events-none absolute top-3 right-3 text-bone/0 transition-colors duration-300 group-hover:text-bone/60"
      />
    </article>
  )
}
