import CartProvider from './CartProvider'
import ThemeProvider from './ThemeProvider'
import ToastProvider from './ToastProvider'
import WishlistProvider from './WishlistProvider'

export default function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <WishlistProvider>
          <CartProvider>{children}</CartProvider>
        </WishlistProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}
