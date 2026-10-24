import { buildImageUrl, PHOTOS } from './media'

/**
 * Storefront categories. `slug` drives the /category/:slug route, and every
 * product references a category by slug so counts stay derived rather than
 * hardcoded.
 *
 * `icon` names a lucide-react export, resolved in CategoryCard, so the data
 * layer stays free of React imports.
 */
export const categories = [
  {
    slug: 'keyboards',
    name: 'Keyboards',
    tagline: 'Mechanical & membrane',
    description:
      'Mechanical and membrane keyboards for typing, work and play — from compact 60% layouts to full-size boards with a number pad.',
    icon: 'Keyboard',
    image: buildImageUrl(PHOTOS.kbMechBlack, { width: 600, height: 450 }),
  },
  {
    slug: 'mouse-pads',
    name: 'Mouse & Mouse Pads',
    tagline: 'Mice, pads & desk mats',
    description:
      'Wired and wireless mice paired with mouse pads, extended desk mats and wrist rests to finish the surface you work on.',
    icon: 'Mouse',
    image: buildImageUrl(PHOTOS.matDarkWithMouse, { width: 600, height: 450 }),
  },
  {
    slug: 'laptop-accessories',
    name: 'Laptop Accessories',
    tagline: 'Stands, sleeves & bags',
    description:
      'Raise your screen to eye level and carry your machine safely with aluminium stands, padded sleeves and everyday laptop bags.',
    icon: 'Laptop',
    image: buildImageUrl(PHOTOS.standSilver, { width: 600, height: 450 }),
  },
  {
    slug: 'cables',
    name: 'Charging & Cables',
    tagline: 'USB-C, Lightning & HDMI',
    description:
      'Braided charging and data cables plus fast wall adapters — USB-C, Lightning and HDMI in the lengths you actually need.',
    icon: 'Cable',
    image: buildImageUrl(PHOTOS.cableUsbWhite, { width: 600, height: 450 }),
  },
  {
    slug: 'audio',
    name: 'Audio',
    tagline: 'Headphones & earbuds',
    description:
      'Over-ear headphones, true wireless earbuds and wired earphones for calls, commutes and long focus sessions.',
    icon: 'Headphones',
    image: buildImageUrl(PHOTOS.headphonesTan, { width: 600, height: 450 }),
  },
  {
    slug: 'phone-accessories',
    name: 'Phone Accessories',
    tagline: 'Stands, holders & mounts',
    description:
      'Desk stands, wireless charging pads and holders that keep your phone visible and charged while you work.',
    icon: 'Smartphone',
    image: buildImageUrl(PHOTOS.phoneStand, { width: 600, height: 450 }),
  },
  {
    slug: 'desk-setup',
    name: 'Desk Setup',
    tagline: 'Build your workspace',
    description:
      'The pieces that tie a desk together — extended mats, cable management, lighting and the small accessories that clear the clutter.',
    icon: 'Monitor',
    image: buildImageUrl(PHOTOS.deskImacHeadphones, { width: 600, height: 450 }),
  },
  {
    slug: 'power',
    name: 'Power',
    tagline: 'Power banks & charging',
    description:
      'Power banks and multi-port chargers sized for a phone top-up, a full day out or a laptop that needs USB-C power delivery.',
    icon: 'BatteryCharging',
    image: buildImageUrl(PHOTOS.powerBankFlatlay, { width: 600, height: 450 }),
  },
  {
    slug: 'hubs-adapters',
    name: 'Hubs & Adapters',
    tagline: 'Expand your ports',
    description:
      'USB-C hubs and adapters that add HDMI, card readers, Ethernet and USB-A ports back to a thin laptop.',
    icon: 'Usb',
    image: buildImageUrl(PHOTOS.hubBlackSevenPort, { width: 600, height: 450 }),
  },
]

export const categoryBySlug = new Map(categories.map((category) => [category.slug, category]))
