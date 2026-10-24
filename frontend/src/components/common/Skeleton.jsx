import { cn } from '../../utils/cn'

/**
 * Placeholder block used by every loading state. Pulses via the shared
 * `animate-shimmer` keyframes, which the reduced-motion rule flattens.
 */
export default function Skeleton({ className, rounded = 'rounded-md', ...rest }) {
  return (
    <div
      aria-hidden="true"
      className={cn('animate-shimmer bg-line/70 dark:bg-elevated', rounded, className)}
      {...rest}
    />
  )
}
