/**
 * Shipping, returns and warranty copy shown on product pages and the contact
 * page. Kept as data so policy wording changes in one place.
 */
export const SHIPPING_POLICY = [
  { region: 'Colombo & suburbs', time: '1–2 working days' },
  { region: 'Other districts', time: '2–4 working days' },
  { region: 'Northern & Eastern provinces', time: '3–5 working days' },
]

export const RETURNS_SUMMARY =
  'Unused items in original packaging can be returned within 7 days of delivery. Faulty items are replaced or refunded.'

const WARRANTY_BY_CATEGORY = {
  keyboards: '1 year warranty against manufacturing defects',
  'mouse-pads': '6 months warranty against manufacturing defects',
  'laptop-accessories': '6 months warranty against manufacturing defects',
  cables: '1 year warranty — replace on fault',
  audio: '1 year warranty against manufacturing defects',
  'phone-accessories': '6 months warranty against manufacturing defects',
  'desk-setup': '6 months warranty against manufacturing defects',
  power: '1 year warranty against battery and manufacturing defects',
  'hubs-adapters': '1 year warranty against manufacturing defects',
}

export function warrantyFor(categorySlug) {
  return WARRANTY_BY_CATEGORY[categorySlug] ?? '6 months warranty against manufacturing defects'
}
