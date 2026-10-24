import { ChevronRight, Heart, Mail, Phone } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { ThemeSelector } from './ThemeToggle'
import CategoryIcon from '../category/CategoryIcon'
import Drawer from '../common/Drawer'
import SocialIcon from '../common/SocialIcon'
import { PRIMARY_NAV, SOCIAL_LINKS, STORE } from '../../data/site'
import { useWishlist } from '../../hooks/useContexts'
import { cn } from '../../utils/cn'

/**
 * Slide-out navigation for small screens: primary links, every category,
 * theme preference and contact details, with large tap targets throughout.
 */
export default function MobileMenu({ open, onClose, categories }) {
  const { count: wishlistCount } = useWishlist()
  const links = PRIMARY_NAV.filter((item) => !item.menu)

  const linkClass = ({ isActive }) =>
    cn(
      'flex h-12 items-center justify-between rounded-control px-3 text-[15px] font-semibold transition-colors',
      isActive ? 'bg-accent-soft text-link' : 'text-ink hover:bg-subtle',
    )

  return (
    <Drawer open={open} onClose={onClose} title="Menu" side="left">
      <nav aria-label="Mobile" className="flex flex-col gap-7 px-3 py-4">
        <ul className="flex flex-col">
          {links.map((item) => (
            <li key={item.label}>
              <NavLink to={item.to} end={item.end} onClick={onClose} className={linkClass}>
                {item.label}
                <ChevronRight className="h-4 w-4 text-faint" aria-hidden="true" />
              </NavLink>
            </li>
          ))}
          <li>
            <NavLink to="/wishlist" onClick={onClose} className={linkClass}>
              <span className="flex items-center gap-2.5">
                <Heart className="h-4.5 w-4.5" aria-hidden="true" />
                Wishlist
              </span>
              {wishlistCount > 0 && (
                <span className="tabular rounded-full bg-accent px-2 py-0.5 text-[11px] font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </NavLink>
          </li>
        </ul>

        <section aria-labelledby="mobile-categories">
          <h3 id="mobile-categories" className="micro-label mb-2 px-3 text-faint">
            Categories
          </h3>
          <ul className="grid grid-cols-2 gap-1.5">
            {categories.map((category) => (
              <li key={category.slug}>
                <NavLink
                  to={`/category/${category.slug}`}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'flex min-h-12 items-center gap-2.5 rounded-control border px-3 py-2 text-[13px] font-semibold transition-colors',
                      isActive ? 'border-accent bg-accent-soft text-link' : 'text-ink hover:bg-subtle',
                    )
                  }
                >
                  <CategoryIcon name={category.icon} className="h-4 w-4 shrink-0 text-muted" />
                  <span className="leading-tight">{category.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="mobile-theme" className="px-1">
          <h3 id="mobile-theme" className="micro-label mb-2.5 px-2 text-faint">
            Appearance
          </h3>
          <ThemeSelector />
        </section>

        <section aria-labelledby="mobile-help" className="flex flex-col gap-1 border-t px-1 pt-6">
          <h3 id="mobile-help" className="micro-label mb-2 px-2 text-faint">
            Need help?
          </h3>
          <a href={STORE.phoneHref} className="flex h-11 items-center gap-3 rounded-control px-2 text-sm text-ink hover:bg-subtle">
            <Phone className="h-4 w-4 text-muted" aria-hidden="true" />
            {STORE.phone}
          </a>
          <a href={`mailto:${STORE.email}`} className="flex h-11 items-center gap-3 rounded-control px-2 text-sm text-ink hover:bg-subtle">
            <Mail className="h-4 w-4 text-muted" aria-hidden="true" />
            {STORE.email}
          </a>
          <div className="mt-3 flex gap-2 px-1">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                className="grid h-11 w-11 place-items-center rounded-control border text-muted transition-colors hover:border-accent hover:text-link"
              >
                <SocialIcon name={social.name} />
              </a>
            ))}
          </div>
        </section>
      </nav>
    </Drawer>
  )
}
