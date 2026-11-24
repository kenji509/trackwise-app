import ChoiceList from './ChoiceList.jsx'
import TopicChips from './TopicChips.jsx'
import { topicAccent } from '../quizData.js'
import './QuestionCard.css'

function QuestionCard({
  number,
  total,
  question,
  selectedChoiceId,
  onSelect,
  marked,
  onToggleMark,
  onPrevious,
  onNext,
}) {
  const isFirst = number === 1
  const isLast = number === total
  const topics = question.topic
    ? [{ ...question.topic, accent: topicAccent(question.topic.topicId) }]
    : []

  return (
    <section className="question-card" aria-labelledby="question-text">
      <div className="question-card__top">
        <p className="question-card__count">
          <strong>Question {number}</strong> of {total}
        </p>
        <TopicChips topics={topics} className="question-card__topic" />
      </div>

      <div className="question-card__bar" aria-hidden="true">
        <span className="question-card__bar-fill" style={{ width: `${(number / total) * 100}%` }} />
      </div>

      <p className="sr-only" aria-live="polite">
        {`Question ${number} of ${total}: ${question.questionText}`}
      </p>

      <h2 id="question-text" className="question-card__text" tabIndex={-1}>
        {question.questionText}
      </h2>

      <ChoiceList
        key={question.questionId}
        choices={question.choices}
        selectedId={selectedChoiceId}
        onSelect={onSelect}
        labelledBy="question-text"
      />

      <div className="question-card__footer">
        <button
          type="button"
          className="question-card__mark"
          aria-pressed={marked}
          onClick={onToggleMark}
        >
          <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
            <path d="M4 22v-7" />
          </svg>
          Mark for review
        </button>

        <div className="question-card__nav">
          <button
            type="button"
            className="btn btn-secondary"
            aria-disabled={isFirst || undefined}
            onClick={isFirst ? undefined : onPrevious}
          >
            <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="m15 18-6-6 6-6" />
            </svg>
            Previous
          </button>
          <button
            type="button"
            className="btn btn-primary"
            aria-disabled={isLast || undefined}
            onClick={isLast ? undefined : onNext}
          >
            Next
            <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}

export default QuestionCard
