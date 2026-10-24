import Button from './Button'
import { cn } from '../../utils/cn'

/**
 * Polished blank slate for empty carts, wishlists and result sets. The icon
 * sits on a dot-grid plate so an empty page still looks like GearZoneLK.
 */
export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionTo,
  onAction,
  secondaryLabel,
  secondaryTo,
  className,
}) {
  return (
    <div className={cn('flex flex-col items-center px-6 py-16 text-center sm:py-20', className)}>
      {Icon && (
        <div className="blueprint-grid mb-6 grid h-20 w-20 place-items-center rounded-panel border border-line">
          <Icon className="h-8 w-8 text-faint" strokeWidth={1.5} />
        </div>
      )}
      <h2 className="text-xl font-bold text-ink sm:text-2xl">{title}</h2>
      {description && <p className="mt-2 max-w-sm text-[15px] text-muted">{description}</p>}
      {(actionLabel || secondaryLabel) && (
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          {actionLabel && (
            <Button to={actionTo} onClick={onAction}>
              {actionLabel}
            </Button>
          )}
          {secondaryLabel && (
            <Button variant="secondary" to={secondaryTo}>
              {secondaryLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
