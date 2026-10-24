import { useEffect, useState } from 'react'
import { Phone, Truck } from 'lucide-react'
import { Link } from 'react-router-dom'
import Container from '../common/Container'
import { ANNOUNCEMENTS, STORE } from '../../data/site'

const ROTATE_MS = 4500

/** Slim utility bar above the header. Rotation pauses for reduced motion. */
export default function AnnouncementBar() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = setInterval(() => setIndex((i) => (i + 1) % ANNOUNCEMENTS.length), ROTATE_MS)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="bg-strip text-on-strip">
      <Container className="flex h-9 items-center justify-center text-[12.5px] font-medium sm:justify-between">
        <p className="flex items-center gap-2" aria-live="off">
          <Truck className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden="true" />
          <span key={index} className="animate-fade-in">
            {ANNOUNCEMENTS[index]}
          </span>
        </p>
        <div className="hidden items-center gap-5 opacity-80 sm:flex">
          <a href={STORE.phoneHref} className="flex items-center gap-1.5 transition-opacity hover:opacity-100">
            <Phone className="h-3.5 w-3.5" aria-hidden="true" />
            {STORE.phone}
          </a>
          <Link to="/contact#tracking" className="transition-opacity hover:opacity-100">
            Track order
          </Link>
        </div>
      </Container>
    </div>
  )
}
