import { gallery, artists } from '@/data/studio'
import { Artists } from '@/components/sections/Artists'
import { Gallery } from '@/components/sections/Gallery'
import { FinalCta } from '@/components/layout/Footer'
import { Reveal, RevealWords } from '@/components/ui/Reveal'
import { NeedleDivider } from '@/components/ui/Atmosphere'

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
          <Reveal>
            <p className="eyebrow">Galeria</p>
          </Reveal>

          <h1 className="mt-5 text-[clamp(2.6rem,8vw,5.5rem)] leading-[0.92] text-bone">
            <RevealWords text="O trabalho" className="block" />
            <RevealWords text="na pele." className="block italic text-dust" delay={0.12} />
          </h1>

          <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <Reveal delay={0.1}>
              <p className="max-w-xl text-[0.98rem] leading-relaxed text-dust">
                Peças fechadas no estúdio, do blackwork pesado ao traço fino. Cada foto é de um
                cliente real, com a pele já cicatrizada — é assim que a tatuagem vai continuar
                parecendo daqui a alguns anos.
              </p>
            </Reveal>

            <Reveal delay={0.16}>
              <ul className="flex gap-8">
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
          </div>

          <NeedleDivider className="mt-14 w-full text-bone/15" />
        </div>
      </section>

      <Artists />
      <Gallery />
      <FinalCta />
    </main>
  )
}
