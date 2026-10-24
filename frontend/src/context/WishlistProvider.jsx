import { useCallback, useEffect, useMemo, useState } from 'react'
import { WishlistContext } from './contexts'
import { readStorage, STORAGE_KEYS, writeStorage } from '../utils/storage'

function loadWishlist() {
  const stored = readStorage(STORAGE_KEYS.wishlist, [])
  return Array.isArray(stored) ? stored.filter((id) => typeof id === 'string') : []
}

/**
 * Wishlist stores product ids only; the wishlist page loads current product
 * data through the catalogue service so prices and stock are never stale.
 */
export default function WishlistProvider({ children }) {
  const [ids, setIds] = useState(loadWishlist)

  useEffect(() => {
    writeStorage(STORAGE_KEYS.wishlist, ids)
  }, [ids])

  useEffect(() => {
    const onStorage = (event) => {
      if (event.key === STORAGE_KEYS.wishlist) setIds(loadWishlist())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const has = useCallback((id) => ids.includes(id), [ids])

  /** Returns true when the product ends up saved, false when removed. */
  const toggle = useCallback(
    (id) => {
      const saved = !ids.includes(id)
      setIds((current) => (current.includes(id) ? current.filter((x) => x !== id) : [id, ...current]))
      return saved
    },
    [ids],
  )

  const remove = useCallback((id) => setIds((current) => current.filter((x) => x !== id)), [])
  const clear = useCallback(() => setIds([]), [])

  const value = useMemo(
    () => ({ ids, count: ids.length, has, toggle, remove, clear }),
    [ids, has, toggle, remove, clear],
  )

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}
