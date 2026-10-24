import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { ArrowLeft, Search, X } from 'lucide-react'
import SearchSuggestions from './SearchSuggestions'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll'
import { useSearchCombobox } from '../../hooks/useSearchCombobox'

/**
 * Full-screen search for small screens: the input sits at the top where the
 * thumb and keyboard expect it, with suggestions filling the rest.
 */
export default function SearchDialog({ open, onClose }) {
  const panelRef = useRef(null)
  const inputRef = useRef(null)
  const combobox = useSearchCombobox({ onDone: onClose })

  useLockBodyScroll(open)
  useFocusTrap(panelRef, open)

  useEffect(() => {
    if (!open) return
    const frame = requestAnimationFrame(() => inputRef.current?.focus())
    return () => cancelAnimationFrame(frame)
  }, [open])

  if (!open) return null

  return createPortal(
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Search products"
      className="animate-fade-in fixed inset-0 z-100 flex flex-col bg-canvas"
    >
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault()
          combobox.submit()
        }}
        className="flex h-16 shrink-0 items-center gap-2 border-b px-3"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close search"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-control text-muted hover:bg-subtle hover:text-ink"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <label htmlFor="mobile-search" className="sr-only">
          Search products
        </label>
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4.5 w-4.5 -translate-y-1/2 text-faint" aria-hidden="true" />
          <input
            ref={inputRef}
            id="mobile-search"
            type="search"
            value={combobox.query}
            onChange={(event) => combobox.setQuery(event.target.value)}
            onKeyDown={combobox.onKeyDown}
            placeholder="Search gadgets & accessories"
            {...combobox.inputProps}
            className="h-11 w-full rounded-control border bg-subtle pr-10 pl-10 text-base text-ink focus:border-accent focus:bg-surface focus:ring-4 focus:ring-accent/12 [&::-webkit-search-cancel-button]:hidden"
          />
          {combobox.query && (
            <button
              type="button"
              onClick={() => {
                combobox.setQuery('')
                inputRef.current?.focus()
              }}
              aria-label="Clear search"
              className="absolute top-1/2 right-1.5 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-md text-faint hover:text-ink"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>
      <div className="flex-1 overflow-y-auto overscroll-contain px-2 py-4">
        <SearchSuggestions combobox={combobox} />
      </div>
    </div>,
    document.body,
  )
}
