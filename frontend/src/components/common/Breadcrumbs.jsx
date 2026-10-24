import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '../../utils/cn'

/**
 * Trail of ancestor links. The final entry renders as plain text with
 * aria-current so assistive tech announces the current page.
 */
export default function Breadcrumbs({ items, className }) {
  return (
    <nav aria-label="Breadcrumb" className={cn('min-w-0', className)}>
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[13px]">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={`${item.label}-${index}`} className="flex min-w-0 items-center gap-1.5">
              {isLast || !item.to ? (
                <span
                  aria-current={isLast ? 'page' : undefined}
                  className="truncate font-medium text-ink"
                >
                  {item.label}
                </span>
              ) : (
                <>
                  <Link
                    to={item.to}
                    className="rounded-sm text-muted transition-colors hover:text-link"
                  >
                    {item.label}
                  </Link>
                  <ChevronRight className="h-3.5 w-3.5 shrink-0 text-faint" aria-hidden="true" />
                </>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
