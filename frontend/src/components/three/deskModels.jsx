import { useLayoutEffect, useMemo, useRef } from 'react'
import { CatmullRomCurve3, Object3D, Shape, Vector3 } from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { COLORS } from './palette'
import { screenTexture } from './textures'

/**
 * Procedural desk objects for the "Build Your Setup" scene. Each model is
 * built around its own origin so the scene can animate it as one unit.
 */

function useRoundedBox(width, height, depth, radius, segments = 3) {
  return useMemo(() => new RoundedBoxGeometry(width, height, depth, segments, radius), [width, height, depth, radius, segments])
}

export function DeskSurface() {
  const geometry = useRoundedBox(4.9, 0.12, 2.5, 0.04)
  return (
    <mesh geometry={geometry} position={[0, -0.06, 0]} receiveShadow>
      <meshStandardMaterial color="#6f4a33" roughness={0.7} metalness={0} />
    </mesh>
  )
}

/** Extended desk mat. Its parent scales X from the left edge to "unroll" it. */
export function DeskMat() {
  const geometry = useRoundedBox(3.6, 0.022, 1.45, 0.01, 2)
  return (
    <mesh geometry={geometry} position={[1.8, 0.011, 0]}>
      <meshStandardMaterial color={COLORS.matGraphite} roughness={0.95} />
    </mesh>
  )
}

/** Curved walnut riser with a laptop on top. */
export function StandWithLaptop({ screenRef }) {
  const arch = useMemo(() => {
    const outer = 0.5
    const inner = 0.45
    const shape = new Shape()
    shape.absarc(0, 0, outer, Math.PI * 0.08, Math.PI * 0.92, false)
    shape.absarc(0, 0, inner, Math.PI * 0.92, Math.PI * 0.08, true)
    shape.closePath()
    return shape
  }, [])
  const base = useRoundedBox(1.22, 0.035, 0.82, 0.02)
  const lid = useRoundedBox(1.22, 0.78, 0.028, 0.025)
  const screen = screenTexture()

  return (
    <group>
      {/* Bridge profile faces the viewer and is extruded front-to-back. */}
      <mesh position={[0, 0, -0.42]} scale={[1.36, 0.86, 1]}>
        <extrudeGeometry args={[arch, { depth: 0.84, bevelEnabled: true, bevelSize: 0.008, bevelThickness: 0.008, bevelSegments: 2, curveSegments: 40 }]} />
        <meshStandardMaterial color={COLORS.walnut} roughness={0.55} />
      </mesh>
      <group position={[0, 0.45, 0.02]}>
        <mesh geometry={base} position={[0, 0.0175, 0]}>
          <meshStandardMaterial color={COLORS.aluminium} roughness={0.32} metalness={0.75} />
        </mesh>
        <group position={[0, 0.035, -0.4]} rotation={[-0.22, 0, 0]}>
          <mesh geometry={lid} position={[0, 0.39, -0.014]}>
            <meshStandardMaterial color={COLORS.aluminium} roughness={0.32} metalness={0.75} />
          </mesh>
          <mesh position={[0, 0.4, 0.001]}>
            <planeGeometry args={[1.12, 0.68]} />
            <meshStandardMaterial ref={screenRef} color="#000000" emissive="#ffffff" emissiveMap={screen} emissiveIntensity={0.9} toneMapped={false} />
          </mesh>
        </group>
      </group>
    </group>
  )
}

/** Low-profile wireless keyboard: aluminium tray plus instanced keys. */
export function SlimKeyboard() {
  const tray = useRoundedBox(1.5, 0.03, 0.5, 0.02)
  const keysRef = useRef(null)
  const COLUMNS = 15
  const ROWS = 5

  useLayoutEffect(() => {
    const dummy = new Object3D()
    let index = 0
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLUMNS; col++) {
        dummy.position.set(-0.665 + col * 0.095, 0.035, -0.18 + row * 0.09)
        dummy.updateMatrix()
        keysRef.current.setMatrixAt(index++, dummy.matrix)
      }
    }
    keysRef.current.instanceMatrix.needsUpdate = true
  }, [])

  return (
    <group>
      <mesh geometry={tray} position={[0, 0.015, 0]}>
        <meshStandardMaterial color={COLORS.aluminium} roughness={0.35} metalness={0.7} />
      </mesh>
      <instancedMesh ref={keysRef} args={[undefined, undefined, COLUMNS * ROWS]}>
        <boxGeometry args={[0.08, 0.014, 0.074]} />
        <meshStandardMaterial color={COLORS.plasticWhite} roughness={0.6} />
      </instancedMesh>
    </group>
  )
}

