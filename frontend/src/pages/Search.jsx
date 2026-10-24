import { useMemo, useState } from 'react'
import { Search as SearchIcon, TrendingUp } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import CatalogView from '../components/catalog/CatalogView'
import PageHeader from '../components/catalog/PageHeader'
import Button from '../components/common/Button'
import Container from '../components/common/Container'
import { usePageMeta } from '../hooks/usePageMeta'
import { POPULAR_SEARCHES } from '../services/catalog'

export default function Search() {
  const [params, setParams] = useSearchParams()
  const query = (params.get('q') ?? '').trim()
  const [draft, setDraft] = useState(query)
  const [lastQuery, setLastQuery] = useState(query)
  const scope = useMemo(() => ({ search: query }), [query])

  if (query !== lastQuery) {
    setLastQuery(query)
    setDraft(query)
  }

  usePageMeta({ title: query ? `Search: ${query}` : 'Search', description: 'Search the GearZoneLK catalogue.' })

  const submit = (event) => {
    event.preventDefault()
    const next = draft.trim()
    setParams(next ? { q: next } : {})
  }

  return (
    <Container className="pb-20">
      <PageHeader
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Search' }]}
        title={query ? <>Results for “{query}”</> : 'Search the store'}
        description={query ? undefined : 'Find keyboards, cables, chargers, audio and more.'}
      />

      <form role="search" onSubmit={submit} className="mb-8 flex max-w-2xl gap-2.5">
        <label htmlFor="page-search" className="sr-only">
          Search products
        </label>
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-4 h-[18px] w-[18px] -translate-y-1/2 text-faint" aria-hidden="true" />
          <input
            id="page-search"
            type="search"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Search gadgets, accessories & more..."
            className="h-12 w-full rounded-control border bg-surface pr-4 pl-11 text-[15px] text-ink focus:border-accent focus:ring-4 focus:ring-accent/12"
          />
        </div>
        <Button type="submit" size="lg" className="h-12">
          Search
        </Button>
      </form>

      {query ? (
        <CatalogView scope={scope} defaultSort="relevance" emptyTitle="No gear found" emptyDescription="Try a different search term, like “cable”, “mouse” or “stand”." />
      ) : (
        <section aria-labelledby="popular-title" className="rounded-panel border bg-subtle/60 p-6 sm:p-8">
          <h2 id="popular-title" className="micro-label flex items-center gap-2 text-faint">
            <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
            Popular searches
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {POPULAR_SEARCHES.map((term) => (
              <li key={term}>
                <Link
                  to={`/search?q=${encodeURIComponent(term)}`}
                  className="inline-flex h-10 items-center rounded-full border bg-surface px-4 text-sm font-semibold text-ink capitalize transition-colors hover:border-accent hover:text-link"
                >
                  {term}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </Container>
  )
}
