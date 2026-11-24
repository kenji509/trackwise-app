import './AuthLayout.css'

function AuthLayout({ title, subtitle, footer, children }) {
  return (
    <div className="auth">
      <aside className="auth__panel" aria-label="About TrackWise">
        <div className="auth__brand">
          <svg className="logo" viewBox="0 0 32 32" aria-hidden="true">
            <rect width="32" height="32" rx="9" />
            <path d="M8 20.5l5-5 4 4 7-8" />
          </svg>
          <span>TrackWise</span>
        </div>

        <div className="auth__intro">
          <p className="auth__tagline">
            Know which topics you are <span className="auth__mark">strong in</span>, not just your
            score.
          </p>
          <p className="auth__lead">
            Quizzes that track progress topic by topic, for students and their teachers.
          </p>
        </div>

        <svg className="auth__art" viewBox="0 0 320 210" aria-hidden="true">
          <circle cx="270" cy="42" r="44" fill="rgb(250 204 21 / 0.12)" />
          <circle cx="270" cy="42" r="32" fill="rgb(250 204 21 / 0.28)" />
          <circle cx="270" cy="42" r="22" fill="var(--color-sunny)" />
          <g transform="rotate(-4 160 118)">
            <rect x="40" y="54" width="232" height="146" rx="20" fill="#0f172a" fillOpacity="0.22" />
            <rect x="40" y="46" width="232" height="146" rx="20" fill="#fff" />
            <rect x="62" y="66" width="72" height="10" rx="5" fill="var(--color-primary)" />
            <rect x="206" y="66" width="44" height="10" rx="5" fill="var(--color-border)" />
            <circle cx="68" cy="103" r="6" fill="var(--mint)" />
            <rect x="82" y="98" width="40" height="10" rx="5" fill="var(--color-border)" />
            <rect x="134" y="98" width="116" height="10" rx="5" fill="var(--color-surface-2)" />
            <rect x="134" y="98" width="104" height="10" rx="5" fill="var(--mint-bright)" />
            <circle cx="68" cy="133" r="6" fill="var(--sunny)" />
            <rect x="82" y="128" width="34" height="10" rx="5" fill="var(--color-border)" />
            <rect x="134" y="128" width="116" height="10" rx="5" fill="var(--color-surface-2)" />
            <rect x="134" y="128" width="72" height="10" rx="5" fill="var(--color-sunny)" />
            <circle cx="68" cy="163" r="6" fill="var(--coral)" />
            <rect x="82" y="158" width="44" height="10" rx="5" fill="var(--color-border)" />
            <rect x="134" y="158" width="116" height="10" rx="5" fill="var(--color-surface-2)" />
            <rect x="134" y="158" width="38" height="10" rx="5" fill="var(--coral-bright)" />
          </g>
          <circle cx="276" cy="184" r="19" fill="var(--mint-bright)" />
          <path
            d="m268 184 5.5 5.5 10-11"
            fill="none"
            stroke="#14532d"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M26 28c1.2 7 2.4 8.2 9.4 9.4-7 1.2-8.2 2.4-9.4 9.4-1.2-7-2.4-8.2-9.4-9.4 7-1.2 8.2-2.4 9.4-9.4z" fill="var(--color-sunny)" />
          <circle cx="22" cy="176" r="5" fill="#60a5fa" />
        </svg>
      </aside>

      <main id="main" className="auth__main">
        <div className="auth__card">
          <div className="auth__head">
            <h1 id="auth-title" className="auth__title" tabIndex={-1}>
              {title}
            </h1>
            <p className="auth__subtitle">{subtitle}</p>
          </div>

          {children}

          <p className="auth__switch">{footer}</p>
        </div>
      </main>
    </div>
  )
}

export default AuthLayout
