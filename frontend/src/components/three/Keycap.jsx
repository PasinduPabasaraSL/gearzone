import { useMemo } from 'react'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { legendTexture } from './textures'

const geometryCache = new Map()

function capGeometry(width, height, depth, radius) {
  const key = [width, height, depth, radius].map((n) => n.toFixed(4)).join('x')
  if (!geometryCache.has(key)) geometryCache.set(key, new RoundedBoxGeometry(width, height, depth, 3, radius))
  return geometryCache.get(key)
}

/**
 * One keycap: a rounded body plus a legend decal on its top face. Geometry is
 * cached by size, so a whole keyboard shares a handful of geometries.
 * `materialRef` exposes the body material so callers can animate emissive
 * (key-press flash) without re-rendering.
 */
export default function Keycap({
  unit,
  widthUnits = 1,
  height = 0.075,
  gap = 0.018,
  color,
  legendColor,
  label,
  sublabel,
  legendSize,
  wordmark = false,
  materialRef,
  ...groupProps
}) {
  const width = widthUnits * unit - gap
  const depth = unit - gap
  const radius = Math.min(width, depth) * 0.14
  const geometry = capGeometry(width, height, depth, radius)

  const legend = useMemo(
    () =>
      label || sublabel
        ? legendTexture({ label, sublabel, widthUnits, color: legendColor, size: legendSize, wordmark })
        : null,
    [label, sublabel, widthUnits, legendColor, legendSize, wordmark],
  )

  return (
    <group {...groupProps}>
      <mesh geometry={geometry} castShadow>
        <meshStandardMaterial ref={materialRef} color={color} roughness={0.55} metalness={0} emissive="#3b7cff" emissiveIntensity={0} />
      </mesh>
      {legend && (
        <mesh position={[0, height / 2 + 0.0015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[width * 0.94, depth * 0.94]} />
          <meshStandardMaterial map={legend} transparent roughness={0.6} depthWrite={false} polygonOffset polygonOffsetFactor={-2} />
        </mesh>
      )}
    </group>
  )
}
