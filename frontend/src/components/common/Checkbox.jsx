import { Check } from 'lucide-react'
import { cn } from '../../utils/cn'

/**
 * Filter checkbox. The native input stays in the DOM (visually hidden but
 * focusable) and drives a styled box via peer classes, so keyboard focus and
 * checked state remain fully native.
 */
export default function Checkbox({ label, count, checked, onChange, className, ...rest }) {
  return (
    <label
      className={cn(
        'group flex cursor-pointer items-center gap-3 py-1.5 text-sm select-none',
        className,
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
        {...rest}
      />
      <span
        aria-hidden="true"
        className={cn(
          'grid h-[18px] w-[18px] shrink-0 place-items-center rounded-[5px] border border-line-strong bg-surface transition-all',
          'group-hover:border-accent',
          'peer-checked:border-accent peer-checked:bg-accent',
          'peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-500',
        )}
      >
        <Check
          className={cn(
            'h-3 w-3 text-white transition-transform',
            checked ? 'scale-100' : 'scale-0',
          )}
          strokeWidth={3.5}
        />
      </span>
      <span
        className={cn(
          'flex-1 transition-colors',
          checked ? 'font-semibold text-ink' : 'text-muted group-hover:text-ink',
        )}
      >
        {label}
      </span>
      {typeof count === 'number' && <span className="tabular text-xs text-faint">{count}</span>}
    </label>
  )
}
