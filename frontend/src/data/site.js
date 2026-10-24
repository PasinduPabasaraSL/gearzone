/**
 * Store-wide configuration: navigation, footer and contact details. Mock
 * contact data uses Sri Lankan formats and is not a real business line.
 */
export const STORE = {
  name: 'GearZoneLK',
  tagline: 'Everyday tech. Better gear.',
  phone: '+94 77 123 4567',
  phoneHref: 'tel:+94771234567',
  whatsappHref: 'https://wa.me/94771234567',
  email: 'hello@gearzone.lk',
  address: 'No. 42, Galle Road, Colombo 03',
  hours: 'Mon – Sat, 9.00 am – 7.00 pm',
}

export const ANNOUNCEMENTS = [
  'Islandwide delivery across Sri Lanka',
  'Free delivery on orders over LKR 15,000',
  'Cash on delivery available',
]

export const PRIMARY_NAV = [
  { label: 'Home', to: '/', end: true },
  { label: 'Shop', to: '/shop' },
  { label: 'Categories', to: '/shop', menu: 'categories' },
  { label: 'Deals', to: '/deals' },
  { label: 'New Arrivals', to: '/new-arrivals' },
  { label: 'About', to: '/about' },
]

export const FOOTER_COLUMNS = [
  {
    title: 'Shop',
    links: [
      { label: 'All Products', to: '/shop' },
      { label: 'New Arrivals', to: '/new-arrivals' },
      { label: 'Deals', to: '/deals' },
      { label: 'Desk Setup', to: '/category/desk-setup' },
    ],
  },
  {
    title: 'Customer',
    links: [
      { label: 'Contact Us', to: '/contact' },
      { label: 'FAQs', to: '/contact#faqs' },
      { label: 'Shipping', to: '/contact#shipping' },
      { label: 'Returns', to: '/contact#returns' },
      { label: 'Order Tracking', to: '/contact#tracking' },
    ],
  },
  {
    title: 'GearZoneLK',
    links: [
      { label: 'About Us', to: '/about' },
      { label: 'Our Story', to: '/about#story' },
      { label: 'Privacy Policy', to: '/about#privacy' },
      { label: 'Terms & Conditions', to: '/about#terms' },
    ],
  },
]

export const SOCIAL_LINKS = [
  { name: 'facebook', label: 'Facebook', href: 'https://facebook.com' },
  { name: 'instagram', label: 'Instagram', href: 'https://instagram.com' },
  { name: 'tiktok', label: 'TikTok', href: 'https://tiktok.com' },
  { name: 'whatsapp', label: 'WhatsApp', href: STORE.whatsappHref },
]
