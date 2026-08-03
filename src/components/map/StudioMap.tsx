import { useMemo, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer, ZoomControl } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { fullAddress, studio } from '@/data/studio'

/**
 * Dark CARTO basemap over OpenStreetMap data — no API key, and the palette
 * matches the site instead of fighting it.
 */
const TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
const ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'

function isTouchDevice(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
}

export default function StudioMap() {
  // On touch, one-finger drag would steal the page scroll — gate it behind a tap.
  const [interactive, setInteractive] = useState(() => !isTouchDevice())

  const icon = useMemo(
    () =>
      L.divIcon({
        className: 'sjt-marker',
        iconSize: [44, 44],
        iconAnchor: [22, 22],
        popupAnchor: [0, -18],
        html: `
          <span class="relative grid size-11 place-items-center">
            <span class="absolute size-11 rounded-full bg-[#d4402a]/25 animate-pulse-ring"></span>
            <span class="absolute size-6 rounded-full bg-[#d4402a]/30"></span>
            <span class="relative size-3 rounded-full bg-[#ff6a4d] shadow-[0_0_12px_rgba(255,106,77,0.9)]"></span>
          </span>`,
      }),
    [],
  )

  return (
    <div className="relative size-full">
      <MapContainer
        center={[studio.coords.lat, studio.coords.lng]}
        zoom={studio.mapZoom}
        zoomControl={false}
        scrollWheelZoom={false}
        dragging={interactive}
        touchZoom={interactive}
        doubleClickZoom={interactive}
        attributionControl
        className="size-full"
        style={{ background: '#050506' }}
      >
        <TileLayer url={TILE_URL} attribution={ATTRIBUTION} maxZoom={19} detectRetina />
        <ZoomControl position="bottomright" />

        <Marker position={[studio.coords.lat, studio.coords.lng]} icon={icon}>
          <Popup>
            <strong className="block text-[13px] font-semibold">{studio.name}</strong>
            <span className="mt-1 block text-[12px] opacity-75">{fullAddress}</span>
          </Popup>
        </Marker>
      </MapContainer>

      {!interactive && (
        <button
          type="button"
          onClick={() => setInteractive(true)}
          className="absolute inset-0 z-[400] grid place-items-center bg-void/45 backdrop-blur-[2px]"
        >
          <span className="rounded-full border border-bone/20 bg-ink/85 px-4 py-2 text-[0.78rem] text-bone">
            Toque para explorar o mapa
          </span>
        </button>
      )}
    </div>
  )
}
