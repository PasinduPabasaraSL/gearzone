import { BadgeCheck, Headset, ShieldCheck, Truck } from 'lucide-react'
import Container from '../common/Container'

const BENEFITS = [
  { icon: Truck, title: 'Fast Delivery', body: 'Islandwide, 2–4 working days' },
  { icon: ShieldCheck, title: 'Secure Shopping', body: 'Safe & reliable ordering' },
  { icon: BadgeCheck, title: 'Quality Gear', body: 'Selected for everyday use' },
  { icon: Headset, title: 'Customer Support', body: 'We’re here to help' },
]

export default function BenefitsStrip() {
  return (
    <section aria-label="Why shop with us" className="border-b bg-subtle/60">
      <Container>
        <ul className="grid grid-cols-2 divide-line lg:grid-cols-4 lg:divide-x">
          {BENEFITS.map(({ icon: Icon, title, body }) => (
            <li key={title} className="flex items-center gap-3 py-5 sm:gap-4 lg:justify-center lg:px-6">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-control border bg-surface text-link">
                <Icon className="h-[18px] w-[18px]" strokeWidth={1.9} aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="micro-label block text-ink">{title}</span>
                <span className="mt-1 block truncate text-[13px] text-muted">{body}</span>
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
