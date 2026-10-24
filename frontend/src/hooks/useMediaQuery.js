import { useCallback, useSyncExternalStore } from 'react'

/** Live result of a CSS media query, e.g. useMediaQuery('(min-width: 768px)'). */
export function useMediaQuery(query) {
  const subscribe = useCallback(
    (onChange) => {
      const media = window.matchMedia(query)
      media.addEventListener('change', onChange)
      return () => media.removeEventListener('change', onChange)
    },
    [query],
  )
  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => false)
}
