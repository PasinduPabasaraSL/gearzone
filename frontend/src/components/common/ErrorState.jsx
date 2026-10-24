import { RefreshCw, TriangleAlert } from 'lucide-react'
import Button from './Button'
import { cn } from '../../utils/cn'

/**
 * Shown when a catalog service call rejects. `onRetry` comes from useAsync so
 * the retry genuinely re-runs the request rather than reloading the page.
 */
export default function ErrorState({
  title = 'Something went wrong.',
  description = 'We could not load this content. Please try again.',
  onRetry,
  className,
}) {
  return (
    <div
      role="alert"
      className={cn('flex flex-col items-center px-6 py-16 text-center sm:py-20', className)}
    >
      <div className="mb-6 grid h-16 w-16 place-items-center rounded-panel border border-danger/30 bg-danger-soft">
        <TriangleAlert className="h-7 w-7 text-danger" strokeWidth={1.75} />
      </div>
      <h2 className="text-xl font-bold text-ink">{title}</h2>
      <p className="mt-2 max-w-sm text-[15px] text-muted">{description}</p>
      {onRetry && (
        <Button variant="secondary" className="mt-7" onClick={onRetry}>
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      )}
    </div>
  )
}
