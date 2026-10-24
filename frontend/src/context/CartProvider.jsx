import { useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import { CartContext } from './contexts'
import { computeOrderSummary, MAX_QUANTITY_PER_ITEM } from '../utils/orderSummary'
import { readStorage, STORAGE_KEYS, writeStorage } from '../utils/storage'

/**
 * Cart lines store a snapshot of the fields the cart UI needs. A real backend
 * would re-price lines at checkout; the snapshot keeps the drawer instant and
 * lets the cart survive a reload without refetching the catalogue.
 */
function toLine(product, quantity) {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    brand: product.brand,
    categoryName: product.categoryName,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    thumbnail: product.images?.[0]?.thumbnail ?? product.thumbnail,
    stock: product.stock,
    quantity,
  }
}

const maxFor = (line) => Math.max(0, Math.min(MAX_QUANTITY_PER_ITEM, line.stock))

function cartReducer(items, action) {
  switch (action.type) {
    case 'add': {
      const existing = items.find((line) => line.id === action.product.id)
      if (existing) {
        return items.map((line) =>
          line.id === existing.id
            ? { ...line, quantity: Math.min(maxFor(line), line.quantity + action.quantity) }
            : line,
        )
      }
      const line = toLine(action.product, 0)
      return [...items, { ...line, quantity: Math.min(maxFor(line), action.quantity) }]
    }
    case 'update':
      return items
        .map((line) =>
          line.id === action.id
            ? { ...line, quantity: Math.max(0, Math.min(maxFor(line), action.quantity)) }
            : line,
        )
        .filter((line) => line.quantity > 0)
    case 'remove':
      return items.filter((line) => line.id !== action.id)
    case 'clear':
      return []
    case 'replace':
      return action.items
    default:
      return items
  }
}

function loadCart() {
  const stored = readStorage(STORAGE_KEYS.cart, [])
  if (!Array.isArray(stored)) return []
  return stored.filter(
    (line) =>
      line &&
      typeof line.id === 'string' &&
      Number.isFinite(line.price) &&
      Number.isInteger(line.quantity) &&
      line.quantity > 0,
  )
}

export default function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, undefined, loadCart)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    writeStorage(STORAGE_KEYS.cart, items)
  }, [items])

  // Keep tabs in sync: adding to the cart in one tab updates the badge in another.
  useEffect(() => {
    const onStorage = (event) => {
      if (event.key === STORAGE_KEYS.cart) dispatch({ type: 'replace', items: loadCart() })
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const addItem = useCallback((product, quantity = 1) => {
    if (!product || product.stock === 0) return
    dispatch({ type: 'add', product, quantity })
  }, [])
  const updateQuantity = useCallback((id, quantity) => dispatch({ type: 'update', id, quantity }), [])
  const removeItem = useCallback((id) => dispatch({ type: 'remove', id }), [])
  const clearCart = useCallback(() => dispatch({ type: 'clear' }), [])
  const openCart = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])

  const summary = useMemo(() => computeOrderSummary(items), [items])

  const value = useMemo(
    () => ({
      items,
      summary,
      isOpen,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      openCart,
      closeCart,
      getQuantity: (id) => items.find((line) => line.id === id)?.quantity ?? 0,
    }),
    [items, summary, isOpen, addItem, updateQuantity, removeItem, clearCart, openCart, closeCart],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
