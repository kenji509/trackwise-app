import './QuizStats.css'

const icons = {
  quizzes: (
    <>
      <rect x="8" y="2" width="8" height="4" rx="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="m9 14 2 2 4-4" />
    </>
  ),
  questions: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01" />
    </>
  ),
  week: (
    <>
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </>
  ),
  topic: (
    <>
      <path d="m12 2 10 5-10 5L2 7l10-5Z" />
      <path d="m2 17 10 5 10-5M2 12l10 5 10-5" />
    </>
  ),
  average: (
    <>
      <path d="M4 18a8 8 0 1 1 16 0" />
      <path d="m12 18 4-5" />
      <path d="M12 18h.01" />
    </>
  ),
  strong: (
    <>
      <path d="M8 21h8M12 17v4" />
      <path d="M7 4h10v5a5 5 0 0 1-10 0V4Z" />
      <path d="M7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3" />
    </>
  ),
  review: (
    <>
      <path d="M2.5 5h6a3.5 3.5 0 0 1 3.5 3.5V20a2.5 2.5 0 0 0-2.5-2.5h-7z" />
      <path d="M21.5 5h-6A3.5 3.5 0 0 0 12 8.5V20a2.5 2.5 0 0 1 2.5-2.5h7z" />
    </>
  ),
}

// Bento row of summary tiles: icon, label, big value, helper line.
// items: [{ id, icon, accent, label, value, helper }]; value may be text or a node.
function QuizStats({ items, loading }) {
  return (
    <dl className="stats" aria-busy={loading || undefined}>
      {items.map((item) => (
        <div key={item.id} className={`stats__item accent-${item.accent}`}>
          <span className="stats__icon" aria-hidden="true">
            <svg className="icon" viewBox="0 0 24 24">
              {icons[item.icon]}
            </svg>
          </span>
          <dt className="stats__label">{item.label}</dt>
          <dd className="stats__value">
            {loading ? (
              <>
                <span className="stats__placeholder" aria-hidden="true" />
                <span className="sr-only">Loading</span>
              </>
            ) : (
              item.value
            )}
          </dd>
          {!loading && item.helper && <dd className="stats__helper">{item.helper}</dd>}
        </div>
      ))}
    </dl>
  )
}

export default QuizStats
