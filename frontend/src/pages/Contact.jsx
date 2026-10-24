import { useState } from 'react'
import { CircleCheck, Clock, Mail, MapPin, Package, Phone, RotateCcw, Truck } from 'lucide-react'
import PageHeader from '../components/catalog/PageHeader'
import Accordion from '../components/common/Accordion'
import Button from '../components/common/Button'
import Container from '../components/common/Container'
import SocialIcon from '../components/common/SocialIcon'
import TextField from '../components/common/TextField'
import { RETURNS_SUMMARY, SHIPPING_POLICY } from '../data/policies'
import { STORE } from '../data/site'
import { usePageMeta } from '../hooks/usePageMeta'

const FAQS = [
  { id: 'cod', question: 'Do you offer cash on delivery?', answer: 'Yes. Cash on delivery is available islandwide. You can also pay by bank transfer.' },
  { id: 'genuine', question: 'Are your products genuine?', answer: 'Every product comes from authorised suppliers and is checked before dispatch. Warranty claims are handled by us directly.' },
  { id: 'change', question: 'Can I change my order after placing it?', answer: 'Yes — we call to confirm every order before dispatch, so you can change items or the address at that point.' },
  { id: 'bulk', question: 'Do you supply offices or bulk orders?', answer: 'We do. Email us with quantities and we’ll send a quote within one working day.' },
]

const CHANNELS = [
  { icon: Phone, label: 'Call us', value: STORE.phone, href: STORE.phoneHref },
  { icon: Mail, label: 'Email', value: STORE.email, href: `mailto:${STORE.email}` },
  { icon: MapPin, label: 'Visit', value: STORE.address },
  { icon: Clock, label: 'Hours', value: STORE.hours },
]

export default function Contact() {
  const [sent, setSent] = useState(false)
  usePageMeta({ title: 'Contact Us', description: 'Get in touch with GearZoneLK by phone, WhatsApp or email.' })

  return (
    <Container className="pb-20">
      <PageHeader
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Contact' }]}
        eyebrow="Support"
        title="We’re here to help."
        description="Questions about a product, an order or delivery? Reach us however suits you."
      />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-12">
        <div className="flex flex-col gap-8">
          <ul className="grid gap-3 sm:grid-cols-2">
            {CHANNELS.map(({ icon: Icon, label, value, href }) => {
              const content = (
                <>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-control bg-accent-soft text-link">
                    <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="micro-label block text-faint">{label}</span>
                    <span className="mt-1 block text-sm font-semibold text-ink">{value}</span>
                  </span>
                </>
              )
              return (
                <li key={label}>
                  {href ? (
                    <a href={href} className="flex h-full items-center gap-3.5 rounded-card border bg-surface p-4 transition-colors hover:border-accent/50">
                      {content}
                    </a>
                  ) : (
                    <div className="flex h-full items-center gap-3.5 rounded-card border bg-surface p-4">{content}</div>
                  )}
                </li>
              )
            })}
          </ul>

          <a
            href={STORE.whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between gap-4 rounded-card border border-success/30 bg-success-soft p-5 transition-colors hover:border-success"
          >
            <span className="flex items-center gap-3.5">
              <SocialIcon name="whatsapp" className="h-7 w-7 text-success" />
              <span>
                <span className="block font-semibold text-ink">Chat on WhatsApp</span>
                <span className="text-sm text-muted">Usually replies within an hour during store hours.</span>
              </span>
            </span>
          </a>

          <section id="faqs" aria-labelledby="faq-title" className="scroll-mt-36">
            <h2 id="faq-title" className="mb-4 text-xl font-bold text-ink">
              Frequently asked questions
            </h2>
            <Accordion items={FAQS} defaultOpenId="cod" />
          </section>

          <div className="grid gap-4 md:grid-cols-3">
            <section id="shipping" aria-labelledby="shipping-title" className="scroll-mt-36 rounded-card border bg-surface p-5">
              <Truck className="h-5 w-5 text-link" aria-hidden="true" />
              <h2 id="shipping-title" className="mt-3 font-bold text-ink">
                Shipping
              </h2>
              <ul className="mt-2 flex flex-col gap-1.5 text-[13px] text-muted">
                {SHIPPING_POLICY.map((row) => (
                  <li key={row.region}>
                    {row.region}: <span className="font-semibold text-ink">{row.time}</span>
                  </li>
                ))}
              </ul>
            </section>
            <section id="returns" aria-labelledby="returns-title" className="scroll-mt-36 rounded-card border bg-surface p-5">
              <RotateCcw className="h-5 w-5 text-link" aria-hidden="true" />
              <h2 id="returns-title" className="mt-3 font-bold text-ink">
                Returns
              </h2>
              <p className="mt-2 text-[13px] leading-relaxed text-muted">{RETURNS_SUMMARY}</p>
            </section>
            <section id="tracking" aria-labelledby="tracking-title" className="scroll-mt-36 rounded-card border bg-surface p-5">
              <Package className="h-5 w-5 text-link" aria-hidden="true" />
              <h2 id="tracking-title" className="mt-3 font-bold text-ink">
                Order tracking
              </h2>
              <p className="mt-2 text-[13px] leading-relaxed text-muted">
                Once dispatched, we SMS a courier tracking link. Message us your order reference any time for an update.
              </p>
            </section>
          </div>
        </div>

        <section aria-labelledby="message-title" className="self-start rounded-panel border bg-surface p-5 sm:p-7 lg:sticky lg:top-[140px]">
          <h2 id="message-title" className="text-lg font-bold text-ink">
            Send us a message
          </h2>
          {sent ? (
            <div role="status" className="animate-scale-in mt-6 flex items-start gap-3 rounded-card bg-success-soft p-4">
              <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-success" aria-hidden="true" />
              <p className="text-sm text-ink">
                Thanks — message received. We reply within one working day.
                <span className="mt-1 block text-xs text-muted">Demo form: messages are not sent anywhere yet.</span>
              </p>
            </div>
          ) : (
            <form
              className="mt-6 flex flex-col gap-4"
              onSubmit={(event) => {
                event.preventDefault()
                if (event.currentTarget.checkValidity()) setSent(true)
                else event.currentTarget.reportValidity()
              }}
            >
              <TextField label="Your name" name="name" autoComplete="name" required />
              <TextField label="Email or phone" name="contact" autoComplete="email" required />
              <TextField label="Message" name="message" as="textarea" required minLength={10} placeholder="How can we help?" />
              <Button type="submit" size="lg">
                Send message
              </Button>
            </form>
          )}
        </section>
      </div>
    </Container>
  )
}
