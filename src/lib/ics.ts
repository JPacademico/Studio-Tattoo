import { fullAddress, studio } from '@/data/studio'

type IcsInput = {
  isoDate: string
  time: string
  durationMinutes: number
  artistName: string
  protocol: string
}

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

/** Floating local time — no TZ database needed and every calendar app accepts it. */
function stamp(date: Date): string {
  return (
    `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}` +
    `T${pad(date.getHours())}${pad(date.getMinutes())}00`
  )
}

function escapeText(value: string): string {
  return value.replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n')
}

export function buildIcs({
  isoDate,
  time,
  durationMinutes,
  artistName,
  protocol,
}: IcsInput): string {
  const [y, m, d] = isoDate.split('-').map(Number)
  const [hh, mm] = time.split(':').map(Number)

  const start = new Date(y, m - 1, d, hh, mm)
  const end = new Date(start.getTime() + durationMinutes * 60_000)

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Studio Junior Tattoo//Agendamento//PT-BR',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${protocol}@studiojuniortattoo`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${escapeText(`Tatuagem com ${artistName} — ${studio.name}`)}`,
    `LOCATION:${escapeText(fullAddress)}`,
    `DESCRIPTION:${escapeText(`Protocolo ${protocol}. Chegue 10 minutos antes. Dúvidas: ${studio.phoneDisplay}`)}`,
    'BEGIN:VALARM',
    'TRIGGER:-PT2H',
    'ACTION:DISPLAY',
    'DESCRIPTION:Sessão no Studio Junior Tattoo em 2 horas',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}

export function downloadIcs(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)

  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()

  // Give Safari a beat to start the download before the URL dies.
  setTimeout(() => URL.revokeObjectURL(url), 2000)
}
