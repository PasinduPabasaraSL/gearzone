import { useId, useRef, useState } from 'react'
import { cn } from '../../utils/cn'

/**
 * WAI-ARIA tab pattern with roving tabindex and arrow-key navigation. Used on
 * the product page for description, specifications, shipping and reviews.
 */
export default function Tabs({ tabs, initialId, activeId: controlledId, onChange, className }) {
  const [internalId, setInternalId] = useState(initialId ?? tabs[0]?.id)
  const activeId = controlledId ?? internalId
  const setActiveId = (id) => {
    setInternalId(id)
    onChange?.(id)
  }
  const baseId = useId()
  const listRef = useRef(null)

  const activeIndex = tabs.findIndex((tab) => tab.id === activeId)
  const active = tabs[activeIndex] ?? tabs[0]

  const focusTab = (index) => {
    const next = (index + tabs.length) % tabs.length
    setActiveId(tabs[next].id)
    listRef.current?.querySelectorAll('[role="tab"]')[next]?.focus()
  }

  const onKeyDown = (event) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      focusTab(activeIndex + 1)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      focusTab(activeIndex - 1)
    } else if (event.key === 'Home') {
      event.preventDefault()
      focusTab(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      focusTab(tabs.length - 1)
    }
  }

  return (
    <div className={className}>
      <div
        ref={listRef}
        role="tablist"
        aria-label="Product information"
        onKeyDown={onKeyDown}
        className="scroll-rail -mx-4 gap-1 border-b border-line px-4 sm:mx-0 sm:px-0"
      >
        {tabs.map((tab) => {
          const selected = tab.id === active?.id
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`${baseId}-tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveId(tab.id)}
              className={cn(
                'relative -mb-px shrink-0 border-b-2 px-4 py-3.5 text-sm font-semibold transition-colors',
                selected
                  ? 'border-accent text-ink'
                  : 'border-transparent text-muted hover:border-line-strong hover:text-ink',
              )}
            >
              {tab.label}
              {typeof tab.count === 'number' && (
                <span className="tabular ml-1.5 text-xs text-faint">{tab.count}</span>
              )}
            </button>
          )
        })}
      </div>

      {active && (
        <div
          role="tabpanel"
          id={`${baseId}-panel-${active.id}`}
          aria-labelledby={`${baseId}-tab-${active.id}`}
          tabIndex={0}
          className="pt-7 outline-none"
        >
          {active.content}
        </div>
      )}
    </div>
  )
}
