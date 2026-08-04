import { useState } from 'react'
import { Download } from 'lucide-react'
import { useToast } from '@/components/ui/Toast'
import { buttonStyles } from '@/components/ui/Button'
import { useInstallPrompt } from './useInstallPrompt'
import { InstallGuideModal } from './InstallGuideModal'

type InstallButtonProps = {
  /** `icon`: round icon-only button for the desktop/tablet header.
   *  `block`: full-width labelled button for the mobile menu sheet. */
  variant?: 'icon' | 'block'
  className?: string
}

/**
 * Replaces the old auto-popup: install is now opt-in, triggered from the nav.
 * Chromium gets the native prompt directly; everywhere else (iOS Safari, or
 * Chromium before it has offered the prompt) gets a short how-to modal.
 */
export function InstallButton({ variant = 'icon', className }: InstallButtonProps) {
  const { canInstall, installed, install, iosSafari } = useInstallPrompt()
  const [modalOpen, setModalOpen] = useState(false)
  const toast = useToast()

  // Nothing to install once it's already on the home screen.
  if (installed) return null

  async function handleClick() {
    if (canInstall) {
      const outcome = await install()
      if (outcome === 'accepted') {
        toast.success('App instalado', 'O Studio Junior agora está na sua tela inicial.')
      }
      return
    }
    setModalOpen(true)
  }

  async function handleInstallNow() {
    const outcome = await install()
    if (outcome === 'accepted') {
      toast.success('App instalado', 'O Studio Junior agora está na sua tela inicial.')
      setModalOpen(false)
    }
  }

  return (
    <>
      {variant === 'icon' ? (
        <button
          type="button"
          onClick={handleClick}
          aria-label="Instalar aplicativo"
          className={
            className ??
            'hidden size-10 place-items-center rounded-full border border-ember/30 bg-ember/[0.06] text-ember transition-colors hoverable:hover:border-ember hoverable:hover:text-ember-bright sm:grid'
          }
        >
          <Download size={17} />
        </button>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          className={className ?? buttonStyles('outline', 'lg', 'w-full')}
        >
          <Download size={17} />
          Instalar app
        </button>
      )}

      <InstallGuideModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        iosSafari={iosSafari}
        canInstall={canInstall}
        onInstallNow={handleInstallNow}
      />
    </>
  )
}
