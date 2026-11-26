import { useEffect, useRef, useState } from 'react'
import './Toast.css'

const TOAST_MS = 4000

// Success message after create/save/delete. Shows one toast at a time.
// toast: { id, title, description } or null.
// - Screen readers hear it through a polite status region that is always on
//   the page (so the announcement isn't missed); focus never moves.
// - Disappears after 4s; the timer pauses while the pointer or focus is on it.
// Errors are never shown here: they stay next to what failed until fixed.
function Toast({ toast, onDismiss }) {
  const [paused, setPaused] = useState(false)

  // Always call the latest onDismiss without restarting the timer on every render
  const dismissRef = useRef(onDismiss)
  useEffect(() => {
    dismissRef.current = onDismiss
  })

  useEffect(() => {
    if (!toast || paused) return
    const timer = setTimeout(() => dismissRef.current(), TOAST_MS)
    return () => clearTimeout(timer)
  }, [toast, paused])

  return (
    <div className="toast-viewport">
      <p className="sr-only" role="status">
        {toast ? `${toast.title}. ${toast.description}` : ''}
      </p>

      {toast && (
        <div
          key={toast.id}
          className="toast"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <svg className="icon toast__icon" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="m8 12 3 3 5-6" />
          </svg>
          {/* Already announced by the status region above */}
          <div className="toast__text" aria-hidden="true">
            <p className="toast__title">{toast.title}</p>
            <p className="toast__description">{toast.description}</p>
          </div>
          <button
            type="button"
            className="icon-btn toast__close"
            onClick={onDismiss}
            aria-label="Dismiss notification"
          >
            <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}

export default Toast
