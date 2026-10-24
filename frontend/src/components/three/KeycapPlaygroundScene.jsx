import { use, useEffect, useMemo, useRef } from 'react'
import { ContactShadows } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { MathUtils, Plane, Raycaster, Vector2, Vector3 } from 'three'
import { useNavigate } from 'react-router-dom'
import Keycap from './Keycap'
import SceneCanvas from './SceneCanvas'
import ThemeLights from './ThemeLights'
import { COLORS } from './palette'
import { fontsReady } from './textures'
import { useThemeBlend } from './useThemeBlend'
import { useTheme } from '../../hooks/useContexts'

const UNIT = 0.74
const CAP_HEIGHT = 0.34
const HALF_HEIGHT = CAP_HEIGHT / 2
const GRAVITY = -18
const RESTITUTION = 0.35
const BOUNDS = { x: 2.55, z: 0.95 }
const DRAG_HEIGHT = 0.75
const MAX_FLICK_SPEED = 14
const CLICK_PX = 6

const KEYS = [
  { id: 'four-a', label: '4', widthUnits: 1, kind: 'light', start: [-1.45, 3.0, -0.1] },
  { id: 'zero', label: '0', widthUnits: 1, kind: 'accent', start: [-0.5, 3.7, 0.15] },
  { id: 'four-b', label: '4', widthUnits: 1, kind: 'light', start: [0.45, 4.4, -0.05] },
  { id: 'esc', label: 'Esc', widthUnits: 1.4, kind: 'dark', start: [1.75, 5.3, 0.3], action: 'shop' },
]

// Scratch objects for pointer → drag-plane projection (one playground per page).
const raycaster = new Raycaster()
const dragPlane = new Plane(new Vector3(0, 1, 0), -DRAG_HEIGHT)
const dragTarget = new Vector3()
const previousPosition = new Vector3()

const STYLE = {
  light: { color: COLORS.capLight, legend: COLORS.legendDark },
  accent: { color: COLORS.brand, legend: COLORS.legendLight },
  dark: { color: COLORS.switchHousing, legend: COLORS.legendLight },
}

function createBody(key, index) {
  return {
    ...key,
    position: new Vector3(...key.start),
    velocity: new Vector3(0, 0, 0),
    tilt: new Vector3(0.6 + index * 0.4, 0, -0.5 + index * 0.3),
    spin: new Vector3(4 - index * 1.5, 0, 3 + index),
    yaw: (index - 1.5) * 0.18,
    radius: (key.widthUnits * UNIT) / 2,
  }
}

/** One fixed-size physics step: gravity, floor bounce, walls, friction and keycap-vs-keycap separation. */
function step(bodies, dt, draggingId) {
  for (const body of bodies) {
    if (body.id === draggingId) continue
    body.velocity.y += GRAVITY * dt
    body.position.addScaledVector(body.velocity, dt)

    const grounded = body.position.y <= HALF_HEIGHT
    if (grounded) {
      body.position.y = HALF_HEIGHT
      if (body.velocity.y < 0) body.velocity.y = Math.abs(body.velocity.y) > 1 ? -body.velocity.y * RESTITUTION : 0
      body.velocity.x *= 1 - 6 * dt
      body.velocity.z *= 1 - 6 * dt
      body.tilt.x = MathUtils.damp(body.tilt.x, 0, 12, dt)
      body.tilt.z = MathUtils.damp(body.tilt.z, 0, 12, dt)
      body.spin.multiplyScalar(1 - 8 * dt)
    } else {
      body.tilt.addScaledVector(body.spin, dt)
    }

    for (const axis of ['x', 'z']) {
      const limit = BOUNDS[axis] - (axis === 'x' ? body.radius : UNIT / 2)
      if (Math.abs(body.position[axis]) > limit) {
        body.position[axis] = Math.sign(body.position[axis]) * limit
        body.velocity[axis] *= -0.5
      }
    }
  }

  // Keep keycaps from overlapping when they sit at similar heights.
  for (let i = 0; i < bodies.length; i++) {
    for (let j = i + 1; j < bodies.length; j++) {
      const a = bodies[i]
      const b = bodies[j]
      if (Math.abs(a.position.y - b.position.y) > CAP_HEIGHT) continue
      const dx = b.position.x - a.position.x
      const dz = b.position.z - a.position.z
      const distance = Math.hypot(dx, dz) || 0.0001
      const overlap = a.radius + b.radius - distance
      if (overlap <= 0) continue
      const nx = dx / distance
      const nz = dz / distance
      const aFixed = a.id === draggingId
      const bFixed = b.id === draggingId
      const share = aFixed || bFixed ? 1 : 0.5
      if (!aFixed) a.position.set(a.position.x - nx * overlap * share, a.position.y, a.position.z - nz * overlap * share)
      if (!bFixed) b.position.set(b.position.x + nx * overlap * share, b.position.y, b.position.z + nz * overlap * share)
      const relative = (b.velocity.x - a.velocity.x) * nx + (b.velocity.z - a.velocity.z) * nz
      if (relative < 0) {
        const impulse = -relative * 0.9
        if (!aFixed) a.velocity.set(a.velocity.x - nx * impulse * share * 2, a.velocity.y, a.velocity.z - nz * impulse * share * 2)
        if (!bFixed) b.velocity.set(b.velocity.x + nx * impulse * share * 2, b.velocity.y, b.velocity.z + nz * impulse * share * 2)
      }
    }
  }
}

