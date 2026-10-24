import { cn } from '../../utils/cn'

/**
 * Availability line. Always pairs the coloured dot with text so stock is
 * never communicated by colour alone.
 */
export default function StockStatus({ stock, lowStock, className }) {
  const state = stock === 0 ? 'out' : lowStock ? 'low' : 'in'
  const config = {
    in: { label: 'In stock', dot: 'bg-success', text: 'text-success' },
    low: { label: `Only ${stock} left`, dot: 'bg-warning', text: 'text-warning' },
    out: { label: 'Out of stock', dot: 'bg-faint', text: 'text-muted' },
  }[state]

  return (
    <p className={cn('flex items-center gap-1.5 text-xs font-semibold', config.text, className)}>
      <span className={cn('h-1.5 w-1.5 shrink-0 rounded-full', config.dot)} aria-hidden="true" />
      {config.label}
    </p>
  )
}
