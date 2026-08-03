/**
 * Renders the PWA icon set from an inline SVG.
 * Run with: npm run icons
 */
import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'public', 'icons')

const INK = '#0b0b0d'
const EMBER = '#d4402a'

/** The ink drop from `src/components/layout/Logo.tsx`, in a 32×32 box. */
const DROP =
  'M16 2c1.7 5.1 3.9 7 6.7 9.7 2.8 2.7 4.1 5.2 4.1 8.4C26.8 26 22 30 16 30S5.2 26 5.2 20.1c0-3.2 1.3-5.7 4.1-8.4C12.1 9 14.3 7.1 16 2Z'
const HIGHLIGHT =
  'M13.4 18.6c1.5 0 2.6 1.1 2.6 2.5s-1.1 2.5-2.6 2.5-2.6-1.1-2.6-2.5 1.1-2.5 2.6-2.5Z'

/**
 * @param size    output edge length in px
 * @param cover   fraction of the canvas the mark should occupy
 * @param radius  corner radius; 50% of size renders a circle
 */
function icon(size, { cover, radius, bleed = false }) {
  const markSize = size * cover
  const scale = markSize / 32
  const offset = (size - markSize) / 2

  return Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <radialGradient id="bg" cx="50%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#1b1b1f"/>
      <stop offset="100%" stop-color="${INK}"/>
    </radialGradient>
  </defs>
  <rect width="${size}" height="${size}" ${bleed ? '' : `rx="${radius}"`} fill="url(#bg)"/>
  <g transform="translate(${offset} ${offset}) scale(${scale})">
    <path d="${DROP}" fill="${EMBER}"/>
    <path d="${HIGHLIGHT}" fill="${INK}"/>
  </g>
</svg>`)
}

await mkdir(outDir, { recursive: true })

const targets = [
  // Standard icons: mark fills most of a rounded tile.
  { file: 'icon-192.png', size: 192, cover: 0.6, radius: 42 },
  { file: 'icon-512.png', size: 512, cover: 0.6, radius: 112 },
  // Maskable: the platform may crop to a circle, so keep the mark inside the
  // 80% safe zone and let the background bleed edge-to-edge.
  { file: 'icon-maskable-512.png', size: 512, cover: 0.42, radius: 0, bleed: true },
  // iOS applies its own mask and dislikes transparency.
  { file: 'apple-touch-icon.png', size: 180, cover: 0.58, radius: 0, bleed: true },
]

for (const { file, size, ...opts } of targets) {
  await sharp(icon(size, opts)).png({ compressionLevel: 9 }).toFile(join(outDir, file))
  console.log(`✓ icons/${file}  ${size}×${size}`)
}

// Favicon lives at the web root, not in /icons.
await sharp(icon(64, { cover: 0.66, radius: 14 }))
  .png({ compressionLevel: 9 })
  .toFile(join(root, 'public', 'favicon-64.png'))
console.log('✓ favicon-64.png  64×64')
