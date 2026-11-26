import './Quizzes.css'

// Decorative drawings for the empty states (hidden from screen readers).
// Colors come from the tokens in index.css; see MASTER.md "Empty states".

// No quizzes yet: a quiz sheet with ticked answers and a pencil
function EmptyIllustration() {
  return (
    <svg className="empty__art" viewBox="0 0 220 140" aria-hidden="true">
      <circle cx="110" cy="74" r="60" fill="var(--color-primary-soft)" />
      <rect x="56" y="32" width="88" height="80" rx="12" fill="var(--sunny-soft)" transform="rotate(-9 100 72)" />
      <rect x="72" y="24" width="88" height="98" rx="12" fill="#fff" stroke="var(--color-border)" strokeWidth="2" />
      <rect x="84" y="38" width="36" height="8" rx="4" fill="var(--color-primary)" />
      <rect x="84" y="58" width="12" height="12" rx="3" fill="var(--mint-bright)" />
      <path d="m87 64 2.5 2.5 4-5" fill="none" stroke="#14532d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="102" y="61" width="44" height="6" rx="3" fill="var(--color-border)" />
      <rect x="84" y="78" width="12" height="12" rx="3" fill="var(--mint-bright)" />
      <path d="m87 84 2.5 2.5 4-5" fill="none" stroke="#14532d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="102" y="81" width="36" height="6" rx="3" fill="var(--color-border)" />
      <rect x="85" y="99" width="10" height="10" rx="3" fill="none" stroke="var(--color-border-strong)" strokeWidth="2" />
      <rect x="102" y="101" width="40" height="6" rx="3" fill="var(--color-border)" />
      <g transform="translate(176 26) rotate(30)">
        <rect x="0" y="-9" width="14" height="10" rx="3" fill="var(--coral-bright)" />
        <rect x="0" y="0" width="14" height="6" fill="var(--color-sunny-lip)" />
        <rect x="0" y="6" width="14" height="50" fill="var(--color-sunny)" />
        <path d="M0 56h14l-7 14z" fill="#fde68a" />
        <path d="M4.6 65.2h4.8L7 70z" fill="var(--color-text)" />
      </g>
      <path d="M40 30c1 6 2 7 8 8-6 1-7 2-8 8-1-6-2-7-8-8 6-1 7-2 8-8z" fill="var(--color-sunny)" />
      <circle cx="186" cy="116" r="5" fill="#60a5fa" />
      <circle cx="36" cy="108" r="4" fill="var(--mint-bright)" />
    </svg>
  )
}

// No matches: a magnifier with a question mark over two quiz cards
function NoMatchIllustration() {
  return (
    <svg className="empty__art" viewBox="0 0 220 140" aria-hidden="true">
      <circle cx="110" cy="74" r="60" fill="var(--color-primary-soft)" />
      <g transform="rotate(-7 84 69)">
        <rect x="48" y="40" width="72" height="58" rx="10" fill="#fff" stroke="var(--color-border)" strokeWidth="2" />
        <rect x="58" y="52" width="28" height="6" rx="3" fill="var(--grape-soft)" />
        <rect x="58" y="66" width="44" height="5" rx="2.5" fill="var(--color-border)" />
      </g>
      <g transform="rotate(7 138 63)">
        <rect x="102" y="34" width="72" height="58" rx="10" fill="#fff" stroke="var(--color-border)" strokeWidth="2" />
        <rect x="112" y="46" width="28" height="6" rx="3" fill="var(--mint-soft)" />
        <rect x="112" y="60" width="44" height="5" rx="2.5" fill="var(--color-border)" />
      </g>
      <line x1="138" y1="92" x2="160" y2="114" stroke="var(--color-sunny)" strokeWidth="11" strokeLinecap="round" />
      <circle cx="122" cy="76" r="24" fill="#fff" fillOpacity="0.85" stroke="var(--color-primary)" strokeWidth="7" />
      <path d="M116.5 71a6 6 0 1 1 8.5 5.5c-2 .9-3 2.2-3 4.2v1" fill="none" stroke="var(--color-text)" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="122" cy="88" r="2.2" fill="var(--color-text)" />
      <path d="M44 34c1 5 2 6 7 7-5 1-6 2-7 7-1-5-2-6-7-7 5-1 6-2 7-7z" fill="var(--color-sunny)" />
      <circle cx="184" cy="30" r="4" fill="var(--grape-bright)" />
    </svg>
  )
}

