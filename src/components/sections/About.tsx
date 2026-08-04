import { differentials, studio, studioShots } from '@/data/studio'
import { SmartImage } from '@/components/ui/SmartImage'
import { Reveal, RevealWords } from '@/components/ui/Reveal'

const STATS = [
  { value: '11', label: 'anos de estúdio' },
  { value: '4', label: 'artistas residentes' },
  { value: '2.4k', label: 'sessões realizadas' },
]

export function About() {
  return (
    <section id="sobre" className="relative scroll-mt-24 px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto grid max-w-[80rem] gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-16">
        {/* Portrait column */}
        <div className="relative">
          <Reveal direction="right">
            <div className="relative">
              <SmartImage
                photoId={studioShots.interiorWarm}
                alt="Interior do Studio Junior Tattoo, com quadros e macas"
                width={620}
                height={780}
                sizes="(max-width: 1024px) 90vw, 34vw"
                className="aspect-[4/5] w-full rounded-2xl border border-bone/10"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-ink via-ink/10 to-transparent"
              />

              {/* Display name bleeding off the bottom edge, like the reference */}
              <span className="pointer-events-none absolute -bottom-5 -left-2 font-display text-[clamp(2.6rem,7vw,4.6rem)] leading-none text-bone drop-shadow-[0_6px_24px_rgb(0_0_0/0.85)] sm:-left-6">
                Studio Junior
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.15} className="mt-12 hidden lg:block">
            <div className="relative">
              <SmartImage
                photoId={studioShots.roomDark}
                alt="Sala de tatuagem em luz baixa"
                width={620}
                height={400}
                sizes="34vw"
                className="aspect-[16/10] w-full rounded-2xl border border-bone/10"
              />
            </div>
          </Reveal>
        </div>

        {/* Copy column */}
        <div className="flex flex-col justify-center">
          <Reveal>
            <p className="eyebrow">Sobre nós</p>
          </Reveal>

          <h2 className="mt-4 text-[clamp(2.4rem,6vw,4.2rem)] leading-[0.95] text-bone">
            <RevealWords text="Feito à mão," className="block" emberWords={['mão']} />
            <RevealWords text="em Aracaju." className="block italic text-dust" delay={0.15} />
          </h2>

          <Reveal delay={0.1}>
            <p className="mt-7 max-w-xl text-[0.98rem] leading-relaxed text-dust">
              O Studio Junior nasceu em {studio.founded}, numa sala pequena no Grageru, com uma
              máquina e uma lista de espera feita de amigos. Hoje somos quatro artistas dividindo o
              mesmo espaço e a mesma teimosia: nada sai daqui que a gente não assinaria embaixo.
            </p>
          </Reveal>

          <ul className="mt-8 space-y-px">
            {differentials.map((item, i) => (
              <Reveal key={item.title} delay={0.08 * i}>
                <li className="group flex gap-5 border-t border-bone/8 py-5">
                  <span className="mt-1 font-display text-lg text-ember tabular-nums">
                    0{i + 1}
                  </span>
                  <div>
                    <h3 className="font-sans text-[0.95rem] font-medium tracking-tight text-bone">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 max-w-md text-[0.88rem] leading-relaxed text-muted">
                      {item.body}
                    </p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={0.2}>
            <ul className="mt-10 grid grid-cols-3 gap-4 border-t border-bone/8 pt-8">
              {STATS.map((stat) => (
                <li key={stat.label}>
                  <span className="block font-display text-[2.2rem] leading-none text-bone">
                    {stat.value}
                  </span>
                  <span className="mt-2 block text-[0.72rem] leading-tight text-muted">
                    {stat.label}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
