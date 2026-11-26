import { answerStatus } from '../../quizAttempt.js'
import { topicAccent } from '../../quizData.js'
import './AnswerReview.css'

function markIcon(right) {
  return (
    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
      {right ? <path d="m5 12.5 4.5 4.5L19 7.5" /> : <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />}
    </svg>
  )
}

function AnswerReview({ answers }) {
  return (
    <ol className="answer-review">
      {answers.map((answer, index) => {
        const status = answerStatus(answer)
        const right = status === 'correct'
        const topic = answer.question.topic

        return (
          <li key={answer.answerId} className="answer-review__item">
            <div className="answer-review__top">
              <p className="answer-review__number">Question {index + 1}</p>
              {topic && (
                <span className={`topic-chip accent-${topicAccent(topic.topicId)}`}>{topic.name}</span>
              )}
            </div>

            <p className="answer-review__question">{answer.question.questionText}</p>

            <div className="answer-review__answers">
              <div className={`answer-review__row answer-review__row--${right ? 'right' : 'wrong'}`}>
                <span className="answer-review__mark">
                  {markIcon(right)}
                  <span className="sr-only">{right ? 'Correct.' : 'Incorrect.'}</span>
                </span>
                <div className="answer-review__text">
                  <p className="answer-review__label">Your answer</p>
                  {answer.choice ? (
                    <p className="answer-review__choice">{answer.choice.choiceText}</p>
                  ) : (
                    <p className="answer-review__choice answer-review__choice--empty">Not answered</p>
                  )}
                </div>
              </div>

              {!right && (
                <div className="answer-review__row answer-review__row--right">
                  <span className="answer-review__mark">{markIcon(true)}</span>
                  <div className="answer-review__text">
                    <p className="answer-review__label">Correct answer</p>
                    {answer.correctChoice ? (
                      <p className="answer-review__choice">{answer.correctChoice.choiceText}</p>
                    ) : (
                      <p className="answer-review__choice answer-review__choice--empty">
                        No correct answer was set for this question.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

export default AnswerReview
