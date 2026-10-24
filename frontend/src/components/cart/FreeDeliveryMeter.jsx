import { CircleCheck, Truck } from 'lucide-react'
import { cn } from '../../utils/cn'
import { formatCurrency } from '../../utils/formatCurrency'

/** Progress towards free delivery: a gentle nudge, not a countdown. */
export default function FreeDeliveryMeter({ summary, className }) {
  const unlocked = summary.freeDeliveryRemaining === 0

  return (
    <div className={cn('rounded-card border bg-subtle p-3.5', className)}>
      <p className="flex items-center gap-2 text-[13px] text-ink">
        {unlocked ? (
          <>
            <CircleCheck className="h-4 w-4 text-success" aria-hidden="true" />
            <span className="font-semibold">You’ve unlocked free islandwide delivery.</span>
          </>
        ) : (
          <>
            <Truck className="h-4 w-4 text-link" aria-hidden="true" />
            <span>
              Add <span className="tabular font-bold">{formatCurrency(summary.freeDeliveryRemaining)}</span> more for free delivery.
            </span>
          </>
        )}
      </p>
      <div
        className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-line"
        role="progressbar"
        aria-label="Progress to free delivery"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(summary.freeDeliveryProgress * 100)}
      >
        <div
          className={cn('h-full rounded-full transition-[width] duration-500 ease-out', unlocked ? 'bg-success' : 'bg-accent')}
          style={{ width: `${summary.freeDeliveryProgress * 100}%` }}
        />
      </div>
    </div>
  )
}
