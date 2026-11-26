import ChoiceFields from './ChoiceFields.jsx'
import FormField from './FormField.jsx'
import { QUESTION_MAX } from '../questionForm.js'
import './QuestionEditor.css'

function QuestionEditor({
  number,
  total,
  draft,
  topicOptions,
  errors,
  busy,
  onField,
  onChoiceText,
  onCorrect,
  onDelete,
  onPrevious,
  onNext,
}) {
  const isFirst = number === 1
  const isLast = number === total

  return (
    <section className="question-editor" aria-labelledby="question-editor-title">
      <div className="question-editor__head">
        <h2 id="question-editor-title" className="question-editor__title" tabIndex={-1}>
          Question {number}
          <span className="question-editor__of"> of {total}</span>
        </h2>
        {draft.questionId === null && <span className="question-editor__new">Unsaved</span>}
        <button
          type="button"
          className="btn btn-ghost question-editor__delete"
          onClick={onDelete}
          disabled={busy}
        >
          <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
          Delete question
        </button>
      </div>

      <FormField
        label="Topic"
        name="topicId"
        type="select"
        options={topicOptions}
        value={draft.topicId}
        onChange={onField}
        error={errors.topicId}
        hint={topicOptions.length === 0 ? 'No topics yet. Add a topic first.' : ''}
        required
      />

      <FormField
        label="Question"
        name="questionText"
        type="textarea"
        value={draft.questionText}
        onChange={onField}
        error={errors.questionText}
        maxLength={QUESTION_MAX}
        required
      />

      <ChoiceFields
        choices={draft.choices}
        correct={draft.correct}
        error={errors.correct}
        choiceErrors={draft.choices.map((_, index) => errors[`choice${index}`])}
        onText={onChoiceText}
        onCorrect={onCorrect}
      />

      <div className="question-editor__nav">
        <button
          type="button"
          className="btn btn-secondary"
          aria-disabled={isFirst || undefined}
          onClick={isFirst ? undefined : onPrevious}
        >
          <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Previous
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          aria-disabled={isLast || undefined}
          onClick={isLast ? undefined : onNext}
        >
          Next
          <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>
    </section>
  )
}

export default QuestionEditor
