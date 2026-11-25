import AttemptList from './AttemptList.jsx'
import NoAttempts from './NoAttempts.jsx'
import './QuizHistory.css'

function QuizHistory({ loading, loadError, onRetry, attempts, onView }) {
  const isReady = !loading && !loadError && attempts !== null

  return (
    <section className="quiz-history" aria-labelledby="quiz-history-heading" aria-busy={loading}>
      <div className="quiz-history__head">
        <h2 id="quiz-history-heading" className="quiz-history__heading">
          Every quiz you’ve taken
        </h2>
        {isReady && attempts.length > 0 && <p className="quiz-history__order">Newest first</p>}
      </div>

      {loading && (
        <div className="quiz-history__card" aria-hidden="true">
          {[1, 2, 3].map((n) => (
            <span key={n} className="skeleton quiz-history__skeleton" />
          ))}
        </div>
      )}

      {loadError && (
        <div className="empty empty--error" role="alert">
          <h3 className="empty__title">Couldn’t load your quiz history</h3>
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
    </section>
  )
}

export default QuizHistory
