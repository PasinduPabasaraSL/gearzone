import { CircleAlert, CircleCheck, Heart, Info, X } from 'lucide-react'
import { cn } from '../../utils/cn'

const TONES = {
  success: { icon: CircleCheck, className: 'text-success' },
  info: { icon: Info, className: 'text-link' },
  error: { icon: CircleAlert, className: 'text-danger' },
  wishlist: { icon: Heart, className: 'text-danger fill-danger' },
}

/**
 * Renders the toast stack. The live region is always mounted so screen
 * readers announce toasts that appear later.
 */
export default function ToastViewport({ toasts, onDismiss }) {
  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed inset-x-0 top-0 z-110 flex flex-col items-center gap-2 p-3 sm:top-auto sm:bottom-0 sm:left-auto sm:items-end sm:p-6"
    >
      {toasts.map((toast) => {
        const tone = TONES[toast.tone] ?? TONES.info
        const Icon = tone.icon
        return (
          <div
            key={toast.id}
            role="status"
            className={cn(
              'pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-card border bg-elevated p-3.5 pr-2.5 shadow-lift',
              toast.leaving ? 'animate-toast-out' : 'animate-toast-in',
            )}
          >
            <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', tone.className)} aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-ink">{toast.title}</p>
              {toast.description && (
                <p className="mt-0.5 truncate text-[13px] text-muted">{toast.description}</p>
              )}
            </div>
            {toast.action && (
              <button
                type="button"
                onClick={() => {
                  toast.action.onClick()
                  onDismiss(toast.id)
                }}
                className="shrink-0 rounded-control px-2.5 py-1.5 text-[13px] font-semibold text-link transition-colors hover:bg-accent-soft"
              >
                {toast.action.label}
              </button>
            )}
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              aria-label="Dismiss notification"
              className="grid h-7 w-7 shrink-0 place-items-center rounded-control text-faint transition-colors hover:bg-subtle hover:text-ink"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
