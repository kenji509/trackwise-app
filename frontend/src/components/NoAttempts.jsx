function NoAttempts() {
  return (
    <div className="empty">
      <svg className="empty__art" viewBox="0 0 220 140" aria-hidden="true">
        <circle cx="110" cy="74" r="60" fill="var(--mint-soft)" />
        <rect x="58" y="30" width="104" height="84" rx="12" fill="#fff" stroke="var(--color-border)" strokeWidth="2" />
        <path d="M72 98h76" stroke="var(--color-border)" strokeWidth="2" strokeLinecap="round" />
        <rect x="78" y="74" width="12" height="24" rx="3" fill="var(--color-border)" />
        <rect x="98" y="62" width="12" height="36" rx="3" fill="var(--color-border)" />
        <rect x="118" y="50" width="12" height="48" rx="3" fill="var(--color-border)" />
        <path d="m76 64 22-14 18 8 22-16" fill="none" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="170" cy="36" r="14" fill="var(--color-sunny)" />
        <path d="M170 29v14M163 36h14" stroke="var(--color-on-sunny)" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M44 38c1 5 2 6 7 7-5 1-6 2-7 7-1-5-2-6-7-7 5-1 6-2 7-7z" fill="var(--color-sunny)" />
      </svg>
      <h2 className="empty__title">No quizzes taken yet</h2>
      <div className="empty__actions">
        <a href="#quizzes" className="btn btn-primary">
          Go to Available Quizzes
        </a>
      </div>
    </div>
  )
}

export default NoAttempts
