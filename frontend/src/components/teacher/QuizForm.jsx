import { useEffect, useRef } from 'react'
import './QuizForm.css'

// Add/edit form shown in a native <dialog> (a bottom sheet on mobile).
// The browser keeps focus inside it and returns focus when it closes.
// onCancel: the user asked to leave (Esc or ✕); the app decides what happens.
// onClosed: the browser closed the dialog by itself (see handleClose).
function QuizForm({ open, title, error, onSubmit, onCancel, onClosed, children }) {
  const dialogRef = useRef(null)

  // Open or close the dialog when the "open" prop changes
  useEffect(() => {
    const dialog = dialogRef.current
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  function handleSubmit(event) {
    event.preventDefault()
    onSubmit()
  }

  // Esc key: let React state close the dialog.
  // Browsers won't let a page block Esc twice in a row (so users can't be
  // trapped): then the event isn't cancelable and the dialog closes anyway.
  function handleCancel(event) {
    if (!event.cancelable) return // handleClose will sync the state
    event.preventDefault()
    onCancel()
  }

  // Fires on every close. If React still thinks the dialog is open, the
  // browser closed it by itself, so update the state to match.
  function handleClose() {
    if (open) onClosed()
  }

  return (
    <dialog
      ref={dialogRef}
      className="dialog"
      aria-labelledby="quiz-form-title"
      onCancel={handleCancel}
      onClose={handleClose}
    >
      <form className="dialog__form" noValidate onSubmit={handleSubmit}>
        <div className="dialog__header">
          <div>
            <h2 id="quiz-form-title" className="dialog__title">
              {title}
            </h2>
            <p className="dialog__subtitle">Fields marked * are required.</p>
          </div>
          <button type="button" className="icon-btn" onClick={onCancel} aria-label="Close">
            <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="dialog__body">
          {/* Server error (e.g. backend offline); role="alert" reads it out */}
          {error && (
            <p className="alert" role="alert">
              {error}
            </p>
          )}
          {children}
        </div>
      </form>
    </dialog>
  )
}

export default QuizForm
