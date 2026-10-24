import { useCallback, useEffect, useRef, useState } from 'react'
import { Search, X } from 'lucide-react'
import SearchSuggestions from './SearchSuggestions'
import { useSearchCombobox } from '../../hooks/useSearchCombobox'
import { cn } from '../../utils/cn'

/**
 * Desktop header search: a prominent input with a suggestions dropdown.
 * Press "/" anywhere to focus it.
 */
export default function SearchBar({ className }) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)
  const inputRef = useRef(null)

  const close = useCallback(() => {
    setOpen(false)
    inputRef.current?.blur()
  }, [])

  const combobox = useSearchCombobox({ onDone: close })

  useEffect(() => {
    const onKeyDown = (event) => {
      const target = event.target
      const typing = target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))
      if (event.key === '/' && !typing && !event.metaKey && !event.ctrlKey) {
        event.preventDefault()
        inputRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <div
      ref={containerRef}
      className={cn('relative', className)}
      onBlur={(event) => {
        if (!containerRef.current?.contains(event.relatedTarget)) setOpen(false)
      }}
    >
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault()
          combobox.submit()
        }}
      >
        <label htmlFor="header-search" className="sr-only">
          Search products
        </label>
        <div className="group relative">
          <Search
            className="pointer-events-none absolute top-1/2 left-4 h-[18px] w-[18px] -translate-y-1/2 text-faint transition-colors group-focus-within:text-link"
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            id="header-search"
            type="search"
            value={combobox.query}
            onChange={(event) => {
              combobox.setQuery(event.target.value)
              setOpen(true)
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={combobox.onKeyDown}
            placeholder="Search gadgets, accessories & more..."
            {...combobox.inputProps}
            aria-expanded={open}
            className="h-11 w-full rounded-control border border-line bg-subtle pr-20 pl-11 text-[15px] text-ink transition-[border-color,background-color,box-shadow] hover:border-line-strong focus:border-accent focus:bg-surface focus:ring-4 focus:ring-accent/12 [&::-webkit-search-cancel-button]:hidden"
          />
          <div className="absolute top-1/2 right-2 flex -translate-y-1/2 items-center gap-1">
            {combobox.query ? (
              <button
                type="button"
                onClick={() => {
                  combobox.setQuery('')
                  inputRef.current?.focus()
                }}
                aria-label="Clear search"
                className="grid h-7 w-7 place-items-center rounded-md text-faint transition-colors hover:bg-line/60 hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            ) : (
              <kbd className="hidden h-6 items-center rounded-md border bg-surface px-2 font-sans text-[11px] font-semibold text-faint lg:flex">
                /
              </kbd>
            )}
          </div>
        </div>
      </form>

      {open && (
        <div className="animate-slide-down absolute inset-x-0 top-full z-50 mt-2 max-h-[min(70vh,560px)] overflow-y-auto rounded-panel border bg-elevated p-2 shadow-panel">
          <SearchSuggestions combobox={combobox} />
        </div>
      )}
    </div>
  )
}
