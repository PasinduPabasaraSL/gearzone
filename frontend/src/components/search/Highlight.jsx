/**
 * Emphasises the parts of `text` that match the search term. Built from
 * string splits rather than HTML injection, so product names are never
 * interpreted as markup.
 */
export default function Highlight({ text, term }) {
  const tokens = String(term ?? '')
    .toLowerCase()
    .split(/\s+/)
    .filter((token) => token.length > 1)
    .map((token) => token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))

  if (tokens.length === 0) return text

  const pattern = new RegExp(`(${tokens.join('|')})`, 'gi')
  return String(text)
    .split(pattern)
    .map((part, index) =>
      index % 2 === 1 ? (
        <mark key={index} className="bg-transparent font-bold text-ink">
          {part}
        </mark>
      ) : (
        part
      ),
    )
}
