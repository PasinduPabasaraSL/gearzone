import { ArrowUp, Banknote, Building2, CreditCard, Mail, MapPin, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import Container from '../common/Container'
import Logo from '../common/Logo'
import SocialIcon from '../common/SocialIcon'
import { FOOTER_COLUMNS, SOCIAL_LINKS, STORE } from '../../data/site'

const PAYMENT_METHODS = [
  { label: 'Cash on Delivery', icon: Banknote },
  { label: 'Bank Transfer', icon: Building2 },
  { label: 'Card Payments', icon: CreditCard },
]

export default function Footer() {
  return (
    <footer className="mt-auto bg-strip text-on-strip">
      <Container className="grid gap-12 py-14 sm:py-16 lg:grid-cols-[1.3fr_repeat(4,1fr)] lg:gap-10">
        <div className="max-w-sm">
          <Logo onStrip />
          <p className="mt-5 text-lg font-semibold tracking-tight">{STORE.tagline}</p>
          <p className="mt-2 text-sm leading-relaxed text-on-strip-muted">
            Keyboards, mice, cables and the small things that make a desk work better — delivered across Sri Lanka.
          </p>
          <ul className="mt-6 flex flex-col gap-2.5 text-sm text-on-strip-muted">
            <li>
              <a href={STORE.phoneHref} className="inline-flex items-center gap-2.5 transition-colors hover:text-on-strip">
                <Phone className="h-4 w-4" aria-hidden="true" />
                {STORE.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${STORE.email}`} className="inline-flex items-center gap-2.5 transition-colors hover:text-on-strip">
                <Mail className="h-4 w-4" aria-hidden="true" />
                {STORE.email}
              </a>
            </li>
            <li className="inline-flex items-center gap-2.5">
              <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
              {STORE.address}
            </li>
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 lg:col-span-4">
          {FOOTER_COLUMNS.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="micro-label text-on-strip-muted">{column.title}</h2>
              <ul className="mt-5 flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-sm text-on-strip/85 transition-colors hover:text-brand-300">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <h2 className="micro-label text-on-strip-muted">Social</h2>
            <ul className="mt-5 flex flex-col gap-3">
              {SOCIAL_LINKS.map((social) => (
                <li key={social.name}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2.5 text-sm text-on-strip/85 transition-colors hover:text-brand-300"
                  >
                    <SocialIcon name={social.name} className="h-4 w-4" />
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>

      <div className="border-t border-strip-line">
        <Container className="flex flex-col gap-5 py-6 text-[13px] text-on-strip-muted md:flex-row md:items-center md:justify-between">
          <p>© 2026 GearZoneLK. All rights reserved.</p>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2" aria-label="Accepted payment methods">
            {PAYMENT_METHODS.map(({ label, icon: Icon }) => (
              <li key={label} className="inline-flex items-center gap-1.5">
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex h-9 items-center gap-1.5 self-start rounded-control border border-strip-line px-3 font-semibold text-on-strip transition-colors hover:bg-strip-raised md:self-auto"
          >
            <ArrowUp className="h-4 w-4" aria-hidden="true" />
            Back to top
          </button>
        </Container>
      </div>
    </footer>
  )
}
