import { formatCurrency } from '../../utils/formatCurrency'
import { cn } from '../../utils/cn'

const SIZES = {
  sm: { now: 'text-[15px]', was: 'text-xs' },
  md: { now: 'text-[17px]', was: 'text-[13px]' },
  lg: { now: 'text-2xl', was: 'text-sm' },
  xl: { now: 'text-[32px]', was: 'text-base' },
}

/**
 * Price display with optional strike-through original and saved percentage.
 * Tabular figures keep prices aligned down a product grid column.
 */
export default function Price({
  value,
  compareAtPrice,
  discount = 0,
  size = 'md',
  showDiscount = true,
  className,
}) {
  const hasCompare = Boolean(compareAtPrice) && compareAtPrice > value
  const styles = SIZES[size]

  return (
    <div className={cn('flex flex-wrap items-baseline gap-x-2 gap-y-1', className)}>
      <span className={cn('tabular font-bold text-ink', styles.now)}>{formatCurrency(value)}</span>
      {hasCompare && (
        <>
          <s className={cn('tabular text-faint', styles.was)}>{formatCurrency(compareAtPrice)}</s>
          {showDiscount && discount > 0 && (
            <span className={cn('tabular font-bold text-success', styles.was)}>
              −{discount}%
            </span>
          )}
        </>
      )}
    </div>
  )
}
