/**
 * Pure catalogue query logic: filtering, sorting, faceting and search
 * scoring. Nothing here touches React or the data modules, so the same
 * functions can move behind an API endpoint unchanged.
 */

export const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'discount', label: 'Biggest Discount' },
]

export const RATING_OPTIONS = [4.5, 4, 3]
export const DISCOUNT_OPTIONS = [10, 15, 20]

export const EMPTY_FILTERS = Object.freeze({
  categories: [],
  brands: [],
  minPrice: null,
  maxPrice: null,
  inStock: false,
  minRating: null,
  minDiscount: null,
})

function normalise(text) {
  return String(text ?? '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\p{Letter}\p{Number}%.\s-]/gu, ' ')
    .trim()
}

export function tokenize(query) {
  return normalise(query)
    .split(/\s+/)
    .filter((token) => token.length > 0)
}

/**
 * Scores how well a product matches a query. Every token must match
 * somewhere; name and brand hits outrank description hits.
 */
export function scoreProduct(product, tokens) {
  if (tokens.length === 0) return 1

  const fields = {
    name: normalise(product.name),
    brand: normalise(product.brand),
    category: normalise(product.categoryName),
    tags: normalise(product.tags.join(' ')),
    description: normalise(product.description),
  }

  let score = 0
  for (const token of tokens) {
    // Allow simple plurals: "keyboards" should find "keyboard".
    const stem = token.length > 3 && token.endsWith('s') ? token.slice(0, -1) : token
    let tokenScore = 0
    if (fields.name.includes(stem)) tokenScore = Math.max(tokenScore, fields.name.startsWith(stem) ? 12 : 9)
    if (fields.brand.includes(stem)) tokenScore = Math.max(tokenScore, 8)
    if (fields.tags.includes(stem)) tokenScore = Math.max(tokenScore, 6)
    if (fields.category.includes(stem)) tokenScore = Math.max(tokenScore, 5)
    if (fields.description.includes(stem)) tokenScore = Math.max(tokenScore, 2)
    if (tokenScore === 0) return 0
    score += tokenScore
  }
  return score
}

export function searchProducts(products, query) {
  const tokens = tokenize(query)
  if (tokens.length === 0) return products

  return products
    .map((product) => ({ product, score: scoreProduct(product, tokens) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || b.product.rating - a.product.rating)
    .map((entry) => entry.product)
}

function matchesFilters(product, filters, skip) {
  if (skip !== 'categories' && filters.categories.length > 0 && !filters.categories.includes(product.category)) {
    return false
  }
  if (skip !== 'brands' && filters.brands.length > 0 && !filters.brands.includes(product.brand)) {
    return false
  }
  if (filters.minPrice != null && product.price < filters.minPrice) return false
  if (filters.maxPrice != null && product.price > filters.maxPrice) return false
  if (filters.inStock && product.stock === 0) return false
  if (filters.minRating != null && product.rating < filters.minRating) return false
  if (filters.minDiscount != null && product.discount < filters.minDiscount) return false
  return true
}

export function filterProducts(products, filters = EMPTY_FILTERS) {
  return products.filter((product) => matchesFilters(product, filters))
}

function featuredScore(product) {
  return (product.featured ? 1000 : 0) + (product.trending ? 400 : 0) + product.rating * 40 + product.reviewCount
}

export function sortProducts(products, sort = 'featured') {
  const sorted = [...products]
  const inStockFirst = (a, b) => Number(b.stock > 0) - Number(a.stock > 0)

  switch (sort) {
    case 'newest':
      return sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price)
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
    case 'discount':
      return sorted.sort((a, b) => b.discount - a.discount || a.price - b.price)
    case 'featured':
    default:
      return sorted.sort((a, b) => inStockFirst(a, b) || featuredScore(b) - featuredScore(a))
  }
}

/**
 * Counts per category and brand for the filter sidebar. Each facet ignores
 * its own selection so options stay visible while being toggled.
 */
export function computeFacets(products, filters = EMPTY_FILTERS) {
  const categoryCounts = {}
  const brandCounts = {}

  for (const product of products) {
    if (matchesFilters(product, filters, 'categories')) {
      categoryCounts[product.category] = (categoryCounts[product.category] ?? 0) + 1
    }
    if (matchesFilters(product, filters, 'brands')) {
      brandCounts[product.brand] = (brandCounts[product.brand] ?? 0) + 1
    }
  }

  const prices = products.map((product) => product.price)
  return {
    categoryCounts,
    brandCounts,
    priceBounds: {
      min: prices.length ? Math.min(...prices) : 0,
      max: prices.length ? Math.max(...prices) : 0,
    },
  }
}

export function countActiveFilters(filters) {
  return (
    filters.categories.length +
    filters.brands.length +
    (filters.minPrice != null || filters.maxPrice != null ? 1 : 0) +
    (filters.inStock ? 1 : 0) +
    (filters.minRating != null ? 1 : 0) +
    (filters.minDiscount != null ? 1 : 0)
  )
}

const VALID_SORTS = new Set(['relevance', ...SORT_OPTIONS.map((option) => option.value)])

/** Serialises filters + sort to URL params so filtered views are shareable. */
export function filtersToParams(filters, sort, base = new URLSearchParams(), defaultSort = 'featured') {
  const params = new URLSearchParams(base)
  const setList = (key, list) => (list.length ? params.set(key, list.join(',')) : params.delete(key))
  const setValue = (key, value) => (value != null && value !== false ? params.set(key, String(value)) : params.delete(key))

  setList('category', filters.categories)
  setList('brand', filters.brands)
  setValue('min', filters.minPrice)
  setValue('max', filters.maxPrice)
  setValue('stock', filters.inStock ? 1 : null)
  setValue('rating', filters.minRating)
  setValue('discount', filters.minDiscount)
  setValue('sort', sort && sort !== defaultSort ? sort : null)
  return params
}

export function paramsToFilters(params, defaultSort = 'featured') {
  const list = (key) => (params.get(key) ? params.get(key).split(',').filter(Boolean) : [])
  const number = (key) => {
    const value = Number(params.get(key))
    return params.has(key) && Number.isFinite(value) ? value : null
  }
  const sort = params.get('sort')

  return {
    filters: {
      categories: list('category'),
      brands: list('brand'),
      minPrice: number('min'),
      maxPrice: number('max'),
      inStock: params.get('stock') === '1',
      minRating: number('rating'),
      minDiscount: number('discount'),
    },
    sort: VALID_SORTS.has(sort) ? sort : defaultSort,
  }
}
