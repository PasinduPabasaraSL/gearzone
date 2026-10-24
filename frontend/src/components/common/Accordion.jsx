import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../utils/cn'

/**
 * Disclosure list built on real <button> triggers with aria-expanded, used for
 * FAQs and for stacking long product content on small screens.
 */
export default function Accordion({ items, defaultOpenId, className }) {
  const [openId, setOpenId] = useState(defaultOpenId ?? null)

  return (
    <div className={cn('divide-y divide-line border-y border-line', className)}>
      {items.map((item) => {
        const expanded = openId === item.id
        return (
          <div key={item.id}>
            <h3>
              <button
                type="button"
                aria-expanded={expanded}
                onClick={() => setOpenId(expanded ? null : item.id)}
                className="flex w-full items-center justify-between gap-4 py-4 text-left text-[15px] font-semibold text-ink transition-colors hover:text-link"
              >
                {item.question ?? item.label}
                <ChevronDown
                  className={cn(
                    'h-4.5 w-4.5 shrink-0 text-muted transition-transform duration-200',
                    expanded && 'rotate-180',
                  )}
                />
              </button>
            </h3>
            {expanded && (
              <div className="animate-fade-in pb-5 text-[15px] leading-relaxed text-muted">
                {item.answer ?? item.content}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
