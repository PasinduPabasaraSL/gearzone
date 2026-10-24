import { brands } from '../data/brands'
import { categories, categoryBySlug } from '../data/categories'
import { products } from '../data/products'
import { ratingBreakdown, reviewsForProduct } from '../data/reviews'
import {
  computeFacets,
  EMPTY_FILTERS,
  filterProducts,
  searchProducts,
  sortProducts,
  tokenize,
} from '../utils/filterProducts'

/**
 * Catalogue service. Every function returns a Promise and resolves after a
 * short delay, mirroring network behaviour so loading and error states in the
 * UI are exercised for real. Replacing the mock with an API means swapping
 * the bodies of these functions for `fetch` calls with the same return shapes.
 */

const LATENCY_MS = { min: 180, max: 420 }
const NEW_ARRIVAL_WINDOW_DAYS = 60
const DEAL_MIN_DISCOUNT = 15

function respond(value) {
  const delay = LATENCY_MS.min + Math.random() * (LATENCY_MS.max - LATENCY_MS.min)
  return new Promise((resolve) => setTimeout(() => resolve(structuredClone(value)), delay))
}

const newestDate = products.reduce((latest, p) => (p.createdAt > latest ? p.createdAt : latest), '')
const newCutoff = new Date(Date.parse(newestDate) - NEW_ARRIVAL_WINDOW_DAYS * 86_400_000)
  .toISOString()
  .slice(0, 10)

const COLLECTIONS = {
  featured: (list) => list.filter((p) => p.featured),
  trending: (list) => list.filter((p) => p.trending),
  new: (list) => list.filter((p) => p.createdAt >= newCutoff || p.badge === 'NEW'),
  deals: (list) => list.filter((p) => p.discount >= DEAL_MIN_DISCOUNT && p.stock > 0),
}

const COLLECTION_DEFAULT_SORT = {
  new: 'newest',
  deals: 'discount',
}

/**
 * Query the catalogue.
 * @param {object} query
 * @param {string} [query.search]      free-text search
 * @param {string} [query.category]    category slug scope (category pages)
 * @param {string} [query.collection]  featured | trending | new | deals
 * @param {object} [query.filters]     FilterState from the sidebar
 * @param {string} [query.sort]
 * @param {number} [query.limit]
 * @param {string} [query.exclude]     product id to leave out (related rails)
 */
export function getProducts({
  search = '',
  category,
  collection,
  filters = EMPTY_FILTERS,
  sort,
  limit,
  exclude,
} = {}) {
  let scope = products
  if (category) scope = scope.filter((p) => p.category === category)
  if (collection && COLLECTIONS[collection]) scope = COLLECTIONS[collection](scope)
  if (exclude) scope = scope.filter((p) => p.id !== exclude)

  const searched = searchProducts(scope, search)
  const filtered = filterProducts(searched, filters)

  const effectiveSort = sort ?? COLLECTION_DEFAULT_SORT[collection] ?? (search ? 'relevance' : 'featured')
  const ordered = effectiveSort === 'relevance' ? filtered : sortProducts(filtered, effectiveSort)

  return respond({
    items: typeof limit === 'number' ? ordered.slice(0, limit) : ordered,
    total: ordered.length,
    facets: computeFacets(searched, filters),
  })
}

export function getProductBySlug(slug) {
  const product = products.find((p) => p.slug === slug)
  if (!product) return respond(null)

  const related = sortProducts(
    products.filter((p) => p.category === product.category && p.id !== product.id),
    'featured',
  ).slice(0, 8)

  return respond({
    product,
    related,
    reviews: reviewsForProduct(product),
    ratingBreakdown: ratingBreakdown(product),
  })
}

export function getProductsByIds(ids) {
  const byId = new Map(products.map((p) => [p.id, p]))
  return respond(ids.map((id) => byId.get(id)).filter(Boolean))
}

export function getCategories() {
  return respond(
    categories.map((category) => ({
      ...category,
      productCount: products.filter((p) => p.category === category.slug).length,
    })),
  )
}

export function getCategory(slug) {
  const category = categoryBySlug.get(slug)
  if (!category) return respond(null)
  return respond({
    ...category,
    productCount: products.filter((p) => p.category === slug).length,
  })
}

export function getBrands() {
  return respond(
    brands.map((brand) => ({
      ...brand,
      productCount: products.filter((p) => p.brand === brand.name).length,
    })),
  )
}

/**
 * Suggestions for the search overlay: matching categories, keyword phrases
 * drawn from product tags, and the top product matches.
 */
export function getSearchSuggestions(term) {
  const tokens = tokenize(term)
  if (tokens.length === 0) return respond({ categories: [], keywords: [], products: [], total: 0 })

  const query = tokens.join(' ')
  const stem = (token) => (token.length > 3 && token.endsWith('s') ? token.slice(0, -1) : token)
  const queryStem = tokens.map(stem).join(' ')

  const matchedCategories = categories
    .filter((c) => `${c.name} ${c.tagline}`.toLowerCase().includes(queryStem))
    .slice(0, 3)
    .map((c) => ({ slug: c.slug, name: c.name, tagline: c.tagline }))

  const keywordCounts = new Map()
  for (const product of products) {
    for (const tag of product.tags) {
      if (queryStem.split(' ').every((t) => tag.includes(t))) {
        keywordCounts.set(tag, (keywordCounts.get(tag) ?? 0) + 1)
      }
    }
  }
  const keywords = [...keywordCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([phrase, count]) => ({ phrase, count }))

  const matches = searchProducts(products, query)

  return respond({
    categories: matchedCategories,
    keywords,
    products: matches.slice(0, 5),
    total: matches.length,
  })
}

export const POPULAR_SEARCHES = ['mechanical keyboard', 'usb-c cable', 'desk mat', 'power bank', 'earbuds', 'laptop stand']
