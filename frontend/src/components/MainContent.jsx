import './MainContent.css'

// Page area: optional notice, then a header, then the page content.
// Each role's main page gets the colorful welcome banner with the page title and
// main action; other pages pass `plain` for a simple title header.
// art: what the banner shows on the right.
// - 'drawing' (default): the quiz sheet, sun and check, with a short entrance:
//   the answer lines draw in, the check pops in, the sun bobs. Teacher Quizzes
//   always; student Available Quizzes when a quiz is ready to take.
// - 'none': nothing (student page while loading, offline or with no quizzes)
function MainContent({
  notice,
  eyebrow,
  title,
  summary,
  actionLabel,
  actionDisabled,
  onAction,
  plain,
  art = 'drawing',
  children,
}) {
  return (
    <main id="main" className="main" tabIndex={-1}>
      {notice}

      {plain ? (
        <header className="page-head">
          <h1 className="page-head__title">{title}</h1>
        </header>
      ) : (
        <header className={`hero hero--${art}`}>
          {/* Decorative shapes; kept away from the text (see MASTER.md) */}
          <span className="hero__blob hero__blob--ring" aria-hidden="true" />
          {art === 'drawing' && (
            <>
              <span className="hero__blob hero__blob--sunny" aria-hidden="true" />
              <span className="hero__blob hero__blob--berry" aria-hidden="true">
                <span className="hero__line hero__line--1" />
                <span className="hero__line hero__line--2" />
                <span className="hero__line hero__line--3" />
              </span>
              <span className="hero__blob hero__blob--mint" aria-hidden="true" />
            </>
          )}

          <div className="hero__text">
            <p className="hero__eyebrow">{eyebrow}</p>
            <h1 className="hero__title">{title}</h1>
            {summary && <p className="hero__summary">{summary}</p>}
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
      )}

      {children}
    </main>
  )
}

export default MainContent
