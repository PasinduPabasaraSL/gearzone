import { useEffect } from 'react'
import { ShoppingBag } from 'lucide-react'
import CartItem from './CartItem'
import FreeDeliveryMeter from './FreeDeliveryMeter'
import Button from '../common/Button'
import Drawer from '../common/Drawer'
import EmptyState from '../common/EmptyState'
import { useCart, useToast } from '../../hooks/useContexts'
import { formatCurrency } from '../../utils/formatCurrency'

/** Mini-cart that slides in from the right whenever the cart is opened. */
export default function CartDrawer() {
  const { items, summary, isOpen, closeCart } = useCart()
  const { dismissAll } = useToast()
  const isEmpty = items.length === 0

  // The cart is where "Added to cart" toasts point; clear them so they don't
  // sit over the drawer's checkout buttons.
  useEffect(() => {
    if (isOpen) dismissAll()
  }, [isOpen, dismissAll])

  return (
    <Drawer
      open={isOpen}
      onClose={closeCart}
      title={isEmpty ? 'Your Cart' : `Your Cart (${summary.itemCount})`}
      footer={
        !isEmpty && (
          <div className="flex flex-col gap-4">
            <dl className="flex flex-col gap-1.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Subtotal</dt>
                <dd className="tabular text-base font-bold text-ink">{formatCurrency(summary.subtotal)}</dd>
              </div>
              {summary.savings > 0 && (
                <div className="flex justify-between">
                  <dt className="text-muted">You save</dt>
                  <dd className="tabular font-semibold text-success">{formatCurrency(summary.savings)}</dd>
                </div>
              )}
              <p className="text-xs text-faint">Delivery calculated at checkout.</p>
            </dl>
            <div className="grid grid-cols-2 gap-2.5">
              <Button variant="secondary" to="/cart" onClick={closeCart}>
                View Cart
              </Button>
              <Button to="/checkout" onClick={closeCart}>
                Checkout
              </Button>
            </div>
          </div>
        )
      }
    >
      {isEmpty ? (
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is waiting for some gear."
          description="Browse keyboards, cables and desk upgrades to get started."
          actionLabel="Start Shopping"
          actionTo="/shop"
          onAction={closeCart}
          className="py-20"
        />
      ) : (
        <div className="px-5 pt-4">
          <FreeDeliveryMeter summary={summary} />
          <ul className="divide-y divide-line">
            {items.map((item) => (
              <CartItem key={item.id} item={item} compact onNavigate={closeCart} />
            ))}
          </ul>
        </div>
      )}
    </Drawer>
  )
}
