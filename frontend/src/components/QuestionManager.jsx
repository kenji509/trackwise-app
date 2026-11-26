import { formatDate } from '../quizData.js'
import './QuestionManager.css'

function QuestionManager({ quiz, state, loadError, saveError, list, onRetry, onAdd, children }) {
  const created = quiz.createdAt ? new Date(quiz.createdAt) : null

  return (
    <div className="question-manager">
      <div className="question-manager__side">
        <section className="question-manager__details" aria-labelledby="quiz-details-title">
          <h2 id="quiz-details-title" className="question-manager__heading">
            Quiz details
          </h2>
          {quiz.description ? (
            <p className="question-manager__description">{quiz.description}</p>
          ) : (
            <p className="question-manager__description is-empty">No description</p>
          )}
          <dl className="question-manager__facts">
            <div>
              <dt>Teacher</dt>
              <dd>{quiz.teacher?.fullName || 'Unknown'}</dd>
            </div>
            <div>
              <dt>Time limit</dt>
              <dd>{quiz.timeLimitMin} min</dd>
            </div>
            {created && !Number.isNaN(created.getTime()) && (
              <div>
                <dt>Created</dt>
                <dd>{formatDate(created)}</dd>
              </div>
            )}
          </dl>
        </section>

        {list}
      </div>

      <div className="question-manager__main">
        {saveError && (
          <div className="alert question-manager__alert" role="alert">
            {saveError}
          </div>
        )}

        {state === 'loading' && (
          <div className="question-manager__placeholder" aria-busy="true">
            <p className="question-manager__placeholder-text">Loading questions…</p>
          </div>
        )}

        {state === 'error' && (
          <div className="question-manager__placeholder" role="alert">
            <h2 className="question-manager__placeholder-title">Couldn’t load the questions</h2>
            <p className="question-manager__placeholder-text">{loadError}</p>
            <button type="button" className="btn btn-primary" onClick={onRetry}>
              Try again
            </button>
          </div>
        )}

        {state === 'empty' && (
          <div className="question-manager__placeholder">
            <h2 className="question-manager__placeholder-title">This quiz has no questions yet</h2>
            <button type="button" className="btn btn-primary" onClick={onAdd}>
              <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Add question
            </button>
          </div>
        )}

        {state === 'ready' && children}
      </div>
    </div>
  )
}

export default QuestionManager
