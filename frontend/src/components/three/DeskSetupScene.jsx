import { useEffect, useRef, useState } from 'react'
import { ContactShadows, Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { MathUtils } from 'three'
import { useNavigate } from 'react-router-dom'
import {
  CABLE_RADIAL_SEGMENTS,
  CABLE_SEGMENTS,
  Cable,
  DeskLamp,
  DeskMat,
  DeskSurface,
  HeadphoneStand,
  Mouse,
  SlimKeyboard,
  StandWithLaptop,
} from './deskModels'
import SceneCanvas from './SceneCanvas'
import ThemeLights from './ThemeLights'
import { useThemeBlend } from './useThemeBlend'
import { SETUP_ITEMS } from '../../data/editorial'
import { formatCurrency } from '../../utils/formatCurrency'

const LAMP_HEAD = [-0.55, 1.0, -0.67]

/** Where each product sits on the desk, and where its pin floats. */
const PLACEMENT = {
  mat: { position: [-1.6, 0, 0.45], anchor: [-1.15, 0.06, 0.95] },
  stand: { position: [0.15, 0, -0.45], anchor: [0.15, 0.24, -0.02] },
  keyboard: { position: [0, 0.022, 0.55], anchor: [0, 0.09, 0.55] },
  mouse: { position: [1.25, 0.022, 0.6], anchor: [1.25, 0.14, 0.6] },
  headphones: { position: [-1.85, 0, -0.45], anchor: [-1.85, 1.0, -0.45] },
  cable: { position: [0, 0, 0], anchor: [1.75, 0.07, -0.25] },
}

const STAGGER = 0.1
const SPAN = 0.34
const easeOutCubic = (t) => 1 - (1 - t) ** 3
const easeOutBack = (t) => 1 + 2.2 * (t - 1) ** 3 + 1.2 * (t - 1) ** 2

/** Scroll progress of the canvas through the viewport: 0 entering, 1 centred. */
function useScrollProgress() {
  const progress = useRef(0)
  useFrame((state, delta) => {
    const rect = state.gl.domElement.getBoundingClientRect()
    const viewport = window.innerHeight
    const start = viewport * 0.92
    const end = viewport * 0.5 - rect.height * 0.5
    const target = MathUtils.clamp((start - rect.top) / Math.max(1, start - end), 0, 1)
    progress.current = MathUtils.damp(progress.current, target, 5, Math.min(delta, 0.05))
  })
  return progress
}

function AssembledItem({ itemKey, index, progress, active, onHover, onSelect, children, cableRef }) {
  const group = useRef(null)
  const lift = useRef(0)

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05)
    const t = MathUtils.clamp((progress.current - index * STAGGER) / SPAN, 0, 1)
    const g = group.current
    if (!g) return

    lift.current = MathUtils.damp(lift.current, active ? 1 : 0, 10, delta)
    g.visible = t > 0.001

    if (itemKey === 'mat') {
      g.scale.x = Math.max(0.001, easeOutCubic(t))
    } else if (itemKey === 'cable') {
      const segments = Math.floor(easeOutCubic(t) * CABLE_SEGMENTS)
      cableRef.current?.setDrawRange(0, segments * CABLE_RADIAL_SEGMENTS * 6)
    } else {
      const eased = easeOutBack(t)
      g.position.y = PLACEMENT[itemKey].position[1] + (1 - eased) * 1.1 + lift.current * 0.06
      g.scale.setScalar(0.85 + 0.15 * Math.min(1, eased))
    }
  })

  return (
    <group
      ref={group}
      position={PLACEMENT[itemKey].position}
      onPointerOver={(event) => {
        event.stopPropagation()
        document.body.style.cursor = 'pointer'
        onHover(itemKey)
      }}
      onPointerOut={() => {
        document.body.style.cursor = ''
        onHover(null)
      }}
      onClick={(event) => {
        event.stopPropagation()
        onSelect(itemKey)
      }}
    >
      {children}
    </group>
  )
}

