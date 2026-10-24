/**
 * Mock reviews, generated deterministically from the product id so a product
 * always shows the same reviews across reloads. A real API would return
 * these per product instead.
 */

const REVIEWERS = [
  'Nadeesha P.',
  'Kasun R.',
  'Tharindu W.',
  'Dilini F.',
  'Ashan M.',
  'Sachini K.',
  'Ravindu S.',
  'Hiruni D.',
  'Malith J.',
  'Ishara G.',
  'Chamod L.',
  'Ayesha N.',
]

const CITIES = ['Colombo', 'Kandy', 'Galle', 'Negombo', 'Kurunegala', 'Jaffna', 'Matara', 'Gampaha']

const COMMENTS = [
  {
    rating: 5,
    title: 'Exactly as described',
    body: 'Arrived well packed and works perfectly. Build quality is better than I expected at this price.',
  },
  {
    rating: 5,
    title: 'Fast delivery to my area',
    body: 'Ordered on Monday and it reached me on Wednesday. Product is genuine and the finish feels premium.',
  },
  {
    rating: 4,
    title: 'Great value',
    body: 'Does everything I need for daily work. Took off one star only because the box was slightly dented.',
  },
  {
    rating: 5,
    title: 'Clean upgrade for my desk',
    body: 'Matches the rest of my setup nicely. Would happily buy from GearZoneLK again.',
  },
  {
    rating: 4,
    title: 'Solid, no complaints',
    body: 'Been using it for a few weeks now and it has held up well. Support answered my question on WhatsApp quickly.',
  },
  {
    rating: 3,
    title: 'Good, with one small issue',
    body: 'Works fine overall, but it took a little time to get used to. Decent for the price.',
  },
  {
    rating: 5,
    title: 'Recommended',
    body: 'Bought one for myself and another as a gift. Both work great and look sharp.',
  },
]

function seededRandom(seed) {
  let state = 0
  for (let i = 0; i < seed.length; i += 1) state = (state * 31 + seed.charCodeAt(i)) >>> 0
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0
    return state / 2 ** 32
  }
}

export function reviewsForProduct(product, count = 5) {
  const random = seededRandom(product.id)
  const visible = Math.min(count, product.reviewCount)

  return Array.from({ length: visible }, (_, index) => {
    const comment = COMMENTS[Math.floor(random() * COMMENTS.length)]
    const daysAgo = 4 + Math.floor(random() * 120) + index * 9
    const date = new Date(Date.UTC(2026, 9, 20) - daysAgo * 86_400_000)

    return {
      id: `${product.id}-review-${index}`,
      author: REVIEWERS[Math.floor(random() * REVIEWERS.length)],
      city: CITIES[Math.floor(random() * CITIES.length)],
      rating: comment.rating,
      title: comment.title,
      body: comment.body,
      date: date.toISOString().slice(0, 10),
      verified: random() > 0.2,
    }
  })
}

/** Star distribution for the review summary bars, consistent with the average. */
export function ratingBreakdown(product) {
  const { rating, reviewCount } = product
  const weights = [5, 4, 3, 2, 1].map((star) => Math.max(0.02, 1 - Math.abs(star - rating) / 2.2))
  const total = weights.reduce((sum, weight) => sum + weight, 0)

  return [5, 4, 3, 2, 1].map((star, index) => ({
    star,
    count: Math.round((weights[index] / total) * reviewCount),
  }))
}
