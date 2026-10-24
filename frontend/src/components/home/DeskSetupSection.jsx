import { lazy, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import SetupHotspots from './SetupHotspots'
import Button from '../common/Button'
import Container from '../common/Container'
import Scene3D from '../three/Scene3D'
import { SETUP_ITEMS } from '../../data/editorial'
import { cn } from '../../utils/cn'
import { formatCurrency } from '../../utils/formatCurrency'

const DeskSetupScene = lazy(() => import('../three/DeskSetupScene'))

/**
 * "Build Your Setup" — GearZoneLK's signature section. A dark band with a
 * shoppable desk on one side and the parts list on the other; hovering a
 * list item highlights the matching pin and vice versa.
 */
export default function DeskSetupSection() {
  const [active, setActive] = useState(null)
  const total = SETUP_ITEMS.reduce((sum, item) => sum + item.price, 0)

  return (
    <section aria-labelledby="setup-title" className="relative overflow-hidden bg-strip py-16 text-on-strip sm:py-24">
      <div
        aria-hidden="true"
        className="blueprint-grid pointer-events-none absolute inset-0 opacity-50 [--grid-dot:rgb(255_255_255/0.09)]"
      />
      <Container className="relative grid items-center gap-10 lg:grid-cols-[minmax(0,380px)_1fr] lg:gap-14">
        <div>
          <p className="micro-label text-brand-300">Signature</p>
          <h2 id="setup-title" className="mt-3 text-[32px] leading-[1.05] font-extrabold tracking-tight sm:text-[44px]">
            Build your setup.
          </h2>
          <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-on-strip-muted">
            Everything you need to create a cleaner, smarter workspace — picked to work together.
          </p>

          <ol className="mt-8 flex flex-col">
            {SETUP_ITEMS.map((item, index) => (
              <li key={item.key}>
                <Link
                  to={`/product/${item.slug}`}
                  onMouseEnter={() => setActive(item.key)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(item.key)}
                  onBlur={() => setActive(null)}
                  className={cn(
                    'group flex items-center gap-3 border-b border-strip-line py-3 transition-colors',
                    active === item.key ? 'text-on-strip' : 'text-on-strip/80 hover:text-on-strip',
                  )}
                >
                  <span className={cn('tabular w-6 text-xs font-semibold', active === item.key ? 'text-brand-300' : 'text-on-strip-muted')}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="micro-label block text-on-strip-muted">{item.label}</span>
                    <span className="mt-1 block truncate text-sm font-semibold">{item.name}</span>
                  </span>
                  <span className="tabular text-sm font-semibold">{formatCurrency(item.price)}</span>
                </Link>
              </li>
            ))}
          </ol>
          <p className="mt-4 flex items-center justify-between text-sm text-on-strip-muted">
            Complete setup
            <span className="tabular text-base font-bold text-on-strip">{formatCurrency(total)}</span>
          </p>

          <Button variant="onAccent" to="/category/desk-setup" className="mt-7">
            Explore Desk Setup
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>

        <Scene3D
          scene={DeskSetupScene}
          fallback={<SetupHotspots activeKey={active} onActiveChange={setActive} />}
          sceneProps={{ activeKey: active, onActiveChange: setActive }}
          minWidth={1024}
          sceneClassName="-inset-x-6 -inset-y-10 [mask-composite:intersect] [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent),linear-gradient(to_bottom,transparent,black_8%,black_92%,transparent)]"
        />
      </Container>
    </section>
  )
}
