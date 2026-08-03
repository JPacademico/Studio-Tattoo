import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, CalendarDays, LoaderCircle, MessageCircle } from 'lucide-react'
import type { Attachment, BookingDraft, BookingMode } from '@/types'
import { artistById } from '@/data/studio'
import { navigate, useSearchParam } from '@/lib/router'
import { usePersistentState } from '@/hooks'
import { isValidPhone, protocolCode, sleep, cn } from '@/lib/utils'
import { useToast } from '@/components/ui/Toast'
import { Button } from '@/components/ui/Button'
import { Stepper } from '@/components/booking/Stepper'
import { ArtistPicker } from '@/components/booking/ArtistPicker'
import { Scheduler } from '@/components/booking/Scheduler'
import {
  DetailsForm,
  MAX_FILES,
  MAX_FILE_BYTES,
  type DetailsErrors,
} from '@/components/booking/DetailsForm'
import { Review } from '@/components/booking/Review'
import { Success } from '@/components/booking/Success'
import { PlanFlow } from '@/components/booking/PlanFlow'

const STEPS = ['Artista', 'Data e horário', 'Seus dados', 'Confirmar']

const EMPTY_DRAFT: BookingDraft = {
  artistId: null,
  date: null,
  time: null,
  name: '',
  phone: '',
  idea: '',
}

function makeId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `f${Date.now()}${Math.random().toString(16).slice(2)}`
}

