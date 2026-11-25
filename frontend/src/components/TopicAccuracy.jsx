import LevelBadge from './LevelBadge.jsx'
import { LEVELS, levelRange } from '../progressData.js'
import './TopicAccuracy.css'

function TopicAccuracy({ topics }) {
  return (
    <section className="topic-accuracy" aria-labelledby="topic-accuracy-title">
      <div className="topic-accuracy__head">
        <h3 id="topic-accuracy-title" className="topic-accuracy__title">
          Accuracy per topic
        </h3>
        <ul className="topic-accuracy__key" aria-label="Levels">
          {LEVELS.map((level) => (
            <li key={level.id}>
              <LevelBadge level={level} text={`${level.label}: ${levelRange(level)}`} />
            </li>
          ))}
        </ul>
      </div>

      <ul className="topic-accuracy__list">
        {topics.map((topic) => (
          <li key={topic.topicId} className={`topic-accuracy__item accent-${topic.level.accent}`}>
            <div className="topic-accuracy__top">
              <span className="topic-accuracy__name">{topic.name}</span>
              <span className="topic-accuracy__value">{topic.percent}%</span>
              <LevelBadge level={topic.level} />
            </div>
            <div className="topic-accuracy__track" aria-hidden="true">
              <span className="topic-accuracy__fill" style={{ width: `${topic.percent}%` }} />
            </div>
            <p className="topic-accuracy__count">
              {topic.correct} of {topic.asked} answers correct
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default TopicAccuracy
