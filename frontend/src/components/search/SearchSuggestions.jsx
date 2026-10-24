import { ArrowRight, ArrowUpRight, LayoutGrid, Search, TrendingUp } from 'lucide-react'
import Highlight from './Highlight'
import Skeleton from '../common/Skeleton'
import { cn } from '../../utils/cn'
import { formatCurrency } from '../../utils/formatCurrency'

const GROUPS = [
  { type: 'popular', title: 'Popular searches' },
  { type: 'keyword', title: 'Suggestions' },
  { type: 'category', title: 'Categories' },
  { type: 'product', title: 'Products' },
]

function OptionContent({ option, term }) {
  if (option.type === 'product') {
    const { product } = option
    return (
      <>
        <img
          src={product.images[0].thumbnail}
          alt=""
          loading="lazy"
          className="h-12 w-12 shrink-0 rounded-[10px] border object-cover product-plate"
        />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm text-ink">
            <Highlight text={product.name} term={term} />
          </span>
          <span className="micro-label mt-1.5 block text-faint">
            {product.brand} · {product.categoryName}
          </span>
        </span>
        <span className="tabular shrink-0 text-sm font-semibold text-ink">{formatCurrency(product.price)}</span>
      </>
    )
  }

  if (option.type === 'all') {
    return (
      <>
        <span className="flex-1 text-sm font-semibold text-link">{option.label}</span>
        <ArrowRight className="h-4 w-4 text-link" aria-hidden="true" />
      </>
    )
  }

  const Icon = option.type === 'category' ? LayoutGrid : option.type === 'popular' ? TrendingUp : Search
  return (
    <>
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-control bg-subtle text-muted">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm text-ink capitalize">
          <Highlight text={option.label} term={term} />
        </span>
        {option.meta && <span className="block truncate text-xs text-muted">{option.meta}</span>}
      </span>
      <ArrowUpRight className="h-4 w-4 shrink-0 text-faint" aria-hidden="true" />
    </>
  )
}

/**
 * Listbox for the search combobox. Options are rendered in groups but keep a
 * single flat index so arrow keys move through every option in order.
 */
export default function SearchSuggestions({ combobox, className }) {
  const { options, activeIndex, setActiveIndex, select, listId, optionId, term, isPending, noResults } = combobox
  const indexed = options.map((option, index) => ({ option, index }))

  return (
    <div className={className}>
      <ul id={listId} role="listbox" aria-label="Search suggestions" className="flex flex-col gap-4">
        {GROUPS.map((group) => {
          const items = indexed.filter((entry) => entry.option.type === group.type)
          if (items.length === 0) return null
          return (
            <li key={group.type} role="presentation">
              <p className="micro-label mb-1.5 px-3 text-faint" aria-hidden="true">
                {group.title}
              </p>
              <ul role="group" aria-label={group.title} className="flex flex-col">
                {items.map(({ option, index }) => (
                  <li
                    key={option.id}
                    id={optionId(index)}
                    role="option"
                    aria-selected={index === activeIndex}
                    onMouseDown={(event) => event.preventDefault()}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => select(option)}
                    className={cn(
                      'flex cursor-pointer items-center gap-3 rounded-control px-3 py-2 transition-colors',
                      index === activeIndex ? 'bg-subtle' : 'hover:bg-subtle',
                    )}
                  >
                    <OptionContent option={option} term={term} />
                  </li>
                ))}
              </ul>
            </li>
          )
        })}

        {indexed
          .filter((entry) => entry.option.type === 'all')
          .map(({ option, index }) => (
            <li
              key={option.id}
              id={optionId(index)}
              role="option"
              aria-selected={index === activeIndex}
              onMouseDown={(event) => event.preventDefault()}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => select(option)}
              className={cn(
                'flex cursor-pointer items-center gap-3 rounded-control border-t px-3 pt-3.5 pb-2.5 transition-colors',
                index === activeIndex ? 'bg-accent-soft' : 'hover:bg-accent-soft',
              )}
            >
              <OptionContent option={option} term={term} />
            </li>
          ))}
      </ul>

      {isPending && options.length === 0 && (
        <div className="flex flex-col gap-2 px-3" aria-hidden="true">
          {[0, 1, 2].map((key) => (
            <div key={key} className="flex items-center gap-3 py-1.5">
              <Skeleton className="h-12 w-12" rounded="rounded-[10px]" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3.5 w-3/4" />
                <Skeleton className="h-2.5 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {noResults && (
        <div className="px-3 py-8 text-center">
          <p className="text-sm font-semibold text-ink">No gear found for “{term}”</p>
          <p className="mt-1 text-[13px] text-muted">Try a different search term, like “cable” or “mouse”.</p>
        </div>
      )}

      <p className="sr-only" aria-live="polite">
        {isPending ? 'Searching' : noResults ? 'No results' : term ? `${options.length} suggestions available` : ''}
      </p>
    </div>
  )
}
