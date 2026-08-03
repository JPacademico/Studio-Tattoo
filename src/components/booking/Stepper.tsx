import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Stepper({
  steps,
  current,
  onJump,
}: {
  steps: string[]
  current: number
  onJump: (index: number) => void
}) {
  const progress = steps.length > 1 ? current / (steps.length - 1) : 0

  return (
    <nav aria-label="Etapas do agendamento" className="relative">
      {/* Rail */}
      <div aria-hidden className="absolute top-4 right-0 left-0 h-px bg-bone/10">
        <motion.div
          className="h-full origin-left bg-ember"
          initial={false}
          animate={{ scaleX: progress }}
          transition={{ type: 'spring', stiffness: 160, damping: 26 }}
          style={{ transformOrigin: 'left' }}
        />
      </div>

      <ol className="relative flex justify-between">
        {steps.map((label, index) => {
          const done = index < current
          const active = index === current
          const reachable = index <= current

          return (
            <li key={label} className="flex flex-col items-center gap-2.5">
              <button
                type="button"
                disabled={!reachable}
                onClick={() => reachable && onJump(index)}
                aria-current={active ? 'step' : undefined}
                className={cn(
                  'grid size-8 place-items-center rounded-full border text-[0.72rem] font-medium transition-colors duration-300',
                  done && 'border-ember bg-ember text-bone',
                  active && 'border-bone bg-bone text-ink',
                  !done && !active && 'border-bone/15 bg-ink text-muted',
                  reachable ? 'cursor-pointer' : 'cursor-default',
                )}
              >
                {done ? <Check size={14} strokeWidth={3} /> : index + 1}
              </button>

              <span
                className={cn(
                  'max-w-[5.5rem] text-center text-[0.68rem] leading-tight transition-colors duration-300 sm:max-w-none sm:text-[0.75rem]',
                  active ? 'text-bone' : 'text-muted',
                )}
              >
                {label}
              </span>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
