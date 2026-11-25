import LevelBadge from './LevelBadge.jsx'
import { formatDateTime } from '../progressData.js'
import './AttemptList.css'

function AttemptList({ attempts, onView }) {
  return (
    <ol className="attempt-list">
      {attempts.map((attempt) => {
        const submitted = formatDateTime(attempt.submittedAt)
        return (
          <li key={attempt.attemptId} className="attempt-list__item">
            <div className="attempt-list__quiz">
              <span className="attempt-list__title">{attempt.title}</span>
              {attempt.submittedAt && (
                <time className="attempt-list__date" dateTime={attempt.submittedAt.toISOString()}>
                  <span className="sr-only">Submitted </span>
                  {submitted}
                </time>
              )}
            </div>
            <span className="attempt-list__score">
              <span aria-hidden="true">
                <strong>{attempt.score}</strong> / {attempt.total}
              </span>
              <span className="sr-only">
                {attempt.score} out of {attempt.total} correct
              </span>
            </span>
            <LevelBadge level={attempt.level} text={`${attempt.percent}%`} className="attempt-list__percent" />
            <button
              type="button"
              className="btn btn-secondary attempt-list__view"
              aria-label={`View ${attempt.title}, submitted ${submitted}`}
              onClick={() => onView(attempt.attemptId)}
            >
              View
            </button>
          </li>
        )
      })}
    </ol>
  )
}

export default AttemptList
