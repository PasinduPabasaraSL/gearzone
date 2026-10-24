import { formatCurrency } from '../../utils/formatCurrency'
import { cn } from '../../utils/cn'

/** Price breakdown shared by the cart page and checkout. */
export default function CartSummary({ summary, title = 'Order summary', children, className }) {
  return (
    <section aria-label={title} className={cn('rounded-panel border bg-surface p-5 sm:p-6', className)}>
      <h2 className="text-lg font-bold text-ink">{title}</h2>
      <dl className="mt-5 flex flex-col gap-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted">
            Subtotal ({summary.itemCount} item{summary.itemCount === 1 ? '' : 's'})
          </dt>
          <dd className="tabular font-semibold text-ink">{formatCurrency(summary.subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted">Delivery</dt>
          <dd className="tabular font-semibold text-ink">{summary.delivery === 0 ? 'Free' : formatCurrency(summary.delivery)}</dd>
        </div>
        <div className="mt-2 flex items-baseline justify-between border-t pt-4">
          <dt className="text-base font-bold text-ink">Total</dt>
          <dd className="tabular text-2xl font-extrabold tracking-tight text-ink">{formatCurrency(summary.total)}</dd>
        </div>
      </dl>
      {summary.savings > 0 && (
        <p className="tabular mt-3 rounded-control bg-success-soft px-3 py-2 text-center text-[13px] font-semibold text-success">
          You’re saving {formatCurrency(summary.savings)} on this order
        </p>
      )}
      {children && <div className="mt-6">{children}</div>}
    </section>
  )
}
