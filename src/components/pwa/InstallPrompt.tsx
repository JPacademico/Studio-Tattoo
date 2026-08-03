import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Download, Share, Smartphone, X } from 'lucide-react'
import { LogoMark } from '@/components/layout/Logo'
import { useToast } from '@/components/ui/Toast'
import { useInstallPrompt } from './useInstallPrompt'

const DISMISS_KEY = 'sjt:install-dismissed'
const DELAY_MS = 9000

function wasDismissed(): boolean {
  try {
    return window.localStorage.getItem(DISMISS_KEY) === '1'
  } catch {
    return false
  }
}

/**
 * Chromium fires `beforeinstallprompt`; iOS Safari never does, so it gets a
 * short "Compartilhar → Adicionar à Tela de Início" explainer instead.
 */
export function InstallPrompt() {
  const { canInstall, installed, install, iosSafari } = useInstallPrompt()
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(wasDismissed)
  const toast = useToast()

  const eligible = !installed && !dismissed && (canInstall || iosSafari)

  useEffect(() => {
    if (!eligible) {
      setVisible(false)
      return
    }
    // Let people actually look at the site before pitching the install.
    const timer = setTimeout(() => setVisible(true), DELAY_MS)
    return () => clearTimeout(timer)
  }, [eligible])

  function close() {
    setVisible(false)
    setDismissed(true)
    try {
      window.localStorage.setItem(DISMISS_KEY, '1')
    } catch {
      /* private mode — it just reappears next session */
    }
  }

  async function handleInstall() {
    const outcome = await install()
    if (outcome === 'accepted') {
      toast.success('App instalado', 'O Studio Junior agora está na sua tela inicial.')
      close()
    } else if (outcome === 'dismissed') {
      setVisible(false)
    }
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          initial={{ opacity: 0, y: 26, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          className="fixed inset-x-4 bottom-4 z-[150] mx-auto max-w-sm overflow-hidden rounded-2xl border border-bone/12 bg-coal/95 p-4 shadow-[0_26px_70px_-16px_rgb(0_0_0/0.85)] backdrop-blur-xl sm:right-6 sm:left-auto sm:bottom-6 sm:mx-0"
          style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background: 'radial-gradient(120% 100% at 0% 0%, rgb(212 64 42 / 0.16), transparent 60%)',
            }}
          />

          <button
            type="button"
            onClick={close}
            aria-label="Dispensar"
            className="absolute top-2.5 right-2.5 grid size-7 place-items-center rounded-full text-muted transition-colors hoverable:hover:bg-bone/10 hoverable:hover:text-bone"
          >
            <X size={14} />
          </button>

          <div className="relative flex items-start gap-3 pr-6">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-bone/[0.06] ring-1 ring-bone/10">
              <LogoMark className="size-5 text-ember" />
            </span>

            <div>
              <p className="text-[0.9rem] font-medium text-bone">Instale o Studio Junior</p>
              <p className="mt-1 text-[0.78rem] leading-relaxed text-muted">
                {iosSafari && !canInstall
                  ? 'Abra o menu Compartilhar e toque em "Adicionar à Tela de Início" para usar como app.'
                  : 'Acesso rápido pela tela inicial, funciona offline e abre em tela cheia.'}
              </p>
            </div>
          </div>

          <div className="relative mt-4">
            {iosSafari && !canInstall ? (
              <div className="flex items-center justify-center gap-2 rounded-xl border border-bone/10 bg-bone/[0.03] px-3 py-2.5 text-[0.78rem] text-dust">
                <Share size={15} className="text-ember" />
                <span>Compartilhar</span>
                <span className="text-muted">→</span>
                <Smartphone size={15} className="text-ember" />
                <span>Tela de Início</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleInstall}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-bone px-4 py-2.5 text-[0.82rem] font-medium text-ink transition-colors hoverable:hover:bg-white"
              >
                <Download size={15} />
                Instalar app
              </button>
            )}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
