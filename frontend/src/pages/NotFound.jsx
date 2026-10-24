import { lazy } from 'react'
import { ArrowLeft, Hand, Search } from 'lucide-react'
import Button from '../components/common/Button'
import Container from '../components/common/Container'
import KeycapFallback from '../components/notfound/KeycapFallback'
import Scene3D from '../components/three/Scene3D'
import { usePageMeta } from '../hooks/usePageMeta'

const KeycapPlaygroundScene = lazy(() => import('../components/three/KeycapPlaygroundScene'))

function PlaygroundHint() {
  return (
    <p className="animate-fade-up pointer-events-none absolute inset-x-0 -bottom-2 flex justify-center [animation-delay:1200ms]">
      <span className="inline-flex items-center gap-2 rounded-full border bg-surface/90 px-3.5 py-1.5 text-[12.5px] font-medium text-muted shadow-xs backdrop-blur-sm">
        <Hand className="h-3.5 w-3.5 text-link" aria-hidden="true" />
        Drag and flick the keys — tap <kbd className="font-sans font-bold text-ink">Esc</kbd> to head back to the shop
      </span>
    </p>
  )
}

export default function NotFound() {
  usePageMeta({ title: 'Page not found' })

  return (
    <section className="relative overflow-hidden">
      <div aria-hidden="true" className="blueprint-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_65%)]" />
      <Container className="relative flex flex-col items-center py-16 text-center sm:py-24">
        <Scene3D
          scene={KeycapPlaygroundScene}
          minWidth={640}
          preloadMargin="0px"
          className="w-full max-w-2xl"
          sceneClassName="-inset-x-16 -inset-y-6"
          overlay={<PlaygroundHint />}
          fallback={
            <div className="flex h-56 items-center justify-center sm:h-72">
              <KeycapFallback />
            </div>
          }
        />
        <p className="micro-label mt-8 text-link">Error 404</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-[44px]">Looks like this gear went missing.</h1>
        <p className="mt-3 max-w-md text-muted">The page you’re after doesn’t exist or has moved. Let’s get you back to the good stuff.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button to="/shop" size="lg">
            <ArrowLeft className="h-4.5 w-4.5" aria-hidden="true" />
            Back to Shop
          </Button>
          <Button to="/search" size="lg" variant="secondary">
            <Search className="h-4.5 w-4.5" aria-hidden="true" />
            Search products
          </Button>
        </div>
      </Container>
    </section>
  )
}
