import './FormField.css'

// Labeled input, textarea or select with optional hint, counter and error.
// For a select, options is a list of { value, label }.
function FormField({ label, name, type = 'text', value, error, hint, options, required, ...inputProps }) {
  const id = `field-${name}`
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  const showCounter = type === 'textarea' && inputProps.maxLength

  // Link the hint and error text to the input for screen readers
  const describedBy = [hint && hintId, error && errorId].filter(Boolean).join(' ')

  const controlProps = {
    id,
    name,
    value,
    required,
    className: 'field__control',
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy || undefined,
    ...inputProps,
  }

  return (
    <div className="field">
      <label htmlFor={id} className="field__label">
        {label}
        {required && (
          <span className="field__required" aria-hidden="true">
            {' '}*
          </span>
        )}
      </label>

      {type === 'textarea' && <textarea rows={4} {...controlProps} />}

      {type === 'select' && (
        <select {...controlProps}>
          <option value="">Choose {label.toLowerCase()}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}

      {type !== 'textarea' && type !== 'select' && <input type={type} {...controlProps} />}

      {(hint || showCounter) && (
        <div className="field__meta">
          {hint && <p id={hintId}>{hint}</p>}
          {showCounter && (
            <span className="field__counter">
              {value.length}/{inputProps.maxLength}
            </span>
          )}
        </div>
      )}

      {error && (
        <p id={errorId} className="field__error">
          <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
          {error}
        </p>
      )}
    </div>
  )
}

export default FormField
