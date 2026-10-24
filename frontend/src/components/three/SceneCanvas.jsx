import { useRef, useState } from 'react'
import { PerformanceMonitor } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { ACESFilmicToneMapping } from 'three'

function FirstFrameSignal({ onReady }) {
  const signalled = useRef(false)
  useFrame(() => {
    if (signalled.current) return
    signalled.current = true
    // Wait one more frame so the canvas has actually been presented.
    requestAnimationFrame(() => onReady?.())
  })
  return null
}

/**
 * Shared Canvas setup for every scene: transparent background so the page's
 * blueprint grid shows through, capped pixel ratio that drops automatically
 * if the frame rate struggles, and a render loop that only runs while the
 * scene is on screen (`active`), rendering on demand otherwise.
 */
export default function SceneCanvas({ active, onReady, camera, lookAt = [0, 0, 0], label, maxDpr = 1.75, children, ...props }) {
  const [dpr, setDpr] = useState(maxDpr)

  return (
    <Canvas
      dpr={[1, dpr]}
      frameloop={active ? 'always' : 'demand'}
      camera={camera}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl, camera: createdCamera }) => {
        gl.setClearColor(0x000000, 0)
        gl.toneMapping = ACESFilmicToneMapping
        createdCamera.lookAt(...lookAt)
      }}
      role="img"
      aria-label={label}
      {...props}
    >
      <PerformanceMonitor onDecline={() => setDpr(1)} />
      <FirstFrameSignal onReady={onReady} />
      {children}
    </Canvas>
  )
}
