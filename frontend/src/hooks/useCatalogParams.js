import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { EMPTY_FILTERS, filtersToParams, paramsToFilters } from '../utils/filterProducts'

/**
 * Filter and sort state stored in the URL, so filtered views survive reloads,
 * work with the back button and can be shared as links.
 */
export function useCatalogParams({ defaultSort = 'featured' } = {}) {
  const [params, setParams] = useSearchParams()
  const { filters, sort } = useMemo(() => paramsToFilters(params, defaultSort), [params, defaultSort])

  const commit = useCallback(
    (nextFilters, nextSort) => {
      setParams((current) => filtersToParams(nextFilters, nextSort, current, defaultSort), {
        replace: true,
        preventScrollReset: true,
      })
    },
    [setParams, defaultSort],
  )

  const setFilters = useCallback((patch) => commit({ ...filters, ...patch }, sort), [commit, filters, sort])
  const setSort = useCallback((nextSort) => commit(filters, nextSort), [commit, filters])

  const toggleListValue = useCallback(
    (key, value) => {
      const list = filters[key]
      setFilters({ [key]: list.includes(value) ? list.filter((item) => item !== value) : [...list, value] })
    },
    [filters, setFilters],
  )

  const clearFilters = useCallback(() => commit(EMPTY_FILTERS, sort), [commit, sort])

  return { filters, sort, setFilters, setSort, toggleListValue, clearFilters, search: params.get('q') ?? '' }
}
