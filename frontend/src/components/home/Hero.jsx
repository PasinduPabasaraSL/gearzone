import { lazy } from 'react'
import { ArrowRight, Banknote, Keyboard, RotateCcw, Truck } from 'lucide-react'
import HeroCollage from './HeroCollage'
import Button from '../common/Button'
import Container from '../common/Container'
import Scene3D from '../three/Scene3D'

const HeroKeyboardScene = lazy(() => import('../three/HeroKeyboardScene'))

function TypingHint() {
  return (
    <p className="animate-fade-up pointer-events-none absolute inset-x-0 bottom-0 flex justify-center [animation-delay:600ms]">
      <span className="inline-flex items-center gap-2 rounded-full border bg-surface/90 px-3.5 py-1.5 text-[12.5px] font-medium text-muted shadow-xs backdrop-blur-sm">
        <Keyboard className="h-3.5 w-3.5 text-link" aria-hidden="true" />
        <span className="hidden [@media(hover:hover)]:inline">Try typing — the keys follow along</span>
        <span className="[@media(hover:hover)]:hidden">Tap the keys to press them</span>
      </span>
    </p>
  )
}

const ASSURANCES = [
  { icon: Truck, label: 'Islandwide delivery' },
  { icon: Banknote, label: 'Cash on delivery' },
  { icon: RotateCcw, label: '7-day returns' },
]

export default function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden border-b">
      <div
        aria-hidden="true"
        className="blueprint-grid pointer-events-none absolute inset-y-0 right-0 w-full opacity-70 [mask-image:radial-gradient(ellipse_at_70%_45%,black_20%,transparent_70%)] lg:w-3/5"
      />
      <Container className="relative grid items-center gap-10 py-12 sm:py-16 lg:min-h-[600px] lg:grid-cols-[1.05fr_1fr] lg:gap-12 lg:py-20">
        <div className="animate-fade-up max-w-xl">
          <p className="inline-flex items-center gap-2 rounded-full border bg-surface py-1 pr-3 pl-1 text-[13px] font-medium text-muted shadow-xs">
            <span className="rounded-full bg-accent px-2 py-0.5 text-[11px] font-bold tracking-wide text-white uppercase">New</span>
            Fresh desk gear just landed
          </p>
          <h1
            id="hero-title"
            className="mt-6 text-[42px] leading-[1.02] font-extrabold tracking-[-0.035em] text-ink sm:text-[56px] lg:text-[64px] 2xl:text-[76px]"
          >
            Upgrade your
            <br />
            everyday <span className="text-link">setup.</span>
          </h1>
          <p className="mt-5 max-w-md text-[17px] leading-relaxed text-muted">
            Smart gadgets and essential accessories designed for work, play, and everything in between.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" to="/shop">
              Shop Now
              <ArrowRight className="h-4.5 w-4.5" aria-hidden="true" />
            </Button>
            <Button size="lg" variant="secondary" to="/#categories">
              Explore Categories
            </Button>
          </div>
          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-[13px] font-medium text-muted">
            {ASSURANCES.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-link" aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div className="animate-fade-up [animation-delay:120ms]">
          <Scene3D
            scene={HeroKeyboardScene}
            fallback={<HeroCollage />}
            overlay={<TypingHint />}
            minWidth={768}
            preloadMargin="0px"
            sceneClassName="-inset-x-10 -inset-y-12 [mask-composite:intersect] [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent),linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)]"
          />
        </div>
      </Container>
    </section>
  )
}
