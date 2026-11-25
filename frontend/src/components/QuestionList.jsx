import './QuestionList.css'

function QuestionList({ items, current, loading, emptyText = 'No questions yet.', status, busy, onSelect, onAdd }) {
  return (
    <section className="question-list" aria-labelledby="question-list-title">
      <div className="question-list__head">
        <h2 id="question-list-title" className="question-list__title">
          Questions
        </h2>
        {!loading && <span className="question-list__count">{items.length}</span>}
      </div>

      {loading && <p className="question-list__empty">Loading questions…</p>}
      {!loading && items.length === 0 && <p className="question-list__empty">{emptyText}</p>}

      {!loading && items.length > 0 && (
        <ol className="question-list__items">
          {items.map((item, index) => (
            <li key={item.key}>
              <button
                type="button"
                className="question-list__item"
                aria-current={index === current ? 'true' : undefined}
                onClick={() => onSelect(index)}
              >
                <span className="question-list__number" aria-hidden="true">
                  {index + 1}
                </span>
                <span className="question-list__body">
                  <span className="sr-only">Question {index + 1}: </span>
                  <span className={item.text ? 'question-list__text' : 'question-list__text is-empty'}>
                    {item.text || 'New question'}
                  </span>
                  <span className="question-list__meta">
                    {item.topic ? (
                      <span className={`topic-chip accent-${item.topic.accent}`}>{item.topic.name}</span>
                    ) : (
                      <span className="question-list__no-topic">No topic</span>
                    )}
                    {item.invalid && (
                      <span className="question-list__flag question-list__flag--invalid">
                        <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                          <circle cx="12" cy="12" r="9" />
                          <path d="M12 8v4M12 16h.01" />
                        </svg>
                        Needs fixing
                      </span>
                    )}
                    {!item.invalid && item.unsaved && <span className="question-list__flag">Unsaved</span>}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ol>
      )}

      <p className="question-list__status" role="status">
        {status}
      </p>

      <button
        id="question-list-add"
        type="button"
        className="btn btn-secondary question-list__add"
        onClick={onAdd}
        disabled={loading || busy}
      >
        <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 5v14M5 12h14" />
        </svg>
        Add question
      </button>
    </section>
  )
}

export default QuestionList
