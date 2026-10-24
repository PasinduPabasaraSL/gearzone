import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MathUtils } from 'three'
import { useTheme } from '../../hooks/useContexts'

/**
 * Inside a Canvas: returns a ref whose `.current` eases from 0 (light theme)
 * to 1 (dark theme) over roughly half a second whenever the theme changes.
 * Read it in useFrame to drive light intensities without re-rendering React.
 * (R3F bridges React context into the Canvas, so useTheme works here.)
 */
export function useThemeBlend() {
  const { resolvedTheme } = useTheme()
  const target = resolvedTheme === 'dark' ? 1 : 0
  const blend = useRef(target)

  useFrame((_, delta) => {
    blend.current = MathUtils.damp(blend.current, target, 5, Math.min(delta, 0.1))
  })

  return blend
}
