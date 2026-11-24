import { firstName, initials } from '../authForm.js'
import './StudentHome.css'

function StudentHome({ user, onLogout }) {
  return (
    <div className="student-home">
      <header className="student-home__bar">
        <div className="student-home__brand">
          <svg className="logo" viewBox="0 0 32 32" aria-hidden="true">
            <rect width="32" height="32" rx="9" />
            <path d="M8 20.5l5-5 4 4 7-8" />
          </svg>
          <span>TrackWise</span>
        </div>

        <div className="student-home__user">
          <span className="avatar student-home__avatar" aria-hidden="true">
            {initials(user.fullName)}
          </span>
          <span className="student-home__user-text">
            <span className="sr-only">Signed in as </span>
            <span className="student-home__name">{user.fullName}</span>
            <span className="student-home__role">
              Student{user.section ? ` · ${user.section.name}` : ''}
            </span>
          </span>
          <button type="button" className="btn btn-secondary" onClick={onLogout}>
            <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <path d="m16 17 5-5-5-5" />
              <path d="M21 12H9" />
            </svg>
            Log out
          </button>
        </div>
      </header>

      <main id="main" className="student-home__main">
        <section className="student-home__card" aria-labelledby="student-title">
          <svg className="student-home__art" viewBox="0 0 220 140" aria-hidden="true">
            <circle cx="110" cy="74" r="60" fill="var(--color-primary-soft)" />
            <rect x="52" y="34" width="96" height="78" rx="12" fill="var(--sunny-soft)" transform="rotate(-8 100 73)" />
            <rect x="66" y="24" width="100" height="96" rx="12" fill="#fff" stroke="var(--color-border)" strokeWidth="2" />
            <rect x="78" y="36" width="40" height="8" rx="4" fill="var(--color-primary)" />
            <path d="M80 106h72" stroke="var(--color-border-strong)" strokeWidth="2" strokeLinecap="round" />
            <rect x="86" y="76" width="14" height="30" rx="4" fill="var(--coral-bright)" />
            <rect x="108" y="64" width="14" height="42" rx="4" fill="var(--color-sunny)" />
            <rect x="130" y="52" width="14" height="54" rx="4" fill="var(--mint-bright)" />
            <circle cx="166" cy="26" r="13" fill="var(--mint-bright)" />
            <path d="m160 26 4 4 7-8" fill="none" stroke="#14532d" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M40 30c1 6 2 7 8 8-6 1-7 2-8 8-1-6-2-7-8-8 6-1 7-2 8-8z" fill="var(--color-sunny)" />
            <circle cx="186" cy="114" r="5" fill="#60a5fa" />
            <circle cx="34" cy="106" r="4" fill="var(--grape-bright)" />
          </svg>

          <p className="student-home__eyebrow">Welcome, {firstName(user.fullName)}</p>
          <h1 id="student-title" className="student-home__title" tabIndex={-1}>
            Student dashboard coming soon
          </h1>
          <p className="student-home__text">
            Soon you’ll see which topics you’re strong in, not just your score.
          </p>
        </section>
      </main>
    </div>
  )
}

export default StudentHome
