import { BadgeCheck } from 'lucide-react'
import Rating from '../common/Rating'

/** Review summary (average + distribution) and the review list. */
export default function ProductReviews({ product, reviews, breakdown }) {
  const maxCount = Math.max(1, ...breakdown.map((row) => row.count))

  return (
    <div className="grid gap-10 lg:grid-cols-[300px_1fr] lg:gap-14">
      <div>
        <p className="tabular text-5xl font-extrabold tracking-tight text-ink">{product.rating.toFixed(1)}</p>
        <Rating value={product.rating} size="lg" className="mt-2" />
        <p className="mt-2 text-sm text-muted">Based on {product.reviewCount} reviews</p>
        <ul className="mt-6 flex flex-col gap-2" aria-label="Rating distribution">
          {breakdown.map((row) => (
            <li key={row.star} className="flex items-center gap-3 text-[13px]">
              <span className="tabular w-10 shrink-0 text-muted">{row.star} star</span>
              <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-line" aria-hidden="true">
                <span className="block h-full rounded-full bg-warning" style={{ width: `${(row.count / maxCount) * 100}%` }} />
              </span>
              <span className="tabular w-8 shrink-0 text-right text-faint">{row.count}</span>
            </li>
          ))}
        </ul>
      </div>

      <ul className="divide-y divide-line">
        {reviews.map((review) => (
          <li key={review.id} className="py-6 first:pt-0">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Rating value={review.rating} size="sm" />
              <time dateTime={review.date} className="text-xs text-faint">
                {new Date(review.date).toLocaleDateString('en-LK', { day: 'numeric', month: 'short', year: 'numeric' })}
              </time>
            </div>
            <h4 className="mt-3 text-[15px] font-semibold text-ink">{review.title}</h4>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{review.body}</p>
            <p className="mt-3 flex items-center gap-1.5 text-xs text-faint">
              <span className="font-semibold text-ink">{review.author}</span>· {review.city}
              {review.verified && (
                <span className="ml-1 inline-flex items-center gap-1 font-semibold text-success">
                  <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  Verified purchase
                </span>
              )}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}
