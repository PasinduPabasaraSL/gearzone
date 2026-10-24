import { CircleCheck, Info } from 'lucide-react'
import Button from '../common/Button'
import { formatCurrency } from '../../utils/formatCurrency'

/** Post-submit screen. States plainly that this demo took no payment. */
export default function OrderConfirmation({ order, methodLabel }) {
  return (
    <div className="animate-fade-up mx-auto max-w-xl py-16 text-center sm:py-24">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-success-soft">
        <CircleCheck className="h-8 w-8 text-success" aria-hidden="true" />
      </div>
      <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">Thank you — order received.</h1>
      <p className="mt-3 text-muted">
        Your reference is <span className="tabular font-bold text-ink">{order.reference}</span>. We’ll call to confirm delivery details.
      </p>

      <dl className="mx-auto mt-8 grid max-w-sm gap-3 rounded-card border bg-surface p-5 text-left text-sm">
        <div className="flex justify-between">
          <dt className="text-muted">Items</dt>
          <dd className="tabular font-semibold text-ink">{order.itemCount}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted">Payment</dt>
          <dd className="font-semibold text-ink">{methodLabel}</dd>
        </div>
        <div className="flex justify-between border-t pt-3">
          <dt className="font-semibold text-ink">Total</dt>
          <dd className="tabular text-base font-bold text-ink">{formatCurrency(order.total)}</dd>
        </div>
      </dl>

      <p className="mx-auto mt-6 flex max-w-sm items-start gap-2 rounded-control bg-subtle p-3 text-left text-xs text-muted">
        <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        This is a demonstration storefront: no payment was taken and no order was sent.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button to="/shop">Continue Shopping</Button>
        <Button variant="secondary" to="/">
          Back to Home
        </Button>
      </div>
    </div>
  )
}
