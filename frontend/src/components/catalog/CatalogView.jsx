import { useMemo, useState } from 'react'
import { PackageSearch, SearchX, SlidersHorizontal } from 'lucide-react'
import ActiveFilters from '../filters/ActiveFilters'
import FilterSidebar from '../filters/FilterSidebar'
import MobileFilters from '../filters/MobileFilters'
import SortDropdown from '../filters/SortDropdown'
import Button from '../common/Button'
import EmptyState from '../common/EmptyState'
import ErrorState from '../common/ErrorState'
import ProductGrid from '../product/ProductGrid'
import { useAsync } from '../../hooks/useAsync'
import { useCatalogParams } from '../../hooks/useCatalogParams'
import { getCategories, getProducts } from '../../services/catalog'
import { countActiveFilters } from '../../utils/filterProducts'

const PAGE_SIZE = 12

/**
 * The browsing experience shared by Shop, Category, Deals, New Arrivals and
 * Search: filter sidebar (sheet on mobile), sort, active-filter chips, grid
 * and incremental "load more". `scope` fixes the part of the catalogue a page
 * covers; everything the shopper changes lives in the URL.
 */
export default function CatalogView({ scope = {}, defaultSort = 'featured', showCategoryFilter = true, emptyTitle, emptyDescription }) {
  const { filters, sort, setFilters, setSort, toggleListValue, clearFilters } = useCatalogParams({ defaultSort })
  const [filtersOpen, setFiltersOpen] = useState(false)

  const queryKey = JSON.stringify([scope, filters, sort])
  const [page, setPage] = useState({ key: queryKey, count: PAGE_SIZE })
  if (page.key !== queryKey) setPage({ key: queryKey, count: PAGE_SIZE })

  const { data, error, isLoading, isInitialLoading, reload } = useAsync(
    () => getProducts({ ...scope, filters, sort }),
    [scope, filters, sort],
  )
  const { data: categories = [] } = useAsync(getCategories, [])

  const categoryNames = useMemo(() => Object.fromEntries(categories.map((c) => [c.slug, c.name])), [categories])
  const activeCount = countActiveFilters(filters)
  const total = data?.total ?? 0
  const visible = data?.items.slice(0, page.count) ?? []

  const sidebarProps = {
    filters,
    facets: data?.facets,
    categories,
    showCategoryFilter,
    onChange: setFilters,
    onToggle: toggleListValue,
  }

  return (
    <div className="lg:grid lg:grid-cols-[256px_minmax(0,1fr)] lg:gap-10">
      <aside aria-label="Filters" className="sticky top-[136px] hidden max-h-[calc(100svh-152px)] self-start overflow-y-auto pr-3 pb-6 lg:block">
        <div className="flex items-center justify-between pb-1">
          <h2 className="text-base font-bold text-ink">Filters</h2>
          {activeCount > 0 && (
            <button type="button" onClick={clearFilters} className="text-[13px] font-semibold text-link hover:underline">
              Clear all
            </button>
          )}
        </div>
        <FilterSidebar {...sidebarProps} />
      </aside>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-3 border-b pb-4">
          <Button variant="secondary" size="sm" onClick={() => setFiltersOpen(true)} className="h-10 lg:hidden" aria-haspopup="dialog">
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            Filters
            {activeCount > 0 && (
              <span className="tabular grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1.5 text-[10px] font-bold text-white">
                {activeCount}
              </span>
            )}
          </Button>
          <p className="text-sm text-muted" aria-live="polite">
            {isInitialLoading ? (
              'Loading products…'
            ) : (
              <>
                <span className="tabular font-semibold text-ink">{total}</span> product{total === 1 ? '' : 's'}
              </>
            )}
          </p>
          <SortDropdown value={sort} onChange={setSort} includeRelevance={Boolean(scope.search)} className="ml-auto w-48 sm:w-56" />
        </div>

        {activeCount > 0 && (
          <div className="pt-4">
            <ActiveFilters filters={filters} categoryNames={categoryNames} onChange={setFilters} onToggle={toggleListValue} onClear={clearFilters} />
          </div>
        )}

        <div className="pt-6">
          {error ? (
            <ErrorState onRetry={reload} />
          ) : !isInitialLoading && total === 0 ? (
            activeCount > 0 ? (
              <EmptyState
                icon={PackageSearch}
                title="No gear matches these filters"
                description="Try removing a filter or widening the price range."
                actionLabel="Clear filters"
                onAction={clearFilters}
              />
            ) : (
              <EmptyState
                icon={SearchX}
                title={emptyTitle ?? 'No gear found'}
                description={emptyDescription ?? 'Try a different search term.'}
                actionLabel="Browse all products"
                actionTo="/shop"
              />
            )
          ) : (
            <>
              <ProductGrid
                products={visible}
                isLoading={isInitialLoading}
                skeletonCount={9}
                layout="sidebar"
                priorityCount={3}
                dimmed={isLoading && !isInitialLoading}
              />
              {!isInitialLoading && total > visible.length && (
                <div className="mt-10 flex flex-col items-center gap-3">
                  <p className="tabular text-[13px] text-muted">
                    Showing {visible.length} of {total}
                  </p>
                  <div className="h-1 w-40 overflow-hidden rounded-full bg-line" aria-hidden="true">
                    <div className="h-full rounded-full bg-accent" style={{ width: `${(visible.length / total) * 100}%` }} />
                  </div>
                  <Button variant="secondary" onClick={() => setPage({ key: queryKey, count: page.count + PAGE_SIZE })} className="mt-2">
                    Load more
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <MobileFilters
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        total={total}
        activeCount={activeCount}
        onClear={clearFilters}
        {...sidebarProps}
      />
    </div>
  )
}
