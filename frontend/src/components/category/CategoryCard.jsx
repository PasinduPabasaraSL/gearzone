import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import CategoryIcon from './CategoryIcon'
import { cn } from '../../utils/cn'

function productLabel(count) {
  return `${count} product${count === 1 ? '' : 's'}`
}

/** Large editorial tile used for the lead category in the bento grid. */
function FeaturedCategoryCard({ category, className }) {
  return (
    <Link
      to={`/category/${category.slug}`}
      className={cn('group relative flex min-h-56 flex-col justify-end overflow-hidden rounded-card bg-strip p-5 text-white sm:p-6', className)}
    >
      <img
        src={category.image}
        alt=""
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
      />
      <span className="absolute inset-0 bg-linear-to-t from-black/85 via-black/35 to-black/5" aria-hidden="true" />
      <span className="relative micro-label text-brand-200">{category.tagline}</span>
      <span className="relative mt-2 text-2xl font-bold tracking-tight sm:text-[28px]">{category.name}</span>
      <span className="relative mt-3 flex items-center justify-between text-sm">
        <span className="tabular text-white/75">{productLabel(category.productCount)}</span>
        <span className="inline-flex items-center gap-1.5 font-semibold">
          Shop now
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
        </span>
      </span>
    </Link>
  )
}

/** Compact tile: photo plate, icon chip, name and live product count. */
export default function CategoryCard({ category, featured = false, className }) {
  if (featured) return <FeaturedCategoryCard category={category} className={className} />

  return (
    <Link
      to={`/category/${category.slug}`}
      className={cn(
        'group flex flex-col rounded-card border bg-surface p-2 transition-[border-color,box-shadow,transform] duration-300',
        'hover:-translate-y-0.5 hover:border-line-strong hover:shadow-card',
        className,
      )}
    >
      <div className="product-plate relative aspect-[4/3] overflow-hidden rounded-[10px]">
        <img
          src={category.image}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
        />
        <span className="absolute top-2 left-2 grid h-8 w-8 place-items-center rounded-lg bg-surface/90 text-ink shadow-xs backdrop-blur-sm">
          <CategoryIcon name={category.icon} className="h-4 w-4" strokeWidth={2} />
        </span>
      </div>
      <div className="flex items-end justify-between gap-2 px-1.5 pt-3 pb-1">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink">{category.name}</p>
          <p className="tabular mt-1 text-xs text-muted">{productLabel(category.productCount)}</p>
        </div>
        <ArrowUpRight
          className="mb-0.5 h-4 w-4 shrink-0 text-link opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 [@media(hover:hover)]:-translate-x-1"
          aria-hidden="true"
        />
      </div>
    </Link>
  )
}
