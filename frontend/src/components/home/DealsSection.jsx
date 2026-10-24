import { ArrowRight, Tag } from 'lucide-react'
import Button from '../common/Button'
import Container from '../common/Container'
import ErrorState from '../common/ErrorState'
import ProductGrid from '../product/ProductGrid'
import { useAsync } from '../../hooks/useAsync'
import { getProducts } from '../../services/catalog'

/**
 * "Gear Deals": the one section allowed a strong blue treatment. Shows the
 * deepest in-stock discounts with a factual stock meter, no fake timers.
 */
export default function DealsSection() {
  const { data, isInitialLoading, error, reload } = useAsync(() => getProducts({ collection: 'deals', limit: 4 }), [])

  return (
    <section aria-labelledby="deals-title" className="py-6 sm:py-10">
      <Container>
        <div className="relative overflow-hidden rounded-panel bg-brand-700 p-5 sm:p-8 lg:p-10 dark:bg-brand-800">
          <div
            aria-hidden="true"
            className="blueprint-grid pointer-events-none absolute inset-0 opacity-60 [--grid-dot:rgb(255_255_255/0.14)] [mask-image:linear-gradient(to_right,black,transparent_65%)]"
          />
          <div className="relative grid gap-8 lg:grid-cols-[280px_1fr] lg:gap-10">
            <div className="flex flex-col">
              <p className="micro-label inline-flex items-center gap-2 text-brand-200">
                <Tag className="h-3.5 w-3.5" aria-hidden="true" />
                Gear Deals
              </p>
              <h2 id="deals-title" className="mt-3 text-[30px] leading-[1.08] font-extrabold tracking-tight text-white sm:text-4xl">
                Upgrade for less.
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-brand-100">
                Limited-time deals on everyday tech essentials. Prices hold while stock lasts.
              </p>
              <Button variant="onAccent" to="/deals" className="mt-7 self-start">
                View all deals
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>

            {error ? (
              <div className="rounded-card bg-surface">
                <ErrorState onRetry={reload} />
              </div>
            ) : (
              <ProductGrid
                products={data?.items}
                isLoading={isInitialLoading}
                skeletonCount={4}
                variant="deal"
                layout="deals"
                className="lg:max-2xl:[&>*:nth-child(4)]:hidden"
              />
            )}
          </div>
        </div>
      </Container>
    </section>
  )
}
