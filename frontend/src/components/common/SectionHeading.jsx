import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '../../utils/cn'

/**
 * Shared section header: uppercase eyebrow, editorial title, optional
 * supporting line and a trailing link. Using this everywhere is what keeps
 * the homepage sections feeling like one designed page.
 */
export default function SectionHeading({
  eyebrow,
  title,
  description,
  actionLabel,
  actionTo,
  align = 'left',
  onAccent = false,
  as: Tag = 'h2',
  id,
  className,
}) {
  const centered = align === 'center'

  return (
    <div
      className={cn(
        'flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between',
        centered && 'sm:flex-col sm:items-center sm:text-center',
        className,
      )}
    >
      <div className={cn('max-w-2xl', centered && 'mx-auto')}>
        {eyebrow && (
          <p className={cn('micro-label mb-3', onAccent ? 'text-brand-200' : 'text-link')}>
            {eyebrow}
          </p>
        )}
        <Tag
          id={id}
          className={cn(
            'text-2xl leading-[1.15] font-bold sm:text-[30px]',
            onAccent ? 'text-white' : 'text-ink',
          )}
        >
          {title}
        </Tag>
        {description && (
          <p
            className={cn(
              'mt-2.5 text-[15px] leading-relaxed',
              onAccent ? 'text-brand-100' : 'text-muted',
            )}
          >
            {description}
          </p>
        )}
      </div>

      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className={cn(
            'group inline-flex shrink-0 items-center gap-1.5 rounded-control text-sm font-semibold transition-colors',
            onAccent ? 'text-white hover:text-brand-100' : 'text-link hover:text-brand-800',
          )}
        >
          {actionLabel}
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  )
}
