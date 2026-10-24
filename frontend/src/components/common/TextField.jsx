import { useId } from 'react'
import { cn } from '../../utils/cn'

/**
 * Labelled text input. The label is always rendered for assistive tech and
 * can be visually hidden where the surrounding design makes it redundant.
 */
export default function TextField({
  label,
  hideLabel = false,
  hint,
  error,
  icon: Icon,
  as = 'input',
  className,
  wrapperClassName,
  id,
  ...rest
}) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const hintId = `${fieldId}-hint`
  const errorId = `${fieldId}-error`
  const Field = as === 'textarea' ? 'textarea' : 'input'

  return (
    <div className={cn('flex flex-col gap-1.5', wrapperClassName)}>
      <label
        htmlFor={fieldId}
        className={cn(
          'text-[13px] font-semibold text-ink',
          hideLabel && 'sr-only',
        )}
      >
        {label}
      </label>

      <div className="relative">
        {Icon && (
          <Icon
            className="pointer-events-none absolute top-1/2 left-3.5 h-4.5 w-4.5 -translate-y-1/2 text-faint"
            aria-hidden="true"
          />
        )}
        <Field
          id={fieldId}
          aria-invalid={error ? true : undefined}
          aria-describedby={cn(hint && hintId, error && errorId) || undefined}
          className={cn(
            'w-full rounded-control border bg-surface text-[15px] text-ink transition-colors',
            'placeholder:text-faint hover:border-line-strong focus:border-accent focus:ring-4 focus:ring-accent/12',
            Field === 'textarea' ? 'min-h-28 resize-y px-3.5 py-3' : 'h-11 px-3.5',
            Icon && 'pl-11',
            error && 'border-danger hover:border-danger focus:border-danger',
            className,
          )}
          {...rest}
        />
      </div>

      {hint && !error && (
        <p id={hintId} className="text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-xs font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  )
}
