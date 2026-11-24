import { useState } from 'react'
import './TopicChips.css'

// Topic labels in their topic color. They're static labels, not buttons.
// With more than `max` topics, a "+n" button reveals the rest, so no topic is
// ever hidden for good (UI UX Pro Max: chip-collection-reflow).
function TopicChips({ topics, max = Infinity, emptyText, className = '' }) {
  const [expanded, setExpanded] = useState(false)

  if (topics.length === 0) {
    return emptyText ? <p className={`topic-chips__empty ${className}`}>{emptyText}</p> : null
  }

  const shown = expanded ? topics : topics.slice(0, max)
  const hiddenCount = topics.length - shown.length

  return (
    <ul className={`topic-chips ${className}`} aria-label="Topics">
      {shown.map((topic) => (
        <li key={topic.topicId} className={`topic-chip accent-${topic.accent}`}>
          {topic.name}
        </li>
      ))}
      {hiddenCount > 0 && (
        <li>
          <button
            type="button"
            className="topic-chip topic-chip--more"
            onClick={() => setExpanded(true)}
            aria-label={`Show ${hiddenCount} more ${hiddenCount === 1 ? 'topic' : 'topics'}`}
          >
            +{hiddenCount}
          </button>
        </li>
      )}
    </ul>
  )
}

export default TopicChips
