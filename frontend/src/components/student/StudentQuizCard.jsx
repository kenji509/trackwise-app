import TopicChips from '../shared/TopicChips.jsx'
import { plural } from '../../quizData.js'
import './StudentQuizCard.css'

const MAX_STAGGER = 8

// lastPercent: the student's newest score on this quiz, null when not taken yet,
// undefined while past attempts are loading (then the line is left out).
function StudentQuizCard({ item, index = 0, lastPercent, starting, error, onStart }) {
  const { quiz, questionCount, topics } = item
  const titleId = `student-quiz-${quiz.quizId}-title`
  const startLabel = starting ? 'Starting…' : 'Start quiz'

  return (
    <article className="student-quiz-card" style={{ '--i': Math.min(index, MAX_STAGGER) }} aria-labelledby={titleId}>
      <div className="student-quiz-card__heading">
        <h2 id={titleId} className="student-quiz-card__title">
          {quiz.title}
        </h2>
        <p className="student-quiz-card__teacher">by {quiz.teacher.fullName}</p>
      </div>

      {quiz.description && <p className="student-quiz-card__description">{quiz.description}</p>}

      <TopicChips topics={topics} max={3} plain className="student-quiz-card__topics" />

      <p className="student-quiz-card__meta">
        <span>{plural(questionCount, 'question')}</span>
        <span>
          <span className="sr-only">Time limit: </span>
          {quiz.timeLimitMin} min
        </span>
      </p>

      {lastPercent !== undefined && (
        <p className="student-quiz-card__last">
          {lastPercent === null ? (
            'Not taken yet'
          ) : (
            <>
              Last score <strong>{lastPercent}%</strong>
            </>
          )}
        </p>
      )}

      {error && (
        <p className="alert" role="alert">
          {error}
        </p>
      )}

      <button
        type="button"
        className="btn btn-primary student-quiz-card__start"
        onClick={onStart}
        aria-label={`${startLabel}: ${quiz.title}`}
      >
        <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7 4.5v15l12-7.5z" />
        </svg>
        {startLabel}
      </button>
    </article>
  )
}

export default StudentQuizCard
