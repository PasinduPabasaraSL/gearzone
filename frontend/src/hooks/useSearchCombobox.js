import { useCallback, useId, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAsync } from './useAsync'
import { useDebouncedValue } from './useDebouncedValue'
import { getSearchSuggestions, POPULAR_SEARCHES } from '../services/catalog'

function buildOptions(term, data) {
  if (!term) {
    return POPULAR_SEARCHES.map((phrase) => ({
      id: `popular-${phrase}`,
      type: 'popular',
      label: phrase,
      to: `/search?q=${encodeURIComponent(phrase)}`,
    }))
  }
  if (!data) return []

  return [
    ...data.keywords.map((keyword) => ({
      id: `keyword-${keyword.phrase}`,
      type: 'keyword',
      label: keyword.phrase,
      meta: `${keyword.count} item${keyword.count === 1 ? '' : 's'}`,
      to: `/search?q=${encodeURIComponent(keyword.phrase)}`,
    })),
    ...data.categories.map((category) => ({
      id: `category-${category.slug}`,
      type: 'category',
      label: category.name,
      meta: category.tagline,
      to: `/category/${category.slug}`,
    })),
    ...data.products.map((product) => ({
      id: `product-${product.id}`,
      type: 'product',
      label: product.name,
      product,
      to: `/product/${product.slug}`,
    })),
    ...(data.total > 0
      ? [
          {
            id: 'all-results',
            type: 'all',
            label: `See all ${data.total} result${data.total === 1 ? '' : 's'} for “${term}”`,
            to: `/search?q=${encodeURIComponent(term)}`,
          },
        ]
      : []),
  ]
}

/**
 * State and keyboard behaviour for the search combobox (WAI-ARIA 1.2
 * pattern). Shared by the desktop header dropdown and the mobile overlay so
 * both behave identically.
 */
export function useSearchCombobox({ onDone } = {}) {
  const navigate = useNavigate()
  const listId = useId()
  const [query, setQueryState] = useState('')
  const [activeIndex, setActiveIndex] = useState(-1)

  const term = query.trim()
  const debouncedTerm = useDebouncedValue(term, 140)
  const { data, isLoading } = useAsync(
    () => (debouncedTerm ? getSearchSuggestions(debouncedTerm) : Promise.resolve(null)),
    [debouncedTerm],
  )

  const options = useMemo(() => buildOptions(debouncedTerm, data), [debouncedTerm, data])
  const isPending = Boolean(term) && (term !== debouncedTerm || isLoading)
  const noResults = Boolean(debouncedTerm) && !isPending && data?.total === 0

  const setQuery = useCallback((value) => {
    setQueryState(value)
    setActiveIndex(-1)
  }, [])

  const select = useCallback(
    (option) => {
      navigate(option.to)
      setQuery('')
      onDone?.()
    },
    [navigate, onDone, setQuery],
  )

  const submit = useCallback(() => {
    if (activeIndex >= 0 && options[activeIndex]) {
      select(options[activeIndex])
      return
    }
    if (!term) return
    navigate(`/search?q=${encodeURIComponent(term)}`)
    setQuery('')
    onDone?.()
  }, [activeIndex, options, select, term, navigate, setQuery, onDone])

  const onKeyDown = useCallback(
    (event) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault()
        setActiveIndex((index) => (options.length ? (index + 1) % options.length : -1))
      } else if (event.key === 'ArrowUp') {
        event.preventDefault()
        setActiveIndex((index) => (options.length ? (index <= 0 ? options.length - 1 : index - 1) : -1))
      } else if (event.key === 'Enter') {
        event.preventDefault()
        submit()
      } else if (event.key === 'Escape') {
        if (query) setQuery('')
        else onDone?.()
      }
    },
    [options.length, submit, query, setQuery, onDone],
  )

  const optionId = (index) => `${listId}-option-${index}`

  return {
    query,
    setQuery,
    term: debouncedTerm,
    options,
    activeIndex,
    setActiveIndex,
    isPending,
    noResults,
    select,
    submit,
    onKeyDown,
    listId,
    optionId,
    inputProps: {
      role: 'combobox',
      'aria-expanded': true,
      'aria-controls': listId,
      'aria-autocomplete': 'list',
      'aria-activedescendant': activeIndex >= 0 ? optionId(activeIndex) : undefined,
      autoComplete: 'off',
      spellCheck: false,
      enterKeyHint: 'search',
    },
  }
}
