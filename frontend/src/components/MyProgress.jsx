import AttemptList from './AttemptList.jsx'
import NoAttempts from './NoAttempts.jsx'
import ReviewCard from './ReviewCard.jsx'
import ScoreTrend from './ScoreTrend.jsx'
import TopicAccuracy from './TopicAccuracy.jsx'
import { plural } from '../quizData.js'
import './MyProgress.css'

// The trend chart needs at least this many graded quizzes
const TREND_MIN = 2

function MyProgress({ loading, loadError, onRetry, progress, onView }) {
  const isReady = !loading && !loadError && progress !== null

  return (
    <div className="my-progress" aria-busy={loading}>
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
          <h2 className="empty__title">Couldn’t load your progress</h2>
          <p className="empty__text">{loadError}</p>
          <div className="empty__actions">
            <button type="button" className="btn btn-primary" onClick={onRetry}>
              Try again
            </button>
          </div>
        </div>
      )}

      {isReady && progress.quizzesTaken === 0 && <NoAttempts />}

      {isReady && progress.quizzesTaken > 0 && progress.trend.length < TREND_MIN && (
        <p className="my-progress__note">
          Take {plural(TREND_MIN - progress.trend.length, 'more quiz', 'more quizzes')} to see your trend
        </p>
      )}

      {isReady && progress.quizzesTaken > 0 && (
        <div className="my-progress__grid">
          <TopicAccuracy topics={progress.topics} />

          {progress.trend.length >= TREND_MIN && <ScoreTrend points={progress.trend} />}

          <section className="my-progress__recent" aria-labelledby="recent-quizzes-title">
            <div className="my-progress__recent-head">
              <h2 id="recent-quizzes-title" className="my-progress__recent-title">
                Recent quizzes
              </h2>
              <a href="#history" className="btn btn-ghost my-progress__all">
                See all in Quiz History
              </a>
            </div>
            <AttemptList attempts={progress.recent} onView={onView} />
          </section>

          {progress.practice.length > 0 && <ReviewCard topics={progress.practice} />}
        </div>
      )}
    </div>
  )
}

export default MyProgress
