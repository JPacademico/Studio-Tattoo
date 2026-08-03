import { Suspense, lazy } from 'react'
import { Clock, Copy, Mail, MapPin, Navigation, Phone } from 'lucide-react'
import { fullAddress, studio } from '@/data/studio'
import { Reveal, RevealWords } from '@/components/ui/Reveal'
import { useInViewOnce } from '@/hooks'
import { useToast } from '@/components/ui/Toast'
import { InstagramIcon, WhatsAppIcon } from '@/components/ui/BrandIcons'
import { buttonStyles } from '@/components/ui/Button'
import { waLink } from '@/lib/utils'

// Leaflet is ~45 kB gzipped — it must never be in the initial bundle.
const StudioMap = lazy(() => import('@/components/map/StudioMap'))

const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${studio.coords.lat},${studio.coords.lng}`

export function Contact() {
  const toast = useToast()
  const [mapRef, mapVisible] = useInViewOnce<HTMLDivElement>('300px')

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(fullAddress)
      toast.success('Endereço copiado', 'Agora é só colar no seu app de mapas.')
    } catch {
      toast.error('Não deu para copiar', 'Seu navegador bloqueou o acesso à área de transferência.')
    }
  }

  return (
    <section id="contato" className="relative scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-[80rem]">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Reveal>
              <p className="eyebrow">Onde estamos</p>
            </Reveal>
            <h2 className="mt-4 text-[clamp(2.2rem,5.5vw,3.6rem)] leading-[0.95] text-bone">
              <RevealWords text="Grageru," className="block" />
              <RevealWords text="Aracaju/SE." className="block italic text-dust" delay={0.12} />
            </h2>
          </div>

          <Reveal delay={0.1}>
            <div className="flex flex-wrap gap-2">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonStyles('primary', 'sm')}
              >
                <Navigation size={14} />
                Como chegar
              </a>
              <button type="button" onClick={copyAddress} className={buttonStyles('outline', 'sm')}>
                <Copy size={14} />
                Copiar endereço
              </button>
            </div>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]">
          {/* Details */}
          <Reveal direction="right" className="order-2 lg:order-1">
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <InfoCard icon={<MapPin size={16} />} label="Endereço">
                <p className="text-[0.9rem] leading-relaxed text-bone">{studio.address.street}</p>
                <p className="text-[0.9rem] leading-relaxed text-dust">
                  {studio.address.district} · {studio.address.city}/{studio.address.state}
                </p>
                <p className="mt-1 text-[0.78rem] text-muted">CEP {studio.address.zip}</p>
              </InfoCard>

              <InfoCard icon={<Clock size={16} />} label="Horários">
                <dl className="space-y-1.5">
                  {studio.hours.map((h) => (
                    <div key={h.days} className="flex justify-between gap-4 text-[0.85rem]">
                      <dt className="text-dust">{h.days}</dt>
                      <dd className="shrink-0 text-bone tabular-nums">{h.time}</dd>
                    </div>
                  ))}
                </dl>
              </InfoCard>

              <InfoCard icon={<Phone size={16} />} label="Contato">
                <a
                  href={waLink(studio.whatsapp, 'Olá! Vim pelo site do Studio Junior Tattoo.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[0.9rem] text-bone transition-colors hoverable:hover:text-ember-bright"
                >
                  <WhatsAppIcon size={15} />
                  {studio.phoneDisplay}
                </a>
                <a
                  href={`mailto:${studio.email}`}
                  className="mt-2 flex items-center gap-2 text-[0.85rem] break-all text-dust transition-colors hoverable:hover:text-bone"
                >
                  <Mail size={15} className="shrink-0" />
                  {studio.email}
                </a>
                <a
                  href={`https://instagram.com/${studio.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 flex items-center gap-2 text-[0.85rem] text-dust transition-colors hoverable:hover:text-bone"
                >
                  <InstagramIcon size={15} className="shrink-0" />@{studio.instagram}
                </a>
              </InfoCard>
            </ul>
          </Reveal>

          {/* Map */}
          <Reveal direction="left" className="order-1 lg:order-2">
            <div
              ref={mapRef}
              className="relative h-[22rem] overflow-hidden rounded-2xl border border-bone/10 bg-void sm:h-[26rem] lg:h-full lg:min-h-[30rem]"
            >
              {mapVisible ? (
                <Suspense fallback={<MapSkeleton />}>
                  <StudioMap />
                </Suspense>
              ) : (
                <MapSkeleton />
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function InfoCard({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
}) {
  return (
    <li className="rounded-2xl border border-bone/10 bg-coal/50 p-5">
      <div className="flex items-center gap-2.5 text-ember">
        {icon}
        <span className="eyebrow text-dust">{label}</span>
      </div>
      <div className="mt-3.5">{children}</div>
    </li>
  )
}

function MapSkeleton() {
  return (
    <div className="grid size-full place-items-center bg-[radial-gradient(120%_100%_at_50%_0%,#16161a,#050506)]">
      <div className="flex flex-col items-center gap-3 text-muted">
        <MapPin size={20} className="animate-pulse" />
        <span className="text-[0.75rem] tracking-wide">carregando o mapa…</span>
      </div>
    </div>
  )
}
