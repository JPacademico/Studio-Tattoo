import { cn } from '@/lib/utils'

/**
 * Decorative coil tattoo machine mark. Pure inline SVG — no asset request,
 * no filters, ~15 lightweight shapes — and no idle animation: the needle
 * only "buzzes" while genuinely hovered (see the `.sjt-machine` rules in
 * index.css), so it costs nothing while it just sits on the page.
 */
export function TattooMachineIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 200"
      className={cn('sjt-machine', className)}
      aria-hidden="true"
      fill="none"
    >
      <g transform="rotate(-35 120 100)">
        {/* power cord */}
        <path
          d="M190 101 C 208 94, 214 114, 198 121"
          className="stroke-bone/25"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* coils */}
        <circle cx="121" cy="68" r="17" className="sjt-coil stroke-ember" strokeWidth="3" />
        <circle cx="121" cy="68" r="4.5" className="fill-ember/70" />
        <circle cx="156" cy="68" r="17" className="sjt-coil stroke-ember" strokeWidth="3" />
        <circle cx="156" cy="68" r="4.5" className="fill-ember/70" />

        {/* struts joining coils to the frame */}
        <path
          d="M121 85 L121 96 M156 85 L156 96"
          className="stroke-bone/45"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* frame / grip */}
        <rect x="86" y="90" width="104" height="22" rx="11" className="stroke-bone/70" strokeWidth="3" />

        {/* trigger */}
        <path d="M168 112 L168 127" className="stroke-bone/45" strokeWidth="3" strokeLinecap="round" />
        <circle cx="168" cy="131" r="4" className="fill-bone/45" />

        {/* nose cone */}
        <path
          d="M86 93 L57 98 L57 104 L86 109 Z"
          className="fill-ash stroke-bone/70"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* needle — the only part that ever moves, and only on hover */}
        <g className="sjt-needle">
          <path d="M57 101 L25 101" className="stroke-bone" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="23" cy="101" r="2.5" className="fill-bone" />
        </g>

        {/* ink drop — fades and drips in on hover */}
        <circle cx="19" cy="109" r="3" className="sjt-drop fill-ember-bright" />
      </g>
    </svg>
  )
}
