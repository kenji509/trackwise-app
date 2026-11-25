import { useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import QuizMenu from './QuizMenu.jsx'
import StatusBadge from './StatusBadge.jsx'
import TopicChips from './TopicChips.jsx'
import { formatDate, plural } from '../quizData.js'
import './QuizCard.css'

// Cards after this many share the last entrance delay
const MAX_STAGGER = 8

// One quiz, as a card (layout="grid") or a row (layout="list"). Same markup for
// both; QuizCard.css rearranges it. item comes from buildQuizViews() in quizData.js.
function QuizCard({ item, layout, index = 0, deleting, deleteError, onEdit, onManage, onDelete }) {
  const { quiz, questionCount, topics, accent, status, createdAt } = item
  const [confirming, setConfirming] = useState(false)
  const menuButtonRef = useRef(null)
  const titleId = `quiz-${quiz.quizId}-title`
  const confirmId = `quiz-${quiz.quizId}-confirm`

  // Hide the confirmation, then put focus back on the ⋯ button.
  // flushSync renders the change first so the focus lands reliably.
  function cancelDelete() {
    flushSync(() => setConfirming(false))
    menuButtonRef.current.focus()
  }

  function handleConfirmKeyDown(event) {
    if (event.key === 'Escape' && !deleting) cancelDelete()
  }

  const className = [
    'quiz-card',
    `quiz-card--${layout}`,
    `accent-${accent}`,
    confirming ? 'is-confirming' : '',
  ].join(' ')

  return (
    <article
      className={className}
      style={layout === 'grid' ? { '--i': Math.min(index, MAX_STAGGER) } : undefined}
      aria-labelledby={titleId}
    >
      <div className="quiz-card__band">
        {createdAt && (
          <time className="quiz-card__date" dateTime={createdAt.toISOString()}>
            <span className="sr-only">Created </span>
            {formatDate(createdAt)}
          </time>
        )}
        <QuizMenu
          label={`Actions for ${quiz.title}`}
          buttonRef={menuButtonRef}
          onEdit={onEdit}
          onManage={onManage}
          onDelete={() => setConfirming(true)}
          disabled={deleting}
        />
      </div>

      <StatusBadge status={status} className="quiz-card__status" />

      <div className="quiz-card__heading">
        <h3 id={titleId} className="quiz-card__title">
          {quiz.title}
        </h3>
        <p className="quiz-card__teacher" title={quiz.teacher.fullName}>
          by {quiz.teacher.fullName}
        </p>
      </div>

      {layout === 'grid' && (
        <p className={quiz.description ? 'quiz-card__description' : 'quiz-card__description is-empty'}>
          {quiz.description || 'No description'}
        </p>
      )}

      <TopicChips
        topics={topics}
        max={layout === 'grid' ? 4 : 2}
        emptyText="No questions yet"
        className="quiz-card__topics"
      />

      <p className="quiz-card__meta">
        <span>
          <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01" />
          </svg>
          {plural(questionCount, 'question')}
        </span>
        <span>
          <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
          </svg>
          <span className="sr-only">Time limit: </span>
          {quiz.timeLimitMin} min
        </span>
      </p>

      {confirming && (
        <div className="quiz-card__confirm" role="group" aria-labelledby={confirmId} onKeyDown={handleConfirmKeyDown}>
          <p id={confirmId} className="quiz-card__confirm-text">
            Delete “{quiz.title}”? This can’t be undone.
          </p>
          {deleteError && (
            <p className="alert quiz-card__error" role="alert">
              {deleteError}
            </p>
          )}
          <div className="quiz-card__confirm-buttons">
            <button type="button" className="btn btn-secondary" onClick={cancelDelete} disabled={deleting} autoFocus>
              Cancel
            </button>
            <button type="button" className="btn btn-danger-solid" onClick={onDelete} disabled={deleting}>
              {deleting ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        </div>
      )}
    </article>
  )
}

export default QuizCard
