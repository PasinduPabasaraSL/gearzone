/**
 * Mock order submission. Nothing is sent or stored: it validates the shape,
 * waits like a network call and returns a demo order reference. A real
 * implementation would POST the order and, for online payments, return a
 * gateway redirect URL instead.
 */
export function placeOrder({ items, summary, paymentMethod }) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (items.length === 0) {
        reject(new Error('Your cart is empty.'))
        return
      }
      const reference = `GZ-${Date.now().toString(36).toUpperCase().slice(-6)}`
      resolve({ reference, total: summary.total, itemCount: summary.itemCount, paymentMethod })
    }, 900)
  })
}
