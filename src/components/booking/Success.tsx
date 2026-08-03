import { motion, useReducedMotion } from 'framer-motion'
import { CalendarDays, Copy, Download, House } from 'lucide-react'
import type { Artist, BookingDraft } from '@/types'
import { fullAddress, studio } from '@/data/studio'
import { formatLongDate } from '@/lib/availability'
import { buildIcs, downloadIcs } from '@/lib/ics'
import { Link } from '@/lib/router'
import { Button, buttonStyles } from '@/components/ui/Button'
import { WhatsAppIcon } from '@/components/ui/BrandIcons'
import { useToast } from '@/components/ui/Toast'
import { waLink } from '@/lib/utils'

export function Success({
  draft,
  artist,
  protocol,
  attachmentCount,
  onRestart,
}: {
  draft: BookingDraft
  artist: Artist
  protocol: string
  attachmentCount: number
  onRestart: () => void
}) {
  const toast = useToast()
  const reduced = useReducedMotion()

  const summary = [
    `*Agendamento — ${studio.name}*`,
    `Protocolo: ${protocol}`,
    `Artista: ${artist.name}`,
    `Data: ${draft.date ? formatLongDate(draft.date) : ''} às ${draft.time}`,
    `Nome: ${draft.name}`,
    `WhatsApp: ${draft.phone}`,
    draft.idea.trim() ? `Ideia: ${draft.idea.trim()}` : '',
    attachmentCount ? `Tenho ${attachmentCount} imagem(ns) de referência para enviar.` : '',
  ]
    .filter(Boolean)
    .join('\n')

  function handleIcs() {
    if (!draft.date || !draft.time) return
    downloadIcs(
      `studio-junior-${protocol}.ics`,
      buildIcs({
        isoDate: draft.date,
        time: draft.time,
        durationMinutes: artist.sessionMinutes,
        artistName: artist.name,
        protocol,
      }),
    )
    toast.success('Evento baixado', 'Abra o arquivo para adicionar ao seu calendário.')
  }

  async function copyProtocol() {
    try {
      await navigator.clipboard.writeText(protocol)
      toast.success('Protocolo copiado')
    } catch {
      toast.error('Não deu para copiar o protocolo')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto max-w-2xl text-center"
    >
      <InkSeal reduced={Boolean(reduced)} />

      <h2 className="mt-8 font-display text-[clamp(2rem,6vw,3.2rem)] leading-none text-bone">
        Horário reservado.
      </h2>
      <p className="mx-auto mt-4 max-w-md text-[0.92rem] leading-relaxed text-muted">
        A gente confirma no seu WhatsApp em até 24 horas. Guarde o protocolo abaixo — é por ele que
        a gente localiza sua reserva.
      </p>

      <button
        type="button"
        onClick={copyProtocol}
        className="group mt-6 inline-flex items-center gap-2.5 rounded-full border border-bone/15 bg-coal/60 px-5 py-2.5 font-mono text-[0.9rem] tracking-widest text-bone transition-colors hoverable:hover:border-bone/40"
      >
        {protocol}
        <Copy size={13} className="text-muted transition-colors group-hover:text-bone" />
      </button>

      <dl className="mt-9 grid gap-px overflow-hidden rounded-2xl border border-bone/10 bg-bone/8 text-left sm:grid-cols-2">
        <Cell label="Artista" value={artist.name} />
        <Cell
          label="Quando"
          value={`${draft.date ? formatLongDate(draft.date) : ''} · ${draft.time}`}
        />
        <Cell label="Em nome de" value={draft.name} />
        <Cell label="Onde" value={fullAddress} />
      </dl>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <a
          href={waLink(artist.whatsapp, summary)}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonStyles('primary', 'lg')}
        >
          <WhatsAppIcon size={17} />
          Enviar detalhes no WhatsApp
        </a>
        <Button variant="outline" size="lg" onClick={handleIcs}>
          <Download size={15} />
          Adicionar ao calendário
        </Button>
      </div>

      {attachmentCount > 0 && (
        <p className="mt-4 text-[0.75rem] text-muted">
          Suas {attachmentCount} imagem(ns) ficam neste dispositivo — mande por WhatsApp para o
          artista ver.
        </p>
      )}

      <div className="mt-10 flex flex-wrap justify-center gap-2 border-t border-bone/8 pt-8">
        <Button variant="ghost" size="sm" onClick={onRestart}>
          <CalendarDays size={14} />
          Fazer outro agendamento
        </Button>
        <Link to="/" className={buttonStyles('ghost', 'sm')}>
          <House size={14} />
          Voltar ao início
        </Link>
      </div>
    </motion.div>
  )
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-ink p-4">
      <dt className="text-[0.68rem] tracking-widest text-muted uppercase">{label}</dt>
      <dd className="mt-1.5 text-[0.88rem] text-bone">{value}</dd>
    </div>
  )
}

/** Stamped-ink confirmation mark: ring draws, check draws, droplets scatter. */
function InkSeal({ reduced }: { reduced: boolean }) {
  return (
    <div className="relative mx-auto size-28">
      <svg viewBox="0 0 120 120" className="size-full" aria-hidden>
        <motion.circle
          cx="60"
          cy="60"
          r="46"
          fill="none"
          stroke="var(--color-ember)"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: reduced ? 1 : 0, rotate: -90 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: '60px 60px', rotate: -90 }}
        />
        <motion.circle
          cx="60"
          cy="60"
          r="46"
          fill="var(--color-ember)"
          initial={{ opacity: 0.35, scale: 0.7 }}
          animate={{ opacity: 0, scale: 1.5 }}
          transition={{ duration: 1.4, ease: 'easeOut', delay: 0.2 }}
          style={{ transformOrigin: '60px 60px' }}
        />
        <motion.path
          d="M40 61 L54 75 L82 46"
          fill="none"
          stroke="var(--color-bone)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: reduced ? 1 : 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.45, ease: 'easeOut' }}
        />

        {!reduced &&
          Array.from({ length: 7 }).map((_, i) => {
            const angle = (i / 7) * Math.PI * 2
            return (
              <motion.circle
                key={i}
                cx={60}
                cy={60}
                r={2.2}
                fill="var(--color-ember)"
                initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  x: Math.cos(angle) * 54,
                  y: Math.sin(angle) * 54,
                  scale: [0, 1, 0.4],
                }}
                transition={{ duration: 1, delay: 0.5 + i * 0.04, ease: 'easeOut' }}
              />
            )
          })}
      </svg>
    </div>
  )
}
