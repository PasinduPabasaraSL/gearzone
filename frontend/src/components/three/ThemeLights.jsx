import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import StudioEnvironment from './StudioEnvironment'
import { COLORS, mixLighting } from './palette'

/**
 * Lighting rig shared by the scenes. `blend` is the damped 0 (light) → 1
 * (dark) ref from useThemeBlend: in light mode the scene is evenly lit like
 * a product shot; in dark mode ambient light drops and a warm desk lamp
 * fades in.
 */
export default function ThemeLights({ blend, lampPosition = [-2.4, 2.8, -0.6], lampAngle = 0.6 }) {
  const hemisphere = useRef(null)
  const key = useRef(null)
  const lamp = useRef(null)

  useFrame((state) => {
    const levels = mixLighting(blend.current)
    if (hemisphere.current) hemisphere.current.intensity = levels.hemisphere
    if (key.current) key.current.intensity = levels.key
    if (lamp.current) lamp.current.intensity = levels.lamp
    state.scene.environmentIntensity = levels.environment
  })

  return (
    <>
      <hemisphereLight ref={hemisphere} args={['#ffffff', '#b8bfcc', 1]} />
      <directionalLight ref={key} position={[2.5, 5, 3]} color="#ffffff" />
      <spotLight ref={lamp} position={lampPosition} angle={lampAngle} penumbra={1} color={COLORS.lampWarm} distance={10} decay={2} intensity={0} />
      <StudioEnvironment />
    </>
  )
}
