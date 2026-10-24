import CategoryCard from './CategoryCard'
import Skeleton from '../common/Skeleton'

/**
 * Bento layout: the lead category takes a 2×2 editorial tile and the rest
 * flow around it — 2 columns on phones, 4 on tablets, 6 on desktop (two
 * clean rows for nine categories).
 */
export default function CategoryGrid({ categories = [], isLoading = false }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-6" aria-busy="true">
        <Skeleton className="col-span-2 min-h-56 md:row-span-2" rounded="rounded-card" />
        {Array.from({ length: 8 }, (_, i) => (
          <Skeleton key={i} className="aspect-[5/5] w-full" rounded="rounded-card" />
        ))}
      </div>
    )
  }

  const [lead, ...rest] = categories

  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-6">
      {lead && (
        <li className="col-span-2 md:row-span-2">
          <CategoryCard category={lead} featured className="h-full" />
        </li>
      )}
      {rest.map((category) => (
        <li key={category.slug}>
          <CategoryCard category={category} className="h-full" />
        </li>
      ))}
    </ul>
  )
}
