/**
 * Checkout configuration. Payment methods are declared here so a real
 * gateway can be wired in by flipping `available` and attaching a handler in
 * the checkout service, without restructuring the page.
 */
export const PAYMENT_METHODS = [
  {
    id: 'cod',
    label: 'Cash on Delivery',
    description: 'Pay in cash when your order arrives.',
    available: true,
  },
  {
    id: 'bank',
    label: 'Bank Transfer',
    description: 'We’ll share our bank details after you place the order.',
    available: true,
  },
  {
    id: 'online',
    label: 'Online Payment',
    description: 'Visa, Mastercard and Amex through a secure payment page.',
    available: false,
  },
]

export const SRI_LANKA_DISTRICTS = [
  'Ampara',
  'Anuradhapura',
  'Badulla',
  'Batticaloa',
  'Colombo',
  'Galle',
  'Gampaha',
  'Hambantota',
  'Jaffna',
  'Kalutara',
  'Kandy',
  'Kegalle',
  'Kilinochchi',
  'Kurunegala',
  'Mannar',
  'Matale',
  'Matara',
  'Monaragala',
  'Mullaitivu',
  'Nuwara Eliya',
  'Polonnaruwa',
  'Puttalam',
  'Ratnapura',
  'Trincomalee',
  'Vavuniya',
]
