import { navigatorLabel, navigatorStatus, questionState } from '../quizAttempt.js'
import './QuestionNavigator.css'

function FlagIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <path d="M4 22v-7" />
    </svg>
  )
}

function QuestionNavigator({ questions, current, answers, marked, answeredCount, onJump, onSubmit }) {
  return (
    <section className="question-nav" aria-labelledby="question-nav-title">
      <div className="question-nav__head">
        <h2 id="question-nav-title" className="question-nav__title">
          Questions
        </h2>
        <p className="question-nav__count">
          {answeredCount} of {questions.length} answered
        </p>
      </div>

      <ol className="question-nav__grid">
        {questions.map((question, index) => {
          const state = questionState(question, answers, marked)
          return (
            <li key={question.questionId}>
              <button
                type="button"
                className={`question-nav__item is-${navigatorStatus(state)}`}
                aria-current={index === current ? 'step' : undefined}
                aria-label={navigatorLabel(index + 1, state)}
                onClick={() => onJump(index)}
              >
                {index + 1}
                {state.marked && <FlagIcon className="question-nav__flag" />}
              </button>
            </li>
          )
        })}
      </ol>

      <ul className="question-nav__legend" aria-label="Legend">
        <li>
          <span className="question-nav__swatch is-answered" aria-hidden="true" />
          Answered
        </li>
        <li>
          <span className="question-nav__swatch is-current" aria-hidden="true" />
          Current
        </li>
        <li>
          <span className="question-nav__swatch is-marked" aria-hidden="true">
            <FlagIcon className="question-nav__flag" />
          </span>
          Marked for review
        </li>
        <li>
          <span className="question-nav__swatch is-unanswered" aria-hidden="true" />
          Not answered
        </li>
      </ul>

      <button type="button" className="btn btn-primary question-nav__submit" onClick={onSubmit}>
        <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="m8 12 3 3 5-6" />
        </svg>
        Submit quiz
      </button>
    </section>
  )
}

export default QuestionNavigator
