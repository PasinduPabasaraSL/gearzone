import { useContext } from 'react'
import { CartContext, ThemeContext, ToastContext, WishlistContext } from '../context/contexts'

function useRequiredContext(context, name) {
  const value = useContext(context)
  if (value === null) throw new Error(`${name} must be used inside its provider (see AppProviders).`)
  return value
}

export const useTheme = () => useRequiredContext(ThemeContext, 'useTheme')
export const useCart = () => useRequiredContext(CartContext, 'useCart')
export const useWishlist = () => useRequiredContext(WishlistContext, 'useWishlist')
export const useToast = () => useRequiredContext(ToastContext, 'useToast')
