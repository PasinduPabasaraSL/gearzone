import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll'
import { cn } from '../../utils/cn'

const EXIT_MS = 220

const SIDES = {
  right: {
    position: 'inset-y-0 right-0 h-full w-full max-w-[26rem]',
    enter: 'animate-in-right',
    exit: 'animate-out-right',
    radius: 'sm:rounded-l-panel',
  },
  left: {
    position: 'inset-y-0 left-0 h-full w-full max-w-[20rem]',
    enter: 'animate-in-left',
    exit: 'animate-out-left',
    radius: 'sm:rounded-r-panel',
  },
  bottom: {
    position: 'inset-x-0 bottom-0 max-h-[88svh]',
    enter: 'animate-in-bottom',
    exit: 'animate-out-bottom',
    radius: 'rounded-t-panel',
  },
}

/**
 * Accessible sliding panel behind the cart, mobile menu and filter sheet.
 * Stays mounted briefly after `open` flips to false so the exit animation can
 * play, then unmounts.
 */
export default function Drawer({ open, onClose, title, side = 'right', footer, children }) {
  // 'closing' keeps the panel mounted for one exit animation. Derived during
  // render from the `open` prop rather than in an effect, so no extra pass.
  const [phase, setPhase] = useState(open ? 'open' : 'closed')
  const [lastOpen, setLastOpen] = useState(open)
  const panelRef = useRef(null)
  const titleId = useId()

  if (open !== lastOpen) {
    setLastOpen(open)
    setPhase(open ? 'open' : 'closing')
  }

  const mounted = phase !== 'closed'
  const closing = phase === 'closing'

  useEffect(() => {
    if (phase !== 'closing') return
    const timer = setTimeout(() => setPhase('closed'), EXIT_MS)
    return () => clearTimeout(timer)
  }, [phase])

  useEffect(() => {
    if (!mounted) return
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [mounted, onClose])

  useLockBodyScroll(mounted)
  useFocusTrap(panelRef, mounted && !closing)

  if (!mounted) return null

  const config = SIDES[side]

  return createPortal(
    <div className="fixed inset-0 z-100 flex">
      <button
        type="button"
        aria-label="Close panel"
        onClick={onClose}
        className={cn(
          'absolute inset-0 cursor-default bg-black/50 backdrop-blur-[2px]',
          closing ? 'animate-fade-out' : 'animate-fade-in',
        )}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cn(
          'absolute flex flex-col bg-canvas shadow-panel outline-none',
          config.position,
          config.radius,
          closing ? config.exit : config.enter,
        )}
      >
        <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-line px-5">
          <h2 id={titleId} className="text-base font-bold text-ink">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={`Close ${title}`}
            className="grid h-9 w-9 place-items-center rounded-control text-muted transition-colors hover:bg-subtle hover:text-ink"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>

        {footer && (
          <div className="shrink-0 border-t border-line bg-surface px-5 py-4">{footer}</div>
        )}
      </div>
    </div>,
    document.body,
  )
}
