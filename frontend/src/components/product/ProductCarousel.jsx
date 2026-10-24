import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ProductCard from './ProductCard'
import ProductCardSkeleton from './ProductCardSkeleton'
import { cn } from '../../utils/cn'

const ITEM_WIDTH = 'w-[46%] xs:w-[40%] sm:w-[31%] lg:w-[calc((100%-3*1.25rem)/4)] 2xl:w-[calc((100%-4*1.25rem)/5)]'

/**
 * Horizontal product rail built on native scroll + CSS scroll-snap: touch
 * swiping, trackpads and keyboard scrolling all work without a carousel
 * library. Arrow buttons page by one viewport width on pointer devices.
 */
export default function ProductCarousel({ products = [], isLoading = false, label, className }) {
  const railRef = useRef(null)
  const [edges, setEdges] = useState({ start: true, end: false })

  const updateEdges = useCallback(() => {
    const rail = railRef.current
    if (!rail) return
    const max = rail.scrollWidth - rail.clientWidth
    setEdges({ start: rail.scrollLeft <= 4, end: rail.scrollLeft >= max - 4 })
  }, [])

  useEffect(() => {
    const rail = railRef.current
    if (!rail) return
    updateEdges()
    const observer = new ResizeObserver(updateEdges)
    observer.observe(rail)
    return () => observer.disconnect()
  }, [updateEdges, products.length, isLoading])

  const page = (direction) => {
    const rail = railRef.current
    if (!rail) return
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    rail.scrollBy({ left: direction * rail.clientWidth * 0.9, behavior: smooth ? 'smooth' : 'auto' })
  }

  const arrow =
    'absolute top-[38%] z-20 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full border bg-elevated text-ink shadow-card transition-[opacity,transform] hover:scale-105 disabled:pointer-events-none disabled:opacity-0 md:grid'

  return (
    <div className={cn('relative', className)}>
      <div
        ref={railRef}
        onScroll={updateEdges}
        role="region"
        aria-label={label}
        tabIndex={0}
        className="scroll-rail -mx-4 scroll-px-4 gap-3 px-4 pt-1 pb-3 sm:-mx-6 sm:scroll-px-6 sm:gap-4 sm:px-6 lg:mx-0 lg:scroll-px-0 lg:gap-5 lg:px-0"
      >
        {isLoading
          ? Array.from({ length: 4 }, (_, i) => (
              <div key={i} className={ITEM_WIDTH}>
                <ProductCardSkeleton />
              </div>
            ))
          : products.map((product) => (
              <div key={product.id} className={ITEM_WIDTH}>
                <ProductCard product={product} sizes="(min-width: 1024px) 300px, (min-width: 640px) 31vw, 46vw" />
              </div>
            ))}
      </div>

      <button type="button" onClick={() => page(-1)} disabled={edges.start} aria-label="Scroll left" className={cn(arrow, '-left-5')}>
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button type="button" onClick={() => page(1)} disabled={edges.end} aria-label="Scroll right" className={cn(arrow, '-right-5')}>
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  )
}
