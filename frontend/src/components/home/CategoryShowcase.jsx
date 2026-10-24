import CategoryGrid from '../category/CategoryGrid'
import Container from '../common/Container'
import ErrorState from '../common/ErrorState'
import SectionHeading from '../common/SectionHeading'
import { useAsync } from '../../hooks/useAsync'
import { getCategories } from '../../services/catalog'

export default function CategoryShowcase() {
  const { data, isInitialLoading, error, reload } = useAsync(getCategories, [])

  return (
    <section id="categories" aria-labelledby="categories-title" className="scroll-mt-32 py-14 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="Browse"
          id="categories-title"
          title="Shop by category"
          description="From the keys under your fingers to the cable behind your desk."
          actionLabel="All products"
          actionTo="/shop"
          className="mb-8 sm:mb-10"
        />
        {error ? <ErrorState onRetry={reload} /> : <CategoryGrid categories={data} isLoading={isInitialLoading} />}
      </Container>
    </section>
  )
}
