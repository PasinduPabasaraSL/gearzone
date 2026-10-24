import { useEffect, useMemo } from 'react'
import { useThree } from '@react-three/fiber'
import { BackSide, BoxGeometry, Color, Mesh, MeshBasicMaterial, PlaneGeometry, PMREMGenerator, Scene } from 'three'
import { COLORS } from './palette'

const PANELS = [
  { color: '#ffffff', intensity: 3.2, size: [8, 3], position: [0, 4, 1.5], rotation: [Math.PI / 2, 0, 0] },
  { color: '#ffffff', intensity: 1.1, size: [3, 4], position: [-4, 1.5, 2], rotation: [0, Math.PI / 2, 0] },
  { color: COLORS.brandBright, intensity: 0.9, size: [3, 3], position: [4, 1, -1], rotation: [0, -Math.PI / 2, 0] },
]

/**
 * Soft studio reflections without an HDR download: a few emissive panels in
 * a dim room, pre-filtered once with PMREMGenerator and attached as the
 * scene environment. (drei's <Environment> would pull in EXR/RGBE/gain-map
 * loaders this site never uses.)
 */
export default function StudioEnvironment() {
  const gl = useThree((state) => state.gl)

  const target = useMemo(() => {
    const room = new Scene()
    const disposables = []
    const box = new BoxGeometry(14, 10, 14)
    const walls = new MeshBasicMaterial({ color: '#15171c', side: BackSide })
    room.add(new Mesh(box, walls))
    disposables.push(box, walls)

    for (const panel of PANELS) {
      const geometry = new PlaneGeometry(...panel.size)
      const material = new MeshBasicMaterial({ color: new Color(panel.color).multiplyScalar(panel.intensity), toneMapped: false })
      const mesh = new Mesh(geometry, material)
      mesh.position.set(...panel.position)
      mesh.rotation.set(...panel.rotation)
      room.add(mesh)
      disposables.push(geometry, material)
    }

    const pmrem = new PMREMGenerator(gl)
    const renderTarget = pmrem.fromScene(room, 0.03)
    pmrem.dispose()
    disposables.forEach((item) => item.dispose())
    return renderTarget
  }, [gl])

  useEffect(() => () => target.dispose(), [target])

  return <primitive object={target.texture} attach="environment" />
}
