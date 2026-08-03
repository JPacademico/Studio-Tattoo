import { manifesto, studioShots } from '@/data/studio'
import { photo } from '@/lib/images'
import { NeedleDivider } from '@/components/ui/Atmosphere'
import { useReveal } from '@/components/ui/Reveal'
import { cn } from '@/lib/utils'

export function Manifesto() {
  const { ref, shown } = useReveal<HTMLQuoteElement>(0.4)
  const words = manifesto.split(' ')

  return (
    <section className="relative overflow-hidden px-5 py-24 sm:px-8 sm:py-32">
      {/* Barely-there backdrop so the quote sits on texture, not flat black. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage: `url(${photo(studioShots.signDark, { w: 1200, h: 600, q: 40 })})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          maskImage: 'radial-gradient(70% 60% at 50% 50%, black, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(70% 60% at 50% 50%, black, transparent 75%)',
        }}
      />

      <div className="relative mx-auto max-w-4xl text-center">
        <NeedleDivider className="mx-auto mb-12 w-40 text-bone/20" />

        <blockquote
          ref={ref}
          className={cn(
            'sjt-fade font-display text-[clamp(1.5rem,3.6vw,2.5rem)] leading-[1.25] text-bone',
            shown && 'is-visible',
          )}
        >
          {words.map((word, i) => (
            <span
              key={`${word}-${i}`}
              className="sjt-fadeword"
              style={{ transitionDelay: `${i * 0.035}s` }}
            >
              {word}&nbsp;
            </span>
          ))}
        </blockquote>

        <p className="eyebrow mt-8">Junior Alves · fundador</p>

        <NeedleDivider className="mx-auto mt-12 w-40 text-bone/20" />
      </div>
    </section>
  )
}
