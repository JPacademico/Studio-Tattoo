import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, animate, motion, useMotionValue } from 'framer-motion'
import type { AnimationPlaybackControls } from 'framer-motion'
import { Check, Info, TriangleAlert, X } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'success' | 'error' | 'info'

type ToastInput = {
  title: string
  description?: string
  duration?: number
  icon?: ReactNode
}

type ToastItem = ToastInput & { id: number; variant: Variant; duration: number }

type ToastApi = {
  success: (title: string, description?: string, opts?: Partial<ToastInput>) => void
  error: (title: string, description?: string, opts?: Partial<ToastInput>) => void
  info: (title: string, description?: string, opts?: Partial<ToastInput>) => void
  dismiss: (id: number) => void
}

const ToastContext = createContext<ToastApi | null>(null)

const MAX_VISIBLE = 3

const VARIANTS: Record<Variant, { accent: string; glow: string; icon: ReactNode }> = {
  success: {
    accent: '#7ddc9a',
    glow: 'rgb(125 220 154 / 0.18)',
    icon: <Check size={15} strokeWidth={2.6} />,
  },
  error: {
    accent: '#ff6a4d',
    glow: 'rgb(255 106 77 / 0.2)',
    icon: <TriangleAlert size={15} strokeWidth={2.4} />,
  },
  info: {
    accent: '#c9c2b6',
    glow: 'rgb(201 194 182 / 0.14)',
    icon: <Info size={15} strokeWidth={2.4} />,
  },
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])
  const nextId = useRef(1)

  const dismiss = useCallback((id: number) => {
    setItems((current) => current.filter((item) => item.id !== id))
  }, [])

  const api = useMemo<ToastApi>(() => {
    const push = (variant: Variant) => (title: string, description?: string, opts?: Partial<ToastInput>) => {
      const item: ToastItem = {
        id: nextId.current++,
        variant,
        title,
        description,
        duration: opts?.duration ?? 5000,
        icon: opts?.icon,
      }
      // Oldest falls off the stack rather than letting toasts pile up forever.
      setItems((current) => [...current, item].slice(-MAX_VISIBLE))
    }

    return {
      success: push('success'),
      error: push('error'),
      info: push('info'),
      dismiss,
    }
  }, [dismiss])

  return (
    <ToastContext.Provider value={api}>
      {children}
      <ToastViewport items={items} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast precisa estar dentro de <ToastProvider>')
  return ctx
}

function ToastViewport({ items, onDismiss }: { items: ToastItem[]; onDismiss: (id: number) => void }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return createPortal(
    <div
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[200] flex flex-col items-center gap-2.5 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:inset-x-auto sm:right-6 sm:bottom-6 sm:items-end sm:px-0"
    >
      <AnimatePresence initial={false} mode="popLayout">
        {items.map((item) => (
          <ToastCard key={item.id} item={item} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>,
    document.body,
  )
}

function ToastCard({ item, onDismiss }: { item: ToastItem; onDismiss: (id: number) => void }) {
  const { accent, glow, icon } = VARIANTS[item.variant]
  const progress = useMotionValue(1)
  const controls = useRef<AnimationPlaybackControls | null>(null)

  useEffect(() => {
    // Driven as a motion value so the countdown never re-renders React.
    controls.current = animate(progress, 0, {
      duration: item.duration / 1000,
      ease: 'linear',
      onComplete: () => onDismiss(item.id),
    })
    return () => controls.current?.stop()
  }, [item.duration, item.id, onDismiss, progress])

  const pause = () => controls.current?.pause()
  const resume = () => controls.current?.play()

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 28, scale: 0.94, filter: 'blur(6px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: 12, scale: 0.9, filter: 'blur(4px)', transition: { duration: 0.22 } }}
      transition={{ type: 'spring', stiffness: 380, damping: 32, mass: 0.7 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.35}
      onDragStart={pause}
      onDragEnd={(_, info) => {
        if (Math.abs(info.offset.x) > 90 || Math.abs(info.velocity.x) > 500) onDismiss(item.id)
        else resume()
      }}
      onHoverStart={pause}
      onHoverEnd={resume}
      role="status"
      className="pointer-events-auto relative w-full max-w-[26rem] cursor-grab overflow-hidden rounded-2xl border border-bone/12 bg-coal/95 shadow-[0_22px_60px_-12px_rgb(0_0_0/0.8)] backdrop-blur-xl active:cursor-grabbing sm:w-[22rem]"
    >
      {/* Accent wash bleeding in from the icon side */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: `radial-gradient(120% 100% at 0% 0%, ${glow}, transparent 62%)` }}
      />

      <div className="relative flex items-start gap-3 p-3.5 pr-10">
        <span
          className="relative mt-0.5 grid size-7 shrink-0 place-items-center rounded-full"
          style={{ background: glow, color: accent }}
        >
          {/* Ink-blot ripple on entry */}
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-full"
            style={{ border: `1px solid ${accent}` }}
            initial={{ scale: 0.7, opacity: 0.9 }}
            animate={{ scale: 1.9, opacity: 0 }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
          />
          {item.icon ?? icon}
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-[0.9rem] leading-snug font-medium text-bone">{item.title}</p>
          {item.description && (
            <p className="mt-1 text-[0.8rem] leading-relaxed text-dust/85">{item.description}</p>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={() => onDismiss(item.id)}
        aria-label="Fechar notificação"
        className="absolute top-2.5 right-2.5 grid size-7 place-items-center rounded-full text-muted transition-colors hoverable:hover:bg-bone/10 hoverable:hover:text-bone"
      >
        <X size={14} />
      </button>

      <motion.div
        aria-hidden
        className={cn('absolute inset-x-0 bottom-0 h-[2px] origin-left')}
        style={{ scaleX: progress, background: accent }}
      />
    </motion.div>
  )
}
