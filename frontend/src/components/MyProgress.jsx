import AttemptList from './AttemptList.jsx'
import NoAttempts from './NoAttempts.jsx'
import ReviewCard from './ReviewCard.jsx'
import ScoreTrend from './ScoreTrend.jsx'
import TopicAccuracy from './TopicAccuracy.jsx'
import './MyProgress.css'

function MyProgress({ loading, loadError, onRetry, progress, onView }) {
  const isReady = !loading && !loadError && progress !== null

  return (
    <section className="my-progress" aria-labelledby="my-progress-heading" aria-busy={loading}>
      <h2 id="my-progress-heading" className="my-progress__heading">
        How you’re doing
      </h2>

      {loading && (
        <div className="my-progress__grid" aria-hidden="true">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="skeleton-card my-progress__skeleton">
              <span className="skeleton skeleton--title" />
              <span className="skeleton skeleton--short" />
              <span className="skeleton skeleton--chips" />
            </div>
          ))}
        </div>
      )}

      {loadError && (
        <div className="empty empty--error" role="alert">
          <h3 className="empty__title">Couldn’t load your progress</h3>
          <p className="empty__text">{loadError}</p>
          <div className="empty__actions">
            <button type="button" className="btn btn-primary" onClick={onRetry}>
              Try again
            </button>
          </div>
        </div>
      )}

      {isReady && progress.quizzesTaken === 0 && <NoAttempts />}

      {isReady && progress.quizzesTaken > 0 && (
        <div className="my-progress__grid">
          <TopicAccuracy topics={progress.topics} />
          {progress.trend.length > 0 && <ScoreTrend points={progress.trend} />}

          <section className="my-progress__recent" aria-labelledby="recent-quizzes-title">
            <div className="my-progress__recent-head">
              <h3 id="recent-quizzes-title" className="my-progress__recent-title">
                Recent quizzes
              </h3>
              <a href="#history" className="btn btn-ghost my-progress__all">
                See all in Quiz History
              </a>
            </div>
            <AttemptList attempts={progress.recent} onView={onView} />
          </section>

          {progress.review.length > 0 && <ReviewCard topics={progress.review} />}
        </div>
      )}
    </section>
  )
}

export default MyProgress
