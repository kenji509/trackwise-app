import './AvailableQuizzes.css'

function AvailableQuizzes({ loading, loadError, onRetry, count, children }) {
  const isReady = !loading && !loadError

  return (
    <div className="available" aria-busy={loading}>
      {loading && (
        <div className="available__grid" aria-hidden="true">
          {[1, 2, 3].map((n) => (
            <div key={n} className="skeleton-card skeleton-card--grid">
              <span className="skeleton skeleton--title" />
              <span className="skeleton skeleton--short" />
              <span className="skeleton skeleton--chips" />
            </div>
          ))}
        </div>
      )}

      {loadError && (
        <div className="empty empty--error" role="alert">
          <h2 className="empty__title">Couldn’t load quizzes</h2>
          <p className="empty__text">{loadError}</p>
          <div className="empty__actions">
            <button type="button" className="btn btn-primary" onClick={onRetry}>
              Try again
            </button>
          </div>
        </div>
      )}

      {isReady && count === 0 && (
        <div className="empty">
          <svg className="empty__art" viewBox="0 0 220 140" aria-hidden="true">
            <circle cx="110" cy="74" r="60" fill="var(--color-primary-soft)" />
            <rect x="72" y="24" width="88" height="98" rx="12" fill="#fff" stroke="var(--color-border)" strokeWidth="2" />
            <rect x="84" y="38" width="36" height="8" rx="4" fill="var(--color-primary)" />
            <rect x="84" y="60" width="60" height="6" rx="3" fill="var(--color-border)" />
            <rect x="84" y="76" width="48" height="6" rx="3" fill="var(--color-border)" />
            <rect x="84" y="92" width="54" height="6" rx="3" fill="var(--color-border)" />
            <circle cx="166" cy="34" r="16" fill="var(--color-sunny)" />
            <path d="M166 26v8l5 3" fill="none" stroke="var(--color-on-sunny)" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M44 34c1 5 2 6 7 7-5 1-6 2-7 7-1-5-2-6-7-7 5-1 6-2 7-7z" fill="var(--color-sunny)" />
          </svg>
          <h2 className="empty__title">No quizzes to take yet</h2>
          <p className="empty__text">When your teacher publishes a quiz, it shows up here.</p>
        </div>
      )}

      {isReady && count > 0 && <div className="available__grid">{children}</div>}
    </div>
  )
}

export default AvailableQuizzes
