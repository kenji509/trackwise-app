import LevelBadge from './LevelBadge.jsx'
import './ReviewCard.css'

function ReviewCard({ topics }) {
  return (
    <section className="review-card" aria-labelledby="review-card-title">
      <div className="review-card__head">
        <h3 id="review-card-title" className="review-card__title">
          Recommended review
        </h3>
        <p className="review-card__intro">
          {topics.length > 1
            ? 'Your two lowest-scoring topics. Practice these next.'
            : 'Your lowest-scoring topic. Practice it next.'}
        </p>
      </div>

      <ol className="review-card__list">
        {topics.map((topic, index) => (
          <li key={topic.topicId} className="review-card__item">
            <span className="review-card__rank" aria-hidden="true">
              {index + 1}
            </span>
            <div className="review-card__body">
              <div className="review-card__top">
                <span className="review-card__name">{topic.name}</span>
                <LevelBadge level={topic.level} text={`${topic.level.label} · ${topic.percent}%`} />
              </div>
              <p className="review-card__meta">
                {topic.correct} of {topic.asked} answers correct
                {topic.quizzes.length > 0 && ` · in ${topic.quizzes.join(', ')}`}
              </p>
            </div>
          </li>
        ))}
      </ol>

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
