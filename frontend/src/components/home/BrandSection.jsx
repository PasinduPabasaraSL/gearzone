import { Link } from 'react-router-dom'
import Container from '../common/Container'
import SectionHeading from '../common/SectionHeading'
import Skeleton from '../common/Skeleton'
import { useAsync } from '../../hooks/useAsync'
import { getBrands } from '../../services/catalog'

/** Minimal wordmark tiles linking to the shop pre-filtered by brand. */
export default function BrandSection() {
  const { data: brands, isInitialLoading } = useAsync(getBrands, [])

  return (
    <section aria-labelledby="brands-title" className="border-y bg-subtle/60 py-14 sm:py-20">
      <Container>
        <SectionHeading
          id="brands-title"
          eyebrow="Shop by brand"
          title="Names you already trust"
          description="A sample of the brands in our catalogue."
          className="mb-8 sm:mb-10"
        />
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 xl:grid-cols-8">
          {isInitialLoading
            ? Array.from({ length: 8 }, (_, i) => (
                <li key={i}>
                  <Skeleton className="h-24 w-full" rounded="rounded-card" />
                </li>
              ))
            : brands.map((brand) => (
                <li key={brand.slug}>
                  <Link
                    to={`/shop?brand=${encodeURIComponent(brand.name)}`}
                    className="group flex h-24 flex-col items-center justify-center rounded-card border bg-surface px-3 text-center transition-[border-color,box-shadow] hover:border-accent/50 hover:shadow-card"
                  >
                    <span className="text-lg font-extrabold tracking-[-0.03em] text-ink/70 transition-colors group-hover:text-ink">
                      {brand.name}
                    </span>
                    <span className="tabular mt-1 text-[11px] text-faint">
                      {brand.productCount} item{brand.productCount === 1 ? '' : 's'}
                    </span>
                  </Link>
                </li>
              ))}
        </ul>
      </Container>
    </section>
  )
}
