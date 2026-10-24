import { useRef, useState } from 'react'
import ProductImage from './ProductImage'
import { cn } from '../../utils/cn'

const ZOOM = 1.9

/**
 * Product gallery. Phones get a swipeable, snap-scrolling strip with dot
 * indicators; larger screens get a main image with hover zoom that follows
 * the cursor, plus a thumbnail rail.
 */
export default function ProductGallery({ images, name, badge }) {
  const [active, setActive] = useState(0)
  const [zoom, setZoom] = useState(null)
  const stripRef = useRef(null)
  const current = images[active] ?? images[0]

  const onStripScroll = () => {
    const strip = stripRef.current
    if (!strip) return
    const index = Math.round(strip.scrollLeft / strip.clientWidth)
    if (index !== active) setActive(index)
  }

  const onZoomMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setZoom({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    })
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Phones: swipe between photos. */}
      <div className="relative md:hidden">
        <div ref={stripRef} onScroll={onStripScroll} className="scroll-rail -mx-4 snap-x" aria-label={`${name} photos`} role="region">
          {images.map((image, index) => (
            <ProductImage
              key={image.id + index}
              image={image}
              alt={`${name} — photo ${index + 1} of ${images.length}`}
              sizes="100vw"
              priority={index === 0}
              className="aspect-square w-full"
            />
          ))}
        </div>
        {badge}
        {images.length > 1 && (
          <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5" aria-hidden="true">
            {images.map((image, index) => (
              <span
                key={image.id + index}
                className={cn('h-1.5 rounded-full bg-white/90 shadow-xs transition-all', index === active ? 'w-5' : 'w-1.5 opacity-60')}
              />
            ))}
          </div>
        )}
      </div>

      {/* Tablet and up: main image with cursor-following zoom. */}
      <div
        className="relative hidden cursor-zoom-in overflow-hidden rounded-panel border md:block"
        onMouseMove={onZoomMove}
        onMouseLeave={() => setZoom(null)}
      >
        <ProductImage
          key={current.id + active}
          image={current}
          alt={`${name} — photo ${active + 1} of ${images.length}`}
          sizes="(min-width: 1280px) 620px, 50vw"
          priority
          className="aspect-square w-full"
          imgClassName="transition-transform duration-200 ease-out"
        />
        {zoom && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-no-repeat"
            style={{
              backgroundImage: `url(${current.large ?? current.src})`,
              backgroundSize: `${ZOOM * 100}%`,
              backgroundPosition: `${zoom.x}% ${zoom.y}%`,
            }}
          />
        )}
        {badge}
      </div>

      {images.length > 1 && (
        <div className="hidden grid-cols-5 gap-3 md:grid" role="group" aria-label="Choose photo">
          {images.map((image, index) => (
            <button
              key={image.id + index}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Show photo ${index + 1}`}
              aria-pressed={index === active}
              className={cn(
                'product-plate aspect-square overflow-hidden rounded-card border-2 transition-[border-color,opacity]',
                index === active ? 'border-accent' : 'border-transparent opacity-70 hover:opacity-100',
              )}
            >
              <img src={image.thumbnail} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
