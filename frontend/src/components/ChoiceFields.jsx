import { choiceLetter } from '../quizAttempt.js'
import { CHOICE_MAX } from '../questionForm.js'
import './ChoiceFields.css'

function errorIcon() {
  return (
    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4M12 16h.01" />
    </svg>
  )
}

function ChoiceFields({ choices, correct, error, choiceErrors, onText, onCorrect }) {
  const describedBy = ['choice-fields-hint', error && 'choice-fields-error'].filter(Boolean).join(' ')

  return (
    <fieldset className="choice-fields" aria-describedby={describedBy}>
      <legend className="choice-fields__legend">
        Answer choices
        <span className="field__required" aria-hidden="true">
          {' '}*
        </span>
      </legend>

      <p id="choice-fields-hint" className="choice-fields__hint">
        {correct === null ? (
          'Fill in all four choices, then select the circle next to the correct one.'
        ) : (
          <>
            Correct answer: <strong>{choiceLetter(correct)}</strong>
          </>
        )}
      </p>

      {error && (
        <p id="choice-fields-error" className="choice-fields__error">
          {errorIcon()}
          {error}
        </p>
      )}

      <ol className="choice-fields__list">
        {choices.map((choice, index) => {
          const letter = choiceLetter(index)
          const textId = `choice-text-${index}`
          const errorId = `${textId}-error`
          const isCorrect = index === correct
          const choiceError = choiceErrors[index]

          return (
            <li key={index} className={isCorrect ? 'choice-field is-correct' : 'choice-field'}>
              <label className="choice-field__pick">
                <input
                  type="radio"
                  id={`choice-correct-${index}`}
                  name="correct-choice"
                  className="choice-field__radio"
                  checked={isCorrect}
                  onChange={() => onCorrect(index)}
                  aria-invalid={error ? true : undefined}
                />
                <span className="sr-only">{letter} is the correct answer</span>
              </label>

              <label htmlFor={textId} className="choice-field__letter">
                <span className="sr-only">Choice </span>
                {letter}
              </label>

              <input
                id={textId}
                className="field__control choice-field__input"
                value={choice.choiceText}
                onChange={(event) => onText(index, event.target.value)}
                maxLength={CHOICE_MAX}
                autoComplete="off"
                aria-invalid={choiceError ? true : undefined}
                aria-describedby={choiceError ? errorId : undefined}
              />

              {choiceError && (
                <p id={errorId} className="choice-field__error">
                  {errorIcon()}
                  {choiceError}
                </p>
              )}
            </li>
          )
        })}
      </ol>
    </fieldset>
  )
}

export default ChoiceFields
