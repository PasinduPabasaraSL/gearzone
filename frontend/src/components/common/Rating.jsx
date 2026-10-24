import { Star } from 'lucide-react'
import { cn } from '../../utils/cn'

const SIZES = { sm: 'h-3.5 w-3.5', md: 'h-4 w-4', lg: 'h-5 w-5' }

function StarRow({ filled, sizeClass }) {
  return (
    <span className="flex">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn(
            sizeClass,
            'shrink-0',
            filled ? 'fill-warning text-warning' : 'fill-line text-line',
          )}
          strokeWidth={1.5}
        />
      ))}
    </span>
  )
}

/**
 * Five-star rating with fractional fill, achieved by clipping a filled row
 * over an empty row. The numeric value is exposed to assistive tech so the
 * rating is never communicated by colour alone.
 */
export default function Rating({
  value = 0,
  reviewCount,
  size = 'md',
  showValue = false,
  className,
}) {
  const clamped = Math.max(0, Math.min(5, Number(value) || 0))
  const sizeClass = SIZES[size]

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <span
        className="relative inline-flex shrink-0"
        role="img"
        aria-label={`Rated ${clamped.toFixed(1)} out of 5`}
      >
        <StarRow filled={false} sizeClass={sizeClass} />
        <span
          className="absolute inset-y-0 left-0 flex overflow-hidden"
          style={{ width: `${(clamped / 5) * 100}%` }}
        >
          <StarRow filled sizeClass={sizeClass} />
        </span>
      </span>
      {showValue && (
        <span className="tabular text-[13px] font-semibold text-ink">{clamped.toFixed(1)}</span>
      )}
      {typeof reviewCount === 'number' && (
        <span className="tabular text-[13px] text-muted">({reviewCount})</span>
      )}
    </div>
  )
}
