import { motion } from 'framer-motion'
import { CalendarDays, Clock, ImagePlus, MapPin, Phone, User } from 'lucide-react'
import type { Artist, Attachment, BookingDraft } from '@/types'
import { fullAddress } from '@/data/studio'
import { formatLongDate } from '@/lib/availability'
import { SmartImage } from '@/components/ui/SmartImage'

export function Review({
  draft,
  artist,
  attachments,
}: {
  draft: BookingDraft
  artist: Artist
  attachments: Attachment[]
}) {
  const rows = [
    {
      icon: <CalendarDays size={15} />,
      label: 'Data',
      value: draft.date ? formatLongDate(draft.date) : '—',
    },
    {
      icon: <Clock size={15} />,
      label: 'Horário',
      value: draft.time ? `${draft.time} · ~${artist.sessionMinutes} min` : '—',
    },
    { icon: <User size={15} />, label: 'Nome', value: draft.name || '—' },
    { icon: <Phone size={15} />, label: 'WhatsApp', value: draft.phone || '—' },
    { icon: <MapPin size={15} />, label: 'Local', value: fullAddress },
  ]

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-2xl border border-bone/10"
      >
        <SmartImage
          photoId={artist.photoId}
          alt={artist.name}
          width={520}
          height={620}
          sizes="(max-width: 1024px) 90vw, 28vw"
          className="aspect-[4/5] w-full"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void via-void/25 to-transparent"
        />
        <div className="absolute inset-x-5 bottom-5">
          <p className="eyebrow text-dust">Seu artista</p>
          <p className="mt-2 font-display text-[1.9rem] leading-none text-bone">{artist.name}</p>
          <p className="mt-1.5 text-[0.75rem] text-ember-bright">{artist.role}</p>
        </div>
      </motion.div>

      <div className="flex flex-col gap-4">
        <ul className="divide-y divide-bone/8 rounded-2xl border border-bone/10 bg-coal/40">
          {rows.map((row, i) => (
            <motion.li
              key={row.label}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.06 * i, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-start gap-3 p-4"
            >
              <span className="mt-0.5 text-ember">{row.icon}</span>
              <div className="min-w-0 flex-1">
                <p className="text-[0.7rem] tracking-widest text-muted uppercase">{row.label}</p>
                <p className="mt-1 text-[0.9rem] text-bone">{row.value}</p>
              </div>
            </motion.li>
          ))}
        </ul>

        {draft.idea.trim() && (
          <div className="rounded-2xl border border-bone/10 bg-coal/40 p-4">
            <p className="text-[0.7rem] tracking-widest text-muted uppercase">Sua ideia</p>
            <p className="mt-2 text-[0.88rem] leading-relaxed whitespace-pre-wrap text-dust">
              {draft.idea}
            </p>
          </div>
        )}

        {attachments.length > 0 && (
          <div className="rounded-2xl border border-bone/10 bg-coal/40 p-4">
            <p className="flex items-center gap-2 text-[0.7rem] tracking-widest text-muted uppercase">
              <ImagePlus size={13} />
              {attachments.length} referência{attachments.length > 1 ? 's' : ''}
            </p>
            <ul className="mt-3 flex gap-2">
              {attachments.map((file) => (
                <li key={file.id} className="size-14 overflow-hidden rounded-lg border border-bone/10">
                  <img src={file.previewUrl} alt={file.name} className="size-full object-cover" />
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="rounded-2xl border border-bone/8 bg-bone/[0.03] p-4 text-[0.78rem] leading-relaxed text-muted">
          Ao confirmar, o horário fica reservado por 24h. A gente responde no WhatsApp com o link do
          sinal de R$ 100 — só então a data é travada de vez.
        </p>
      </div>
    </div>
  )
}
