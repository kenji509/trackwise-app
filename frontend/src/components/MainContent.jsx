import './MainContent.css'

// Page area: optional notice, a colorful welcome banner with the page title and
// main action, then the page content.
function MainContent({ notice, eyebrow, title, summary, actionLabel, actionDisabled, onAction, children }) {
  return (
    <main id="main" className="main" tabIndex={-1}>
      {notice}

      <header className="hero">
        {/* Decorative shapes; kept away from the text (see MASTER.md) */}
        <span className="hero__blob hero__blob--ring" aria-hidden="true" />
        <span className="hero__blob hero__blob--sunny" aria-hidden="true" />
        <span className="hero__blob hero__blob--berry" aria-hidden="true" />
        <span className="hero__blob hero__blob--mint" aria-hidden="true" />

        <div className="hero__text">
          <p className="hero__eyebrow">{eyebrow}</p>
          <h1 className="hero__title">{title}</h1>
          <p className="hero__summary">{summary}</p>
        </div>

        {actionLabel && (
          <button
            type="button"
            className="btn btn-light hero__action"
            onClick={onAction}
            disabled={actionDisabled}
          >
            <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 5v14M5 12h14" />
            </svg>
            {actionLabel}
          </button>
        )}
      </header>

      {children}
    </main>
  )
}

export default MainContent