export function BookingPage() {
  const toast = useToast()

  const modeParam = useSearchParam('modo')
  const artistParam = useSearchParam('artista')
  const mode: BookingMode = modeParam === 'planejar' ? 'planejar' : 'agendar'

  const [draft, setDraft] = usePersistentState<BookingDraft>('sjt:booking-draft', EMPTY_DRAFT)
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState<DetailsErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [protocol, setProtocol] = useState<string | null>(null)

  const artist = artistById(draft.artistId)

  // Deep links like /agendar?artista=bia preselect the artist and skip ahead.
  const appliedParam = useRef(false)
  useEffect(() => {
    if (appliedParam.current || !artistParam) return
    appliedParam.current = true
    if (artistById(artistParam)) {
      setDraft((current) => ({ ...current, artistId: artistParam }))
      if (mode === 'agendar') setStep(1)
    }
  }, [artistParam, mode, setDraft])

  // Object URLs must be released when the page goes away.
  const attachmentsRef = useRef(attachments)
  attachmentsRef.current = attachments
  useEffect(
    () => () => attachmentsRef.current.forEach((file) => URL.revokeObjectURL(file.previewUrl)),
    [],
  )

  function patchDraft(patch: Partial<BookingDraft>) {
    setDraft((current) => ({ ...current, ...patch }))
  }

  function switchMode(next: BookingMode) {
    navigate(`/agendar?modo=${next}`, { replace: true })
  }

  function addFiles(incoming: FileList | File[]) {
    const files = Array.from(incoming)
    const accepted: Attachment[] = []
    let rejectedType = 0
    let rejectedSize = 0
    let overflow = false

    for (const file of files) {
      if (attachments.length + accepted.length >= MAX_FILES) {
        overflow = true
        break
      }
      if (!file.type.startsWith('image/')) {
        rejectedType++
        continue
      }
      if (file.size > MAX_FILE_BYTES) {
        rejectedSize++
        continue
      }
      accepted.push({
        id: makeId(),
        name: file.name,
        size: file.size,
        previewUrl: URL.createObjectURL(file),
      })
    }

    if (accepted.length) {
      setAttachments((current) => [...current, ...accepted])
      toast.success(
        `${accepted.length} imagem${accepted.length > 1 ? 'ns' : ''} anexada${accepted.length > 1 ? 's' : ''}`,
        'Elas ficam só neste dispositivo — nada é enviado.',
      )
    }
    if (rejectedType) toast.error('Só aceitamos imagens', 'PDFs e vídeos não passam por aqui.')
    if (rejectedSize) toast.error('Imagem muito pesada', 'O limite é 8 MB por arquivo.')
    if (overflow) toast.info(`Máximo de ${MAX_FILES} imagens`, 'Remova alguma para anexar outra.')
  }

  function removeFile(id: string) {
    setAttachments((current) => {
      const target = current.find((file) => file.id === id)
      if (target) URL.revokeObjectURL(target.previewUrl)
      return current.filter((file) => file.id !== id)
    })
  }

  function validateStep(index: number): boolean {
    if (index === 0 && !draft.artistId) {
      toast.info('Escolha um artista', 'Cada um tem uma agenda diferente.')
      return false
    }
    if (index === 1) {
      if (!draft.date) {
        toast.info('Escolha um dia', 'Os dias com ponto vermelho têm horário livre.')
        return false
      }
      if (!draft.time) {
        toast.info('Escolha um horário', 'Selecione um dos horários disponíveis.')
        return false
      }
    }
    if (index === 2) {
      const next: DetailsErrors = {}
      if (draft.name.trim().length < 3) next.name = 'Digite seu nome completo.'
      if (!isValidPhone(draft.phone)) next.phone = 'Digite um número com DDD.'
      setErrors(next)
      if (Object.keys(next).length) {
        toast.error('Faltou preencher', 'Confira os campos destacados.')
        return false
      }
    }
    return true
  }

  function goNext() {
    if (!validateStep(step)) return
    setErrors({})
    setStep((current) => Math.min(current + 1, STEPS.length - 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function goBack() {
    setStep((current) => Math.max(current - 1, 0))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function confirm() {
    if (!artist || !draft.date || !draft.time) return
    setSubmitting(true)

    // Prototype only — stands in for the request a real backend would receive.
    await sleep(1500)

    const code = protocolCode(`${draft.artistId}${draft.date}${draft.time}${draft.phone}`)
    setProtocol(code)
    setSubmitting(false)
    toast.success('Agendamento enviado!', `Protocolo ${code} — confirmamos no WhatsApp em até 24h.`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function restart() {
    attachmentsRef.current.forEach((file) => URL.revokeObjectURL(file.previewUrl))
    setAttachments([])
    setDraft(EMPTY_DRAFT)
    setProtocol(null)
    setErrors({})
    setStep(0)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const isLastStep = step === STEPS.length - 1
  const showFooterNav = mode === 'agendar' && !protocol

  const heading = useMemo(
    () =>
      mode === 'planejar'
        ? { eyebrow: 'Planejar', line1: 'Antes da', line2: 'agulha.' }
        : { eyebrow: 'Agendar', line1: 'Reserve', line2: 'sua sessão.' },
    [mode],
  )

  return (
    <main id="conteudo" className="relative min-h-svh px-5 pt-28 pb-40 sm:px-8 sm:pt-36">
      <div className="mx-auto max-w-[72rem]">
        {/* Heading */}
        <div className="text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="eyebrow"
          >
            {heading.eyebrow}
          </motion.p>
          <h1 className="mt-4 text-[clamp(2.4rem,7vw,4.2rem)] leading-[0.94] text-bone">
            <span className="block overflow-hidden">
              <motion.span
                initial={{ y: '110%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="block"
              >
                {heading.line1}
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span
                initial={{ y: '110%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 0.9, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="block italic text-dust"
              >
                {heading.line2}
              </motion.span>
            </span>
          </h1>
        </div>

        {/* Mode switch */}
        {!protocol && (
          <div className="mt-9 flex justify-center">
            <div
              role="tablist"
              aria-label="Como você quer continuar"
              className="inline-flex rounded-full border border-bone/12 bg-coal/60 p-1"
            >
              <ModeTab
                active={mode === 'agendar'}
                onClick={() => switchMode('agendar')}
                icon={<CalendarDays size={14} />}
                label="Agendar sessão"
              />
              <ModeTab
                active={mode === 'planejar'}
                onClick={() => switchMode('planejar')}
                icon={<MessageCircle size={14} />}
                label="Planejar tattoo"
              />
            </div>
          </div>
        )}

        <div className="mt-12 sm:mt-14">
          <AnimatePresence mode="wait">
            {mode === 'planejar' ? (
              <motion.div
                key="planejar"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <PlanFlow
                  artistId={draft.artistId}
                  onArtist={(id) => patchDraft({ artistId: id })}
                  name={draft.name}
                  onName={(value) => patchDraft({ name: value })}
                  idea={draft.idea}
                  onIdea={(value) => patchDraft({ idea: value })}
                />
              </motion.div>
            ) : protocol && artist ? (
              <motion.div key="sucesso">
                <Success
                  draft={draft}
                  artist={artist}
                  protocol={protocol}
                  attachmentCount={attachments.length}
                  onRestart={restart}
                />
              </motion.div>
            ) : (
              <motion.div
                key="agendar"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="mx-auto max-w-2xl">
                  <Stepper
                    steps={STEPS}
                    current={step}
                    onJump={(index) => index < step && setStep(index)}
                  />
                </div>

                <div className="mt-12">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -24 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {step === 0 && (
                        <StepShell
                          title="Quem vai te tatuar?"
                          hint="Cada artista tem seu estilo e sua própria agenda."
                        >
                          <ArtistPicker
                            value={draft.artistId}
                            onChange={(id) => {
                              // Changing the artist invalidates the chosen slot.
                              patchDraft({ artistId: id, date: null, time: null })
                            }}
                          />
                        </StepShell>
                      )}

                      {step === 1 && (
                        <StepShell
                          title="Quando fica bom pra você?"
                          hint={`Agenda de ${artist?.name ?? 'seu artista'} nos próximos 60 dias.`}
                        >
                          <Scheduler
                            artistId={draft.artistId}
                            date={draft.date}
                            time={draft.time}
                            onDate={(iso) => patchDraft({ date: iso, time: null })}
                            onTime={(value) => patchDraft({ time: value })}
                          />
                        </StepShell>
                      )}

                      {step === 2 && (
                        <StepShell
                          title="Como a gente te encontra?"
                          hint="Só o necessário para confirmar sua reserva."
                        >
                          <DetailsForm
                            draft={draft}
                            onChange={patchDraft}
                            attachments={attachments}
                            onAddFiles={addFiles}
                            onRemoveFile={removeFile}
                            errors={errors}
                          />
                        </StepShell>
                      )}

                      {step === 3 && artist && (
                        <StepShell
                          title="Confere se está tudo certo"
                          hint="Ainda dá para voltar e ajustar qualquer coisa."
                        >
                          <Review draft={draft} artist={artist} attachments={attachments} />
                        </StepShell>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Sticky step navigation */}
      <AnimatePresence>
        {showFooterNav && (
          <motion.div
            initial={{ y: 90 }}
            animate={{ y: 0 }}
            exit={{ y: 90 }}
            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
            className="fixed inset-x-0 bottom-0 z-[100] border-t border-bone/8 bg-ink/85 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl"
          >
            <div className="mx-auto flex max-w-[72rem] items-center justify-between gap-3 px-5 py-3.5 sm:px-8">
              <Button variant="ghost" size="md" onClick={goBack} disabled={step === 0 || submitting}>
                <ArrowLeft size={15} />
                Voltar
              </Button>

              <p className="hidden text-[0.75rem] text-muted sm:block">
                Etapa {step + 1} de {STEPS.length} · {STEPS[step]}
              </p>

              {isLastStep ? (
                <Button variant="ember" size="md" onClick={confirm} disabled={submitting}>
                  {submitting ? (
                    <>
                      <LoaderCircle size={15} className="animate-spin" />
                      Reservando…
                    </>
                  ) : (
                    <>
                      Confirmar agendamento
                      <ArrowRight size={15} />
                    </>
                  )}
                </Button>
              ) : (
                <Button variant="primary" size="md" onClick={goNext}>
                  Continuar
                  <ArrowRight size={15} />
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

function ModeTab({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        'relative inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[0.8rem] transition-colors duration-300 sm:px-5',
        active ? 'text-ink' : 'text-dust hoverable:hover:text-bone',
      )}
    >
      {active && (
        <motion.span
          layoutId="mode-tab"
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          className="absolute inset-0 rounded-full bg-bone"
        />
      )}
      <span className="relative flex items-center gap-2">
        {icon}
        {label}
      </span>
    </button>
  )
}

function StepShell({
  title,
  hint,
  children,
}: {
  title: string
  hint: string
  children: React.ReactNode
}) {
  return (
    <section>
      <div className="mb-8 text-center">
        <h2 className="font-display text-[1.9rem] leading-none text-bone sm:text-[2.2rem]">
          {title}
        </h2>
        <p className="mt-2.5 text-[0.85rem] text-muted">{hint}</p>
      </div>
      {children}
    </section>
  )
}