export function Mouse() {
  return (
    <mesh position={[0, 0.045, 0]} scale={[1, 0.42, 1.55]}>
      <sphereGeometry args={[0.11, 40, 24]} />
      <meshStandardMaterial color={COLORS.plasticWhite} roughness={0.45} />
    </mesh>
  )
}

/** Over-ear headphones resting on a walnut-and-metal stand. */
export function HeadphoneStand() {
  return (
    <group>
      <mesh position={[0, 0.012, 0]}>
        <cylinderGeometry args={[0.17, 0.18, 0.024, 40]} />
        <meshStandardMaterial color={COLORS.plasticBlack} roughness={0.4} metalness={0.5} />
      </mesh>
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[0.07, 0.78, 0.07]} />
        <meshStandardMaterial color={COLORS.walnut} roughness={0.55} />
      </mesh>
      {/* Headband faces the viewer so the silhouette reads as headphones. */}
      <group position={[0, 0.79, 0]}>
        <mesh>
          <torusGeometry args={[0.2, 0.026, 16, 48, Math.PI]} />
          <meshStandardMaterial color="#2a2e36" roughness={0.45} metalness={0.3} />
        </mesh>
        {[-1, 1].map((side) => (
          <group key={side} position={[side * 0.205, -0.06, 0]}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.105, 0.105, 0.075, 40]} />
              <meshStandardMaterial color="#30343d" roughness={0.5} metalness={0.25} />
            </mesh>
            <mesh position={[-side * 0.042, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
              <torusGeometry args={[0.078, 0.022, 12, 32]} />
              <meshStandardMaterial color="#15171c" roughness={0.9} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  )
}

/**
 * Braided USB-C cable from the laptop to the desk edge. The scene animates
 * the tube's draw range through `geometryRef` so it appears to lay itself.
 */
export const CABLE_SEGMENTS = 160
export const CABLE_RADIAL_SEGMENTS = 10

export function Cable({ geometryRef }) {
  const curve = useMemo(
    () =>
      new CatmullRomCurve3([
        new Vector3(0.77, 0.47, -0.32),
        new Vector3(0.82, 0.35, -0.35),
        new Vector3(0.9, 0.03, -0.2),
        new Vector3(1.25, 0.02, -0.05),
        new Vector3(1.75, 0.02, -0.25),
        new Vector3(2.15, 0.02, -0.75),
      ]),
    [],
  )
  const end = curve.getPoint(1)
  const tangent = curve.getTangent(1)

  return (
    <group>
      <mesh>
        <tubeGeometry ref={geometryRef} args={[curve, CABLE_SEGMENTS, 0.014, CABLE_RADIAL_SEGMENTS, false]} />
        <meshStandardMaterial color="#f2f3f5" roughness={0.6} />
      </mesh>
      <mesh position={end} rotation={[0, Math.atan2(tangent.x, tangent.z), 0]}>
        <boxGeometry args={[0.05, 0.03, 0.11]} />
        <meshStandardMaterial color="#f2f3f5" roughness={0.4} />
      </mesh>
    </group>
  )
}

/** Desk lamp whose bulb glows in dark mode; `bulbRef` exposes the bulb material. */
export function DeskLamp({ bulbRef }) {
  return (
    <group>
      <mesh position={[0, 0.015, 0]}>
        <cylinderGeometry args={[0.16, 0.18, 0.03, 40]} />
        <meshStandardMaterial color={COLORS.plasticBlack} roughness={0.35} metalness={0.6} />
      </mesh>
      <mesh position={[0.08, 0.42, 0]} rotation={[0, 0, -0.38]}>
        <cylinderGeometry args={[0.018, 0.018, 0.85, 16]} />
        <meshStandardMaterial color={COLORS.plasticBlack} roughness={0.35} metalness={0.6} />
      </mesh>
      <mesh position={[0.42, 0.86, 0.12]} rotation={[0.35, 0, -1.1]}>
        <cylinderGeometry args={[0.016, 0.016, 0.62, 16]} />
        <meshStandardMaterial color={COLORS.plasticBlack} roughness={0.35} metalness={0.6} />
      </mesh>
      <group position={[0.7, 1.0, 0.28]} rotation={[0.55, 0, -0.45]}>
        <mesh>
          <coneGeometry args={[0.13, 0.2, 32, 1, true]} />
          <meshStandardMaterial color={COLORS.plasticBlack} roughness={0.35} metalness={0.6} side={2} />
        </mesh>
        <mesh position={[0, -0.06, 0]}>
          <sphereGeometry args={[0.055, 24, 16]} />
          <meshStandardMaterial ref={bulbRef} color="#fff4dd" emissive={COLORS.lampWarm} emissiveIntensity={0} toneMapped={false} />
        </mesh>
      </group>
    </group>
  )
}
