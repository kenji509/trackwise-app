import LevelBar, { LevelScale } from './LevelBar.jsx'
import { levelFor } from '../../progressData.js'
import './TopicBreakdown.css'

// Score by topic on the Results screen. The square next to the name is the
// topic color; the bar is the level color with the same marks as My Progress.
function TopicBreakdown({ topics }) {
  if (topics.length === 0) {
    return <p className="topic-breakdown__empty">These questions have no topics yet.</p>
  }

  return (
    <ul className="topic-breakdown">
      {topics.map((topic, index) => (
        <li key={topic.topicId} className="topic-breakdown__item">
          <div className="topic-breakdown__top">
            <span className={`topic-breakdown__name accent-${topic.accent}`}>{topic.name}</span>
            <span className="topic-breakdown__count">
              <strong>{topic.correct}</strong> of {topic.total} correct
            </span>
          </div>
          {index === 0 && <LevelScale />}
          <LevelBar percent={topic.percent} accent={levelFor(topic.percent).accent} />
        </li>
      ))}
    </ul>
  )
}

export default TopicBreakdown
