import { X } from 'lucide-react'
import { formatAmount } from '../../utils/formatCurrency'

/**
 * Removable chips summarising the active filters, so users can see and undo
 * what is narrowing their results without reopening the sidebar.
 */
export default function ActiveFilters({ filters, categoryNames = {}, onChange, onToggle, onClear }) {
  const chips = [
    ...filters.categories.map((slug) => ({
      key: `c-${slug}`,
      label: categoryNames[slug] ?? slug,
      remove: () => onToggle('categories', slug),
    })),
    ...filters.brands.map((brand) => ({ key: `b-${brand}`, label: brand, remove: () => onToggle('brands', brand) })),
  ]

  if (filters.minPrice != null || filters.maxPrice != null) {
    const low = filters.minPrice != null ? formatAmount(filters.minPrice) : 'Any'
    const high = filters.maxPrice != null ? formatAmount(filters.maxPrice) : 'Any'
    chips.push({ key: 'price', label: `LKR ${low} – ${high}`, remove: () => onChange({ minPrice: null, maxPrice: null }) })
  }
  if (filters.inStock) chips.push({ key: 'stock', label: 'In stock', remove: () => onChange({ inStock: false }) })
  if (filters.minRating != null) {
    chips.push({ key: 'rating', label: `${filters.minRating}★ & up`, remove: () => onChange({ minRating: null }) })
  }
  if (filters.minDiscount != null) {
    chips.push({ key: 'discount', label: `${filters.minDiscount}%+ off`, remove: () => onChange({ minDiscount: null }) })
  }

  if (chips.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={chip.remove}
          aria-label={`Remove filter: ${chip.label}`}
          className="animate-scale-in inline-flex h-8 items-center gap-1.5 rounded-full border border-accent/30 bg-accent-soft pr-2 pl-3 text-[13px] font-semibold text-link transition-colors hover:border-accent"
        >
          {chip.label}
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      ))}
      <button type="button" onClick={onClear} className="h-8 px-2 text-[13px] font-semibold text-muted underline-offset-4 hover:text-ink hover:underline">
        Clear all
      </button>
    </div>
  )
}
