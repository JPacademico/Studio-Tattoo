# Studio Junior Tattoo — UI

Front-end prototype for a tattoo studio in Aracaju/SE: a marketing home page plus a
booking flow. **Everything is mocked** — there is no backend, no database and no
network write of any kind. Confirming a booking simulates a request and returns a
protocol code.

Built with Vite 8 + React 19 + TypeScript, Tailwind v4, Framer Motion and Leaflet.
Interface copy is pt-BR.

## Routes

| Path       | What's there                                                        |
| ---------- | ------------------------------------------------------------------- |
| `/`        | Hero, sobre nós, processo, manifesto, FAQ, mapa e contato            |
| `/galeria` | Artistas e o mural de polaroids, com filtro por artista e lightbox   |
| `/agendar` | Booking flow (`?modo=agendar`) and WhatsApp handoff (`?modo=planejar`) |

Only `/` ships in the entry chunk. `/galeria` and `/agendar` are code-split and
prefetched on idle, so navigation is instant without inflating the first load.

## Running it

```bash
npm install
```

```bash
npm run dev
```

| Script            | What it does                                          |
| ----------------- | ----------------------------------------------------- |
| `npm run dev`     | Dev server (honours `PORT`, defaults to 5173)          |
| `npm run build`   | Typecheck + production build into `dist/`              |
| `npm run preview` | Serves `dist/` — **use this to test the PWA**          |
| `npm run icons`   | Regenerates `public/icons/*` from the inline SVG mark  |
| `npm run typecheck` | Types only                                          |

The service worker is disabled in dev (`devOptions.enabled: false`) so you never
fight a stale cache while working. Install, offline mode and the update prompt only
appear under `npm run preview` or a real deploy.

## Changing the content

All copy, artists, photos, hours, address and FAQ live in **`src/data/studio.ts`**.
Nothing else needs editing to rebrand the site:

- `studio` — name, address, map coordinates, opening hours, WhatsApp, Instagram
- `artists` — the four artists, each with their own workdays, time slots, session
  length and WhatsApp number (these drive the booking calendar)
- `gallery`, `processSteps`, `faq`, `differentials` — page content

Photos are Unsplash IDs resolved through `src/lib/images.ts`. To move to local
files, change `photo()` there and drop the images in `public/`.

To move the map pin, edit `studio.coords`.

## How the booking works

`/agendar` has two modes, switched by `?modo=`:

- **`agendar`** — a four-step flow: artist → day and time → contact details and
  reference images → review → confirmation. Progress is saved to `localStorage`,
  so a refresh mid-booking doesn't lose anything.
- **`planejar`** — pick an artist (or "ainda não sei"), describe the idea, and hand
  off to that artist's WhatsApp with the message pre-filled.

Deep links work: `/agendar?modo=agendar&artista=bia` preselects the artist and jumps
straight to the calendar.

Availability is generated, not stored. `src/lib/availability.ts` hashes
`artist|date|time` so a given slot is *consistently* busy across reloads — it looks
like a real agenda instead of random noise. Slots also close 2h before start on the
same day. Override specific slots via `mockBusySlots` in `studio.ts`.

Attached images never leave the device: they become object URLs for the preview and
are revoked on unmount. The success screen offers a WhatsApp handoff and an `.ics`
download instead.

## PWA

Installable and works offline after the first visit. Verified in a production
preview: manifest parses, the service worker activates and controls the page, and a
reload with the network disabled still boots the full site — including the remote
photography, which is picked up by a `CacheFirst` runtime cache for
`images.unsplash.com`. Map tiles and Google Fonts are cached the same way.

Updates use `registerType: 'prompt'` — a new build shows a toast rather than
swapping the app out from under someone mid-booking.

Install affordance: Chromium gets a custom card wired to `beforeinstallprompt`; iOS
Safari never fires that event, so it gets a "Compartilhar → Adicionar à Tela de
Início" explainer instead. Both appear after 9s and stay dismissed.

## Deploying

Configured for **Vercel** via `vercel.json` — framework, build command, SPA
rewrite and cache headers are all in there. Point Vercel's **Root Directory** at
`Studio-Junior-Tattoo-UI` (the app is a subfolder of the repo) and deploy.

On any other static host the one hard requirement is a **rewrite of unknown paths
to `/index.html`**, otherwise a hard refresh on `/galeria` or `/agendar` 404s.

- Netlify: `/* /index.html 200` in `_redirects`
- Nginx: `try_files $uri $uri/ /index.html;`

## Notes and limitations

- **The data is invented.** Artist names, bios, phone numbers, the address and the
  photography are placeholders for the prototype. Replace before showing a client.
- The WhatsApp numbers (`5579999990001`–`4`) are not real; the links are correctly
  formed and will open WhatsApp with a pre-filled message to a dead number.
- Respects `prefers-reduced-motion` throughout — parallax, reveals and the drifting
  background all shut off.

### Performance choices worth knowing

Scroll smoothness was tuned deliberately; a few things look odd until you know why:

- **Reveals are CSS, not JS.** `Reveal`/`RevealWords` share a single
  IntersectionObserver and animate with compositor-only transitions. They're used
  ~40 times — one motion component and one observer each was the biggest
  main-thread cost on the page. No blur in the transition, for the same reason.
- **No `mix-blend-mode` on the grain overlay.** A fixed, full-viewport blended
  layer forces the compositor to re-blend the whole screen every scroll frame.
- **The drifting haze only animates on `hover: hover` pointers.** Phones get it
  static, so no oversized layer is being transformed during touch scrolling.
- **Header uses `backdrop-blur-md`, not `-xl`,** with a more opaque background to
  compensate. It's on screen permanently, so the filter is re-evaluated constantly.
- **Image placeholders are a static gradient.** A shimmer animates
  `background-position`, which can't be composited and repaints every frame — bad
  news on a page with a dozen images loading at once.
- ~126 kB gzipped on first load. Leaflet (~48 kB gz) is dynamically imported and
  only fetched when the map scrolls into view. Framer Motion is the largest
  remaining dependency; it's still needed for layout animations, drag and
  scroll-linked effects, so `LazyMotion` would need `domMax` and wouldn't save
  much.
- Targets Safari 14+ / Chrome 87+ so older iOS devices can still install it.
