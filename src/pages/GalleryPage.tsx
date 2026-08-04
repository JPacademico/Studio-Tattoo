import { gallery, artists } from '@/data/studio'
import { Artists } from '@/components/sections/Artists'
import { Gallery } from '@/components/sections/Gallery'
import { FinalCta } from '@/components/layout/Footer'
import { Reveal, RevealWords } from '@/components/ui/Reveal'
import { NeedleDivider } from '@/components/ui/Atmosphere'
import { TattooMachineIcon } from '@/components/ui/TattooMachineIcon'

const STATS = [
  { value: String(gallery.length), label: 'peças no mural' },
  { value: String(artists.length), label: 'artistas residentes' },
  { value: '7', label: 'estilos atendidos' },
]

export function GalleryPage() {
  return (
    <main id="conteudo">
      <section className="relative px-5 pt-32 pb-4 sm:px-8 sm:pt-40">
        <div className="mx-auto max-w-[80rem]">
          {/* pr-* reserves a column on the right the headline text can never
              wrap into, so the icon has guaranteed empty space to sit in at
              every breakpoint instead of relying on the headline happening
              to be short enough. */}
          <div className="relative pr-16 sm:pr-24 md:pr-32 lg:pr-40">
            <Reveal>
              <p className="eyebrow">Galeria</p>
            </Reveal>

            <TattooMachineIcon
              className="pointer-events-auto absolute top-0 right-0 size-12 opacity-90 transition-opacity duration-300 hoverable:hover:opacity-100 sm:size-20 md:size-28 lg:size-36"
            />

            <h1 className="mt-5 text-[clamp(2.6rem,8vw,5.5rem)] leading-[0.92] text-bone">
              <RevealWords text="O trabalho" className="block" />
              <RevealWords text="na pele." className="block italic text-dust" delay={0.12} />
            </h1>
          </div>

          <Reveal delay={0.1}>
            <ul className="mt-8 flex gap-8">
              {STATS.map((stat) => (
                <li key={stat.label}>
                  <span className="block font-display text-[2.2rem] leading-none text-bone">
                    {stat.value}
                  </span>
                  <span className="mt-2 block max-w-24 text-[0.7rem] leading-tight text-muted">
                    {stat.label}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>

          <NeedleDivider className="mt-14 w-full text-bone/15" />
        </div>
      </section>

      <Artists />
      <Gallery />
      <FinalCta />
    </main>
  )
}
