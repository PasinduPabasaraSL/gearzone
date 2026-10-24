import { useEffect, useState } from 'react'
import { formatAmount } from '../../utils/formatCurrency'

const STEP = 100
const COMMIT_DELAY_MS = 300

/**
 * Dual-thumb price slider built from two native range inputs (keyboard and
 * screen-reader support for free), plus exact number fields. Values commit
 * to the URL after the user pauses so dragging does not flood history.
 */
export default function PriceRangeFilter({ bounds, minPrice, maxPrice, onCommit }) {
  const floor = Math.floor(bounds.min / STEP) * STEP
  const ceiling = Math.ceil(bounds.max / STEP) * STEP
  const committed = [minPrice ?? floor, maxPrice ?? ceiling]

  const [draft, setDraft] = useState(committed)
  const [synced, setSynced] = useState(committed.join('-'))

  // Adopt external changes (chip removed, "clear all", new scope).
  if (committed.join('-') !== synced) {
    setSynced(committed.join('-'))
    setDraft(committed)
  }

  const [low, high] = draft

  useEffect(() => {
    if (`${low}-${high}` === synced) return
    const timer = setTimeout(() => {
      onCommit({
        minPrice: low <= floor ? null : low,
        maxPrice: high >= ceiling ? null : high,
      })
    }, COMMIT_DELAY_MS)
    return () => clearTimeout(timer)
  }, [low, high, synced, floor, ceiling, onCommit])

  const span = Math.max(1, ceiling - floor)
  const lowPct = ((low - floor) / span) * 100
  const highPct = ((high - floor) / span) * 100

  const thumb =
    'pointer-events-none absolute inset-0 h-5 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-accent [&::-webkit-slider-thumb]:bg-surface [&::-webkit-slider-thumb]:shadow-card [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:cursor-grab [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-accent [&::-moz-range-thumb]:bg-surface focus-visible:outline-none [&:focus-visible::-webkit-slider-thumb]:ring-4 [&:focus-visible::-webkit-slider-thumb]:ring-accent/25'

  const numberField = (label, value, onChange) => (
    <label className="flex flex-1 flex-col gap-1">
      <span className="micro-label text-faint">{label}</span>
      <span className="flex h-10 items-center gap-1.5 rounded-control border bg-surface px-2.5 focus-within:border-accent">
        <span className="text-xs text-faint">LKR</span>
        <input
          type="number"
          inputMode="numeric"
          min={floor}
          max={ceiling}
          step={STEP}
          value={value}
          onChange={(event) => onChange(Number(event.target.value) || 0)}
          className="tabular w-full min-w-0 bg-transparent text-sm font-semibold text-ink"
        />
      </span>
    </label>
  )

  return (
    <div>
      <div className="relative mx-2 h-5">
        <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-line" />
        <div
          className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-accent"
          style={{ left: `${lowPct}%`, right: `${100 - highPct}%` }}
        />
        <input
          type="range"
          aria-label="Minimum price"
          aria-valuetext={`LKR ${formatAmount(low)}`}
          min={floor}
          max={ceiling}
          step={STEP}
          value={low}
          onChange={(event) => setDraft([Math.min(Number(event.target.value), high - STEP), high])}
          className={thumb}
        />
        <input
          type="range"
          aria-label="Maximum price"
          aria-valuetext={`LKR ${formatAmount(high)}`}
          min={floor}
          max={ceiling}
          step={STEP}
          value={high}
          onChange={(event) => setDraft([low, Math.max(Number(event.target.value), low + STEP)])}
          className={thumb}
        />
      </div>
      <div className="mt-4 flex items-end gap-2">
        {numberField('Min', low, (value) => setDraft([Math.max(floor, Math.min(value, high - STEP)), high]))}
        <span className="pb-3 text-faint" aria-hidden="true">
          –
        </span>
        {numberField('Max', high, (value) => setDraft([low, Math.min(ceiling, Math.max(value, low + STEP))]))}
      </div>
    </div>
  )
}
