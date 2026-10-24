import { useEffect, useState } from 'react'

/**
 * Tracks whether an element is within `rootMargin` of the viewport. Used to
 * download 3D scenes just before they scroll into view and to pause their
 * render loops once they leave it.
 */
export function useInView(ref, { rootMargin = '0px', once = false } = {}) {
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
        if (entry.isIntersecting && once) observer.disconnect()
      },
      { rootMargin },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref, rootMargin, once])

  return inView
}
