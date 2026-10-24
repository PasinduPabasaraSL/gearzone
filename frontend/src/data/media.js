/**
 * Single source of truth for product imagery.
 *
 * Images are currently served from the Unsplash CDN. Every URL in the app is
 * built here, so pointing the storefront at a real product-image CDN later
 * means changing `CDN_BASE` and `buildImageUrl` only — no component or product
 * record needs to be touched.
 *
 * Each PHOTOS entry was checked against the live CDN and reviewed so the
 * subject matches the products that reference it.
 */
const CDN_BASE = 'https://images.unsplash.com'
const DEFAULT_QUALITY = 75
const SRCSET_WIDTHS = [320, 480, 640, 800, 1200]

export const PHOTOS = {
  // Keyboards
  kbMechBlack: 'photo-1618384887929-16ec33fab9ef',
  kbKeycapsBright: 'photo-1595225476474-87563907a212',
  kbKeycapsPastel: 'photo-1601445638532-3c6f6c3aa1d6',
  kbCream: 'photo-1625948515291-69613efd103f',
  kbSwitches: 'photo-1595044426077-d36d9236d54a',
  kbRgbGaming: 'photo-1636036824578-d0d300a4effb',
  kbSlimWhite: 'photo-1541140532154-b024d705b90a',
  kbSlimSilver: 'photo-1587829741301-dc798b83add3',
  kbWhiteDesk: 'photo-1511467687858-23d96c32e4ae',
  kbOnDeskMat: 'photo-1743862558369-5dcea79ccbff',

  // Mice
  mouseGaming: 'photo-1563297007-0686b7003af7',
  mouseWirelessCream: 'photo-1527814050087-3793815479db',
  mouseBlackMinimal: 'photo-1615663245857-ac93bb7c39e7',
  mouseGrey: 'photo-1527864550417-7fd91fc51a46',

  // Mouse pads and desk mats
  matDarkWithMouse: 'photo-1629317297639-9201108cca3c',
  matGreen: 'photo-1641057350241-c05da7c70a9f',
  matGrey: 'photo-1641057350183-48d58af53b12',
  matWarm: 'photo-1641057349981-48bdca8fe870',
  padGamingSetup: 'photo-1629429407759-01cd3d7cfb38',

  // Cables
  cableUsbWhite: 'photo-1596570689888-52906bdd68a9',
  cableBlackConnectors: 'photo-1649959223405-f927e0fc1e05',

  // Chargers
  chargerWallWhite: 'photo-1586254117143-faa8f0a09bc6',
  chargerCoiled: 'photo-1583863788434-e58a36330cf0',
  chargerWireless: 'photo-1575543419095-0b090628213f',

  // Hubs and adapters
  hubBlackSevenPort: 'photo-1760376789487-994070337c76',
  hubBlackWithCable: 'photo-1760376789478-c1023d2dc007',

  // Power banks
  powerBankHeld: 'photo-1617671536627-ad3218167479',
  powerBankFlatlay: 'photo-1564286026321-4e3ad4d6022d',
  powerBankSlim: 'photo-1609091839311-d5365f9ff1c5',

  // Laptop stands
  standBlackRiser: 'photo-1652198144911-4f204ccf35e6',
  standSilver: 'photo-1629317480826-910f729d1709',
  standMinimal: 'photo-1629317480872-45e07211ffd4',
  standWood: 'photo-1575399545768-5f1840c1312d',
  standWithMonitor: 'photo-1623567238235-940ff1311da7',

  // Laptop sleeves and bags
  sleeveBeige: 'photo-1602414975697-62e63811999a',
  sleeveGreyFelt: 'photo-1611461527944-1a718332613b',
  sleeveGreyBench: 'photo-1720048169586-6750c7863d8c',
  sleeveHeld: 'photo-1587614387466-0a72ca909e16',
  bagLeather: 'photo-1510682469697-f2953374f076',
  bagBriefcase: 'photo-1643033998435-dd69a55811be',
  backpackNavy: 'photo-1553062407-98eeb64c6a62',
  backpackBlack: 'photo-1581605405669-fcdf81165afa',

  // Audio
  headphonesYellow: 'photo-1505740420928-5e560c06d30e',
  headphonesWhiteBg: 'photo-1583394838336-acd977736f90',
  headphonesTan: 'photo-1618366712010-f4ae9c647dcb',
  headphonesStudio: 'photo-1546435770-a3e426bf472b',
  headphonesRoseGold: 'photo-1613040809024-b4ef7ba99bc3',
  earbudsCases: 'photo-1590658268037-6bf12165a8df',
  earbudsPurple: 'photo-1606220945770-b5b6c2c55bf1',
  earbudsWhite: 'photo-1600294037681-c80b4cb5b434',
  earbudsPro: 'photo-1572569511254-d8f925fe2cbb',
  earphonesWired: 'photo-1608156639585-b3a032ef9689',

  // Phone accessories
  phoneStand: 'photo-1698314440014-3badb1e9c938',
  phoneWithEarbuds: 'photo-1592899677977-9c10ca588bbd',
  phoneDark: 'photo-1592750475338-74b7b21085ab',
  phoneOnLaptop: 'photo-1511707171634-5f897ff02aa9',

  // Desk setups, used by category and editorial sections
  deskImacHeadphones: 'photo-1616763355603-9755a640a287',
  deskPurpleLight: 'photo-1547082299-de196ea013d6',
  deskMonitorKeyboard: 'photo-1587831990711-23ca6441447b',
  deskLaptopLamp: 'photo-1522199755839-a2bacb67c546',
  deskWood: 'photo-1484788984921-03950022c9ef',
  deskGaming: 'photo-1593305841991-05c297ba4575',
}

/**
 * Builds a single CDN URL. Square crops are requested by default so product
 * photography fills its tile without ever being stretched.
 */
export function buildImageUrl(photoId, { width = 800, height = width, quality } = {}) {
  const params = new URLSearchParams({
    auto: 'format',
    fit: 'crop',
    w: String(width),
    h: String(height),
    q: String(quality ?? DEFAULT_QUALITY),
  })
  return `${CDN_BASE}/${photoId}?${params.toString()}`
}

/** Width-descriptor srcset so browsers can pick an appropriate resolution. */
export function buildSrcSet(photoId, { aspect = 1, widths = SRCSET_WIDTHS } = {}) {
  return widths
    .map(
      (width) =>
        `${buildImageUrl(photoId, { width, height: Math.round(width / aspect) })} ${width}w`,
    )
    .join(', ')
}

/**
 * Turns image keys from a product record into renderable descriptors. Doing
 * this at the data boundary means components only ever handle plain URLs,
 * which is exactly what a real API would return.
 */
export function resolveImages(keys) {
  return keys.map((key) => {
    const photoId = PHOTOS[key]
    if (!photoId) throw new Error(`Unknown product photo key: ${key}`)
    return {
      id: key,
      src: buildImageUrl(photoId, { width: 800 }),
      srcSet: buildSrcSet(photoId),
      thumbnail: buildImageUrl(photoId, { width: 200 }),
      large: buildImageUrl(photoId, { width: 1600, quality: 80 }),
    }
  })
}
