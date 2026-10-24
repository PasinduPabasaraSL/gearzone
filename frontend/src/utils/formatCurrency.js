const CURRENCY = 'LKR'

// Grouped thousands, no decimals: prices in this catalogue are whole rupees.
const formatter = new Intl.NumberFormat('en-LK', {
  style: 'decimal',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

/** Formats a rupee amount for display, e.g. 12990 -> "LKR 12,990". */
export function formatCurrency(amount) {
  const value = Number(amount)
  if (!Number.isFinite(value)) return `${CURRENCY} 0`
  return `${CURRENCY} ${formatter.format(Math.round(value))}`
}

/** Formats without the currency code, for use beside an existing label. */
export function formatAmount(amount) {
  const value = Number(amount)
  if (!Number.isFinite(value)) return '0'
  return formatter.format(Math.round(value))
}

/** Percentage saved when a compare-at price is present, else 0. */
export function discountPercent(price, compareAtPrice) {
  if (!compareAtPrice || compareAtPrice <= price) return 0
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
}
