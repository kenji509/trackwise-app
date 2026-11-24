import { useRef } from 'react'
import { flushSync } from 'react-dom'
import './FormButtons.css'

// Cancel (secondary) and Save (primary, submits the form).
// When the user tries to leave with unsaved edits, the row turns into a
// "Discard changes?" confirmation with Keep editing / Discard.
function FormButtons({
  saveLabel,
  saving,
  confirmingDiscard,
  onCancel,
  onKeepEditing,
  onDiscard,
}) {
  const cancelRef = useRef(null)

  // Hide the confirmation, then put focus back on Cancel
  function keepEditing() {
    flushSync(() => onKeepEditing())
    cancelRef.current.focus()
  }

  if (confirmingDiscard) {
    return (
      // Different keys make React mount fresh buttons, so autoFocus runs
      // (otherwise "Keep editing" would reuse the Save button's element)
      <div
        key="confirm"
        className="form-buttons form-buttons--confirm"
        role="group"
        aria-labelledby="discard-text"
      >
        <p id="discard-text" className="form-buttons__text">
          Discard your unsaved changes?
        </p>
        <button type="button" className="btn btn-secondary" onClick={keepEditing} autoFocus>
          Keep editing
        </button>
        <button type="button" className="btn btn-danger-solid" onClick={onDiscard}>
          Discard
        </button>
      </div>
    )
  }

  return (
    <div key="buttons" className="form-buttons">
      <button
        ref={cancelRef}
        id="form-cancel"
        type="button"
        className="btn btn-secondary"
        onClick={onCancel}
        disabled={saving}
      >
        Cancel
      </button>
      {/* Stays enabled so a click shows what needs fixing; disabled only while saving */}
      <button type="submit" className="btn btn-primary" disabled={saving}>
        {saveLabel}
      </button>
    </div>
  )
}

export default FormButtons
