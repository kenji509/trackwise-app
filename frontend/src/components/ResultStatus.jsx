import './ResultStatus.css'

function ResultStatus({ title, note, message, error, busy, children }) {
  return (
    <section className="result-status" aria-labelledby="quiz-result-title" aria-busy={busy || undefined}>
      {!error && (
        <svg className="result-status__art" viewBox="0 0 220 140" aria-hidden="true">
          <circle cx="110" cy="72" r="60" fill="var(--mint-soft)" />
          <rect x="70" y="26" width="80" height="94" rx="12" fill="#fff" stroke="var(--color-border)" strokeWidth="2" />
          <rect x="82" y="40" width="34" height="8" rx="4" fill="var(--color-primary)" />
          <rect x="82" y="60" width="56" height="6" rx="3" fill="var(--color-border)" />
          <rect x="82" y="74" width="44" height="6" rx="3" fill="var(--color-border)" />
          <rect x="82" y="88" width="50" height="6" rx="3" fill="var(--color-border)" />
          <circle cx="150" cy="104" r="22" fill="var(--mint-bright)" />
          <path d="m140 104 7 7 13-14" fill="none" stroke="#14532d" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M46 34c1 6 2 7 8 8-6 1-7 2-8 8-1-6-2-7-8-8 6-1 7-2 8-8z" fill="var(--color-sunny)" />
          <circle cx="184" cy="40" r="5" fill="var(--grape-bright)" />
          <circle cx="38" cy="104" r="4" fill="#60a5fa" />
        </svg>
      )}

      <h2 id="quiz-result-title" className="result-status__title" tabIndex={-1}>
        {title}
      </h2>

      {note && <p className="result-status__note">{note}</p>}

      {message && (
        <p className="result-status__message">
          {busy && <span className="result-status__spinner" aria-hidden="true" />}
          {message}
        </p>
      )}

      {error && (
        <p className="alert result-status__error" role="alert">
          {error}
        </p>
      )}

      {children && <div className="result-status__actions">{children}</div>}
    </section>
  )
}

export default ResultStatus