/** DOM pin + card floating over an assembled item (rendered via drei <Html>). */
function Hotspot({ item, active, onHover, onSelect }) {
  const href = `/product/${item.slug}`
  return (
    <Html position={PLACEMENT[item.key].anchor} center zIndexRange={[30, 10]}>
      <div className="relative" onMouseEnter={() => onHover(item.key)} onMouseLeave={() => onHover(null)}>
        <a
          href={href}
          onClick={(event) => {
            event.preventDefault()
            onSelect(item.key)
          }}
          onFocus={() => onHover(item.key)}
          onBlur={() => onHover(null)}
          aria-label={`${item.label}: ${item.name}, ${formatCurrency(item.price)}`}
          className={`grid h-7 w-7 place-items-center rounded-full border-2 border-white text-sm font-bold text-white shadow-lg transition-all duration-200 ${active ? 'scale-110 bg-[#1c5fe3]' : 'bg-black/50 backdrop-blur-sm hover:bg-[#1c5fe3]'}`}
        >
          <span aria-hidden="true" className={`transition-transform ${active ? 'rotate-45' : ''}`}>
            +
          </span>
        </a>
        {active && (
          <div className="animate-scale-in pointer-events-none absolute top-9 left-1/2 w-52 -translate-x-1/2 rounded-card border border-white/10 bg-strip-raised/95 p-3 text-left shadow-panel backdrop-blur-md">
            <p className="micro-label text-on-strip-muted">{item.label}</p>
            <p className="mt-1.5 text-[13px] leading-snug font-semibold text-on-strip">{item.name}</p>
            <p className="tabular mt-1 text-[13px] font-bold text-brand-300">{formatCurrency(item.price)}</p>
          </div>
        )}
      </div>
    </Html>
  )
}

function Desk({ activeKey, onHover, onSelect }) {
  const blend = useThemeBlend()
  const progress = useScrollProgress()
  const bulb = useRef(null)
  const screen = useRef(null)
  const cable = useRef(null)
  const rig = useRef(null)
  const pointer = useRef(0)
  const [assembled, setAssembled] = useState(0)

  useEffect(() => {
    const onMove = (event) => {
      pointer.current = (event.clientX / window.innerWidth) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05)
    if (bulb.current) bulb.current.emissiveIntensity = blend.current * 4
    if (screen.current) screen.current.emissiveIntensity = 0.75 + blend.current * 0.6
    if (rig.current) rig.current.rotation.y = MathUtils.damp(rig.current.rotation.y, pointer.current * 0.08, 3, delta)

    // Pins appear once their item has landed; update React only on change.
    const landed = SETUP_ITEMS.filter((_, i) => progress.current - i * STAGGER >= SPAN * 0.95).length
    if (landed !== assembled) setAssembled(landed)
  })

  return (
    <>
      <ThemeLights blend={blend} lampPosition={LAMP_HEAD} lampAngle={0.8} />
      <group ref={rig}>
        <DeskSurface />
        <group position={[-1.25, 0, -0.95]}>
          <DeskLamp bulbRef={bulb} />
        </group>

        {SETUP_ITEMS.map((item, index) => (
          <AssembledItem
            key={item.key}
            itemKey={item.key}
            index={index}
            progress={progress}
            active={activeKey === item.key}
            onHover={onHover}
            onSelect={onSelect}
            cableRef={cable}
          >
            {item.key === 'mat' && <DeskMat />}
            {item.key === 'stand' && <StandWithLaptop screenRef={screen} />}
            {item.key === 'keyboard' && <SlimKeyboard />}
            {item.key === 'mouse' && <Mouse />}
            {item.key === 'headphones' && <HeadphoneStand />}
            {item.key === 'cable' && <Cable geometryRef={cable} />}
          </AssembledItem>
        ))}

        {SETUP_ITEMS.slice(0, assembled).map((item) => (
          <Hotspot key={item.key} item={item} active={activeKey === item.key} onHover={onHover} onSelect={onSelect} />
        ))}

        <ContactShadows position={[0, 0.001, 0]} opacity={0.55} scale={7} blur={2.2} far={1.6} resolution={512} color="#000000" />
      </group>
    </>
  )
}

/**
 * "Build Your Setup" 3D scene: as the section scrolls into view the desk mat
 * unrolls, then the stand and laptop, keyboard, mouse, headphones and cable
 * land one after another. Hover an item (or its row in the parts list) to
 * highlight it; click to open the product. In dark mode the desk lamp
 * switches on and the laptop screen glows brighter.
 */
export default function DeskSetupScene({ active, onReady, activeKey, onActiveChange }) {
  const navigate = useNavigate()
  const select = (key) => {
    const item = SETUP_ITEMS.find((entry) => entry.key === key)
    if (item) {
      document.body.style.cursor = ''
      navigate(`/product/${item.slug}`)
    }
  }

  useEffect(
    () => () => {
      document.body.style.cursor = ''
    },
    [],
  )

  return (
    <SceneCanvas
      active={active}
      onReady={onReady}
      camera={{ position: [0, 3.1, 4.2], fov: 32, near: 0.1, far: 40 }}
      lookAt={[0, 0.25, 0]}
      label="3D desk setup with a desk mat, laptop stand, keyboard, mouse, headphones and cable"
    >
      <Desk activeKey={activeKey} onHover={onActiveChange} onSelect={select} />
    </SceneCanvas>
  )
}
