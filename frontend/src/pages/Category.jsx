import { useMemo } from 'react'
import { PackageX } from 'lucide-react'
import { useParams } from 'react-router-dom'
import CatalogView from '../components/catalog/CatalogView'
import PageHeader from '../components/catalog/PageHeader'
import CategoryIcon from '../components/category/CategoryIcon'
import Container from '../components/common/Container'
import EmptyState from '../components/common/EmptyState'
import ErrorState from '../components/common/ErrorState'
import Skeleton from '../components/common/Skeleton'
import { useAsync } from '../hooks/useAsync'
import { usePageMeta } from '../hooks/usePageMeta'
import { getCategory } from '../services/catalog'

export default function Category() {
  const { slug } = useParams()
  const { data: category, isLoading, error, reload } = useAsync(() => getCategory(slug), [slug])
  const scope = useMemo(() => ({ category: slug }), [slug])

  usePageMeta({
    title: category ? category.name : isLoading ? undefined : 'Category not found',
    description: category?.description,
  })

  if (error) {
    return (
      <Container className="py-16">
        <ErrorState onRetry={reload} />
      </Container>
    )
  }

  if (!isLoading && !category) {
    return (
      <Container className="py-10">
        <EmptyState
          icon={PackageX}
          title="We couldn’t find that category."
          description="It may have moved. Browse the full catalogue instead."
          actionLabel="Back to Shop"
          actionTo="/shop"
        />
      </Container>
    )
  }

  const ready = category && category.slug === slug

  return (
    <Container className="pb-20">
      {ready ? (
        <PageHeader
          breadcrumbs={[
            { label: 'Home', to: '/' },
            { label: 'Shop', to: '/shop' },
            { label: category.name },
          ]}
          eyebrow={
            <span className="inline-flex items-center gap-2">
              <CategoryIcon name={category.icon} className="h-3.5 w-3.5" />
              {category.tagline} · {category.productCount} products
            </span>
          }
          title={category.name}
          description={category.description}
          aside={
            <div className="product-plate relative hidden h-36 w-56 shrink-0 overflow-hidden rounded-panel border md:block">
              <img src={category.image} alt="" className="h-full w-full object-cover" />
            </div>
          }
        />
      ) : (
        <div className="pt-8 pb-10" aria-hidden="true">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="mt-8 h-9 w-72" />
          <Skeleton className="mt-4 h-4 w-full max-w-xl" />
        </div>
      )}
      <CatalogView key={slug} scope={scope} showCategoryFilter={false} emptyTitle="Nothing here yet" emptyDescription="New gear for this category is on the way." />
    </Container>
  )
}
