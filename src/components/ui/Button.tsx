import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from '@/lib/router'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'outline' | 'ghost' | 'ember'
type Size = 'sm' | 'md' | 'lg'

const BASE =
  'group relative inline-flex select-none items-center justify-center gap-2 rounded-full font-sans font-medium tracking-wide transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40'

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-bone text-ink shadow-[0_10px_30px_-10px_rgb(236_231_221/0.45)] hoverable:hover:bg-white hoverable:hover:shadow-[0_16px_40px_-12px_rgb(236_231_221/0.6)]',
  ember:
    'bg-ember text-bone shadow-[0_10px_30px_-10px_rgb(212_64_42/0.7)] hoverable:hover:bg-ember-bright',
  outline:
    'border border-bone/22 text-bone hoverable:hover:border-bone/55 hoverable:hover:bg-bone/[0.06]',
  ghost: 'text-dust hoverable:hover:text-bone hoverable:hover:bg-bone/[0.06]',
}

const SIZES: Record<Size, string> = {
  sm: 'h-9 px-4 text-[0.78rem]',
  md: 'h-11 px-6 text-[0.85rem]',
  lg: 'h-13 px-8 text-[0.9rem]',
}

export function buttonStyles(variant: Variant = 'primary', size: Size = 'md', className?: string) {
  return cn(BASE, VARIANTS[variant], SIZES[size], className)
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: Size
}

export function Button({ variant = 'primary', size = 'md', className, ...rest }: ButtonProps) {
  return <button className={buttonStyles(variant, size, className)} {...rest} />
}

export function ButtonLink({
  to,
  variant = 'primary',
  size = 'md',
  className,
  children,
}: {
  to: string
  variant?: Variant
  size?: Size
  className?: string
  children: ReactNode
}) {
  return (
    <Link to={to} className={buttonStyles(variant, size, className)}>
      {children}
    </Link>
  )
}

export function ExternalButtonLink({
  href,
  variant = 'primary',
  size = 'md',
  className,
  children,
}: {
  href: string
  variant?: Variant
  size?: Size
  className?: string
  children: ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={buttonStyles(variant, size, className)}
    >
      {children}
    </a>
  )
}
