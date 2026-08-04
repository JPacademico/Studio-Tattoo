import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Download, Share, SquarePlus, X } from 'lucide-react'
import { LogoMark } from '@/components/layout/Logo'
import { useLockBodyScroll } from '@/hooks'
import { buttonStyles } from '@/components/ui/Button'

type InstallGuideModalProps = {
  open: boolean
  onClose: () => void
  /** True on iOS Safari, which never fires `beforeinstallprompt`. */
  iosSafari: boolean
  /** True once Chromium has offered a native prompt to trigger. */
  canInstall: boolean
  onInstallNow: () => void
}

/**
 * Explains "download" when there's nothing to programmatically trigger:
 * iOS Safari (no `beforeinstallprompt` ever fires there) and any browser
 * where Chromium hasn't offered the native prompt yet. When a native prompt
 * *is* available, this still opens but leads with a button that fires it.
 */
export function InstallGuideModal({
  open,
  onClose,
  iosSafari,
  canInstall,
  onInstallNow,
}: InstallGuideModalProps) {
  useLockBodyScroll(open)

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="install-guide"
          role="dialog"
          aria-modal="true"
          aria-labelledby="install-guide-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-[180] flex items-center justify-center bg-void/85 p-4 backdrop-blur-xl"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            onClick={(event) => event.stopPropagation()}
            className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-bone/12 bg-coal shadow-[0_30px_80px_-20px_rgb(0_0_0/0.85)]"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(120% 100% at 0% 0%, rgb(212 64 42 / 0.14), transparent 60%)',
              }}
            />

            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar"
              className="absolute top-3 right-3 z-10 grid size-8 place-items-center rounded-full text-muted transition-colors hoverable:hover:bg-bone/10 hoverable:hover:text-bone"
            >
              <X size={15} />
            </button>

            <div className="relative p-6">
              <span className="grid size-11 place-items-center rounded-xl bg-bone/[0.06] ring-1 ring-bone/10">
                <LogoMark className="size-6 text-ember" />
              </span>

              <h2 id="install-guide-title" className="mt-4 font-display text-2xl text-bone">
                Instalar o app
              </h2>
              <p className="mt-2 text-[0.85rem] leading-relaxed text-muted">
                Acesso rápido pela tela inicial, funciona offline e abre em tela cheia — sem
                precisar do navegador.
              </p>

              {canInstall ? (
                <button
                  type="button"
                  onClick={onInstallNow}
                  className={buttonStyles('primary', 'lg', 'mt-5 w-full')}
                >
                  <Download size={16} />
                  Instalar agora
                </button>
              ) : iosSafari ? (
                <ol className="mt-5 space-y-3">
                  <Step index={1} icon={<Share size={15} />}>
                    Toque no ícone <strong className="text-bone">Compartilhar</strong> na barra do
                    Safari.
                  </Step>
                  <Step index={2} icon={<SquarePlus size={15} />}>
                    Escolha <strong className="text-bone">Adicionar à Tela de Início</strong>.
                  </Step>
                </ol>
              ) : (
                <ol className="mt-5 space-y-3">
                  <Step index={1}>
                    Abra o menu do navegador (geralmente <strong className="text-bone">⋮</strong>{' '}
                    ou <strong className="text-bone">•••</strong>).
                  </Step>
                  <Step index={2}>
                    Toque em <strong className="text-bone">Instalar aplicativo</strong> ou{' '}
                    <strong className="text-bone">Adicionar à tela inicial</strong>.
                  </Step>
                </ol>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

function Step({
  index,
  icon,
  children,
}: {
  index: number
  icon?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-bone/[0.06] text-[0.7rem] text-ember ring-1 ring-bone/10">
        {icon ?? index}
      </span>
      <p className="text-[0.85rem] leading-relaxed text-dust">{children}</p>
    </li>
  )
}
