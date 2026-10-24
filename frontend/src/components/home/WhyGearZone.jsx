import { BadgePercent, HeartHandshake, PackageCheck, Truck } from 'lucide-react'
import Container from '../common/Container'

const REASONS = [
  {
    icon: PackageCheck,
    title: 'Curated Gear',
    body: 'We focus on useful technology and everyday accessories — no filler, no gimmicks.',
  },
  {
    icon: BadgePercent,
    title: 'Fair Pricing',
    body: 'Competitive prices shown upfront in rupees, without unnecessary complexity.',
  },
  {
    icon: Truck,
    title: 'Islandwide Delivery',
    body: 'Convenient delivery across Sri Lanka, with cash on delivery available.',
  },
  {
    icon: HeartHandshake,
    title: 'Customer First',
    body: 'Friendly support on WhatsApp, phone and email — before and after you buy.',
  },
]

export default function WhyGearZone() {
  return (
    <section aria-labelledby="why-title" className="py-14 sm:py-20">
      <Container className="grid gap-10 lg:grid-cols-[minmax(0,360px)_1fr] lg:gap-16">
        <div>
          <p className="micro-label text-link">Why us</p>
          <h2 id="why-title" className="mt-3 text-[30px] leading-[1.1] font-extrabold tracking-tight text-ink sm:text-4xl">
            Why GearZone<span className="text-link">LK</span>?
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-muted">
            We started GearZoneLK to make good desk and mobile gear easy to find in Sri Lanka — fairly priced, honestly described and
            delivered to your door.
          </p>
        </div>
        <ul className="grid gap-px overflow-hidden rounded-panel border bg-line sm:grid-cols-2">
          {REASONS.map(({ icon: Icon, title, body }, index) => (
            <li key={title} className="flex flex-col bg-surface p-6 sm:p-7">
              <div className="flex items-center justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-control bg-accent-soft text-link">
                  <Icon className="h-5 w-5" strokeWidth={1.9} aria-hidden="true" />
                </span>
                <span className="tabular text-xs font-semibold text-faint" aria-hidden="true">
                  0{index + 1}
                </span>
              </div>
              <h3 className="mt-5 text-base font-bold text-ink">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
