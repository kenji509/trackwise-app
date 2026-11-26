import { topicAccent } from '../quizData.js'
import './ReviewCard.css'

function ReviewCard({ topics }) {
  return (
    <section className="review-card" aria-labelledby="review-card-title">
      <h2 id="review-card-title" className="review-card__title">
        Needs practice
      </h2>

      <ul className="review-card__list">
        {topics.map((topic) => (
          <li key={topic.topicId} className="review-card__item">
            <div className="review-card__top">
              <span className={`topic-chip accent-${topicAccent(topic.topicId)} review-card__name`}>{topic.name}</span>
              <span className="review-card__percent">{topic.percent}%</span>
            </div>
            <p className="review-card__meta">
              {topic.correct} of {topic.asked} answers correct
              {topic.quizzes.length > 0 && ` in ${topic.quizzes.join(', ')}`}
            </p>
          </li>
        ))}
      </ul>

      <a href="#quizzes" className="btn btn-primary review-card__action">
        <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8 5v14l11-7z" />
        </svg>
        Practice in Available Quizzes
      </a>
    </section>
  )
}

export default ReviewCard
