import { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, Sparkles } from 'lucide-react'
import { artistById, artists, studio } from '@/data/studio'
import { ArtistPicker } from './ArtistPicker'
import { WhatsAppIcon } from '@/components/ui/BrandIcons'
import { buttonStyles } from '@/components/ui/Button'
import { cn, waLink } from '@/lib/utils'

const UNSURE = 'indeciso'

export function PlanFlow({
  artistId,
  onArtist,
  name,
  onName,
  idea,
  onIdea,
}: {
  artistId: string | null
  onArtist: (id: string) => void
  name: string
  onName: (value: string) => void
  idea: string
  onIdea: (value: string) => void
}) {
  const [touched, setTouched] = useState(false)
  const artist = artistById(artistId)
  const undecided = artistId === UNSURE

  const target = artist?.whatsapp ?? studio.whatsapp
  const greeting = artist ? `Olá, ${artist.name.split(' ')[0]}!` : 'Olá!'

  const message = [
    `${greeting} Vim pelo site do ${studio.name}.`,
    name.trim() ? `Meu nome é ${name.trim()}.` : '',
    idea.trim() ? `\nMinha ideia: ${idea.trim()}` : '\nQueria conversar sobre uma ideia de tatuagem.',
    undecided ? '\nAinda não sei qual artista combina mais com o que eu quero.' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const ready = idea.trim().length > 0 && Boolean(artistId)

  return (
    <div className="space-y-10">
      <section>
        <div className="flex items-baseline gap-3">
          <span className="font-display text-[1.6rem] text-ember">01</span>
          <h2 className="font-sans text-[0.95rem] font-medium text-bone">
            Com quem você quer conversar?
          </h2>
        </div>

        <div className="mt-5">
          <ArtistPicker value={artistId} onChange={onArtist} layoutId="plan-artist" />
        </div>

        <button
          type="button"
          onClick={() => onArtist(UNSURE)}
          aria-pressed={undecided}
          className={cn(
            'mt-3 flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition-colors duration-300',
            undecided
              ? 'border-ember bg-ember/8'
              : 'border-bone/10 bg-coal/40 hoverable:hover:border-bone/25',
          )}
        >
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-bone/[0.06] text-ember">
            <Sparkles size={16} />
          </span>
          <span>
            <span className="block text-[0.88rem] text-bone">Ainda não sei</span>
            <span className="mt-0.5 block text-[0.76rem] text-muted">
              Fale com o estúdio e a gente indica o artista certo para a sua ideia.
            </span>
          </span>
        </button>
      </section>

      <section>
        <div className="flex items-baseline gap-3">
          <span className="font-display text-[1.6rem] text-ember">02</span>
          <h2 className="font-sans text-[0.95rem] font-medium text-bone">Conte a sua ideia</h2>
        </div>

        <div className="mt-5 grid gap-4">
          <div>
            <label htmlFor="plan-nome" className="eyebrow mb-2.5 block">
              Seu nome <span className="text-muted/60">(opcional)</span>
            </label>
            <input
              id="plan-nome"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => onName(e.target.value)}
              placeholder="Como podemos te chamar"
              className="w-full rounded-xl border border-bone/12 bg-coal/50 px-4 py-3 text-[0.92rem] text-bone transition-colors outline-none placeholder:text-muted/70 focus:border-bone/45"
            />
          </div>

          <div>
            <label htmlFor="plan-ideia" className="eyebrow mb-2.5 block">
              O que você tem em mente <span className="text-ember">*</span>
            </label>
            <textarea
              id="plan-ideia"
              rows={6}
              value={idea}
              onChange={(e) => onIdea(e.target.value)}
              onBlur={() => setTouched(true)}
              placeholder="Ex.: quero fechar o antebraço com folhagens em traço fino, algo entre 15 e 20 cm. Tenho algumas referências salvas."
              className={cn(
                'w-full resize-y rounded-xl border bg-coal/50 px-4 py-3 text-[0.92rem] leading-relaxed text-bone transition-colors outline-none placeholder:text-muted/70',
                touched && !idea.trim()
                  ? 'border-ember/70 focus:border-ember'
                  : 'border-bone/12 focus:border-bone/45',
              )}
            />
            {touched && !idea.trim() && (
              <p role="alert" className="mt-1.5 text-[0.75rem] text-ember-bright">
                Escreva pelo menos uma linha sobre a sua ideia.
              </p>
            )}
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-baseline gap-3">
          <span className="font-display text-[1.6rem] text-ember">03</span>
          <h2 className="font-sans text-[0.95rem] font-medium text-bone">Continue no WhatsApp</h2>
        </div>

        <motion.div
          layout
          className="mt-5 rounded-2xl border border-bone/10 bg-coal/40 p-5"
        >
          <p className="flex items-center gap-2 text-[0.72rem] tracking-widest text-muted uppercase">
            <MessageCircle size={13} />
            Prévia da mensagem
          </p>

          <div className="mt-3 rounded-xl rounded-tl-sm bg-[#075E54]/20 p-3.5 ring-1 ring-bone/8">
            <p className="text-[0.85rem] leading-relaxed whitespace-pre-wrap text-dust">
              {message}
            </p>
          </div>

          <a
            href={ready ? waLink(target, message) : undefined}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={!ready}
            onClick={(e) => {
              if (!ready) {
                e.preventDefault()
                setTouched(true)
              }
            }}
            className={buttonStyles(
              'primary',
              'lg',
              cn('mt-5 w-full', !ready && 'pointer-events-auto opacity-40'),
            )}
          >
            <WhatsAppIcon size={17} />
            {artist ? `Falar com ${artist.name.split(' ')[0]}` : 'Falar com o estúdio'}
          </a>

          <p className="mt-3 text-center text-[0.72rem] text-muted">
            Suas imagens de referência você manda direto na conversa.
          </p>
        </motion.div>
      </section>

      {!artistId && (
        <p className="text-center text-[0.78rem] text-muted">
          {artists.length} artistas disponíveis — escolha um acima para começar.
        </p>
      )}
    </div>
  )
}
