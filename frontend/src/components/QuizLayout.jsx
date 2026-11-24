import './QuizLayout.css'

function QuizLayout({ title, actions, aside, children }) {
  return (
    <div className="quiz-layout">
      <header className="quiz-layout__bar">
        <svg className="logo quiz-layout__logo" viewBox="0 0 32 32" aria-hidden="true">
          <rect width="32" height="32" rx="9" />
          <path d="M8 20.5l5-5 4 4 7-8" />
        </svg>
        <h1 id="quiz-title" className="quiz-layout__title" tabIndex={-1}>
          {title}
        </h1>
        {actions && <div className="quiz-layout__actions">{actions}</div>}
      </header>

      <main
        id="main"
        className={aside ? 'quiz-layout__body' : 'quiz-layout__body quiz-layout__body--single'}
      >
        <div className="quiz-layout__content">{children}</div>
        {aside && <div className="quiz-layout__aside">{aside}</div>}
      </main>
    </div>
  )
}

export default QuizLayout
