import { useEffect, useState } from 'react'
import { ShoppingBag } from 'lucide-react'
import { useShopActions } from '../../hooks/useShopActions'
import { cn } from '../../utils/cn'
import { formatCurrency } from '../../utils/formatCurrency'

/**
 * Phone-only bar that keeps price and Add to Cart within thumb reach once the
 * main purchase buttons have scrolled out of view.
 */
export default function StickyPurchaseBar({ product, targetRef }) {
  const [visible, setVisible] = useState(false)
  const { addToCart } = useShopActions()

  useEffect(() => {
    const target = targetRef.current
    if (!target) return
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0)
    })
    observer.observe(target)
    return () => observer.disconnect()
  }, [targetRef])

  if (product.stock === 0) return null

  return (
    <div
      aria-hidden={!visible}
      inert={!visible}
      className={cn(
        'fixed inset-x-0 bottom-0 z-30 border-t bg-canvas/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md transition-transform duration-300 md:hidden',
        visible ? 'translate-y-0' : 'translate-y-full',
      )}
    >
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] text-muted">{product.name}</p>
          <p className="tabular text-base font-bold text-ink">{formatCurrency(product.price)}</p>
        </div>
        <button
          type="button"
          onClick={() => addToCart(product)}
          className="inline-flex h-12 items-center gap-2 rounded-control bg-accent px-5 text-sm font-semibold text-white active:bg-accent-hover"
        >
          <ShoppingBag className="h-4.5 w-4.5" aria-hidden="true" />
          Add to Cart
        </button>
      </div>
    </div>
  )
}
