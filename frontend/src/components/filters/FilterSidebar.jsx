import { useId } from 'react'
import { Star } from 'lucide-react'
import FilterGroup from './FilterGroup'
import PriceRangeFilter from './PriceRangeFilter'
import Checkbox from '../common/Checkbox'
import { DISCOUNT_OPTIONS, RATING_OPTIONS } from '../../utils/filterProducts'
import { cn } from '../../utils/cn'

/** Exclusive choice rendered as native radios, with an "Any" reset option. */
function RadioList({ name, options, value, onChange }) {
  return (
    <div role="radiogroup" className="flex flex-col">
      {options.map((option) => {
        const checked = value === option.value
        return (
          <label key={String(option.value)} className="group flex cursor-pointer items-center gap-3 py-1.5 text-sm select-none">
            <input
              type="radio"
              name={name}
              checked={checked}
              onChange={() => onChange(option.value)}
              className="peer sr-only"
            />
            <span
              aria-hidden="true"
              className={cn(
                'grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full border border-line-strong bg-surface transition-colors group-hover:border-accent',
                'peer-checked:border-accent peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-500',
              )}
            >
              <span className={cn('h-2 w-2 rounded-full bg-accent transition-transform', checked ? 'scale-100' : 'scale-0')} />
            </span>
            <span className={cn('flex items-center gap-1.5', checked ? 'font-semibold text-ink' : 'text-muted group-hover:text-ink')}>
              {option.label}
            </span>
          </label>
        )
      })}
    </div>
  )
}

/**
 * Every filter control for the catalogue. Rendered in the desktop sidebar
 * and inside the mobile filter sheet; all changes apply immediately.
 */
export default function FilterSidebar({
  filters,
  facets,
  categories = [],
  showCategoryFilter = true,
  onChange,
  onToggle,
  className,
}) {
  const nameBase = useId()
  const brandEntries = Object.entries(facets?.brandCounts ?? {}).sort(([a], [b]) => a.localeCompare(b))
  const visibleCategories = categories.filter((category) => facets?.categoryCounts?.[category.slug])

  const ratingOptions = [
    { value: null, label: 'Any rating' },
    ...RATING_OPTIONS.map((rating) => ({
      value: rating,
      label: (
        <>
          <Star className="h-3.5 w-3.5 fill-warning text-warning" aria-hidden="true" />
          {rating} & up
        </>
      ),
    })),
  ]
  const discountOptions = [
    { value: null, label: 'Any price' },
    ...DISCOUNT_OPTIONS.map((discount) => ({ value: discount, label: `${discount}% off or more` })),
  ]

  return (
    <div className={className}>
      {showCategoryFilter && visibleCategories.length > 0 && (
        <FilterGroup title="Category" badge={filters.categories.length}>
          {visibleCategories.map((category) => (
            <Checkbox
              key={category.slug}
              label={category.name}
              count={facets.categoryCounts[category.slug] ?? 0}
              checked={filters.categories.includes(category.slug)}
              onChange={() => onToggle('categories', category.slug)}
            />
          ))}
        </FilterGroup>
      )}

      {brandEntries.length > 0 && (
        <FilterGroup title="Brand" badge={filters.brands.length}>
          {brandEntries.map(([brand, count]) => (
            <Checkbox
              key={brand}
              label={brand}
              count={count}
              checked={filters.brands.includes(brand)}
              onChange={() => onToggle('brands', brand)}
            />
          ))}
        </FilterGroup>
      )}

      {facets && facets.priceBounds.max > facets.priceBounds.min && (
        <FilterGroup title="Price range" badge={filters.minPrice != null || filters.maxPrice != null ? 1 : 0}>
          <PriceRangeFilter
            bounds={facets.priceBounds}
            minPrice={filters.minPrice}
            maxPrice={filters.maxPrice}
            onCommit={onChange}
          />
        </FilterGroup>
      )}

      <FilterGroup title="Availability" badge={filters.inStock ? 1 : 0}>
        <Checkbox label="In stock only" checked={filters.inStock} onChange={() => onChange({ inStock: !filters.inStock })} />
      </FilterGroup>

      <FilterGroup title="Rating" badge={filters.minRating != null ? 1 : 0}>
        <RadioList
          name={`${nameBase}-rating`}
          options={ratingOptions}
          value={filters.minRating}
          onChange={(minRating) => onChange({ minRating })}
        />
      </FilterGroup>

      <FilterGroup title="Discount" badge={filters.minDiscount != null ? 1 : 0}>
        <RadioList
          name={`${nameBase}-discount`}
          options={discountOptions}
          value={filters.minDiscount}
          onChange={(minDiscount) => onChange({ minDiscount })}
        />
      </FilterGroup>
    </div>
  )
}
