import { cn } from '../../utils/cn'

function Keycap({ label, accent = false, className }) {
  return (
    <span
      className={cn(
        'grid aspect-square w-20 place-items-center rounded-[18px] border-b-[6px] text-3xl font-extrabold shadow-lift sm:w-28 sm:text-5xl',
        accent ? 'border-brand-800 bg-accent text-white' : 'border-line-strong bg-surface text-ink',
        className,
      )}
    >
      {label}
    </span>
  )
}

/** CSS keycaps spelling 404. Shown when the 3D version cannot run. */
export default function KeycapFallback() {
  return (
    <div className="flex items-end justify-center gap-3 sm:gap-4" aria-hidden="true">
      <Keycap label="4" className="-rotate-6" />
      <Keycap label="0" accent className="-translate-y-3 rotate-3" />
      <Keycap label="4" className="rotate-6" />
    </div>
  )
}
