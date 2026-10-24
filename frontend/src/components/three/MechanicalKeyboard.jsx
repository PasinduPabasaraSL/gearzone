import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MathUtils, Object3D } from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import Keycap from './Keycap'
import { layoutKeys, LAYOUT_ROWS, LAYOUT_WIDTH_UNITS } from './keyboardLayout'
import { COLORS } from './palette'

export const UNIT = 0.19

const CASE_HEIGHT = 0.12
const PLATE_Y = 0.129
const SWITCH_Y = 0.1625
const CAP_Y = 0.2375
const PRESS_DEPTH = 0.045

const CAP_COLORS = {
  alpha: { color: COLORS.capLight, legend: COLORS.legendDark },
  mod: { color: COLORS.capMid, legend: COLORS.legendDark },
  accent: { color: COLORS.brand, legend: COLORS.legendLight },
}

const scratch = new Object3D()

function placeSwitches(keys, housings, stems, lift) {
  if (!housings || !stems) return
  keys.forEach((key, i) => {
    scratch.position.set(key.x * UNIT, SWITCH_Y + lift, key.z * UNIT)
    scratch.updateMatrix()
    housings.setMatrixAt(i, scratch.matrix)
    scratch.position.y += 0.038
    scratch.updateMatrix()
    stems.setMatrixAt(i, scratch.matrix)
  })
  housings.instanceMatrix.needsUpdate = true
  stems.instanceMatrix.needsUpdate = true
}

/**
 * Procedural 60% mechanical keyboard in four layers: case, plate, switches
 * (instanced, one draw call each for housings and stems) and keycaps.
 *
 * Animation is driven entirely from refs read in useFrame:
 * - `pressedRef.current` — Set of KeyboardEvent codes currently held down
 * - `explodeRef.current` — 0..1, lifts the layers apart
 * - `glowRef.current`    — 0..1, intensity of the blue underglow strip
 */
export default function MechanicalKeyboard({ pressedRef, explodeRef, glowRef, onKeyDown, onKeyUp, ...groupProps }) {
  const keys = useMemo(() => layoutKeys(), [])
  const capRefs = useRef([])
  const capMaterials = useRef([])
  const press = useRef(keys.map(() => 0))
  const flash = useRef(keys.map(() => 0))
  const jitter = useMemo(
    () => keys.map((_, i) => ({ rx: Math.sin(i * 12.9898) * 0.18, rz: Math.cos(i * 78.233) * 0.18, lift: 0.04 + ((i * 37) % 11) / 110 })),
    [keys],
  )

  const plateRef = useRef(null)
  const housingsRef = useRef(null)
  const stemsRef = useRef(null)
  const glowMaterial = useRef(null)

  const widthWorld = LAYOUT_WIDTH_UNITS * UNIT
  const depthWorld = LAYOUT_ROWS * UNIT
  const caseGeometry = useMemo(() => new RoundedBoxGeometry(widthWorld + 0.16, CASE_HEIGHT, depthWorld + 0.16, 4, 0.045), [widthWorld, depthWorld])
  const glowGeometry = useMemo(() => new RoundedBoxGeometry(widthWorld + 0.2, 0.02, depthWorld + 0.2, 3, 0.05), [widthWorld, depthWorld])

  useLayoutEffect(() => {
    placeSwitches(keys, housingsRef.current, stemsRef.current, 0)
  }, [keys])

  const lastExplode = useRef(-1)

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05)
    const pressed = pressedRef?.current
    const explode = explodeRef?.current ?? 0
    const eased = explode * explode * (3 - 2 * explode)

    keys.forEach((key, i) => {
      const held = pressed?.has(key.code) ? 1 : 0
      press.current[i] = MathUtils.damp(press.current[i], held, held ? 40 : 18, delta)
      if (held) flash.current[i] = 1
      flash.current[i] = MathUtils.damp(flash.current[i], 0, 6, delta)

      const cap = capRefs.current[i]
      if (cap) {
        cap.position.y = CAP_Y - press.current[i] * PRESS_DEPTH + eased * (0.4 + jitter[i].lift)
        cap.rotation.x = eased * jitter[i].rx
        cap.rotation.z = eased * jitter[i].rz
      }
      const material = capMaterials.current[i]
      if (material) material.emissiveIntensity = flash.current[i] * 0.85
    })

    if (Math.abs(eased - lastExplode.current) > 0.0005) {
      lastExplode.current = eased
      if (plateRef.current) plateRef.current.position.y = PLATE_Y + eased * 0.08
      placeSwitches(keys, housingsRef.current, stemsRef.current, eased * 0.2)
    }

    if (glowMaterial.current) glowMaterial.current.emissiveIntensity = (glowRef?.current ?? 0) * 2.4
  })

  return (
    <group {...groupProps}>
      <mesh geometry={glowGeometry} position={[0, 0.006, 0]}>
        <meshStandardMaterial ref={glowMaterial} color="#05070c" emissive={COLORS.glow} emissiveIntensity={0} toneMapped={false} />
      </mesh>

      <mesh geometry={caseGeometry} position={[0, CASE_HEIGHT / 2 + 0.012, 0]} castShadow>
        <meshStandardMaterial color={COLORS.caseGraphite} roughness={0.42} metalness={0.35} />
      </mesh>

      <mesh ref={plateRef} position={[0, PLATE_Y, 0]}>
        <boxGeometry args={[widthWorld + 0.02, 0.012, depthWorld + 0.02]} />
        <meshStandardMaterial color={COLORS.plateMetal} roughness={0.35} metalness={0.8} />
      </mesh>

      <instancedMesh ref={housingsRef} args={[undefined, undefined, keys.length]}>
        <boxGeometry args={[0.112, 0.055, 0.112]} />
        <meshStandardMaterial color={COLORS.switchHousing} roughness={0.6} />
      </instancedMesh>
      <instancedMesh ref={stemsRef} args={[undefined, undefined, keys.length]}>
        <boxGeometry args={[0.036, 0.03, 0.036]} />
        <meshStandardMaterial color={COLORS.switchStem} roughness={0.5} />
      </instancedMesh>

      {keys.map((key, i) => {
        const palette = CAP_COLORS[key.kind]
        return (
          <Keycap
            key={key.code}
            ref={(node) => (capRefs.current[i] = node)}
            materialRef={(node) => (capMaterials.current[i] = node)}
            unit={UNIT}
            widthUnits={key.width}
            color={palette.color}
            legendColor={palette.legend}
            label={key.label}
            wordmark={key.wordmark}
            position={[key.x * UNIT, CAP_Y, key.z * UNIT]}
            onPointerDown={(event) => {
              event.stopPropagation()
              onKeyDown?.(key.code)
            }}
            onPointerUp={() => onKeyUp?.(key.code)}
            onPointerLeave={() => onKeyUp?.(key.code)}
          />
        )
      })}
    </group>
  )
}
