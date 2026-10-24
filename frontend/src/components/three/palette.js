/**
 * Colours for the 3D scenes, matched to the CSS design tokens (hex values
 * converted from the OKLCH tokens in index.css) so models sit naturally on
 * the page in both themes.
 */
export const COLORS = {
  brand: '#1c5fe3',
  brandBright: '#3878f4',
  glow: '#3b7cff',
  lampWarm: '#ffd6a0',

  caseGraphite: '#1b1e24',
  plateMetal: '#8b929c',
  switchHousing: '#2a2e36',
  switchStem: '#e5484d',

  capLight: '#eceef2',
  capMid: '#b9c0cc',
  legendDark: '#1d2129',
  legendLight: '#ffffff',

  matGraphite: '#2c3038',
  walnut: '#8a5a3b',
  aluminium: '#c4c9d1',
  plasticWhite: '#f3f4f6',
  plasticBlack: '#16181d',
}

/**
 * Lighting targets per theme. Scenes blend between these with a damped
 * 0 (light) → 1 (dark) value, so a theme switch fades the desk lamp and blue
 * underglow in rather than snapping.
 */
export const LIGHTING = {
  light: { hemisphere: 1.15, key: 2.4, environment: 0.85, lamp: 0, glow: 0, shadow: 0.42 },
  dark: { hemisphere: 0.22, key: 0.55, environment: 0.3, lamp: 38, glow: 1, shadow: 0.75 },
}

export function mixLighting(blend) {
  const out = {}
  for (const key of Object.keys(LIGHTING.light)) {
    out[key] = LIGHTING.light[key] + (LIGHTING.dark[key] - LIGHTING.light[key]) * blend
  }
  return out
}
