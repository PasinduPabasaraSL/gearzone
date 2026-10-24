import { createContext } from 'react'

/**
 * Context objects live apart from their providers so provider files export
 * only components (react/only-export-components) and hooks can import the
 * context without creating a cycle.
 */
export const ThemeContext = createContext(null)
export const CartContext = createContext(null)
export const WishlistContext = createContext(null)
export const ToastContext = createContext(null)
