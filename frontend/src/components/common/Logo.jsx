import { Link } from 'react-router-dom'
import { cn } from '../../utils/cn'

/**
 * Text-based wordmark with a small geometric mark. The mark repeats the
 * bracketed "Z" from the favicon; swapping in a real logo later means editing
 * only this file.
 */
export default function Logo({ to = '/', showWordmark = true, onStrip = false, className }) {
  return (
    <Link
      to={to}
      aria-label="GearZoneLK — home"
      className={cn('group inline-flex shrink-0 items-center gap-2.5', className)}
    >
      <span className="grid h-9 w-9 place-items-center rounded-[10px] bg-accent shadow-xs transition-transform duration-200 group-hover:-rotate-3">
        <svg viewBox="0 0 32 32" className="h-5 w-5" aria-hidden="true">
          <path
            d="M10.5 10.5h11L10.5 21.5h11"
            fill="none"
            stroke="currentColor"
            className="text-white"
            strokeWidth="3.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {showWordmark && (
        <span
          className={cn(
            'text-[19px] leading-none font-extrabold tracking-[-0.03em]',
            onStrip ? 'text-on-strip' : 'text-ink',
          )}
        >
          GearZone
          <span className={onStrip ? 'text-brand-400' : 'text-link'}>LK</span>
        </span>
      )}
    </Link>
  )
}
