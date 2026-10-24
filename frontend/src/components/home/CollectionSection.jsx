import Container from '../common/Container'
import ErrorState from '../common/ErrorState'
import SectionHeading from '../common/SectionHeading'
import ProductCarousel from '../product/ProductCarousel'
import ProductGrid from '../product/ProductGrid'
import { useAsync } from '../../hooks/useAsync'
import { getProducts } from '../../services/catalog'
import { cn } from '../../utils/cn'

/**
 * A homepage product section: heading plus a grid or carousel fed by a
 * catalogue query. Featured, Trending and New Arrivals are all instances.
 */
export default function CollectionSection({
  id,
  eyebrow,
  title,
  description,
  actionLabel = 'View all',
  actionTo,
  collection,
  limit = 8,
  display = 'grid',
  gridClassName,
  className,
}) {
  const { data, isInitialLoading, error, reload } = useAsync(() => getProducts({ collection, limit }), [collection, limit])
  const headingId = `${id}-title`

  return (
    <section id={id} aria-labelledby={headingId} className={cn('py-14 sm:py-20', className)}>
      <Container>
        <SectionHeading
          id={headingId}
          eyebrow={eyebrow}
          title={title}
          description={description}
          actionLabel={actionLabel}
          actionTo={actionTo}
          className="mb-8 sm:mb-10"
        />
        {error ? (
          <ErrorState onRetry={reload} />
        ) : display === 'carousel' ? (
          <ProductCarousel products={data?.items} isLoading={isInitialLoading} label={title} />
        ) : (
          <ProductGrid
            products={data?.items}
            isLoading={isInitialLoading}
            skeletonCount={Math.min(limit, 8)}
            className={gridClassName}
          />
        )}
      </Container>
    </section>
  )
}
