import { cn } from '@/lib/utils'

/** Ink-drop monogram. Drawn rather than imported so it stays crisp and tiny. */
export function LogoMark({ className }: { className?: string }) {
  return (
    // Sizing comes from the caller — an unconditional `size-full` here would
    // beat any `size-*` passed in, since both land in the same Tailwind layer.
    <svg viewBox="0 0 32 32" className={cn('shrink-0', className ?? 'size-5')} aria-hidden>
      <path
        fill="currentColor"
        d="M16 2c1.7 5.1 3.9 7 6.7 9.7 2.8 2.7 4.1 5.2 4.1 8.4C26.8 26 22 30 16 30S5.2 26 5.2 20.1c0-3.2 1.3-5.7 4.1-8.4C12.1 9 14.3 7.1 16 2Z"
      />
      <path
        fill="var(--color-ink)"
        d="M13.4 18.6c1.5 0 2.6 1.1 2.6 2.5s-1.1 2.5-2.6 2.5-2.6-1.1-2.6-2.5 1.1-2.5 2.6-2.5Z"
      />
    </svg>
  )
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <LogoMark className="size-5 text-ember" />
      <span className="font-sans text-[0.78rem] font-semibold tracking-[0.2em] text-bone uppercase">
        Studio Junior
      </span>
    </span>
  )
}
