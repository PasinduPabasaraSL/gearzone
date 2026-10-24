import { buildImageUrl, PHOTOS } from './media'
import { products } from './products'

/**
 * Art-directed homepage content. Product references are by slug and resolved
 * against the catalogue here, so names and prices shown in editorial
 * sections always match the product pages.
 */
function pick(slug) {
  const product = products.find((p) => p.slug === slug)
  if (!product) throw new Error(`Editorial content references unknown product: ${slug}`)
  return { slug, name: product.name, brand: product.brand, price: product.price, image: product.images[0] }
}

export const HERO_PICKS = {
  primary: pick('redragon-k617-fizz-60-mechanical-keyboard'),
  secondary: pick('logitech-g502-hero-gaming-mouse'),
  tertiary: pick('anker-soundcore-q30-anc-headphones'),
}

/**
 * Items placed on the "Build Your Setup" desk, in assembly order. `spot`
 * positions a pin on the static fallback photo (percent of width/height) and
 * is null for items not visible in that photo; the 3D scene uses `key` to
 * attach each product to its modelled object.
 */
export const SETUP_ITEMS = [
  { key: 'mat', label: 'Desk Mat', spot: { x: 14, y: 82 }, ...pick('ugreen-xl-extended-desk-mat-graphite') },
  { key: 'stand', label: 'Laptop Stand', spot: { x: 62, y: 46 }, ...pick('anker-walnut-laptop-stand') },
  { key: 'keyboard', label: 'Keyboard', spot: { x: 44, y: 74 }, ...pick('rapoo-e9800m-wireless-slim-keyboard') },
  { key: 'mouse', label: 'Mouse', spot: null, ...pick('logitech-pebble-wireless-silent-mouse') },
  { key: 'headphones', label: 'Headphones', spot: { x: 18, y: 31 }, ...pick('anker-soundcore-q30-anc-headphones') },
  { key: 'cable', label: 'USB-C Cable', spot: null, ...pick('ugreen-usb-c-to-usb-c-100w-braided-cable') },
]

export const SETUP_BACKDROP = buildImageUrl(PHOTOS.matGrey, { width: 1400, height: 900 })
