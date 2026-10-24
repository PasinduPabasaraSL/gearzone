import { useEffect } from 'react'

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

/**
 * Keeps Tab focus inside `containerRef` while active, moves focus in on open
 * and returns it to the previously focused element on close. Required for the
 * cart drawer, mobile menu, filter sheet and search overlay to be usable by
 * keyboard and screen-reader users.
 */
export function useFocusTrap(containerRef, active) {
  useEffect(() => {
    if (!active) return

    const container = containerRef.current
    if (!container) return

    const previouslyFocused = document.activeElement

    const focusables = () => Array.from(container.querySelectorAll(FOCUSABLE))

    // Defer so the panel's entry animation does not fight the scroll-into-view
    // that focusing triggers.
    const raf = requestAnimationFrame(() => {
      const [first] = focusables()
      ;(first ?? container).focus({ preventScroll: true })
    })

    const onKeyDown = (event) => {
      if (event.key !== 'Tab') return
      const items = focusables()
      if (items.length === 0) {
        event.preventDefault()
        return
      }
      const first = items[0]
      const last = items[items.length - 1]
      const current = document.activeElement

      if (event.shiftKey && (current === first || !container.contains(current))) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && current === last) {
        event.preventDefault()
        first.focus()
      }
    }

    container.addEventListener('keydown', onKeyDown)

    return () => {
      cancelAnimationFrame(raf)
      container.removeEventListener('keydown', onKeyDown)
      if (previouslyFocused instanceof HTMLElement) {
        previouslyFocused.focus({ preventScroll: true })
      }
    }
  }, [containerRef, active])
}
