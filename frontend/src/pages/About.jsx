import { ArrowRight, Leaf, MessageCircle, PackageCheck, Scale } from 'lucide-react'
import PageHeader from '../components/catalog/PageHeader'
import Button from '../components/common/Button'
import Container from '../components/common/Container'
import { buildImageUrl, PHOTOS } from '../data/media'
import { usePageMeta } from '../hooks/usePageMeta'

const VALUES = [
  { icon: PackageCheck, title: 'Useful over flashy', body: 'Every product earns its place by making a desk or a day easier.' },
  { icon: Scale, title: 'Honest pricing', body: 'Prices in rupees, shown upfront. Deals are real discounts, not inflated “was” prices.' },
  { icon: MessageCircle, title: 'Real support', body: 'Talk to a person on WhatsApp, phone or email — before and after you buy.' },
  { icon: Leaf, title: 'Less waste', body: 'Minimal packaging where we can, and repairs or replacements before refunds.' },
]

const POLICIES = [
  {
    id: 'privacy',
    title: 'Privacy Policy',
    body: 'We only collect the details needed to deliver your order — your name, phone number and address — and never sell them. Payment details are handled by our payment partner and never stored by GearZoneLK.',
  },
  {
    id: 'terms',
    title: 'Terms & Conditions',
    body: 'Prices and availability can change without notice. Orders are confirmed by phone before dispatch. Warranty claims are handled through GearZoneLK with your invoice as proof of purchase.',
  },
]

export default function About() {
  usePageMeta({ title: 'About Us', description: 'GearZoneLK is a Sri Lankan online store for everyday tech accessories, delivered islandwide.' })

  return (
    <>
      <Container>
        <PageHeader
          breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'About' }]}
          eyebrow="About GearZoneLK"
          title="Everyday tech. Better gear."
          description="We’re a Sri Lankan online store for the keyboards, cables, stands and small accessories that make work and play feel better."
        />
      </Container>

      <section id="story" aria-labelledby="story-title" className="scroll-mt-36 border-y bg-subtle/60 py-16 sm:py-20">
        <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="product-plate overflow-hidden rounded-panel border">
            <img
              src={buildImageUrl(PHOTOS.deskMonitorKeyboard, { width: 1000, height: 750 })}
              alt="A tidy workspace with a monitor, keyboard and mouse"
              loading="lazy"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
          <div>
            <p className="micro-label text-link">Our story</p>
            <h2 id="story-title" className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Started at a cluttered desk in Colombo.
            </h2>
            <div className="mt-5 flex flex-col gap-4 text-[15px] leading-relaxed text-muted">
              <p>
                Finding a decent USB-C cable or a laptop stand that didn’t wobble meant hours of comparing listings with blurry photos and
                vague specs. We wanted one place that stocked good gear, described it honestly and delivered it anywhere in the island.
              </p>
              <p>
                GearZoneLK is that place. We test what we sell, write the specs you actually need, and keep prices fair — whether you’re
                setting up a home office in Kandy or a gaming corner in Jaffna.
              </p>
            </div>
            <Button to="/shop" className="mt-8">
              Browse the catalogue
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </Container>
      </section>

      <section aria-labelledby="values-title" className="py-16 sm:py-20">
        <Container>
          <h2 id="values-title" className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            What we care about
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map(({ icon: Icon, title, body }) => (
              <li key={title} className="rounded-card border bg-surface p-6">
                <span className="grid h-11 w-11 place-items-center rounded-control bg-accent-soft text-link">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-bold text-ink">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section aria-label="Policies" className="pb-20">
        <Container className="grid gap-4 md:grid-cols-2">
          {POLICIES.map((policy) => (
            <article key={policy.id} id={policy.id} className="scroll-mt-36 rounded-panel border bg-surface p-6 sm:p-8">
              <h2 className="text-lg font-bold text-ink">{policy.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">{policy.body}</p>
            </article>
          ))}
        </Container>
      </section>
    </>
  )
}
