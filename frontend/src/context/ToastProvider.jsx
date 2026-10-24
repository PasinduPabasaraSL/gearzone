import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ToastContext } from './contexts'
import ToastViewport from '../components/common/ToastViewport'

const DISPLAY_MS = 3600
const EXIT_MS = 200
const MAX_VISIBLE = 3

/**
 * App-wide toast queue. `toast()` returns the id so a caller can dismiss its
 * own notification early (e.g. when the cart drawer opens).
 */
export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef(new Map())

  const remove = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
    clearTimeout(timers.current.get(id))
    timers.current.delete(id)
  }, [])

  const dismiss = useCallback(
    (id) => {
      setToasts((current) => current.map((toast) => (toast.id === id ? { ...toast, leaving: true } : toast)))
      clearTimeout(timers.current.get(id))
      timers.current.set(
        id,
        setTimeout(() => remove(id), EXIT_MS),
      )
    },
    [remove],
  )

  const toast = useCallback(
    ({ title, description, tone = 'success', action, duration = DISPLAY_MS }) => {
      const id = crypto.randomUUID()
      setToasts((current) => [...current, { id, title, description, tone, action, leaving: false }].slice(-MAX_VISIBLE))
      timers.current.set(
        id,
        setTimeout(() => dismiss(id), duration),
      )
      return id
    },
    [dismiss],
  )

  const dismissAll = useCallback(() => {
    timers.current.forEach((timer) => clearTimeout(timer))
    timers.current.clear()
    setToasts((current) => current.map((item) => ({ ...item, leaving: true })))
    // Only toasts marked leaving are removed, so one raised meanwhile survives.
    timers.current.set(
      'dismiss-all',
      setTimeout(() => setToasts((current) => current.filter((item) => !item.leaving)), EXIT_MS),
    )
  }, [])

  useEffect(() => {
    const pending = timers.current
    return () => pending.forEach((timer) => clearTimeout(timer))
  }, [])

  const value = useMemo(() => ({ toast, dismiss, dismissAll }), [toast, dismiss, dismissAll])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}
