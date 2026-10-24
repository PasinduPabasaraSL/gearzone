/**
 * Joins class values, dropping falsy entries so conditional classes read well
 * at the call site. Deliberately not a Tailwind-aware merge: components keep
 * their base classes minimal and callers pass layout-only overrides.
 */
export function cn(...parts) {
  return parts.flat(Infinity).filter(Boolean).join(' ')
}
