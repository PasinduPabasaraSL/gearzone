import { Outlet, ScrollRestoration, useNavigation } from 'react-router-dom'
import Footer from './Footer'
import Header from './Header'
import CartDrawer from '../cart/CartDrawer'
import { cn } from '../../utils/cn'

/** Thin top bar shown while a lazily loaded route chunk is downloading. */
function NavigationProgress() {
  const { state } = useNavigation()
  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none fixed inset-x-0 top-0 z-120 h-0.5 origin-left bg-accent transition-[transform,opacity] duration-500 ease-out',
        state === 'loading' ? 'scale-x-75 opacity-100' : 'scale-x-100 opacity-0',
      )}
    />
  )
}

export default function Layout() {
  return (
    <div className="flex min-h-svh flex-col">
      <a
        href="#main-content"
        className="sr-only z-130 rounded-control bg-accent px-4 py-2 font-semibold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <NavigationProgress />
      <Header />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <ScrollRestoration />
    </div>
  )
}
