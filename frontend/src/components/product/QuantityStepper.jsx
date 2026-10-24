import { Minus, Plus } from 'lucide-react'
import { cn } from '../../utils/cn'

const SIZES = {
  sm: { box: 'h-9', button: 'w-9', value: 'w-8 text-sm' },
  md: { box: 'h-11', button: 'w-11', value: 'w-10 text-[15px]' },
  lg: { box: 'h-13', button: 'w-12', value: 'w-11 text-base' },
}

/**
 * − value + control. Buttons disable at the bounds so the limit is visible,
 * and the value is announced politely as it changes.
 */
export default function QuantityStepper({ value, onChange, min = 1, max = 10, size = 'md', label = 'Quantity', className }) {
  const styles = SIZES[size]
  const buttonClass = cn(
    'grid h-full place-items-center text-muted transition-colors hover:bg-subtle hover:text-ink disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent',
    styles.button,
  )

  return (
    <div role="group" aria-label={label} className={cn('inline-flex items-center overflow-hidden rounded-control border bg-surface', styles.box, className)}>
      <button type="button" onClick={() => onChange(value - 1)} disabled={value <= min} aria-label="Decrease quantity" className={buttonClass}>
        <Minus className="h-4 w-4" />
      </button>
      <output aria-live="polite" className={cn('tabular text-center font-semibold text-ink', styles.value)}>
        {value}
      </output>
      <button type="button" onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="Increase quantity" className={buttonClass}>
        <Plus className="h-4 w-4" />
      </button>
    </div>
  )
}
