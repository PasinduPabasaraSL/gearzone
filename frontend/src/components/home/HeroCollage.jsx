import { Link } from 'react-router-dom'
import { HERO_PICKS } from '../../data/editorial'
import { cn } from '../../utils/cn'
import { formatCurrency } from '../../utils/formatCurrency'

function PriceTag({ item, className }) {
  return (
    <span className={cn('absolute flex flex-col rounded-control border bg-elevated/95 px-3 py-2 shadow-card backdrop-blur-sm', className)}>
      <span className="micro-label text-faint">{item.brand}</span>
      <span className="tabular mt-1 text-sm font-bold text-ink">{formatCurrency(item.price)}</span>
    </span>
  )
}

/**
 * Static, asymmetric product composition. It is the hero's visual on small
 * screens and the fallback whenever the 3D keyboard cannot run (reduced
 * motion, no WebGL, or while the 3D chunk loads).
 */
export default function HeroCollage({ className }) {
  const { primary, secondary, tertiary } = HERO_PICKS

  return (
    <div className={cn('relative mx-auto aspect-[5/4] w-full max-w-[560px] 2xl:max-w-[700px]', className)}>
      <Link
        to={`/product/${primary.slug}`}
        aria-label={primary.name}
        className="group absolute top-[6%] left-[4%] w-[66%] overflow-hidden rounded-panel border bg-surface shadow-lift transition-transform duration-500 hover:-translate-y-1"
      >
        <img src={primary.image.src} srcSet={primary.image.srcSet} sizes="(min-width: 1024px) 360px, 60vw" alt="" fetchPriority="high" className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
        <PriceTag item={primary} className="bottom-3 left-3" />
      </Link>

      <Link
        to={`/product/${secondary.slug}`}
        aria-label={secondary.name}
        className="group absolute top-0 right-[2%] w-[36%] overflow-hidden rounded-card border bg-surface shadow-card transition-transform duration-500 hover:-translate-y-1"
      >
        <img src={secondary.image.thumbnail} srcSet={secondary.image.srcSet} sizes="200px" alt="" className="aspect-[4/5] w-full object-cover" />
      </Link>

      <Link
        to={`/product/${tertiary.slug}`}
        aria-label={tertiary.name}
        className="group absolute right-0 bottom-[2%] w-[44%] overflow-hidden rounded-card border bg-surface shadow-lift transition-transform duration-500 hover:-translate-y-1"
      >
        <img src={tertiary.image.thumbnail} srcSet={tertiary.image.srcSet} sizes="240px" alt="" className="aspect-[4/3] w-full object-cover" />
        <PriceTag item={tertiary} className="top-2.5 left-2.5 scale-90 origin-top-left" />
      </Link>
    </div>
  )
}
