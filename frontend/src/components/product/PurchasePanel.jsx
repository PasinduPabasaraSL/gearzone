import { useState } from 'react'
import { Banknote, Check, RotateCcw, ShieldCheck, ShoppingBag, Truck, Zap } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import QuantityStepper from './QuantityStepper'
import StockStatus from './StockStatus'
import WishlistButton from './WishlistButton'
import Button from '../common/Button'
import Price from '../common/Price'
import Rating from '../common/Rating'
import { RETURNS_SUMMARY, SHIPPING_POLICY, warrantyFor } from '../../data/policies'
import { useShopActions } from '../../hooks/useShopActions'
import { formatCurrency } from '../../utils/formatCurrency'
import { MAX_QUANTITY_PER_ITEM } from '../../utils/orderSummary'

/**
 * Right-hand column of the product page: identity, price, stock, quantity
 * and the primary purchase actions, followed by delivery and warranty
 * assurances. `ctaRef` marks the CTA row so the mobile sticky bar knows when
 * it has scrolled away.
 */
export default function PurchasePanel({ product, onShowReviews, ctaRef }) {
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useShopActions()
  const navigate = useNavigate()
  const outOfStock = product.stock === 0
  const maxQuantity = Math.min(product.stock, MAX_QUANTITY_PER_ITEM)
  const savings = product.compareAtPrice ? product.compareAtPrice - product.price : 0

  const buyNow = () => {
    if (addToCart(product, quantity)) navigate('/checkout')
  }

  return (
    <div className="flex flex-col">
      <p className="micro-label flex flex-wrap items-center gap-x-2 gap-y-1 text-faint">
        <Link to={`/shop?brand=${encodeURIComponent(product.brand)}`} className="text-link hover:underline">
          {product.brand}
        </Link>
        <span aria-hidden="true">·</span>
        <Link to={`/category/${product.category}`} className="hover:text-ink">
          {product.categoryName}
        </Link>
      </p>
      <h1 className="mt-3 text-[26px] leading-[1.15] font-extrabold tracking-[-0.025em] text-ink sm:text-[32px]">{product.name}</h1>

      <button type="button" onClick={onShowReviews} className="group mt-3 self-start rounded-control">
        <Rating
          value={product.rating}
          showValue
          reviewCount={product.reviewCount}
          className="[&>span:last-child]:underline-offset-4 group-hover:[&>span:last-child]:underline"
        />
      </button>

      <div className="mt-6 border-y py-5">
        <Price value={product.price} compareAtPrice={product.compareAtPrice} discount={product.discount} size="xl" />
        {savings > 0 && (
          <p className="tabular mt-1.5 text-sm font-semibold text-success">You save {formatCurrency(savings)}</p>
        )}
        <StockStatus stock={product.stock} lowStock={product.lowStock} className="mt-3 text-[13px]" />
      </div>

      {product.highlights.length > 0 && (
        <ul className="mt-5 flex flex-col gap-2.5">
          {product.highlights.map((highlight) => (
            <li key={highlight} className="flex items-start gap-2.5 text-[15px] text-ink">
              <Check className="mt-0.5 h-4.5 w-4.5 shrink-0 text-link" aria-hidden="true" />
              {highlight}
            </li>
          ))}
        </ul>
      )}

      <div ref={ctaRef} className="mt-7 flex flex-col gap-3">
        <div className="flex gap-3">
          {!outOfStock && <QuantityStepper size="lg" value={quantity} max={maxQuantity} onChange={setQuantity} />}
          <Button size="lg" className="min-w-0 flex-1 px-4" disabled={outOfStock} onClick={() => addToCart(product, quantity)}>
            <ShoppingBag className="h-5 w-5 shrink-0 max-xs:hidden" aria-hidden="true" />
            {outOfStock ? 'Out of Stock' : 'Add to Cart'}
          </Button>
          <WishlistButton product={product} variant="inline" />
        </div>
        {!outOfStock && (
          <Button size="lg" variant="secondary" fullWidth onClick={buyNow}>
            <Zap className="h-4.5 w-4.5" aria-hidden="true" />
            Buy Now
          </Button>
        )}
      </div>

      <ul className="mt-7 grid gap-px overflow-hidden rounded-card border bg-line text-sm">
        <li className="flex gap-3 bg-surface p-4">
          <Truck className="mt-0.5 h-5 w-5 shrink-0 text-link" aria-hidden="true" />
          <span>
            <span className="block font-semibold text-ink">Islandwide delivery</span>
            <span className="text-muted">
              {SHIPPING_POLICY[0].region}: {SHIPPING_POLICY[0].time} · elsewhere {SHIPPING_POLICY[1].time}
            </span>
          </span>
        </li>
        <li className="flex gap-3 bg-surface p-4">
          <Banknote className="mt-0.5 h-5 w-5 shrink-0 text-link" aria-hidden="true" />
          <span>
            <span className="block font-semibold text-ink">Cash on delivery</span>
            <span className="text-muted">Pay when your order arrives, or by bank transfer.</span>
          </span>
        </li>
        <li className="flex gap-3 bg-surface p-4">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-link" aria-hidden="true" />
          <span>
            <span className="block font-semibold text-ink">Warranty</span>
            <span className="text-muted">{warrantyFor(product.category)}</span>
          </span>
        </li>
        <li className="flex gap-3 bg-surface p-4">
          <RotateCcw className="mt-0.5 h-5 w-5 shrink-0 text-link" aria-hidden="true" />
          <span>
            <span className="block font-semibold text-ink">7-day returns</span>
            <span className="text-muted">{RETURNS_SUMMARY}</span>
          </span>
        </li>
      </ul>
    </div>
  )
}
