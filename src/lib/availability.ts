import { artistById, mockBusySlots, studio } from '@/data/studio'
import { hash } from '@/lib/utils'

export type Slot = { time: string; taken: boolean }

/** `YYYY-MM-DD` in *local* time — `toISOString()` would shift the day in UTC-3. */
export function toISODate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function fromISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function startOfToday(): Date {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

export function lastBookableDay(): Date {
  const d = startOfToday()
  d.setDate(d.getDate() + studio.bookingWindowDays)
  return d
}

/** A day is offerable when the artist works it, it is not past, and it is in range. */
export function isDayAvailable(artistId: string | null, date: Date): boolean {
  const artist = artistById(artistId)
  if (!artist) return false
  if (date < startOfToday()) return false
  if (date > lastBookableDay()) return false
  if (!artist.workdays.includes(date.getDay())) return false
  return slotsForDay(artistId, toISODate(date)).some((s) => !s.taken)
}

/**
 * Mocked availability. `hash` keeps a given slot consistently taken across
 * reloads, so the calendar feels like a real agenda instead of noise.
 */
export function slotsForDay(artistId: string | null, iso: string): Slot[] {
  const artist = artistById(artistId)
  if (!artist) return []

  const date = fromISODate(iso)
  if (!artist.workdays.includes(date.getDay())) return []

  const overrides = mockBusySlots[`${artist.id}:${iso}`] ?? []
  const now = new Date()
  const isToday = toISODate(now) === iso

  return artist.slots.map((time) => {
    const [h, m] = time.split(':').map(Number)

    // Same-day slots close 2h before start.
    const cutoff = new Date(date)
    cutoff.setHours(h, m - 120, 0, 0)
    const tooLate = isToday && now > cutoff

    const taken = overrides.includes(time) || hash(`${artist.id}|${iso}|${time}`) % 10 < 3

    return { time, taken: taken || tooLate }
  })
}

const WEEKDAYS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado']
const MONTHS = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
]

export const WEEKDAY_INITIALS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

/**
 * Sentence case, not title case — Portuguese keeps "de" and month names
 * lowercase, so a CSS `capitalize` would render "Sábado, 9 De Agosto".
 */
function sentenceCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export function formatLongDate(iso: string): string {
  const d = fromISODate(iso)
  return sentenceCase(`${WEEKDAYS[d.getDay()]}, ${d.getDate()} de ${MONTHS[d.getMonth()]}`)
}

export function formatShortDate(iso: string): string {
  const d = fromISODate(iso)
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`
}

export function monthLabel(year: number, month: number): string {
  return sentenceCase(`${MONTHS[month]} de ${year}`)
}

/** Calendar grid for a month, padded with `null` so the 1st lands on its weekday. */
export function monthMatrix(year: number, month: number): Array<Date | null> {
  const first = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: Array<Date | null> = Array.from({ length: first.getDay() }, () => null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d))
  return cells
}
