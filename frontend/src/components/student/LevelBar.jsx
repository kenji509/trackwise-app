import { levelThresholds } from '../../progressData.js'
import './LevelBar.css'

const THRESHOLDS = levelThresholds().sort((a, b) => a - b)

// "50%" and "80%" above a bar, centered on its tick marks. Shown once per
// list, above the first bar.
export function LevelScale() {
  return (
    <div className="level-scale" aria-hidden="true">
      {THRESHOLDS.map((threshold) => (
        <span key={threshold} className="level-scale__mark" style={{ left: `${threshold}%` }}>
          {threshold}%
        </span>
      ))}
    </div>
  )
}

// A bar filled to percent in its level color (accent: mint, sunny or coral from
// LEVELS in progressData.js), with tick marks where Needs practice and Strong begin.
// Decorative: the percent or count is always written next to it.
function LevelBar({ percent, accent }) {
  return (
    <div className={`level-bar accent-${accent}`} aria-hidden="true">
      <span className="level-bar__fill" style={{ width: `${percent}%` }} />
      {THRESHOLDS.map((threshold) => (
        <span key={threshold} className="level-bar__tick" style={{ left: `${threshold}%` }} />
      ))}
    </div>
  )
}

export default LevelBar