function Playground({ onAction }) {
  const blend = useThemeBlend()
  const { camera, gl } = useThree()
  const bodies = useMemo(() => KEYS.map(createBody), [])
  const groups = useRef([])
  const drag = useRef(null)
  const pointer = useRef({ ndc: new Vector2(), hasPointer: false })

  useEffect(() => {
    const element = gl.domElement
    const toNdc = (event) => {
      const rect = element.getBoundingClientRect()
      pointer.current.ndc.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1)
      pointer.current.hasPointer = true
    }
    const onUp = (event) => {
      const current = drag.current
      if (!current) return
      drag.current = null
      element.style.cursor = ''
      const body = bodies.find((b) => b.id === current.id)
      const moved = Math.hypot(event.clientX - current.startX, event.clientY - current.startY)
      if (moved < CLICK_PX && performance.now() - current.startTime < 350) {
        body.velocity.set(0, 5, 0)
        body.spin.set(6, 0, 0)
        if (body.action) onAction(body.action)
        return
      }
      if (body.velocity.length() > MAX_FLICK_SPEED) body.velocity.setLength(MAX_FLICK_SPEED)
      body.spin.set(body.velocity.z * 1.2, 0, -body.velocity.x * 1.2)
    }
    window.addEventListener('pointermove', toNdc, { passive: true })
    window.addEventListener('pointerup', onUp)
    return () => {
      window.removeEventListener('pointermove', toNdc)
      window.removeEventListener('pointerup', onUp)
    }
  }, [bodies, gl, onAction])

  const toPointer = (event) => {
    const rect = gl.domElement.getBoundingClientRect()
    pointer.current.ndc.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1)
  }

  const startDrag = (id) => (event) => {
    event.stopPropagation()
    toPointer(event)
    drag.current = { id, startX: event.clientX, startY: event.clientY, startTime: performance.now() }
    gl.domElement.style.cursor = 'grabbing'
  }

  useFrame((_, rawDelta) => {
    const dt = Math.min(rawDelta, 1 / 30)

    const current = drag.current
    if (current) {
      const body = bodies.find((b) => b.id === current.id)
      raycaster.setFromCamera(pointer.current.ndc, camera)
      if (raycaster.ray.intersectPlane(dragPlane, dragTarget)) {
        dragTarget.x = MathUtils.clamp(dragTarget.x, -BOUNDS.x + body.radius, BOUNDS.x - body.radius)
        dragTarget.z = MathUtils.clamp(dragTarget.z, -BOUNDS.z, BOUNDS.z)
        previousPosition.copy(body.position)
        body.position.lerp(dragTarget, 1 - Math.exp(-18 * dt))
        body.velocity.copy(body.position).sub(previousPosition).divideScalar(Math.max(dt, 1e-3))
        body.tilt.x = MathUtils.damp(body.tilt.x, body.velocity.z * 0.05, 10, dt)
        body.tilt.z = MathUtils.damp(body.tilt.z, -body.velocity.x * 0.05, 10, dt)
      }
    }

    step(bodies, dt / 2, current?.id)
    step(bodies, dt / 2, current?.id)

    bodies.forEach((body, i) => {
      const group = groups.current[i]
      if (!group) return
      group.position.copy(body.position)
      group.rotation.set(body.tilt.x, body.yaw, body.tilt.z)
    })
  })

  return (
    <>
      <ThemeLights blend={blend} lampPosition={[-2.4, 3.2, 1.2]} lampAngle={0.7} />
      {bodies.map((body, i) => {
        const style = STYLE[body.kind]
        return (
          <Keycap
            key={body.id}
            ref={(node) => (groups.current[i] = node)}
            unit={UNIT}
            widthUnits={body.widthUnits}
            height={CAP_HEIGHT}
            gap={0.04}
            color={style.color}
            legendColor={style.legend}
            label={body.label}
            legendSize="large"
            position={body.start}
            onPointerDown={startDrag(body.id)}
            onPointerOver={() => {
              if (!drag.current) gl.domElement.style.cursor = 'grab'
            }}
            onPointerOut={() => {
              if (!drag.current) gl.domElement.style.cursor = ''
            }}
          />
        )
      })}
    </>
  )
}

/**
 * 404 playground: keycaps spelling "404" drop onto the page; drag and flick
 * them around. The Esc keycap (or the Escape key) heads back to the shop.
 */
export default function KeycapPlaygroundScene({ active, onReady }) {
  use(fontsReady())
  const navigate = useNavigate()
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key !== 'Escape' || event.defaultPrevented) return
      if (document.querySelector('[role="dialog"][aria-modal="true"]')) return
      navigate('/shop')
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [navigate])

  return (
    <SceneCanvas
      active={active}
      onReady={onReady}
      camera={{ position: [0, 3.7, 4.1], fov: 30, near: 0.1, far: 40 }}
      lookAt={[0, 0.25, 0]}
      label="404 spelled out in keycaps that you can drag and flick"
      style={{ touchAction: 'none' }}
    >
      <Playground onAction={(action) => action === 'shop' && navigate('/shop')} />
      <ContactShadows position={[0, 0, 0]} opacity={resolvedTheme === 'dark' ? 0.7 : 0.38} scale={8} blur={2.4} far={2} resolution={512} color="#0b1020" />
    </SceneCanvas>
  )
}
