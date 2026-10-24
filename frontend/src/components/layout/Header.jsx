import { useState } from 'react'
import { Heart, Menu, Search, ShoppingBag, Truck, User } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import AnnouncementBar from './AnnouncementBar'
import CategoriesMenu from './CategoriesMenu'
import MobileMenu from './MobileMenu'
import { ThemeToggle } from './ThemeToggle'
import Container from '../common/Container'
import Logo from '../common/Logo'
import SearchBar from '../search/SearchBar'
import SearchDialog from '../search/SearchDialog'
import { PRIMARY_NAV } from '../../data/site'
import { useAsync } from '../../hooks/useAsync'
import { useCart, useToast, useWishlist } from '../../hooks/useContexts'
import { getCategories } from '../../services/catalog'
import { cn } from '../../utils/cn'
import { formatCurrency } from '../../utils/formatCurrency'
import { FREE_DELIVERY_THRESHOLD } from '../../utils/orderSummary'

function CountBadge({ count }) {
  if (count <= 0) return null
  // Keyed on count so the badge re-pops each time the number changes.
  return (
    <span
      key={count}
      aria-hidden="true"
      className="animate-scale-in tabular absolute -top-0.5 -right-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-accent px-1 text-[10px] leading-none font-bold text-white ring-2 ring-canvas"
    >
      {count > 99 ? '99+' : count}
    </span>
  )
}

const iconButton =
  'relative grid h-10 w-10 place-items-center rounded-control text-muted transition-colors hover:bg-subtle hover:text-ink'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const { summary, openCart } = useCart()
  const { count: wishlistCount } = useWishlist()
  const { toast } = useToast()
  const { data: categories = [] } = useAsync(getCategories, [])

  return (
    <>
      <AnnouncementBar />
      <header className="sticky top-0 z-40 border-b bg-canvas/90 backdrop-blur-md supports-[backdrop-filter]:bg-canvas/80">
        <Container className="flex h-16 items-center gap-2 lg:h-[72px] lg:gap-8">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            className={cn(iconButton, '-ml-2 lg:hidden')}
          >
            <Menu className="h-[21px] w-[21px]" />
          </button>

          <Logo />

          <SearchBar className="mx-auto hidden max-w-2xl flex-1 md:block" />

          <div className="ml-auto flex items-center gap-0.5 md:ml-0">
            <button type="button" onClick={() => setSearchOpen(true)} aria-label="Search" className={cn(iconButton, 'md:hidden')}>
              <Search className="h-5 w-5" />
            </button>
            <ThemeToggle className="hidden sm:grid" />
            <button
              type="button"
              aria-label="Account"
              onClick={() =>
                toast({
                  tone: 'info',
                  title: 'Accounts are coming soon',
                  description: 'You can check out as a guest today.',
                })
              }
              className={cn(iconButton, 'hidden lg:grid')}
            >
              <User className="h-5 w-5" />
            </button>
            <Link to="/wishlist" aria-label={`Wishlist, ${wishlistCount} items`} className={cn(iconButton, 'hidden sm:grid')}>
              <Heart className="h-5 w-5" />
              <CountBadge count={wishlistCount} />
            </Link>
            <button
              type="button"
              onClick={openCart}
              aria-label={`Open cart, ${summary.itemCount} items`}
              className={cn(iconButton, '-mr-2 sm:mr-0')}
            >
              <ShoppingBag className="h-5 w-5" />
              <CountBadge count={summary.itemCount} />
            </button>
          </div>
        </Container>

        <nav aria-label="Primary" className="relative hidden border-t lg:block">
          <Container className="flex h-11 items-center justify-between">
            <ul className="flex items-center gap-7">
              {PRIMARY_NAV.map((item) => (
                <li key={item.label}>
                  {item.menu === 'categories' ? (
                    <CategoriesMenu categories={categories} />
                  ) : (
                    <NavLink
                      to={item.to}
                      end={item.end}
                      className={({ isActive }) =>
                        cn(
                          'relative flex h-11 items-center text-[14px] font-semibold transition-colors',
                          'after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:rounded-full after:bg-accent after:transition-transform after:duration-200',
                          isActive ? 'text-ink after:scale-x-100' : 'text-muted after:scale-x-0 hover:text-ink',
                        )
                      }
                    >
                      {item.label}
                    </NavLink>
                  )}
                </li>
              ))}
            </ul>
            <p className="flex items-center gap-2 text-[13px] text-muted">
              <Truck className="h-4 w-4 text-link" aria-hidden="true" />
              Free delivery over <span className="tabular font-semibold text-ink">{formatCurrency(FREE_DELIVERY_THRESHOLD)}</span>
            </p>
          </Container>
        </nav>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} categories={categories} />
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