// Load error: a sad cloud and an unplugged cable
function ErrorIllustration() {
  return (
    <svg className="empty__art" viewBox="0 0 220 140" aria-hidden="true">
      <circle cx="110" cy="70" r="60" fill="var(--color-surface-2)" />
      <path
        d="M78 84h64a17 17 0 0 0 1-34 25 25 0 0 0-48-6 19 19 0 0 0-17 40z"
        fill="#fff"
        stroke="var(--color-border-strong)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="98" cy="66" r="2.6" fill="var(--color-text)" />
      <circle cx="122" cy="66" r="2.6" fill="var(--color-text)" />
      <path d="M103 76c4-3 10-3 14 0" fill="none" stroke="var(--color-text)" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M30 112h46" stroke="var(--color-text)" strokeWidth="4" strokeLinecap="round" />
      <rect x="74" y="103" width="22" height="18" rx="5" fill="var(--color-primary)" />
      <path d="M96 108h8M96 116h8" stroke="var(--color-text)" strokeWidth="3" strokeLinecap="round" />
      <rect x="124" y="102" width="22" height="20" rx="6" fill="#fff" stroke="var(--color-text)" strokeWidth="2.5" />
      <path d="M131 109v6M139 109v6" stroke="var(--color-text)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M146 112h44" stroke="var(--color-text)" strokeWidth="4" strokeLinecap="round" />
      <path
        d="M112 96h8l-5 9h7l-13 17 3-12h-6z"
        fill="var(--color-sunny)"
        stroke="var(--color-sunny-lip)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// Heading row, toolbar, and one of: loading, load error, empty, no matches, or the quizzes.
// layout: 'grid' | 'list'. onShowSamples is only passed while samples are off.
function Quizzes({
  headerAction,
  toolbar,
  loading,
  loadError,
  onRetry,
  total,
  shown,
  layout,
  onAdd,
  onClearFilters,
  onShowSamples,
  children,
}) {
  const isReady = !loading && !loadError

  return (
    <section className="quizzes" aria-labelledby="quizzes-heading">
      <div className="quizzes__head">
        <h2 id="quizzes-heading" className="quizzes__heading">
          All quizzes
        </h2>
        {headerAction}
      </div>

      {!loadError && toolbar}

      {/* Placeholders while loading (hidden from screen readers; the count says "Loading") */}
      {loading && (
        <div className={layout === 'list' ? 'quizzes__list' : 'quizzes__grid'} aria-hidden="true">
          {[1, 2, 3].map((n) => (
            <div key={n} className={`skeleton-card skeleton-card--${layout}`}>
              <span className="skeleton skeleton--title" />
              <span className="skeleton skeleton--short" />
              <span className="skeleton skeleton--chips" />
            </div>
          ))}
        </div>
      )}

      {loadError && (
        <div className="empty empty--error" role="alert">
          <ErrorIllustration />
          <h3 className="empty__title">Couldn’t load quizzes</h3>
          <p className="empty__text">{loadError}</p>
          <div className="empty__actions">
            <button type="button" className="btn btn-primary" onClick={onRetry}>
              Try again
            </button>
            {onShowSamples && (
              <button type="button" className="btn btn-secondary" onClick={onShowSamples}>
                Show sample quizzes
              </button>
            )}
          </div>
        </div>
      )}

      {isReady && total === 0 && (
        <div className="empty">
          <EmptyIllustration />
          <h3 className="empty__title">Let’s make your first quiz</h3>
          <div className="empty__actions">
            <button type="button" className="btn btn-primary" onClick={onAdd}>
              <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Create a quiz
            </button>
            {onShowSamples && (
              <button type="button" className="btn btn-ghost" onClick={onShowSamples}>
                Show sample quizzes
              </button>
            )}
          </div>
        </div>
      )}

      {isReady && total > 0 && shown === 0 && (
        <div className="empty">
          <NoMatchIllustration />
          <h3 className="empty__title">No quizzes match</h3>
          <p className="empty__text">Try a different word, or remove a filter to see more quizzes.</p>
          <button type="button" className="btn btn-secondary" onClick={onClearFilters}>
            Clear filters
          </button>
        </div>
      )}

      {isReady && shown > 0 && (
        <div className={layout === 'list' ? 'quizzes__list' : 'quizzes__grid'}>{children}</div>
      )}
    </section>
  )
}

export default Quizzes
