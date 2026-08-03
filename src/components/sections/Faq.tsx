import { useId, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { faq } from '@/data/studio'
import type { FaqItem } from '@/types'
import { Reveal, RevealWords } from '@/components/ui/Reveal'
import { cn } from '@/lib/utils'

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)

  const columns: FaqItem[][] = [
    faq.filter((_, i) => i % 2 === 0),
    faq.filter((_, i) => i % 2 === 1),
  ]

  return (
    <section id="faq" className="relative scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-[80rem]">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-[clamp(2.2rem,5.5vw,3.6rem)] leading-[0.95] text-bone">
            <RevealWords text="Perguntas" className="block" />
            <RevealWords text="frequentes" className="block italic text-dust" delay={0.12} />
          </h2>
          <Reveal delay={0.1}>
            <p className="max-w-xs text-[0.88rem] leading-relaxed text-muted sm:text-right">
              O que a gente mais responde no direct. Se a sua dúvida não estiver aqui, chama no
              WhatsApp.
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-x-10 gap-y-0 lg:grid-cols-2">
          {columns.map((column, colIndex) => (
            <div key={colIndex} className="flex flex-col">
              {column.map((item, rowIndex) => {
                // Recover the original index so only one panel is open globally.
                const index = rowIndex * 2 + colIndex
                return (
                  <FaqRow
                    key={item.question}
                    item={item}
                    isOpen={open === index}
                    onToggle={() => setOpen(open === index ? null : index)}
                    delay={rowIndex * 0.05}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FaqRow({
  item,
  isOpen,
  onToggle,
  delay,
}: {
  item: FaqItem
  isOpen: boolean
  onToggle: () => void
  delay: number
}) {
  const panelId = useId()

  return (
    <Reveal delay={delay} amount={0.4}>
      <div
        className={cn(
          'border-b border-bone/8 transition-colors duration-500',
          isOpen && 'border-bone/16',
        )}
      >
        <h3>
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={isOpen}
            aria-controls={panelId}
            className="group flex w-full items-center justify-between gap-4 py-5 text-left"
          >
            <span
              className={cn(
                // The wrapping <h3> defaults to the display serif; questions
                // are UI copy, so pull them back to the sans stack.
                'font-sans text-[0.92rem] leading-snug font-normal transition-colors duration-300',
                isOpen ? 'text-bone' : 'text-dust hoverable:group-hover:text-bone',
              )}
            >
              {item.question}
            </span>

            <span
              className={cn(
                'grid size-7 shrink-0 place-items-center rounded-full border transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
                isOpen
                  ? 'rotate-[135deg] border-ember bg-ember/12 text-ember-bright'
                  : 'border-bone/15 text-dust hoverable:group-hover:border-bone/40',
              )}
            >
              <Plus size={14} />
            </span>
          </button>
        </h3>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              id={panelId}
              key="panel"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                height: { duration: 0.42, ease: [0.16, 1, 0.3, 1] },
                opacity: { duration: 0.28 },
              }}
              className="overflow-hidden"
            >
              <p className="pr-10 pb-5 text-[0.88rem] leading-relaxed text-muted">{item.answer}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Reveal>
  )
}
