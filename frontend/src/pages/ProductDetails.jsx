import { useRef, useState } from 'react'
import { PackageX } from 'lucide-react'
import { useParams } from 'react-router-dom'
import Breadcrumbs from '../components/common/Breadcrumbs'
import Container from '../components/common/Container'
import EmptyState from '../components/common/EmptyState'
import ErrorState from '../components/common/ErrorState'
import SectionHeading from '../components/common/SectionHeading'
import Skeleton from '../components/common/Skeleton'
import Tabs from '../components/common/Tabs'
import ProductBadge from '../components/product/ProductBadge'
import ProductCarousel from '../components/product/ProductCarousel'
import ProductGallery from '../components/product/ProductGallery'
import ProductJsonLd from '../components/product/ProductJsonLd'
import ProductReviews from '../components/product/ProductReviews'
import PurchasePanel from '../components/product/PurchasePanel'
import StickyPurchaseBar from '../components/product/StickyPurchaseBar'
import { RETURNS_SUMMARY, SHIPPING_POLICY, warrantyFor } from '../data/policies'
import { useAsync } from '../hooks/useAsync'
import { usePageMeta } from '../hooks/usePageMeta'
import { getProductBySlug } from '../services/catalog'

function ProductSkeleton() {
  return (
    <div className="grid gap-8 py-8 md:grid-cols-2 lg:gap-14" aria-busy="true">
      <span className="sr-only">Loading product</span>
      <Skeleton className="aspect-square w-full" rounded="rounded-panel" />
      <div className="flex flex-col gap-4">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-2/3" />
        <Skeleton className="h-4 w-40" />
        <Skeleton className="mt-4 h-10 w-48" />
        <Skeleton className="mt-6 h-13 w-full" rounded="rounded-control" />
        <Skeleton className="h-13 w-full" rounded="rounded-control" />
        <Skeleton className="mt-4 h-40 w-full" rounded="rounded-card" />
      </div>
    </div>
  )
}

function Specifications({ specifications }) {
  return (
    <dl className="max-w-3xl divide-y divide-line overflow-hidden rounded-card border">
      {Object.entries(specifications).map(([key, value]) => (
        <div key={key} className="grid grid-cols-[minmax(120px,38%)_1fr] gap-4 px-4 py-3.5 text-sm odd:bg-subtle/60 sm:px-5">
          <dt className="micro-label self-center text-faint">{key}</dt>
          <dd className="font-medium text-ink">{value}</dd>
        </div>
      ))}
    </dl>
  )
}

function ShippingInfo({ category }) {
  return (
    <div className="grid max-w-4xl gap-8 md:grid-cols-2">
      <div>
        <h3 className="text-base font-bold text-ink">Delivery times</h3>
        <ul className="mt-3 divide-y divide-line rounded-card border text-sm">
          {SHIPPING_POLICY.map((row) => (
            <li key={row.region} className="flex justify-between gap-4 px-4 py-3">
              <span className="text-muted">{row.region}</span>
              <span className="font-semibold text-ink">{row.time}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[13px] text-muted">Free delivery on orders over LKR 15,000. Otherwise a flat LKR 450 islandwide.</p>
      </div>
      <div className="flex flex-col gap-6">
        <div>
          <h3 className="text-base font-bold text-ink">Warranty</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">{warrantyFor(category)}. Keep your invoice — we handle claims for you.</p>
        </div>
        <div>
          <h3 className="text-base font-bold text-ink">Returns</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">{RETURNS_SUMMARY}</p>
        </div>
      </div>
    </div>
  )
}

export default function ProductDetails() {
  const { slug } = useParams()
  const { data, isLoading, error, reload } = useAsync(() => getProductBySlug(slug), [slug])
  const [tab, setTab] = useState('description')
  const [tabSlug, setTabSlug] = useState(slug)
  if (slug !== tabSlug) {
    setTabSlug(slug)
    setTab('description')
  }
  const tabsRef = useRef(null)
  const ctaRef = useRef(null)

  const product = data?.product?.slug === slug ? data.product : null
  usePageMeta({
    title: product ? `${product.name} — ${product.brand}` : isLoading ? undefined : 'Product not found',
    description: product?.description,
  })

  if (error) {
    return (
      <Container className="py-16">
        <ErrorState onRetry={reload} />
      </Container>
    )
  }

  if (!product) {
    return (
      <Container>
        {isLoading ? (
          <ProductSkeleton />
        ) : (
          <EmptyState
            icon={PackageX}
            title="This product isn’t available."
            description="It may have sold out or moved. Have a look at the rest of the catalogue."
            actionLabel="Back to Shop"
            actionTo="/shop"
          />
        )}
      </Container>
    )
  }

  const showReviews = () => {
    setTab('reviews')
    tabsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <ProductJsonLd product={product} />
      <Container className="pb-16">
        <Breadcrumbs
          className="pt-6 sm:pt-8"
          items={[
            { label: 'Home', to: '/' },
            { label: product.categoryName, to: `/category/${product.category}` },
            { label: product.name },
          ]}
        />

        <div className="grid gap-8 pt-6 md:grid-cols-2 md:gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div className="md:sticky md:top-[140px] md:self-start">
            <ProductGallery
              key={product.id}
              images={product.images}
              name={product.name}
              badge={
                <div className="absolute top-4 left-4">
                  <ProductBadge badge={product.badge} discount={product.discount} />
                </div>
              }
            />
          </div>
          <PurchasePanel key={product.id} product={product} onShowReviews={showReviews} ctaRef={ctaRef} />
        </div>

        <section ref={tabsRef} aria-label="Product information" className="mt-16 scroll-mt-36 sm:mt-20">
          <Tabs
            activeId={tab}
            onChange={setTab}
            tabs={[
              {
                id: 'description',
                label: 'Description',
                content: (
                  <div className="max-w-3xl">
                    <p className="text-[16px] leading-relaxed text-ink">{product.description}</p>
                    {product.highlights.length > 0 && (
                      <ul className="mt-6 grid gap-3 sm:grid-cols-3">
                        {product.highlights.map((highlight) => (
                          <li key={highlight} className="rounded-card border bg-subtle/60 p-4 text-sm font-semibold text-ink">
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ),
              },
              { id: 'specifications', label: 'Specifications', content: <Specifications specifications={product.specifications} /> },
              { id: 'shipping', label: 'Shipping & Warranty', content: <ShippingInfo category={product.category} /> },
              {
                id: 'reviews',
                label: 'Reviews',
                count: product.reviewCount,
                content: <ProductReviews product={product} reviews={data.reviews} breakdown={data.ratingBreakdown} />,
              },
            ]}
          />
        </section>

        {data.related.length > 0 && (
          <section aria-labelledby="related-title" className="mt-20">
            <SectionHeading
              id="related-title"
              eyebrow="You may also like"
              title={`More ${product.categoryName.toLowerCase()}`}
              actionLabel="View category"
              actionTo={`/category/${product.category}`}
              className="mb-8"
            />
            <ProductCarousel products={data.related} label={`More ${product.categoryName}`} />
          </section>
        )}
      </Container>
      <StickyPurchaseBar key={product.id} product={product} targetRef={ctaRef} />
    </>
  )
}
