import { topicAccent } from '../../quizData.js'
import './ProgressSummary.css'

// A topic name with its color square, or a muted note when there is none
function topicValue(topic, emptyText) {
  if (!topic) return <span className="progress-summary__none">{emptyText}</span>
  return <span className={`topic-chip accent-${topicAccent(topic.topicId)}`}>{topic.name}</span>
}

function ProgressSummary({ loading, progress }) {
  const average = progress?.averagePercent ?? 0
  const placeholder = <span className="progress-summary__placeholder" aria-hidden="true" />

  return (
    <section className="progress-summary" aria-label="Summary" aria-busy={loading || undefined}>
      <div className="progress-summary__main">
        <div className="progress-summary__ring">
          <svg className="progress-summary__ring-art" viewBox="0 0 120 120" aria-hidden="true">
            <circle className="progress-summary__ring-track" cx="60" cy="60" r="52" />
            {!loading && average > 0 && (
              <circle
                className="progress-summary__ring-fill"
                cx="60"
                cy="60"
                r="52"
                pathLength="100"
                strokeDasharray={`${average} 100`}
              />
            )}
          </svg>
          <p className="progress-summary__average">{loading ? placeholder : `${average}%`}</p>
        </div>
        <p className="progress-summary__label">Average score</p>
        {loading && <span className="sr-only">Loading</span>}
      </div>

      <dl className="progress-summary__facts">
        <div className="progress-summary__fact">
          <dt className="progress-summary__term">Quizzes taken</dt>
          <dd className="progress-summary__value">{loading ? placeholder : progress.quizzesTaken}</dd>
        </div>
        <div className="progress-summary__fact">
          <dt className="progress-summary__term">Strongest topic</dt>
          <dd className="progress-summary__value">{loading ? placeholder : topicValue(progress.strongest, 'None yet')}</dd>
          {!loading && progress.strongest && (
            <dd className="progress-summary__detail">{progress.strongest.percent}% correct</dd>
          )}
        </div>
        <div className="progress-summary__fact">
          <dt className="progress-summary__term">Needs practice</dt>
          <dd className="progress-summary__value">
            {loading ? placeholder : topicValue(progress.needsPractice, 'Nothing right now')}
          </dd>
          {!loading && progress.needsPractice && (
            <dd className="progress-summary__detail">{progress.needsPractice.percent}% correct</dd>
          )}
        </div>
      </dl>
    </section>
  )
}

export default ProgressSummary
