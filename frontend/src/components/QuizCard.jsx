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
// A plain white card: the status is a word, and the 4px left edge repeats it
// (mint for Published, sunny for Draft).
function QuizCard({ item, layout, index = 0, deleting, deleteError, onEdit, onManage, onDelete }) {
  const { quiz, questionCount, topics, status, createdAt } = item
  const [confirming, setConfirming] = useState(false)
  const menuButtonRef = useRef(null)
  const titleId = `quiz-${quiz.quizId}-title`
  const confirmId = `quiz-${quiz.quizId}-confirm`

  // Hide the confirmation, then put focus back on the Manage button.
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
    `quiz-card--${status}`,
    confirming ? 'is-confirming' : '',
  ].join(' ')

  return (
    <article
      className={className}
      style={layout === 'grid' ? { '--i': Math.min(index, MAX_STAGGER) } : undefined}
      aria-labelledby={titleId}
    >
      <div className="quiz-card__top">
        <StatusBadge status={status} className="quiz-card__status" />
        <QuizMenu
          label={`Manage ${quiz.title}`}
          buttonRef={menuButtonRef}
          onEdit={onEdit}
          onManage={onManage}
          onDelete={() => setConfirming(true)}
          disabled={deleting}
        />
      </div>

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
        plain
        className="quiz-card__topics"
      />

      <p className="quiz-card__meta">
        <span>{plural(questionCount, 'question')}</span>
        <span>
          <span className="sr-only">Time limit: </span>
          {quiz.timeLimitMin} min
        </span>
      </p>

      {layout === 'list' && createdAt && (
        <time className="quiz-card__date" dateTime={createdAt.toISOString()}>
          <span className="sr-only">Created </span>
          {formatDate(createdAt)}
        </time>
      )}

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
