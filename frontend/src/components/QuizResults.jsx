import AnswerReview from './AnswerReview.jsx'
import TopicBreakdown from './TopicBreakdown.jsx'
import { resultSummary } from '../quizAttempt.js'
import './QuizResults.css'

const submittedFormat = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
})

function submittedText(value) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '' : `Submitted ${submittedFormat.format(date)}`
}

function QuizResults({ result, timedOut, onDone, doneLabel = 'Back to Available Quizzes' }) {
  const summary = resultSummary(result)
  const submitted = submittedText(result.submittedAt)
  const misses = [
    summary.wrong > 0 && `${summary.wrong} incorrect`,
    summary.unanswered > 0 && `${summary.unanswered} unanswered`,
  ]
    .filter(Boolean)
    .join(', ')

  return (
    <div className="quiz-results">
      <section className="quiz-results__card quiz-results__score" aria-labelledby="quiz-result-title">
        <h2 id="quiz-result-title" className="quiz-results__title" tabIndex={-1}>
          Your results
        </h2>
        {submitted && <p className="quiz-results__submitted">{submitted}</p>}

        {timedOut && (
          <p className="quiz-results__note">
            The timer reached 00:00, so your quiz was submitted automatically.
          </p>
        )}

        <div className="quiz-results__ring">
          <svg className="quiz-results__ring-art" viewBox="0 0 120 120" aria-hidden="true">
            <circle className="quiz-results__ring-track" cx="60" cy="60" r="52" />
            {summary.percent > 0 && (
              <circle
                className="quiz-results__ring-fill"
                cx="60"
                cy="60"
                r="52"
                pathLength="100"
                strokeDasharray={`${summary.percent} 100`}
              />
            )}
          </svg>
          <p className="quiz-results__score-text">
            <span className="sr-only">
              You scored {summary.score} out of {summary.total}, {summary.percent}%.
            </span>
            <span className="quiz-results__number" aria-hidden="true">
              {summary.score}
              <span className="quiz-results__out-of"> / {summary.total}</span>
            </span>
            <span className="quiz-results__percent" aria-hidden="true">
              {summary.percent}%
            </span>
          </p>
        </div>

        {misses && <p className="quiz-results__misses">{misses}</p>}
      </section>

      <section className="quiz-results__card quiz-results__topics" aria-labelledby="results-topics-title">
        <h3 id="results-topics-title" className="quiz-results__heading">
          Score by topic
        </h3>
        <TopicBreakdown topics={summary.topics} />
      </section>

      <section className="quiz-results__card quiz-results__review" aria-labelledby="results-review-title">
        <h3 id="results-review-title" className="quiz-results__heading">
          Your answers
        </h3>
        <AnswerReview answers={result.answers || []} />
      </section>

      <button type="button" className="btn btn-primary quiz-results__done" onClick={onDone}>
        {doneLabel}
      </button>
    </div>
  )
}

export default QuizResults
