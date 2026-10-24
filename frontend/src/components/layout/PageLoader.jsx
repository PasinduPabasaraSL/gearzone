import Container from '../common/Container'
import Skeleton from '../common/Skeleton'

/** Shown on a cold start while the first route chunk downloads. */
export default function PageLoader() {
  return (
    <Container className="py-12" aria-busy="true">
      <span className="sr-only">Loading</span>
      <Skeleton className="h-8 w-56" />
      <Skeleton className="mt-3 h-4 w-80 max-w-full" />
      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <Skeleton key={i} className="aspect-[3/4] w-full" rounded="rounded-card" />
        ))}
      </div>
    </Container>
  )
}
