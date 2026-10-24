import { useState } from 'react'
import { Loader2, Lock, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import CartSummary from '../components/cart/CartSummary'
import PageHeader from '../components/catalog/PageHeader'
import OrderConfirmation from '../components/checkout/OrderConfirmation'
import PaymentOptions from '../components/checkout/PaymentOptions'
import Button from '../components/common/Button'
import Container from '../components/common/Container'
import EmptyState from '../components/common/EmptyState'
import Select from '../components/common/Select'
import TextField from '../components/common/TextField'
import { PAYMENT_METHODS, SRI_LANKA_DISTRICTS } from '../data/checkout'
import { useCart, useToast } from '../hooks/useContexts'
import { usePageMeta } from '../hooks/usePageMeta'
import { placeOrder } from '../services/checkout'
import { formatCurrency } from '../utils/formatCurrency'

const INITIAL_FORM = { fullName: '', phone: '', email: '', address: '', city: '', district: '', postalCode: '', notes: '' }
const PHONE_PATTERN = /^(?:\+94|0)?7\d{8}$/
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function validate(form) {
  const errors = {}
  if (form.fullName.trim().length < 2) errors.fullName = 'Please enter your full name.'
  if (!PHONE_PATTERN.test(form.phone.replace(/[\s-]/g, ''))) errors.phone = 'Enter a Sri Lankan mobile number, e.g. 077 123 4567.'
  if (form.email && !EMAIL_PATTERN.test(form.email.trim())) errors.email = 'Please enter a valid email address.'
  if (form.address.trim().length < 5) errors.address = 'Please enter your street address.'
  if (form.city.trim().length < 2) errors.city = 'Please enter your city or town.'
  if (!form.district) errors.district = 'Please choose your district.'
  return errors
}

function FormSection({ step, title, children }) {
  return (
    <section aria-labelledby={`step-${step}`} className="rounded-panel border bg-surface p-5 sm:p-7">
      <h2 id={`step-${step}`} className="flex items-center gap-3 text-lg font-bold text-ink">
        <span className="tabular grid h-7 w-7 place-items-center rounded-full bg-ink text-[13px] font-bold text-canvas">{step}</span>
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  )
}

/**
 * Mock checkout. Collects contact and delivery details and a payment choice,
 * validates them client-side and hands off to the checkout service. Details
 * live only in component state and are never persisted.
 */
export default function Checkout() {
  const { items, summary, clearCart } = useCart()
  const { toast } = useToast()
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [submitting, setSubmitting] = useState(false)
  const [order, setOrder] = useState(null)
  usePageMeta({ title: 'Checkout' })

  const field = (name) => ({
    name,
    value: form[name],
    error: errors[name],
    onChange: (event) => {
      setForm((current) => ({ ...current, [name]: event.target.value }))
      if (errors[name]) setErrors((current) => ({ ...current, [name]: undefined }))
    },
  })

  if (order) {
    return (
      <Container>
        <OrderConfirmation order={order} methodLabel={PAYMENT_METHODS.find((m) => m.id === order.paymentMethod)?.label} />
      </Container>
    )
  }

  if (items.length === 0) {
    return (
      <Container>
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is waiting for some gear."
          description="Add a few items before heading to checkout."
          actionLabel="Start Shopping"
          actionTo="/shop"
          className="py-24"
        />
      </Container>
    )
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = validate(form)
    setErrors(nextErrors)
    const firstInvalid = Object.keys(nextErrors)[0]
    if (firstInvalid) {
      document.querySelector(`[name="${firstInvalid}"]`)?.focus()
      return
    }

    setSubmitting(true)
    try {
      const result = await placeOrder({ items, summary, paymentMethod })
      setOrder(result)
      clearCart()
      window.scrollTo({ top: 0 })
    } catch (error) {
      toast({ tone: 'error', title: 'Could not place order', description: error.message })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Container className="pb-20">
      <PageHeader
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Cart', to: '/cart' },
          { label: 'Checkout' },
        ]}
        title="Checkout"
        description="Guest checkout — no account needed."
      />

      <form onSubmit={onSubmit} noValidate className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-12">
        <div className="flex flex-col gap-6">
          <FormSection step={1} title="Contact information">
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="Full name" autoComplete="name" required {...field('fullName')} wrapperClassName="sm:col-span-2" />
              <TextField label="Mobile number" type="tel" inputMode="tel" autoComplete="tel" placeholder="077 123 4567" required {...field('phone')} />
              <TextField label="Email (optional)" type="email" autoComplete="email" placeholder="you@example.com" hint="For your order receipt." {...field('email')} />
            </div>
          </FormSection>

          <FormSection step={2} title="Delivery address">
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="Street address" autoComplete="street-address" placeholder="No. 12, Temple Road" required {...field('address')} wrapperClassName="sm:col-span-2" />
              <TextField label="City / Town" autoComplete="address-level2" placeholder="Nugegoda" required {...field('city')} />
              <div className="flex flex-col gap-1.5">
                <Select
                  label="District"
                  name="district"
                  value={form.district}
                  onChange={field('district').onChange}
                  aria-invalid={errors.district ? true : undefined}
                  options={[{ value: '', label: 'Select district' }, ...SRI_LANKA_DISTRICTS.map((d) => ({ value: d, label: d }))]}
                  className={errors.district ? 'border-danger' : undefined}
                />
                {errors.district && <p className="text-xs font-medium text-danger">{errors.district}</p>}
              </div>
              <TextField label="Postal code (optional)" inputMode="numeric" autoComplete="postal-code" {...field('postalCode')} />
              <TextField label="Delivery notes (optional)" as="textarea" placeholder="Landmarks, gate colour, best time to call…" {...field('notes')} wrapperClassName="sm:col-span-2" />
            </div>
          </FormSection>

          <FormSection step={3} title="Payment method">
            <PaymentOptions methods={PAYMENT_METHODS} value={paymentMethod} onChange={setPaymentMethod} />
          </FormSection>
        </div>

        <div className="lg:sticky lg:top-[140px] lg:self-start">
          <CartSummary summary={summary}>
            <ul className="-mt-1 mb-6 max-h-64 divide-y divide-line overflow-y-auto border-y">
              {items.map((item) => (
                <li key={item.id} className="flex items-center gap-3 py-3">
                  <span className="relative shrink-0">
                    <img src={item.thumbnail} alt="" className="product-plate h-12 w-12 rounded-[10px] border object-cover" />
                    <span className="tabular absolute -top-1.5 -right-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1 text-[10px] font-bold text-canvas">
                      {item.quantity}
                    </span>
                  </span>
                  <Link to={`/product/${item.slug}`} className="min-w-0 flex-1 truncate text-[13px] font-semibold text-ink hover:text-link">
                    {item.name}
                  </Link>
                  <span className="tabular text-[13px] font-semibold text-ink">{formatCurrency(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <Button type="submit" size="lg" fullWidth disabled={submitting}>
              {submitting ? <Loader2 className="h-4.5 w-4.5 animate-spin" aria-hidden="true" /> : <Lock className="h-4 w-4" aria-hidden="true" />}
              {submitting ? 'Placing order…' : `Place Order · ${formatCurrency(summary.total)}`}
            </Button>
            <p className="mt-3 text-center text-xs leading-relaxed text-faint">
              Demo checkout — no payment is processed and no details are stored.
            </p>
          </CartSummary>
        </div>
      </form>
    </Container>
  )
}
