import { formatClock, spokenDuration, timerLevel, timerWarning } from '../quizAttempt.js'
import './QuizTimer.css'

function QuizTimer({ seconds, totalSeconds }) {
  const level = timerLevel(seconds, totalSeconds)

  return (
    <>
      <div
        className={`quiz-timer quiz-timer--${level}`}
        role="timer"
        aria-label={`Time left: ${spokenDuration(seconds)}`}
      >
        <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="13" r="8" />
          <path d="M12 9v4l2.5 2M9.5 2.5h5" />
        </svg>
        <span aria-hidden="true">{formatClock(seconds)}</span>
      </div>
      <p className="sr-only" aria-live="polite">
        {timerWarning(level)}
      </p>
    </>
  )
}

export default QuizTimer
