import Badge from '../common/Badge'

const TONE_BY_BADGE = {
  NEW: 'contrast',
  SALE: 'accent',
  'BEST SELLER': 'accentSoft',
  LIMITED: 'warning',
  'OUT OF STOCK': 'neutral',
}

export default function ProductBadge({ badge, discount, className }) {
  if (!badge) return null
  const label = badge === 'SALE' && discount ? `Sale −${discount}%` : badge
  return (
    <Badge tone={TONE_BY_BADGE[badge] ?? 'neutral'} className={className}>
      {label}
    </Badge>
  )
}
