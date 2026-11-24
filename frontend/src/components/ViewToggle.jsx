import './ViewToggle.css'

// Grid / List switch: two toggle buttons, the current one has aria-pressed="true"
function ViewToggle({ value, onChange }) {
  return (
    <div className="view-toggle" role="group" aria-label="Layout">
      <button
        type="button"
        className="view-toggle__button"
        aria-pressed={value === 'grid'}
        aria-label="Grid view"
        title="Grid view"
        onClick={() => onChange('grid')}
      >
        <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="3" width="7" height="7" rx="2" />
          <rect x="14" y="3" width="7" height="7" rx="2" />
          <rect x="3" y="14" width="7" height="7" rx="2" />
          <rect x="14" y="14" width="7" height="7" rx="2" />
        </svg>
      </button>
      <button
        type="button"
        className="view-toggle__button"
        aria-pressed={value === 'list'}
        aria-label="List view"
        title="List view"
        onClick={() => onChange('list')}
      >
        <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
        </svg>
      </button>
    </div>
  )
}

export default ViewToggle
