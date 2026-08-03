import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import { artistById } from '@/data/studio'
import {
  WEEKDAY_INITIALS,
  formatLongDate,
  isDayAvailable,
  lastBookableDay,
  monthLabel,
  monthMatrix,
  slotsForDay,
  startOfToday,
  toISODate,
} from '@/lib/availability'
import { cn } from '@/lib/utils'

type SchedulerProps = {
  artistId: string | null
  date: string | null
  time: string | null
  onDate: (iso: string) => void
  onTime: (time: string) => void
}

export function Scheduler({ artistId, date, time, onDate, onTime }: SchedulerProps) {
  const today = startOfToday()
  const [cursor, setCursor] = useState(() => {
    const base = date ? new Date(date) : today
    return { year: base.getFullYear(), month: base.getMonth() }
  })
  // Drives which way the grid slides between months.
  const [direction, setDirection] = useState(1)

  const artist = artistById(artistId)
  const cells = useMemo(() => monthMatrix(cursor.year, cursor.month), [cursor])
  const slots = useMemo(() => (date ? slotsForDay(artistId, date) : []), [artistId, date])

  const limit = lastBookableDay()
  const canGoBack =
    cursor.year > today.getFullYear() ||
    (cursor.year === today.getFullYear() && cursor.month > today.getMonth())
  const canGoForward =
    cursor.year < limit.getFullYear() ||
    (cursor.year === limit.getFullYear() && cursor.month < limit.getMonth())

  function shiftMonth(step: number) {
    setDirection(step)
    setCursor((current) => {
      const next = new Date(current.year, current.month + step, 1)
      return { year: next.getFullYear(), month: next.getMonth() }
    })
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]">
      {/* Calendar */}
      <div className="rounded-2xl border border-bone/10 bg-coal/40 p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <p className="font-display text-[1.5rem] leading-none text-bone">
            {monthLabel(cursor.year, cursor.month)}
          </p>
          <div className="flex gap-1.5">
            <MonthButton
              label="Mês anterior"
              disabled={!canGoBack}
              onClick={() => shiftMonth(-1)}
              icon={<ChevronLeft size={16} />}
            />
            <MonthButton
              label="Próximo mês"
              disabled={!canGoForward}
              onClick={() => shiftMonth(1)}
              icon={<ChevronRight size={16} />}
            />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-7 gap-1 text-center">
          {WEEKDAY_INITIALS.map((initial, i) => (
            <span key={i} className="pb-2 text-[0.68rem] font-medium tracking-widest text-muted">
              {initial}
            </span>
          ))}
        </div>

        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${cursor.year}-${cursor.month}`}
              initial={{ opacity: 0, x: direction * 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -28 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-7 gap-1"
            >
              {cells.map((day, i) => {
                if (!day) return <span key={`pad-${i}`} />

                const iso = toISODate(day)
                const available = isDayAvailable(artistId, day)
                const selected = date === iso
                const isToday = toISODate(today) === iso

                return (
                  <button
                    key={iso}
                    type="button"
                    disabled={!available}
                    aria-label={formatLongDate(iso)}
                    aria-pressed={selected}
                    onClick={() => onDate(iso)}
                    className={cn(
                      'relative grid aspect-square place-items-center rounded-xl text-[0.85rem] transition-all duration-200',
                      available
                        ? 'text-bone hoverable:hover:bg-bone/10'
                        : 'cursor-not-allowed text-muted/35',
                      selected && 'bg-bone text-ink font-medium',
                      isToday && !selected && 'ring-1 ring-bone/25',
                    )}
                  >
                    {selected && (
                      <motion.span
                        layoutId="day-selection"
                        transition={{ type: 'spring', stiffness: 480, damping: 34 }}
                        className="absolute inset-0 rounded-xl bg-bone"
                      />
                    )}
                    <span className={cn('relative tabular-nums', selected && 'text-ink')}>
                      {day.getDate()}
                    </span>
                    {available && !selected && (
                      <span className="absolute bottom-1.5 size-1 rounded-full bg-ember" />
                    )}
                  </button>
                )
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        <p className="mt-5 flex items-center gap-2 border-t border-bone/8 pt-4 text-[0.72rem] text-muted">
          <span className="size-1.5 rounded-full bg-ember" />
          Dias com horário livre
          {artist && <span className="ml-auto">Atende {artist.workdays.length}x por semana</span>}
        </p>
      </div>

      {/* Time slots */}
      <div className="rounded-2xl border border-bone/10 bg-coal/40 p-4 sm:p-6">
        <div className="flex items-center gap-2">
          <Clock size={15} className="text-ember" />
          <p className="eyebrow text-dust">Horários</p>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {!date ? (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-6 text-[0.85rem] leading-relaxed text-muted"
            >
              Escolha um dia no calendário para ver os horários disponíveis.
            </motion.p>
          ) : (
            <motion.div
              key={date}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              className="mt-4"
            >
              <p className="text-[0.9rem] text-bone">{formatLongDate(date)}</p>
              {artist && (
                <p className="mt-1 text-[0.75rem] text-muted">
                  Sessões de aproximadamente {artist.sessionMinutes} minutos
                </p>
              )}

              <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2">
                {slots.map((slot, i) => {
                  const selected = time === slot.time
                  return (
                    <motion.button
                      key={slot.time}
                      type="button"
                      disabled={slot.taken}
                      onClick={() => onTime(slot.time)}
                      aria-pressed={selected}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.35 }}
                      whileTap={slot.taken ? undefined : { scale: 0.96 }}
                      className={cn(
                        'relative overflow-hidden rounded-xl border py-3 text-[0.88rem] tabular-nums transition-colors duration-250',
                        slot.taken
                          ? 'cursor-not-allowed border-bone/6 text-muted/40'
                          : selected
                            ? 'border-transparent bg-bone font-medium text-ink'
                            : 'border-bone/12 text-bone hoverable:hover:border-bone/35 hoverable:hover:bg-bone/[0.06]',
                      )}
                    >
                      {slot.time}
                      {slot.taken && (
                        <span
                          aria-hidden
                          className="absolute inset-x-4 top-1/2 h-px -rotate-6 bg-muted/40"
                        />
                      )}
                    </motion.button>
                  )
                })}
              </div>

              {slots.every((s) => s.taken) && (
                <p className="mt-4 rounded-xl border border-ember/25 bg-ember/8 px-3 py-2.5 text-[0.78rem] leading-relaxed text-ember-bright">
                  Todos os horários deste dia já foram preenchidos. Escolha outra data.
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function MonthButton({
  label,
  disabled,
  onClick,
  icon,
}: {
  label: string
  disabled: boolean
  onClick: () => void
  icon: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="grid size-9 place-items-center rounded-full border border-bone/12 text-dust transition-colors enabled:hoverable:hover:border-bone/40 enabled:hoverable:hover:text-bone disabled:opacity-25"
    >
      {icon}
    </button>
  )
}
