import { use, useCallback, useEffect, useRef } from 'react'
import { ContactShadows } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending, MathUtils } from 'three'
import MechanicalKeyboard from './MechanicalKeyboard'
import SceneCanvas from './SceneCanvas'
import ThemeLights from './ThemeLights'
import { fontsReady, glowTexture } from './textures'
import { useThemeBlend } from './useThemeBlend'
import { COLORS } from './palette'
import { useTheme } from '../../hooks/useContexts'

const DEMO_WORD = 'GEARZONE'
const BASE_ROTATION = { x: 0.06, y: -0.42 }

/**
 * Keyboard rig: follows the cursor, bobs gently, mirrors physical key presses
 * and explodes into its layers as the hero scrolls away.
 */
function KeyboardRig({ pressedRef, onKeyDown, onKeyUp }) {
  const group = useRef(null)
  const pointer = useRef({ x: 0, y: 0 })
  const explode = useRef(0)
  const explodeTarget = useRef(0)
  const blend = useThemeBlend()
  const halo = useRef(null)

  useEffect(() => {
    const onMove = (event) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1
    }
    const onScroll = () => {
      explodeTarget.current = MathUtils.clamp(window.scrollY / (window.innerHeight * 0.55), 0, 1)
    }
    onScroll()
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05)
    explode.current = MathUtils.damp(explode.current, explodeTarget.current, 6, delta)
    const g = group.current
    if (g) {
      g.rotation.x = MathUtils.damp(g.rotation.x, BASE_ROTATION.x + pointer.current.y * 0.09, 4, delta)
      g.rotation.y = MathUtils.damp(g.rotation.y, BASE_ROTATION.y + pointer.current.x * 0.2, 4, delta)
      g.position.y = Math.sin(state.clock.elapsedTime * 0.9) * 0.022
    }
    if (halo.current) halo.current.opacity = blend.current * 0.9
  })

  return (
    <>
      <ThemeLights blend={blend} />
      <group ref={group} scale={0.9}>
        <MechanicalKeyboard pressedRef={pressedRef} explodeRef={explode} glowRef={blend} onKeyDown={onKeyDown} onKeyUp={onKeyUp} />
        <mesh position={[0, -0.004, 0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={-1}>
          <planeGeometry args={[4.4, 2.3]} />
          <meshBasicMaterial ref={halo} map={glowTexture(COLORS.glow)} transparent opacity={0} blending={AdditiveBlending} depthWrite={false} />
        </mesh>
      </group>
    </>
  )
}

/**
 * Hero 3D scene: a procedural 60% mechanical keyboard (modelled on the K617
 * Fizz in the catalogue). Type on your own keyboard and the matching keys
 * press; tap keys on touch screens; scroll and it separates into case,
 * plate, switches and keycaps. Types "GEARZONE" once as a hint.
 */
export default function HeroKeyboardScene({ active, onReady }) {
  use(fontsReady())
  const { resolvedTheme } = useTheme()
  const pressed = useRef(new Set())
  const userTyped = useRef(false)

  const keyDown = useCallback((code) => pressed.current.add(code), [])
  const keyUp = useCallback((code) => pressed.current.delete(code), [])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.repeat) return
      userTyped.current = true
      keyDown(event.code)
    }
    const onKeyUp = (event) => keyUp(event.code)
    const clear = () => pressed.current.clear()
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('blur', clear)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('blur', clear)
    }
  }, [keyDown, keyUp])

  // One-off typing demo the first time the scene is on screen.
  const demoPlayed = useRef(false)
  useEffect(() => {
    if (!active || demoPlayed.current) return
    demoPlayed.current = true
    const timers = []
    DEMO_WORD.split('').forEach((letter, index) => {
      const code = `Key${letter}`
      const start = 1100 + index * 170
      timers.push(setTimeout(() => !userTyped.current && keyDown(code), start))
      timers.push(setTimeout(() => keyUp(code), start + 110))
    })
    return () => timers.forEach(clearTimeout)
  }, [active, keyDown, keyUp])

  return (
    <SceneCanvas
      active={active}
      onReady={onReady}
      camera={{ position: [0, 3.2, 3.7], fov: 30, near: 0.1, far: 30 }}
      lookAt={[0, 0.2, 0]}
      onPointerMissed={() => pressed.current.clear()}
      label="3D mechanical keyboard that mirrors the keys you type"
    >
      <KeyboardRig pressedRef={pressed} onKeyDown={keyDown} onKeyUp={keyUp} />
      <ContactShadows
        position={[0, -0.01, 0]}
        opacity={resolvedTheme === 'dark' ? 0.75 : 0.42}
        scale={6}
        blur={2.6}
        far={1.4}
        resolution={512}
        color="#0b1020"
      />
    </SceneCanvas>
  )
}
