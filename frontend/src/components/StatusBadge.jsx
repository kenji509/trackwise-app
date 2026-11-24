import './StatusBadge.css'

// Draft (no questions yet) or Published (has questions).
// Text + icon, so the color is never the only signal.
function StatusBadge({ status, className = '' }) {
  const published = status === 'published'

  return (
    <span className={`status-badge status-badge--${status} ${className}`}>
      <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
        {published ? (
          <>
            <circle cx="12" cy="12" r="9" />
            <path d="m8 12 3 3 5-6" />
          </>
        ) : (
          <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
        )}
      </svg>
      {published ? 'Published' : 'Draft'}
    </span>
  )
}

export default StatusBadge
