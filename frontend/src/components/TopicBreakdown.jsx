import './TopicBreakdown.css'

function TopicBreakdown({ topics }) {
  if (topics.length === 0) {
    return <p className="topic-breakdown__empty">These questions have no topics yet.</p>
  }

  return (
    <ul className="topic-breakdown">
      {topics.map((topic) => (
        <li key={topic.topicId} className={`topic-breakdown__item accent-${topic.accent}`}>
          <div className="topic-breakdown__top">
            <span className="topic-breakdown__name">{topic.name}</span>
            <span className="topic-breakdown__count">
              <strong>{topic.correct}</strong> of {topic.total} correct
            </span>
          </div>
          <div className="topic-breakdown__bar" aria-hidden="true">
            <span className="topic-breakdown__fill" style={{ width: `${topic.percent}%` }} />
          </div>
        </li>
      ))}
    </ul>
  )
}

export default TopicBreakdown
