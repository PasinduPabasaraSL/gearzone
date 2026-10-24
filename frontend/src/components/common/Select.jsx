import { useId } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../utils/cn'

/**
 * Native <select> with GearZoneLK styling. Deliberately native rather than a
 * custom listbox: it gets correct keyboard and touch behaviour for free, and
 * mobile users get the platform picker.
 */
export default function Select({
  label,
  hideLabel = false,
  options,
  value,
  onChange,
  id,
  className,
  wrapperClassName,
  ...rest
}) {
  const generatedId = useId()
  const fieldId = id ?? generatedId

  return (
    <div className={cn('flex flex-col gap-1.5', wrapperClassName)}>
      <label
        htmlFor={fieldId}
        className={cn('text-[13px] font-semibold text-ink', hideLabel && 'sr-only')}
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={fieldId}
          value={value}
          onChange={onChange}
          className={cn(
            'h-11 w-full cursor-pointer appearance-none rounded-control border bg-surface pr-10 pl-3.5',
            'text-[15px] font-medium text-ink transition-colors hover:border-line-strong focus:border-accent focus:ring-4 focus:ring-accent/12',
            className,
          )}
          {...rest}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute top-1/2 right-3.5 h-4 w-4 -translate-y-1/2 text-muted"
          aria-hidden="true"
        />
      </div>
    </div>
  )
}
