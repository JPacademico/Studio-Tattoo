/**
 * Unsplash delivers derivatives straight off the URL, so we never ship an
 * oversized file. Everything goes through here — swap this one function for a
 * local `/gallery/*` path later and the whole site follows.
 */
const HOST = 'https://images.unsplash.com'

type ImgOpts = {
  w: number
  h?: number
  q?: number
}

export function photo(id: string, { w, h, q = 68 }: ImgOpts): string {
  const params = new URLSearchParams({
    auto: 'format',
    fit: 'crop',
    crop: 'entropy',
    w: String(w),
    q: String(q),
  })
  if (h) params.set('h', String(h))
  return `${HOST}/${id}?${params.toString()}`
}

/** Builds a 1x/2x srcset so retina phones stay sharp without doubling desktop bytes. */
export function photoSrcSet(id: string, { w, h, q = 68 }: ImgOpts): string {
  const at = (scale: number) =>
    `${photo(id, { w: w * scale, h: h ? h * scale : undefined, q })} ${w * scale}w`
  return [at(1), at(2)].join(', ')
}
