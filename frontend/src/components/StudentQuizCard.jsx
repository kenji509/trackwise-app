import TopicChips from './TopicChips.jsx'
import { plural } from '../quizData.js'
import './StudentQuizCard.css'

const MAX_STAGGER = 8

function StudentQuizCard({ item, index = 0, starting, error, onStart }) {
  const { quiz, questionCount, topics, accent } = item
  const titleId = `student-quiz-${quiz.quizId}-title`
  const startLabel = starting ? 'Starting…' : 'Start quiz'

  return (
    <article
      className={`student-quiz-card accent-${accent}`}
      style={{ '--i': Math.min(index, MAX_STAGGER) }}
      aria-labelledby={titleId}
    >
      <div className="student-quiz-card__band">
        <span className="student-quiz-card__time">
          <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
          </svg>
          <span className="sr-only">Time limit: </span>
          {quiz.timeLimitMin} min
        </span>
      </div>

      <div className="student-quiz-card__heading">
        <h3 id={titleId} className="student-quiz-card__title">
          {quiz.title}
        </h3>
        <p className="student-quiz-card__teacher">by {quiz.teacher.fullName}</p>
      </div>

      {quiz.description && <p className="student-quiz-card__description">{quiz.description}</p>}

      <TopicChips topics={topics} max={3} className="student-quiz-card__topics" />

      <p className="student-quiz-card__meta">
        <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01" />
        </svg>
        {plural(questionCount, 'question')}
      </p>

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
