import { useEffect, useId, useRef } from 'react'
import './ConfirmDialog.css'

function ConfirmDialog({ open, title, confirmLabel, cancelLabel, danger, onConfirm, onCancel, children }) {
  const dialogRef = useRef(null)
  const cancelRef = useRef(null)
  const titleId = useId()
  const bodyId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (open && !dialog.open) {
      dialog.showModal()
      cancelRef.current.focus()
    }
    if (!open && dialog.open) dialog.close()
  }, [open])

  function handleClose() {
    if (open) onCancel()
  }

  return (
    <dialog
      ref={dialogRef}
      className="confirm-dialog"
      aria-labelledby={titleId}
      aria-describedby={bodyId}
      onClose={handleClose}
    >
      <h2 id={titleId} className="confirm-dialog__title">
        {title}
      </h2>
      <div id={bodyId} className="confirm-dialog__body">
        {children}
      </div>
      <div className="confirm-dialog__buttons">
        <button ref={cancelRef} type="button" className="btn btn-secondary" onClick={onCancel}>
          {cancelLabel}
        </button>
        <button
          type="button"
          className={danger ? 'btn btn-danger-solid' : 'btn btn-primary'}
          onClick={onConfirm}
        >
          {confirmLabel}
        </button>
      </div>
    </dialog>
  )
}

export default ConfirmDialog
