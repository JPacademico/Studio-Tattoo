import { AnimatePresence, motion } from 'framer-motion'
import { RefreshCw, X } from 'lucide-react'
import { useRegisterSW } from 'virtual:pwa-register/react'

/**
 * `registerType: 'prompt'` means a new build waits for the user's OK instead of
 * swapping under their feet — important mid-booking.
 */
export function ReloadPrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisterError(error) {
      console.error('Falha ao registrar o service worker:', error)
    },
  })

  return (
    <AnimatePresence>
      {needRefresh && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ type: 'spring', stiffness: 340, damping: 30 }}
          role="status"
          className="fixed inset-x-4 top-[max(1rem,env(safe-area-inset-top))] z-[190] mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-bone/12 bg-coal/95 p-3 pl-4 shadow-[0_20px_50px_-14px_rgb(0_0_0/0.8)] backdrop-blur-xl"
        >
          <RefreshCw size={16} className="shrink-0 text-ember" />
          <p className="flex-1 text-[0.82rem] text-bone">Uma versão nova do site está pronta.</p>

          <button
            type="button"
            onClick={() => updateServiceWorker(true)}
            className="rounded-full bg-bone px-3.5 py-1.5 text-[0.76rem] font-medium text-ink transition-colors hoverable:hover:bg-white"
          >
            Atualizar
          </button>
          <button
            type="button"
            onClick={() => setNeedRefresh(false)}
            aria-label="Agora não"
            className="grid size-7 shrink-0 place-items-center rounded-full text-muted transition-colors hoverable:hover:text-bone"
          >
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
