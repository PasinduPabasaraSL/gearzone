import { useState } from 'react'
import { ArrowLeft, Lock, ShoppingBag } from 'lucide-react'
import CartItem from '../components/cart/CartItem'
import CartSummary from '../components/cart/CartSummary'
import FreeDeliveryMeter from '../components/cart/FreeDeliveryMeter'
import PageHeader from '../components/catalog/PageHeader'
import Button from '../components/common/Button'
import Container from '../components/common/Container'
import EmptyState from '../components/common/EmptyState'
import CollectionSection from '../components/home/CollectionSection'
import { useCart } from '../hooks/useContexts'
import { usePageMeta } from '../hooks/usePageMeta'

export default function Cart() {
  const { items, summary, clearCart } = useCart()
  const [confirmClear, setConfirmClear] = useState(false)
  usePageMeta({ title: 'Your Cart' })

  if (items.length === 0) {
    return (
      <>
        <Container>
          <PageHeader breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Cart' }]} title="Your cart" className="pb-0 sm:pb-0" />
          <EmptyState
            icon={ShoppingBag}
            title="Your cart is waiting for some gear."
            description="Browse keyboards, cables and desk upgrades — your picks will show up here."
            actionLabel="Start Shopping"
            actionTo="/shop"
            secondaryLabel="View Deals"
            secondaryTo="/deals"
          />
        </Container>
        <CollectionSection id="cart-trending" eyebrow="Popular" title="Trending now" collection="trending" limit={8} display="carousel" actionTo="/shop" className="border-t" />
      </>
    )
  }

  return (
    <Container className="pb-20">
      <PageHeader
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Cart' }]}
        title="Your cart"
        description={`${summary.itemCount} item${summary.itemCount === 1 ? '' : 's'} ready for checkout.`}
      />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12">
        <div>
          <FreeDeliveryMeter summary={summary} />
          <ul className="mt-2 divide-y divide-line border-b">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <Button variant="ghost" to="/shop" className="-ml-3">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Continue shopping
            </Button>
            {confirmClear ? (
              <div className="flex items-center gap-2" role="group" aria-label="Confirm clearing cart">
                <span className="text-sm text-muted">Remove all items?</span>
                <Button variant="danger" size="sm" onClick={clearCart}>
                  Yes, clear
                </Button>
                <Button variant="secondary" size="sm" onClick={() => setConfirmClear(false)}>
                  Cancel
                </Button>
              </div>
            ) : (
              <Button variant="quiet" size="sm" onClick={() => setConfirmClear(true)}>
                Clear cart
              </Button>
            )}
          </div>
        </div>

        <div className="lg:sticky lg:top-[140px] lg:self-start">
          <CartSummary summary={summary}>
            <Button to="/checkout" size="lg" fullWidth>
              <Lock className="h-4 w-4" aria-hidden="true" />
              Proceed to Checkout
            </Button>
            <p className="mt-3 text-center text-xs text-faint">Cash on delivery and bank transfer accepted.</p>
          </CartSummary>
        </div>
      </div>
    </Container>
  )
}
