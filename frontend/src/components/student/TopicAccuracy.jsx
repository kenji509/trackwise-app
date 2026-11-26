import LevelBadge from './LevelBadge.jsx'
import LevelBar, { LevelScale } from './LevelBar.jsx'
import { LEVELS } from '../../progressData.js'
import './TopicAccuracy.css'

const TICK_TEXT = LEVELS.filter((level) => level.min > 0)
  .map((level) => `${level.label} starts at ${level.min}%`)
  .join(' and ')

function TopicAccuracy({ topics }) {
  return (
    <section className="topic-accuracy" aria-labelledby="topic-accuracy-title">
      <h2 id="topic-accuracy-title" className="topic-accuracy__title">
        Accuracy per topic
      </h2>
      <p className="sr-only">Each bar has a mark where {TICK_TEXT}.</p>

      <ul className="topic-accuracy__list">
        {topics.map((topic, index) => (
          <li key={topic.topicId} className="topic-accuracy__item">
            <div className="topic-accuracy__top">
              <span className="topic-accuracy__name">{topic.name}</span>
              <span className="topic-accuracy__value">{topic.percent}%</span>
              <LevelBadge level={topic.level} />
            </div>
            {index === 0 && <LevelScale />}
            <LevelBar percent={topic.percent} accent={topic.level.accent} />
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
