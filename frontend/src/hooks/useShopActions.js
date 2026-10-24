import { useCallback } from 'react'
import { useCart, useToast, useWishlist } from './useContexts'
import { MAX_QUANTITY_PER_ITEM } from '../utils/orderSummary'

/**
 * The add-to-cart and wishlist interactions with their feedback attached, so
 * every product card, rail and detail page behaves identically.
 */
export function useShopActions() {
  const { addItem, openCart, getQuantity } = useCart()
  const wishlist = useWishlist()
  const { toast } = useToast()

  const addToCart = useCallback(
    (product, quantity = 1) => {
      if (product.stock === 0) {
        toast({ tone: 'error', title: 'Out of stock', description: product.name })
        return false
      }
      if (getQuantity(product.id) >= Math.min(product.stock, MAX_QUANTITY_PER_ITEM)) {
        toast({ tone: 'info', title: 'Maximum quantity in cart', description: product.name })
        return false
      }
      addItem(product, quantity)
      toast({
        tone: 'success',
        title: quantity > 1 ? `Added ${quantity} to cart` : 'Added to cart',
        description: product.name,
        action: { label: 'View cart', onClick: openCart },
      })
      return true
    },
    [addItem, getQuantity, openCart, toast],
  )

  const toggleWishlist = useCallback(
    (product) => {
      const saved = wishlist.toggle(product.id)
      toast({
        tone: saved ? 'wishlist' : 'info',
        title: saved ? 'Saved to wishlist' : 'Removed from wishlist',
        description: product.name,
      })
      return saved
    },
    [wishlist, toast],
  )

  return { addToCart, toggleWishlist, isWishlisted: wishlist.has }
}
