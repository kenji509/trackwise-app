import { useId } from 'react'
import './SelectField.css'

// Compact select with its label shown inside the field ("Teacher  All ▾"),
// so every control has a visible label without an extra row.
// The label points at the select with htmlFor, so its accessible name is just
// the label (wrapping the select would add the current value to the name).
// options: [{ value, label, count?, disabled? }]; count is shown as "(3)".
// Options with count 0 are disabled unless they are the current value.
function SelectField({ label, value, onChange, options, allLabel }) {
  const id = useId()

  return (
    <div className="select-field">
      <label htmlFor={id} className="select-field__label">
        {label}
      </label>
      <select
        id={id}
        className="select-field__control"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {allLabel && <option value="">{allLabel}</option>}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled ?? (option.count === 0 && option.value !== value)}
          >
            {option.count === undefined ? option.label : `${option.label} (${option.count})`}
          </option>
        ))}
      </select>
      <svg className="icon select-field__chevron" viewBox="0 0 24 24" aria-hidden="true">
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>
  )
}

export default SelectField
