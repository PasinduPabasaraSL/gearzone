import { Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import QuantityStepper from '../product/QuantityStepper'
import { useCart } from '../../hooks/useContexts'
import { cn } from '../../utils/cn'
import { formatCurrency } from '../../utils/formatCurrency'
import { MAX_QUANTITY_PER_ITEM } from '../../utils/orderSummary'

/** One cart line. `compact` is the drawer layout; the default is the cart page. */
export default function CartItem({ item, compact = false, onNavigate }) {
  const { updateQuantity, removeItem } = useCart()
  const max = Math.min(item.stock, MAX_QUANTITY_PER_ITEM)
  const href = `/product/${item.slug}`

  return (
    <li className={cn('flex gap-4', compact ? 'py-4' : 'py-6')}>
      <Link
        to={href}
        onClick={onNavigate}
        className={cn('product-plate shrink-0 overflow-hidden rounded-card border', compact ? 'h-20 w-20' : 'h-24 w-24 sm:h-28 sm:w-28')}
      >
        <img src={item.thumbnail} alt={item.name} loading="lazy" className="h-full w-full object-cover" />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="micro-label text-faint">{item.brand}</p>
            <Link
              to={href}
              onClick={onNavigate}
              className={cn('mt-1.5 line-clamp-2 font-semibold text-ink transition-colors hover:text-link', compact ? 'text-sm' : 'text-[15px]')}
            >
              {item.name}
            </Link>
            {!compact && <p className="tabular mt-1 text-[13px] text-muted">{formatCurrency(item.price)} each</p>}
          </div>
          <button
            type="button"
            onClick={() => removeItem(item.id)}
            aria-label={`Remove ${item.name} from cart`}
            className="-mt-1 -mr-1.5 grid h-9 w-9 shrink-0 place-items-center rounded-control text-faint transition-colors hover:bg-danger-soft hover:text-danger"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <QuantityStepper
            size="sm"
            value={item.quantity}
            max={max}
            onChange={(quantity) => updateQuantity(item.id, quantity)}
            label={`Quantity for ${item.name}`}
          />
          <div className="text-right">
            {item.compareAtPrice > item.price && (
              <s className="tabular block text-xs text-faint">{formatCurrency(item.compareAtPrice * item.quantity)}</s>
            )}
            <p className="tabular text-[15px] font-bold text-ink">{formatCurrency(item.price * item.quantity)}</p>
          </div>
        </div>
      </div>
    </li>
  )
}
