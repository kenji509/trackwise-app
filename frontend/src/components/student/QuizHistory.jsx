import AttemptList from './AttemptList.jsx'
import NoAttempts from './NoAttempts.jsx'
import './QuizHistory.css'

function QuizHistory({ loading, loadError, onRetry, attempts, onView }) {
  const isReady = !loading && !loadError && attempts !== null

  return (
    <div className="quiz-history" aria-busy={loading}>
      {loading && (
        <div className="quiz-history__card" aria-hidden="true">
          {[1, 2, 3].map((n) => (
            <span key={n} className="skeleton quiz-history__skeleton" />
          ))}
        </div>
      )}

      {loadError && (
        <div className="empty empty--error" role="alert">
          <h2 className="empty__title">Couldn’t load your quiz history</h2>
          <p className="empty__text">{loadError}</p>
          <div className="empty__actions">
            <button type="button" className="btn btn-primary" onClick={onRetry}>
              Try again
            </button>
          </div>
        </div>
      )}

      {isReady && attempts.length === 0 && <NoAttempts />}

      {isReady && attempts.length > 0 && (
        <div className="quiz-history__card">
          <AttemptList attempts={attempts} onView={onView} />
        </div>
      )}
    </div>
  )
}

export default QuizHistory
