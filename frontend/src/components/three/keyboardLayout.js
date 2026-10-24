/**
 * 60% ANSI layout (61 keys), matching the K617 Fizz in the catalogue. Each
 * key's `code` is the KeyboardEvent.code it mirrors; widths are in key units
 * and every row sums to 15u.
 */
const k = (code, label, width = 1, kind = 'alpha', extra = {}) => ({ code, label, width, kind, ...extra })

const letters = (codes) => codes.split('').map((c) => k(`Key${c}`, c))

export const KEYBOARD_ROWS = [
  [
    k('Escape', 'Esc', 1, 'accent'),
    ...'1234567890'.split('').map((d) => k(`Digit${d}`, d)),
    k('Minus', '-'),
    k('Equal', '='),
    k('Backspace', 'Backspace', 2, 'mod'),
  ],
  [k('Tab', 'Tab', 1.5, 'mod'), ...letters('QWERTYUIOP'), k('BracketLeft', '['), k('BracketRight', ']'), k('Backslash', '\\', 1.5, 'mod')],
  [k('CapsLock', 'Caps', 1.75, 'mod'), ...letters('ASDFGHJKL'), k('Semicolon', ';'), k('Quote', "'"), k('Enter', 'Enter', 2.25, 'accent')],
  [
    k('ShiftLeft', 'Shift', 2.25, 'mod'),
    ...letters('ZXCVBNM'),
    k('Comma', ','),
    k('Period', '.'),
    k('Slash', '/'),
    k('ShiftRight', 'Shift', 2.75, 'mod'),
  ],
  [
    k('ControlLeft', 'Ctrl', 1.25, 'mod'),
    k('MetaLeft', 'Win', 1.25, 'mod'),
    k('AltLeft', 'Alt', 1.25, 'mod'),
    k('Space', 'GearZoneLK', 6.25, 'alpha', { wordmark: true }),
    k('AltRight', 'Alt', 1.25, 'mod'),
    k('Fn', 'Fn', 1.25, 'mod'),
    k('ContextMenu', 'Menu', 1.25, 'mod'),
    k('ControlRight', 'Ctrl', 1.25, 'mod'),
  ],
]

export const LAYOUT_WIDTH_UNITS = 15
export const LAYOUT_ROWS = KEYBOARD_ROWS.length

/** Flattened keys with their centre position in key units (x right, z towards viewer). */
export function layoutKeys() {
  const keys = []
  KEYBOARD_ROWS.forEach((row, rowIndex) => {
    let cursor = 0
    for (const key of row) {
      keys.push({
        ...key,
        x: cursor + key.width / 2 - LAYOUT_WIDTH_UNITS / 2,
        z: rowIndex + 0.5 - LAYOUT_ROWS / 2,
      })
      cursor += key.width
    }
  })
  return keys
}
