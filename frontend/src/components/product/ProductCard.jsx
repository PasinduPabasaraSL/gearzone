import { memo, useState } from 'react'
import { Check, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import ProductBadge from './ProductBadge'
import ProductImage from './ProductImage'
import StockStatus from './StockStatus'
import WishlistButton from './WishlistButton'
import Price from '../common/Price'
import Rating from '../common/Rating'
import { useCart } from '../../hooks/useContexts'
import { useShopActions } from '../../hooks/useShopActions'
import { cn } from '../../utils/cn'

/** Stock meter for deal cards: factual remaining-units display, no countdowns. */
function StockMeter({ stock }) {
  const REFERENCE = 25
  const ratio = Math.max(0.06, Math.min(1, stock / REFERENCE))
  return (
    <div className="mt-3">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-ink">{stock <= 5 ? `Only ${stock} left` : `${stock} in stock`}</span>
      </div>
      <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-line" aria-hidden="true">
        <div className={cn('h-full rounded-full', stock <= 5 ? 'bg-warning' : 'bg-accent')} style={{ width: `${ratio * 100}%` }} />
      </div>
    </div>
  )
}

/**
 * The storefront's core unit. The whole card is clickable through a stretched
 * title link; the wishlist and add-to-cart buttons sit above it so they stay
 * independently focusable and tappable.
 */
function ProductCard({ product, variant = 'default', priority = false, sizes, className }) {
  const { addToCart } = useShopActions()
  const { getQuantity } = useCart()
  const href = `/product/${product.slug}`
  const outOfStock = product.stock === 0
  const inCart = getQuantity(product.id) > 0
  // The alternate photo is fetched only once a mouse user hovers the card.
  const [hoverPrimed, setHoverPrimed] = useState(false)
  const secondImage = hoverPrimed ? product.images[1] : null

  return (
    <article
      onPointerEnter={(event) => event.pointerType === 'mouse' && setHoverPrimed(true)}
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-card border bg-surface',
        'transition-[box-shadow,transform,border-color] duration-300 ease-out',
        'hover:-translate-y-0.5 hover:border-line-strong hover:shadow-lift',
        'has-[a:focus-visible]:border-accent',
        className,
      )}
    >
      <div className="relative aspect-square">
        <ProductImage
          image={product.images[0]}
          alt={product.name}
          priority={priority}
          sizes={sizes}
          className="h-full w-full"
          imgClassName="transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
        {secondImage && (
          <ProductImage
            image={secondImage}
            alt=""
            sizes={sizes}
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            imgClassName="scale-[1.04]"
          />
        )}

        <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5">
          <ProductBadge badge={product.badge} discount={product.discount} />
        </div>

        <WishlistButton
          product={product}
          className="absolute top-2.5 right-2.5 z-10 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:focus-visible:opacity-100 aria-pressed:opacity-100"
        />
      </div>

      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        <p className="micro-label truncate text-faint">
          {product.brand}
          <span className="mx-1.5 text-line-strong">·</span>
          {product.categoryName}
        </p>
        <h3 className="mt-2 line-clamp-2 min-h-[2.6em] text-[14px] leading-[1.3] font-semibold text-ink sm:text-[15px]">
          <Link to={href} className="outline-none after:absolute after:inset-0 after:z-[1] after:content-['']">
            {product.name}
          </Link>
        </h3>
        <Rating value={product.rating} reviewCount={product.reviewCount} size="sm" className="mt-2" />

        <Price
          value={product.price}
          compareAtPrice={product.compareAtPrice}
          discount={product.discount}
          size="md"
          className="mt-3"
        />

        {variant === 'deal' ? (
          !outOfStock && <StockMeter stock={product.stock} />
        ) : (
          <StockStatus stock={product.stock} lowStock={product.lowStock} className="mt-2" />
        )}

        <div className="mt-auto pt-4">
          <button
            type="button"
            disabled={outOfStock}
            onClick={() => addToCart(product)}
            className={cn(
              'relative z-10 inline-flex h-10 w-full items-center justify-center gap-2 rounded-control text-[13px] font-semibold transition-colors duration-200 sm:h-11 sm:text-sm',
              outOfStock
                ? 'cursor-not-allowed border border-dashed text-faint'
                : 'border border-line-strong bg-surface text-ink hover:border-accent hover:bg-accent hover:text-white group-hover:border-accent group-hover:bg-accent group-hover:text-white',
            )}
          >
            {outOfStock ? (
              'Out of Stock'
            ) : inCart ? (
              <>
                <Check className="h-4 w-4" aria-hidden="true" />
                Add Another
              </>
            ) : (
              <>
                <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  )
}

export default memo(ProductCard)
