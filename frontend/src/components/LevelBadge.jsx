import './LevelBadge.css'

const icons = {
  strong: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  practice: <path d="M6 12h12" />,
  weak: (
    <>
      <path d="M12 7v6" />
      <path d="M12 17h.01" />
    </>
  ),
}

function LevelBadge({ level, text, className = '' }) {
  return (
    <span className={`level-badge accent-${level.accent} ${className}`}>
      <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
        {icons[level.id]}
      </svg>
      {text ?? level.label}
    </span>
  )
}

export default LevelBadge
