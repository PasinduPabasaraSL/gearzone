import { useState } from 'react'
import { CircleCheck, Mail } from 'lucide-react'
import Button from '../common/Button'
import Container from '../common/Container'
import TextField from '../common/TextField'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/**
 * Newsletter sign-up. Frontend only: the address is validated and
 * acknowledged but not stored or sent anywhere until a mailing service is
 * connected.
 */
export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const onSubmit = (event) => {
    event.preventDefault()
    if (!EMAIL_PATTERN.test(email.trim())) {
      setError('Please enter a valid email address.')
      return
    }
    setError('')
    setSubscribed(true)
  }

  return (
    <section aria-labelledby="newsletter-title" className="pb-16 sm:pb-24">
      <Container>
        <div className="relative overflow-hidden rounded-panel border bg-surface px-6 py-10 sm:px-12 sm:py-14">
          <div aria-hidden="true" className="blueprint-grid pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_left,black,transparent_60%)]" />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_440px]">
            <div>
              <span className="grid h-11 w-11 place-items-center rounded-control bg-accent-soft text-link">
                <Mail className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2 id="newsletter-title" className="mt-5 text-[28px] leading-tight font-extrabold tracking-tight text-ink sm:text-[34px]">
                Stay in the loop.
              </h2>
              <p className="mt-2 max-w-md text-[15px] text-muted">Get new gear, deals and product drops delivered to your inbox.</p>
            </div>

            {subscribed ? (
              <div role="status" className="animate-scale-in flex items-start gap-3 rounded-card border border-success/30 bg-success-soft p-5">
                <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-success" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-ink">You’re on the list.</p>
                  <p className="mt-1 text-sm text-muted">We’ll send the next drop to {email.trim()}.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="flex flex-col gap-3 sm:flex-row sm:items-start">
                <TextField
                  label="Email address"
                  hideLabel
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value)
                    if (error) setError('')
                  }}
                  error={error}
                  wrapperClassName="flex-1"
                  className="h-12"
                />
                <Button type="submit" size="lg" className="h-12 shrink-0">
                  Subscribe
                </Button>
              </form>
            )}
          </div>
        </div>
      </Container>
    </section>
  )
}
