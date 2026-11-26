import './LevelBadge.css'

// Strong: a tick. Needs practice: a half-filled circle (part of the way
// there; a dash read as "minus 60%"). Weak: an exclamation mark.
const icons = {
  strong: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  practice: (
    <>
      <circle cx="12" cy="12" r="7" />
      <path d="M12 5a7 7 0 0 0 0 14Z" fill="currentColor" />
    </>
  ),
  weak: (
    <>
      <path d="M12 7v6" />
      <path d="M12 17h.01" />
    </>
  ),
}

function LevelBadge({ level, text, className = '' }) {
  return (
    <span className={`level-badge level-badge--${level.id} accent-${level.accent} ${className}`}>
      <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
        {icons[level.id]}
      </svg>
      {text ?? level.label}
    </span>
  )
}

export default LevelBadge
