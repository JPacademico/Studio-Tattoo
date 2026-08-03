import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ImagePlus, Trash2, Upload } from 'lucide-react'
import type { Attachment, BookingDraft } from '@/types'
import { cn, formatBytes, maskPhone } from '@/lib/utils'

export const MAX_FILES = 4
export const MAX_FILE_BYTES = 8 * 1024 * 1024

export type DetailsErrors = Partial<Record<'name' | 'phone', string>>

type DetailsFormProps = {
  draft: BookingDraft
  onChange: (patch: Partial<BookingDraft>) => void
  attachments: Attachment[]
  onAddFiles: (files: FileList | File[]) => void
  onRemoveFile: (id: string) => void
  errors: DetailsErrors
  ideaLabel?: string
  ideaPlaceholder?: string
}

export function DetailsForm({
  draft,
  onChange,
  attachments,
  onAddFiles,
  onRemoveFile,
  errors,
  ideaLabel = 'Sua ideia',
  ideaPlaceholder = 'Conte o que você quer tatuar, em que parte do corpo e o tamanho aproximado…',
}: DetailsFormProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Field label="Nome completo" htmlFor="nome" error={errors.name} required>
        <input
          id="nome"
          name="name"
          type="text"
          autoComplete="name"
          value={draft.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="Como você quer ser chamado"
          className={inputClass(Boolean(errors.name))}
        />
      </Field>

      <Field label="WhatsApp" htmlFor="telefone" error={errors.phone} required>
        <input
          id="telefone"
          name="phone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          value={draft.phone}
          onChange={(e) => onChange({ phone: maskPhone(e.target.value) })}
          placeholder="(79) 99999-0000"
          className={inputClass(Boolean(errors.phone))}
        />
      </Field>

      <div className="lg:col-span-2">
        <Field label={ideaLabel} htmlFor="ideia">
          <textarea
            id="ideia"
            name="idea"
            rows={5}
            value={draft.idea}
            onChange={(e) => onChange({ idea: e.target.value })}
            placeholder={ideaPlaceholder}
            className={cn(inputClass(false), 'resize-y leading-relaxed')}
          />
        </Field>
      </div>

      {/* Reference images */}
      <div className="lg:col-span-2">
        <p className="eyebrow mb-2.5">Referências (opcional)</p>

        <div
          onDragOver={(e) => {
            e.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragging(false)
            if (e.dataTransfer.files.length) onAddFiles(e.dataTransfer.files)
          }}
          className={cn(
            'relative rounded-2xl border border-dashed p-6 text-center transition-colors duration-300',
            dragging ? 'border-ember bg-ember/8' : 'border-bone/15 bg-coal/30',
          )}
        >
          <input
            ref={inputRef}
            id="referencias"
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={(e) => {
              if (e.target.files?.length) onAddFiles(e.target.files)
              // Reset so re-picking the same file still fires a change.
              e.target.value = ''
            }}
          />

          <motion.div
            animate={{ y: dragging ? -4 : 0, scale: dragging ? 1.06 : 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            className="mx-auto grid size-11 place-items-center rounded-full border border-bone/12 bg-bone/[0.04] text-ember"
          >
            {dragging ? <Upload size={18} /> : <ImagePlus size={18} />}
          </motion.div>

          <p className="mt-3 text-[0.85rem] text-bone">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="underline decoration-bone/30 underline-offset-4 transition-colors hoverable:hover:decoration-bone"
            >
              Escolher imagens
            </button>{' '}
            <span className="hidden sm:inline text-muted">ou arraste aqui</span>
          </p>
          <p className="mt-1.5 text-[0.72rem] text-muted">
            Até {MAX_FILES} imagens, {formatBytes(MAX_FILE_BYTES)} cada
          </p>
        </div>

        <AnimatePresence initial={false}>
          {attachments.length > 0 && (
            <motion.ul
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 grid grid-cols-2 gap-2.5 overflow-hidden sm:grid-cols-4"
            >
              <AnimatePresence initial={false}>
                {attachments.map((file) => (
                  <motion.li
                    key={file.id}
                    layout
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    transition={{ duration: 0.25 }}
                    className="group relative overflow-hidden rounded-xl border border-bone/10 bg-ash"
                  >
                    <img
                      src={file.previewUrl}
                      alt={file.name}
                      className="aspect-square w-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-void/95 to-transparent p-2 pt-6">
                      <p className="truncate text-[0.65rem] text-dust">{file.name}</p>
                      <p className="text-[0.6rem] text-muted">{formatBytes(file.size)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveFile(file.id)}
                      aria-label={`Remover ${file.name}`}
                      className="absolute top-1.5 right-1.5 grid size-7 place-items-center rounded-full bg-void/80 text-dust backdrop-blur transition-colors hoverable:hover:bg-ember hoverable:hover:text-bone"
                    >
                      <Trash2 size={13} />
                    </button>
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function inputClass(hasError: boolean): string {
  return cn(
    'w-full rounded-xl border bg-coal/50 px-4 py-3 text-[0.92rem] text-bone placeholder:text-muted/70',
    'transition-colors duration-250 outline-none',
    hasError
      ? 'border-ember/70 focus:border-ember'
      : 'border-bone/12 hoverable:hover:border-bone/25 focus:border-bone/45',
  )
}

function Field({
  label,
  htmlFor,
  error,
  required,
  children,
}: {
  label: string
  htmlFor: string
  error?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="eyebrow mb-2.5 block">
        {label}
        {required && <span className="ml-1 text-ember">*</span>}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            role="alert"
            className="mt-1.5 text-[0.75rem] text-ember-bright"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
