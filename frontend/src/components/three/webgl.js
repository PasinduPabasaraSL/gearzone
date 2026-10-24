let cached

/**
 * True when the browser can create a WebGL context. Checked once and cached;
 * disabled GPUs, blocklisted drivers and some privacy modes return false.
 */
export function hasWebGL() {
  if (cached !== undefined) return cached
  try {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('webgl2') ?? canvas.getContext('webgl')
    cached = Boolean(context)
    context?.getExtension('WEBGL_lose_context')?.loseContext()
  } catch {
    cached = false
  }
  return cached
}
