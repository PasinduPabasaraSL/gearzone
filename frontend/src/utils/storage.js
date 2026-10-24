/**
 * localStorage access that never throws. Private browsing and quota errors
 * degrade to in-memory behaviour instead of breaking the cart.
 */
export const STORAGE_KEYS = {
  theme: 'gearzonelk.theme',
  cart: 'gearzonelk.cart',
  wishlist: 'gearzonelk.wishlist',
}

export function readStorage(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key)
    return raw == null ? fallback : JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function writeStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage unavailable: state stays in memory for this session */
  }
}
