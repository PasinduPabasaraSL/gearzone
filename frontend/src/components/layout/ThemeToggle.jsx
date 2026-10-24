import { Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from '../../hooks/useContexts'
import { cn } from '../../utils/cn'

/** Header icon button: flips between light and dark. */
export function ThemeToggle({ className }) {
  const { resolvedTheme, toggleTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Light theme' : 'Dark theme'}
      className={cn(
        'relative grid h-10 w-10 place-items-center overflow-hidden rounded-control text-muted transition-colors hover:bg-subtle hover:text-ink',
        className,
      )}
    >
      <Sun
        aria-hidden="true"
        className={cn(
          'absolute h-[19px] w-[19px] transition-all duration-300',
          isDark ? 'rotate-0 opacity-100' : '-rotate-90 scale-50 opacity-0',
        )}
      />
      <Moon
        aria-hidden="true"
        className={cn(
          'absolute h-[19px] w-[19px] transition-all duration-300',
          isDark ? 'rotate-90 scale-50 opacity-0' : 'rotate-0 opacity-100',
        )}
      />
    </button>
  )
}

const OPTIONS = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
]

/** Three-way selector including "System", used in the mobile menu. */
export function ThemeSelector({ className }) {
  const { preference, setPreference } = useTheme()

  return (
    <div role="radiogroup" aria-label="Theme" className={cn('grid grid-cols-3 gap-1 rounded-control border bg-subtle p-1', className)}>
      {OPTIONS.map(({ value, label, icon: Icon }) => {
        const selected = preference === value
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => setPreference(value)}
            className={cn(
              'flex h-9 items-center justify-center gap-1.5 rounded-md text-[13px] font-semibold transition-colors',
              selected ? 'bg-surface text-ink shadow-xs' : 'text-muted hover:text-ink',
            )}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {label}
          </button>
        )
      })}
    </div>
  )
}
