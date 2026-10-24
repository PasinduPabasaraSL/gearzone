import { useEffect, useRef, useState } from 'react'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import CategoryIcon from '../category/CategoryIcon'
import Container from '../common/Container'
import { cn } from '../../utils/cn'

const HOVER_DELAY_MS = 120

/**
 * Desktop "Categories" mega menu. Opens on hover for pointer users and on
 * click/Enter for keyboard users; Escape and outside clicks close it.
 */
export default function CategoriesMenu({ categories }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const hoverTimer = useRef(null)
  const location = useLocation()
  const [lastPath, setLastPath] = useState(location.pathname)

  if (location.pathname !== lastPath) {
    setLastPath(location.pathname)
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false)
    }
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  useEffect(() => () => clearTimeout(hoverTimer.current), [])

  const scheduleOpen = (next) => {
    clearTimeout(hoverTimer.current)
    hoverTimer.current = setTimeout(() => setOpen(next), HOVER_DELAY_MS)
  }

  return (
    <div
      ref={rootRef}
      className="static"
      onPointerEnter={(event) => event.pointerType === 'mouse' && scheduleOpen(true)}
      onPointerLeave={(event) => event.pointerType === 'mouse' && scheduleOpen(false)}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((value) => !value)}
        className={cn(
          'flex h-11 items-center gap-1 text-[14px] font-semibold transition-colors',
          open ? 'text-ink' : 'text-muted hover:text-ink',
        )}
      >
        Categories
        <ChevronDown className={cn('h-4 w-4 transition-transform duration-200', open && 'rotate-180')} aria-hidden="true" />
      </button>

      {open && (
        <div className="animate-slide-down absolute inset-x-0 top-full z-50 border-b bg-canvas shadow-panel">
          <Container className="grid grid-cols-[1fr_300px] gap-8 py-7">
            <ul className="grid grid-cols-3 gap-1.5">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    to={`/category/${category.slug}`}
                    className="group flex items-center gap-3.5 rounded-card p-3 transition-colors hover:bg-subtle"
                  >
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-control border bg-surface text-muted transition-colors group-hover:border-accent/40 group-hover:text-link">
                      <CategoryIcon name={category.icon} className="h-5 w-5" strokeWidth={1.75} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-ink">{category.name}</span>
                      <span className="block truncate text-xs text-muted">
                        {category.tagline} · {category.productCount}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            <Link
              to="/category/desk-setup"
              className="group relative flex flex-col justify-end overflow-hidden rounded-panel bg-ink p-5 text-white"
            >
              <img
                src={categories.find((c) => c.slug === 'desk-setup')?.image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-55 transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent" aria-hidden="true" />
              <span className="relative micro-label text-brand-200">Signature</span>
              <span className="relative mt-2 text-lg font-bold">Build your setup</span>
              <span className="relative mt-1 inline-flex items-center gap-1 text-sm text-white/80">
                Explore desk setup <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          </Container>
        </div>
      )}
    </div>
  )
}
