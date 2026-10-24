import { useState } from 'react'
import { ImageOff } from 'lucide-react'
import { cn } from '../../utils/cn'

/**
 * Product photo with lazy loading, responsive srcset, a shimmer placeholder
 * while it loads, and a neutral fallback if the CDN URL fails. Images are
 * square CDN crops shown with object-cover, so they fill the tile without
 * ever being stretched.
 */
export default function ProductImage({
  image,
  alt,
  sizes = '(min-width: 1280px) 300px, (min-width: 768px) 33vw, 50vw',
  priority = false,
  className,
  imgClassName,
}) {
  const [status, setStatus] = useState('loading')

  return (
    <div className={cn('product-plate relative overflow-hidden', className)}>
      {status === 'loading' && <div className="animate-shimmer absolute inset-0 bg-line/50 dark:bg-elevated" aria-hidden="true" />}
      {status === 'error' || !image ? (
        <div className="absolute inset-0 grid place-items-center text-faint" role="img" aria-label={alt}>
          <ImageOff className="h-8 w-8" strokeWidth={1.5} aria-hidden="true" />
        </div>
      ) : (
        <img
          src={image.src}
          srcSet={image.srcSet}
          sizes={sizes}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          className={cn(
            'h-full w-full object-cover transition-opacity duration-300',
            status === 'loaded' ? 'opacity-100' : 'opacity-0',
            imgClassName,
          )}
        />
      )}
    </div>
  )
}
