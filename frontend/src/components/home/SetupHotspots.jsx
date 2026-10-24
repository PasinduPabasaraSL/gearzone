import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SETUP_BACKDROP, SETUP_ITEMS } from '../../data/editorial'
import { cn } from '../../utils/cn'
import { formatCurrency } from '../../utils/formatCurrency'

/**
 * Photo of a finished desk with shoppable pins. Used on small screens and as
 * the fallback for the 3D desk scene.
 */
export default function SetupHotspots({ activeKey, onActiveChange, className }) {
  const [localActive, setLocalActive] = useState(null)
  const active = activeKey ?? localActive
  const setActive = onActiveChange ?? setLocalActive

  return (
    <div className={cn('relative aspect-[14/9] overflow-hidden rounded-panel border border-strip-line', className)}>
      <img src={SETUP_BACKDROP} alt="A finished desk setup with a laptop stand, keyboard, mouse and desk mat" loading="lazy" className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-black/15" aria-hidden="true" />

      {SETUP_ITEMS.filter((item) => item.spot).map((item) => {
        const open = active === item.key
        return (
          <div
            key={item.key}
            className="absolute"
            style={{ left: `${item.spot.x}%`, top: `${item.spot.y}%` }}
            onMouseEnter={() => setActive(item.key)}
            onMouseLeave={() => setActive(null)}
          >
            <button
              type="button"
              onClick={() => setActive(open ? null : item.key)}
              onFocus={() => setActive(item.key)}
              aria-expanded={open}
              aria-label={`${item.label}: ${item.name}`}
              className={cn(
                'relative -translate-x-1/2 -translate-y-1/2 grid h-8 w-8 place-items-center rounded-full border-2 border-white text-white shadow-lift transition-all duration-200',
                open ? 'scale-110 bg-accent' : 'bg-black/45 backdrop-blur-sm hover:bg-accent',
              )}
            >
              <span className="absolute inset-0 animate-ping rounded-full bg-white/30 [animation-duration:2.4s]" aria-hidden="true" />
              <Plus className={cn('h-4 w-4 transition-transform', open && 'rotate-45')} aria-hidden="true" />
            </button>
            {open && (
              <Link
                to={`/product/${item.slug}`}
                className={cn(
                  'animate-scale-in absolute z-10 flex w-56 items-center gap-3 rounded-card border bg-elevated p-2.5 shadow-panel',
                  item.spot.x > 60 ? 'right-0' : '-left-4',
                  item.spot.y > 60 ? 'bottom-5' : 'top-5',
                )}
              >
                <img src={item.image.thumbnail} alt="" className="product-plate h-12 w-12 shrink-0 rounded-[10px] object-cover" />
                <span className="min-w-0">
                  <span className="micro-label block text-faint">{item.label}</span>
                  <span className="mt-1 block truncate text-[13px] font-semibold text-ink">{item.name}</span>
                  <span className="tabular block text-[13px] font-bold text-link">{formatCurrency(item.price)}</span>
                </span>
              </Link>
            )}
          </div>
        )
      })}
    </div>
  )
}
