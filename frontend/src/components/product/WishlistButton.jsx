import { useState } from 'react'
import { Heart } from 'lucide-react'
import { useShopActions } from '../../hooks/useShopActions'
import { cn } from '../../utils/cn'

/** Heart toggle with a short pop when a product is saved. */
export default function WishlistButton({ product, variant = 'overlay', className }) {
  const { toggleWishlist, isWishlisted } = useShopActions()
  const [popKey, setPopKey] = useState(0)
  const saved = isWishlisted(product.id)

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault()
        if (toggleWishlist(product)) setPopKey((key) => key + 1)
      }}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
      className={cn(
        'grid place-items-center transition-[background-color,color,opacity,transform] duration-200',
        variant === 'overlay'
          ? 'h-9 w-9 rounded-full bg-surface/90 shadow-xs backdrop-blur-sm hover:scale-105 hover:bg-surface'
          : 'h-13 w-13 shrink-0 rounded-control border bg-surface hover:border-line-strong hover:bg-subtle',
        saved ? 'text-danger' : 'text-muted hover:text-ink',
        className,
      )}
    >
      <Heart key={popKey} className={cn('h-[18px] w-[18px]', saved && 'animate-heart-pop fill-current')} aria-hidden="true" />
    </button>
  )
}
