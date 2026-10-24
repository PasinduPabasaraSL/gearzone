import ProductCard from './ProductCard'
import ProductCardSkeleton from './ProductCardSkeleton'
import { cn } from '../../utils/cn'

const LAYOUTS = {
  // Full-width sections: 2 → 3 → 4 → 5 columns.
  wide: {
    grid: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5',
    sizes: '(min-width: 1536px) 20vw, (min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw',
  },
  // Inside the deals panel: 2 columns, 3 beside the panel copy, 4 on wide screens.
  deals: {
    grid: 'grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4',
    sizes: '(min-width: 1536px) 360px, (min-width: 1024px) 280px, 50vw',
  },
  // Beside the filter sidebar: 2 → 3 → 4 columns.
  sidebar: {
    grid: 'grid-cols-2 md:grid-cols-3 2xl:grid-cols-4',
    sizes: '(min-width: 1536px) 22vw, (min-width: 768px) 30vw, 50vw',
  },
}

export default function ProductGrid({
  products = [],
  isLoading = false,
  skeletonCount = 8,
  layout = 'wide',
  variant,
  priorityCount = 0,
  dimmed = false,
  className,
}) {
  const config = LAYOUTS[layout]

  return (
    <div
      className={cn(
        'grid gap-3 sm:gap-4 lg:gap-5',
        config.grid,
        dimmed && 'pointer-events-none opacity-60 transition-opacity',
        className,
      )}
      aria-busy={isLoading || dimmed}
    >
      {isLoading
        ? Array.from({ length: skeletonCount }, (_, i) => <ProductCardSkeleton key={i} />)
        : products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              variant={variant}
              sizes={config.sizes}
              priority={index < priorityCount}
            />
          ))}
    </div>
  )
}
