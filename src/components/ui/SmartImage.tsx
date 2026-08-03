import { useState } from 'react'
import { photo, photoSrcSet } from '@/lib/images'
import { cn } from '@/lib/utils'

type SmartImageProps = {
  photoId: string
  alt: string
  width: number
  height?: number
  sizes?: string
  className?: string
  imgClassName?: string
  /** Set on the hero image only — everything else stays lazy. */
  priority?: boolean
}

/**
 * Remote imagery needs three things the bare `<img>` doesn't give us:
 * a placeholder while it streams, a fade so it doesn't pop in, and a
 * graceful fallback when a URL rots or the device is offline.
 */
export function SmartImage({
  photoId,
  alt,
  width,
  height,
  sizes,
  className,
  imgClassName,
  priority = false,
}: SmartImageProps) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading')

  return (
    <div className={cn('relative overflow-hidden bg-ash', className)}>
      {status !== 'loaded' && (
        <div
          aria-hidden
          className={cn(
            'absolute inset-0',
            // Static gradient, not a shimmer: animating background-position
            // can't be composited, so a page full of loading images repaints
            // on every frame.
            status === 'loading' && 'bg-[linear-gradient(105deg,#171719,#24242a,#171719)]',
          )}
        >
          {status === 'error' && <InkFallback />}
        </div>
      )}

      <img
        src={photo(photoId, { w: width, h: height })}
        srcSet={photoSrcSet(photoId, { w: width, h: height })}
        sizes={sizes ?? `${width}px`}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        onLoad={() => setStatus('loaded')}
        onError={() => setStatus('error')}
        className={cn(
          'size-full object-cover transition-opacity duration-700 ease-out',
          status === 'loaded' ? 'opacity-100' : 'opacity-0',
          imgClassName,
        )}
      />
    </div>
  )
}

/** Shown when a photo can't be fetched — reads as intentional, not broken. */
function InkFallback() {
  return (
    <div className="grid size-full place-items-center bg-[radial-gradient(120%_100%_at_30%_20%,#26262c,#0b0b0d)]">
      <svg viewBox="0 0 64 64" className="size-1/3 max-w-24 text-bone/12" aria-hidden>
        <path
          fill="currentColor"
          d="M32 4c3 9 7 12 12 17s7 9 7 15c0 10-8.5 18-19 18S13 46 13 36c0-6 2-10 7-15S29 13 32 4Z"
        />
        <circle cx="26" cy="34" r="3" className="fill-ink" />
      </svg>
    </div>
  )
}
