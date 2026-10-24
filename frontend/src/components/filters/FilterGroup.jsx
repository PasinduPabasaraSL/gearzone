import { useId, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../utils/cn'

/** Collapsible section of the filter sidebar. */
export default function FilterGroup({ title, defaultOpen = true, badge, children }) {
  const [open, setOpen] = useState(defaultOpen)
  const panelId = useId()

  return (
    <div className="border-b py-4 last:border-b-0">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
          className="flex w-full items-center justify-between gap-2 py-1 text-left text-sm font-bold text-ink"
        >
          <span className="flex items-center gap-2">
            {title}
            {badge > 0 && (
              <span className="tabular grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1.5 text-[10px] font-bold text-white">
                {badge}
              </span>
            )}
          </span>
          <ChevronDown className={cn('h-4 w-4 text-muted transition-transform duration-200', open && 'rotate-180')} aria-hidden="true" />
        </button>
      </h3>
      <div id={panelId} hidden={!open} className="pt-2.5">
        {children}
      </div>
    </div>
  )
}
