import './StatusBadge.css'

// Draft (no questions yet) or Published (has questions), as a word.
// The quiz card's left edge repeats it in color, so color is never the only signal.
function StatusBadge({ status, className = '' }) {
  return (
    <p className={`status-badge status-badge--${status} ${className}`}>{status === 'published' ? 'Published' : 'Draft'}</p>
  )
}

export default StatusBadge
