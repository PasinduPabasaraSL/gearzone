import { CanvasTexture, SRGBColorSpace } from 'three'

const FONT_FAMILY = 'Inter, ui-sans-serif, system-ui, sans-serif'
const PX_PER_UNIT = 128
const cache = new Map()

/**
 * Resolves once Inter is available to canvas drawing, so keycap legends are
 * rendered in the brand font. Pass to React's `use()` to suspend a scene.
 */
let fontPromise
export function fontsReady() {
  fontPromise ??= Promise.all([
    document.fonts.load(`600 48px Inter`),
    document.fonts.load(`800 48px Inter`),
  ]).catch(() => undefined)
  return fontPromise
}

/**
 * Transparent texture holding one keycap legend. Single characters are
 * centred; words (Tab, Shift…) sit bottom-left like a real keycap. Cached by
 * content so identical legends share a texture.
 */
export function legendTexture({ label = '', sublabel = '', widthUnits = 1, color = '#1d2129', size = 'auto', wordmark = false }) {
  const key = [label, sublabel, widthUnits, color, size, wordmark].join('|')
  if (cache.has(key)) return cache.get(key)

  const width = Math.round(PX_PER_UNIT * widthUnits)
  const height = PX_PER_UNIT
  const canvas = document.createElement('canvas')
  canvas.width = width * 2
  canvas.height = height * 2
  const ctx = canvas.getContext('2d')
  ctx.scale(2, 2)
  ctx.fillStyle = color
  ctx.textBaseline = 'middle'

  if (wordmark) {
    ctx.font = `800 34px ${FONT_FAMILY}`
    ctx.textAlign = 'center'
    ctx.globalAlpha = 0.6
    ctx.fillText(label, width / 2, height / 2)
  } else if (label.length <= 1 || size === 'large') {
    ctx.font = `700 ${size === 'large' ? 72 : 60}px ${FONT_FAMILY}`
    ctx.textAlign = 'center'
    ctx.fillText(label, width / 2, sublabel ? height * 0.6 : height / 2)
    if (sublabel) {
      ctx.font = `600 30px ${FONT_FAMILY}`
      ctx.globalAlpha = 0.6
      ctx.fillText(sublabel, width / 2, height * 0.28)
    }
  } else {
    ctx.font = `700 30px ${FONT_FAMILY}`
    ctx.textAlign = 'left'
    ctx.fillText(label, 16, height - 28)
  }

  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  texture.anisotropy = 4
  cache.set(key, texture)
  return texture
}

/** Soft radial gradient used for the blue underglow halo. */
export function glowTexture(color = '#3b7cff') {
  const key = `glow|${color}`
  if (cache.has(key)) return cache.get(key)
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  gradient.addColorStop(0, color)
  gradient.addColorStop(0.45, `${color}66`)
  gradient.addColorStop(1, `${color}00`)
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  cache.set(key, texture)
  return texture
}

/** Laptop screen: a calm brand-blue gradient with a faint dot grid. */
export function screenTexture() {
  const key = 'screen'
  if (cache.has(key)) return cache.get(key)
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 320
  const ctx = canvas.getContext('2d')
  const gradient = ctx.createLinearGradient(0, 0, 512, 320)
  gradient.addColorStop(0, '#0d1b3d')
  gradient.addColorStop(0.55, '#1c5fe3')
  gradient.addColorStop(1, '#7fb0ff')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 512, 320)
  ctx.fillStyle = 'rgba(255,255,255,0.12)'
  for (let x = 16; x < 512; x += 22) for (let y = 16; y < 320; y += 22) ctx.fillRect(x, y, 2, 2)
  ctx.fillStyle = '#ffffff'
  ctx.font = `800 40px ${FONT_FAMILY}`
  ctx.textBaseline = 'middle'
  ctx.fillText('GearZoneLK', 40, 160)
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  cache.set(key, texture)
  return texture
}
