import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import SceneErrorBoundary from './SceneErrorBoundary'
import { hasWebGL } from './webgl'
import { useInView } from '../../hooks/useInView'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { cn } from '../../utils/cn'

/**
 * Gate in front of every 3D scene.
 *
 * - Shows `fallback` (a static visual) when WebGL is unavailable, when the
 *   visitor prefers reduced motion, or below `minWidth`.
 * - Mounts the lazily imported `scene` only once its container is within
 *   `preloadMargin` of the viewport, so the Three.js chunk never delays the
 *   initial page load.
 * - Keeps the fallback in place (it also defines the layout box) and
 *   cross-fades to the canvas after the scene reports its first frame.
 * - Passes `active` so the scene stops rendering while off-screen, and falls
 *   back to the static visual if the scene throws.
 */
export default function Scene3D({
  scene: LazyScene,
  fallback,
  overlay,
  minWidth = 0,
  preloadMargin = '300px',
  className,
  sceneClassName,
  sceneProps,
}) {
  const containerRef = useRef(null)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const reducedMotion = useReducedMotion()
  const wideEnough = useMediaQuery(`(min-width: ${minWidth}px)`)
  const nearViewport = useInView(containerRef, { rootMargin: preloadMargin, once: true })
  const visible = useInView(containerRef, { rootMargin: '50px' })

  const canRender = !failed && !reducedMotion && (minWidth === 0 || wideEnough) && hasWebGL()
  const showScene = canRender && nearViewport
  const sceneVisible = showScene && ready

  const onReady = useCallback(() => setReady(true), [])

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <div
        aria-hidden={sceneVisible || undefined}
        inert={sceneVisible || undefined}
        className={cn('transition-opacity duration-700', sceneVisible && 'opacity-0')}
      >
        {fallback}
      </div>

      {showScene && (
        <div className={cn('absolute transition-opacity duration-700', sceneClassName ?? 'inset-0', ready ? 'opacity-100' : 'opacity-0')}>
          <SceneErrorBoundary fallback={<FailureSignal onFail={setFailed} />}>
            <Suspense fallback={null}>
              <LazyScene active={visible} onReady={onReady} {...sceneProps} />
            </Suspense>
          </SceneErrorBoundary>
        </div>
      )}

      {sceneVisible && overlay}
    </div>
  )
}

/** Rendered by the error boundary: flips the gate back to the static fallback. */
function FailureSignal({ onFail }) {
  useEffect(() => onFail(true), [onFail])
  return null
}
