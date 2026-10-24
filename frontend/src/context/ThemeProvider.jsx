import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import { ThemeContext } from './contexts'
import { readStorage, STORAGE_KEYS, writeStorage } from '../utils/storage'

const DARK_QUERY = '(prefers-color-scheme: dark)'
const PREFERENCES = ['light', 'dark', 'system']
const TRANSITION_MS = 320

function subscribeToSystem(onChange) {
  const media = window.matchMedia(DARK_QUERY)
  media.addEventListener('change', onChange)
  return () => media.removeEventListener('change', onChange)
}

const getSystemTheme = () => (window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light')

/**
 * Light / dark / system theme. The initial class is applied by the inline
 * script in index.html before React loads, so this provider only takes over
 * for changes and never causes a flash on first paint.
 */
export default function ThemeProvider({ children }) {
  const [preference, setPreferenceState] = useState(() => {
    const stored = readStorage(STORAGE_KEYS.theme, 'system')
    return PREFERENCES.includes(stored) ? stored : 'system'
  })
  const systemTheme = useSyncExternalStore(subscribeToSystem, getSystemTheme, () => 'light')
  const resolvedTheme = preference === 'system' ? systemTheme : preference
  const isFirstApply = useRef(true)

  useEffect(() => {
    const root = document.documentElement
    let timer

    // Animate colours on user-initiated changes only, never on first mount.
    if (!isFirstApply.current) {
      root.classList.add('theme-transition')
      timer = setTimeout(() => root.classList.remove('theme-transition'), TRANSITION_MS)
    }
    isFirstApply.current = false

    root.classList.toggle('dark', resolvedTheme === 'dark')
    root.style.colorScheme = resolvedTheme
    return () => clearTimeout(timer)
  }, [resolvedTheme])

  const setPreference = useCallback((next) => {
    if (!PREFERENCES.includes(next)) return
    setPreferenceState(next)
    writeStorage(STORAGE_KEYS.theme, next)
  }, [])

  const toggleTheme = useCallback(() => {
    setPreference(resolvedTheme === 'dark' ? 'light' : 'dark')
  }, [resolvedTheme, setPreference])

  const value = useMemo(
    () => ({ preference, resolvedTheme, setPreference, toggleTheme }),
    [preference, resolvedTheme, setPreference, toggleTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
