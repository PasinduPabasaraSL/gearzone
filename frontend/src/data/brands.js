/**
 * Brands carried in this sample catalogue.
 *
 * These are placeholder entries for a mock storefront: the descriptions
 * summarise what each brand is generally known for and make no claim about a
 * distribution or reseller arrangement with GearZoneLK.
 */
export const brands = [
  { slug: 'logitech', name: 'Logitech', blurb: 'Mice, keyboards and everyday peripherals.' },
  { slug: 'havit', name: 'Havit', blurb: 'Affordable gaming gear and audio.' },
  { slug: 'ugreen', name: 'UGREEN', blurb: 'Cables, hubs and charging essentials.' },
  { slug: 'baseus', name: 'Baseus', blurb: 'Chargers, power banks and phone accessories.' },
  { slug: 'redragon', name: 'Redragon', blurb: 'Mechanical keyboards and gaming mice.' },
  { slug: 'a4tech', name: 'A4Tech', blurb: 'Dependable entry-level input devices.' },
  { slug: 'rapoo', name: 'Rapoo', blurb: 'Wireless keyboards and quiet mice.' },
  { slug: 'anker', name: 'Anker', blurb: 'Charging, power banks and audio.' },
]

export const brandBySlug = new Map(brands.map((brand) => [brand.slug, brand]))
export const brandNames = brands.map((brand) => brand.name)
