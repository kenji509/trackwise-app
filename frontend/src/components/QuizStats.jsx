import './QuizStats.css'

// Small symbols in the top-right corner of a cell, beside its label.
// Decorative (aria-hidden): the label already names the cell.
const SYMBOLS = {
  clipboard: (
    <>
      <rect x="8" y="2" width="8" height="4" rx="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    </>
  ),
  question: (
    <>
      <path d="M8.5 9a3.5 3.5 0 1 1 5 3.2c-.9.4-1.5 1.2-1.5 2.1v.7" />
      <path d="M12 19h.01" />
    </>
  ),
  sparkle: <path d="M12 4c.6 4.8 3.2 7.4 8 8-4.8.6-7.4 3.2-8 8-.6-4.8-3.2-7.4-8-8 4.8-.6 7.4-3.2 8-8Z" />,
  chart: <path d="M5 20v-6M12 20V9M19 20V4" />,
}

// Summary strip: one row of cells (label, value, optional helper line).
// items: [{ id, label, value, helper, symbol, tone }]; value may be text or a node.
// symbol: a key of SYMBOLS; tone: blue | sunny | mint | grape (the symbol's color).
function QuizStats({ items, loading }) {
  return (
    <dl className="stats" aria-busy={loading || undefined}>
      {items.map((item) => (
        <div key={item.id} className="stats__item">
          <dt className="stats__label">
            <span className="stats__label-text">{item.label}</span>
            {item.symbol && (
              <span className={`stats__symbol stats__symbol--${item.tone}`} aria-hidden="true">
                <svg className="icon" viewBox="0 0 24 24">
                  {SYMBOLS[item.symbol]}
                </svg>
              </span>
            )}
          </dt>
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
