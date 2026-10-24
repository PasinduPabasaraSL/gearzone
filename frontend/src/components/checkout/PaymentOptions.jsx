import { Banknote, Building2, CreditCard } from 'lucide-react'
import { cn } from '../../utils/cn'

const ICONS = { cod: Banknote, bank: Building2, online: CreditCard }

/** Radio cards for payment methods. Unavailable methods render disabled with a label. */
export default function PaymentOptions({ methods, value, onChange }) {
  return (
    <div role="radiogroup" aria-label="Payment method" className="grid gap-3">
      {methods.map((method) => {
        const Icon = ICONS[method.id] ?? CreditCard
        const checked = value === method.id
        return (
          <label
            key={method.id}
            className={cn(
              'relative flex items-start gap-4 rounded-card border p-4 transition-colors',
              method.available ? 'cursor-pointer hover:border-line-strong' : 'cursor-not-allowed opacity-60',
              checked && 'border-accent bg-accent-soft/50 ring-1 ring-accent',
            )}
          >
            <input
              type="radio"
              name="payment-method"
              value={method.id}
              checked={checked}
              disabled={!method.available}
              onChange={() => onChange(method.id)}
              className="peer sr-only"
            />
            <span
              aria-hidden="true"
              className={cn(
                'mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-500',
                checked ? 'border-accent' : 'border-line-strong',
              )}
            >
              <span className={cn('h-2.5 w-2.5 rounded-full bg-accent transition-transform', checked ? 'scale-100' : 'scale-0')} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center gap-2 text-[15px] font-semibold text-ink">
                {method.label}
                {!method.available && (
                  <span className="rounded-md bg-subtle px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-muted uppercase">Coming soon</span>
                )}
              </span>
              <span className="mt-0.5 block text-[13px] text-muted">{method.description}</span>
            </span>
            <Icon className="h-5 w-5 shrink-0 text-muted" aria-hidden="true" />
          </label>
        )
      })}
    </div>
  )
}
