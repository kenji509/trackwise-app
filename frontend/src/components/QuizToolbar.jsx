import SelectField from './SelectField.jsx'
import ViewToggle from './ViewToggle.jsx'
import './QuizToolbar.css'

// Search, teacher/topic filters, sort and grid/list toggle, then a row with the
// result count (read out by screen readers) and the active filters as removable chips.
// activeFilters: [{ key, label, onRemove }]
function QuizToolbar({
  search,
  onSearch,
  teacherId,
  teacherOptions,
  onTeacherChange,
  topicId,
  topicOptions,
  onTopicChange,
  sort,
  sortOptions,
  onSortChange,
  view,
  onViewChange,
  countText,
  activeFilters,
  onClearAll,
}) {
  return (
    <div className="toolbar">
      <div className="toolbar__controls">
        <div className="toolbar__search">
          <label htmlFor="quiz-search" className="sr-only">
            Search quizzes
          </label>
          <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
          </svg>
          <input
            id="quiz-search"
            className="toolbar__search-input"
            type="search"
            placeholder="Search quizzes or topics"
            value={search}
            onChange={(event) => onSearch(event.target.value)}
          />
        </div>

        <SelectField
          label="Teacher"
          value={teacherId}
          onChange={onTeacherChange}
          options={teacherOptions}
          allLabel="All"
        />
        <SelectField label="Topic" value={topicId} onChange={onTopicChange} options={topicOptions} allLabel="All" />
        <SelectField label="Sort" value={sort} onChange={onSortChange} options={sortOptions} />
        <ViewToggle value={view} onChange={onViewChange} />
      </div>

      <div className="toolbar__status">
        {/* role="status" announces the new count after each change */}
        <p className="toolbar__count" role="status">
          {countText}
        </p>

        {activeFilters.length > 0 && (
          <ul className="toolbar__filters" aria-label="Active filters">
            {activeFilters.map((filter) => (
              <li key={filter.key} className="filter-chip">
                {filter.label}
                <button
                  type="button"
                  className="filter-chip__remove"
                  onClick={filter.onRemove}
                  aria-label={`Remove filter: ${filter.label}`}
                >
                  <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </li>
            ))}
            <li>
              <button type="button" className="btn btn-ghost toolbar__clear" onClick={onClearAll}>
                Clear all
              </button>
            </li>
          </ul>
        )}
      </div>
    </div>
  )
}

export default QuizToolbar
