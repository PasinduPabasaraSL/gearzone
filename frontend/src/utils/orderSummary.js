/**
 * Order pricing rules in one place, shared by the cart drawer, cart page and
 * checkout. A backend would compute these server-side; the shape returned
 * here is what the UI expects from it.
 */
export const FREE_DELIVERY_THRESHOLD = 15000
export const STANDARD_DELIVERY_FEE = 450
export const MAX_QUANTITY_PER_ITEM = 10

export function computeOrderSummary(items) {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const savings = items.reduce(
    (sum, item) =>
      sum + (item.compareAtPrice > item.price ? (item.compareAtPrice - item.price) * item.quantity : 0),
    0,
  )
  const qualifiesForFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD
  const delivery = itemCount === 0 || qualifiesForFreeDelivery ? 0 : STANDARD_DELIVERY_FEE

  return {
    itemCount,
    subtotal,
    savings,
    delivery,
    total: subtotal + delivery,
    freeDeliveryRemaining: Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal),
    freeDeliveryProgress: Math.min(1, subtotal / FREE_DELIVERY_THRESHOLD),
  }
}
