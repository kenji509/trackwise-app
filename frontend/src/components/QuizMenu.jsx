import { useEffect, useId, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import './QuizMenu.css'

// "⋯" button that opens Edit / Manage questions / Delete. Manage questions only
// shows when onManage is given (not for sample quizzes). Always visible (not hover-only), so it
// works with touch, mouse and keyboard (UI UX Pro Max: hover-vs-tap).
// Keyboard (WAI-ARIA menu button): Enter/Space/↓ open on the first item, ↑ on the
// last; ↑/↓/Home/End move; Esc closes and returns focus; Tab closes.
// buttonRef lets the card put focus back on this button (e.g. after "Cancel" delete).
function QuizMenu({ label, buttonRef, onEdit, onManage, onDelete, disabled }) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)
  const buttonId = useId()
  const menuId = useId()

  // Clicking anywhere outside closes the menu
  useEffect(() => {
    if (!open) return
    function handlePointerDown(event) {
      if (!menuRef.current?.contains(event.target) && !buttonRef.current?.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [open, buttonRef])

  function items() {
    return [...menuRef.current.querySelectorAll('[role="menuitem"]')]
  }

  // Render the menu now (flushSync) so its items exist when we focus one
  function openMenu(focusLast = false) {
    flushSync(() => setOpen(true))
    const list = items()
    list[focusLast ? list.length - 1 : 0].focus()
  }

  function closeMenu() {
    flushSync(() => setOpen(false))
    buttonRef.current.focus()
  }

  function handleButtonClick() {
    if (open) closeMenu()
    else openMenu()
  }

  function handleButtonKeyDown(event) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      openMenu()
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      openMenu(true)
    }
  }

  function handleMenuKeyDown(event) {
    const list = items()
    const index = list.indexOf(document.activeElement)
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      list[(index + 1) % list.length].focus()
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      list[(index - 1 + list.length) % list.length].focus()
    } else if (event.key === 'Home') {
      event.preventDefault()
      list[0].focus()
    } else if (event.key === 'End') {
      event.preventDefault()
      list[list.length - 1].focus()
    } else if (event.key === 'Escape') {
      event.preventDefault()
      event.stopPropagation()
      closeMenu()
    } else if (event.key === 'Tab') {
      setOpen(false) // let focus move on naturally
    }
  }

  // Close first and return focus to the button, then run the action.
  // (The edit dialog remembers the focused element and returns focus there.)
  function choose(action) {
    closeMenu()
    action()
  }

  return (
    <div className="quiz-menu">
      <button
        ref={buttonRef}
        id={buttonId}
        type="button"
        className="icon-btn quiz-menu__button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={handleButtonClick}
        onKeyDown={handleButtonKeyDown}
        disabled={disabled}
      >
        <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="5" cy="12" r="1.3" />
          <circle cx="12" cy="12" r="1.3" />
          <circle cx="19" cy="12" r="1.3" />
        </svg>
      </button>

      {open && (
        <div
          ref={menuRef}
          id={menuId}
          className="quiz-menu__list"
          role="menu"
          aria-labelledby={buttonId}
          onKeyDown={handleMenuKeyDown}
        >
          <button type="button" role="menuitem" tabIndex={-1} className="quiz-menu__item" onClick={() => choose(onEdit)}>
            <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
            </svg>
            Edit
          </button>
          {onManage && (
            <button type="button" role="menuitem" tabIndex={-1} className="quiz-menu__item" onClick={() => choose(onManage)}>
              <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M10 6h11M10 12h11M10 18h11" />
                <path d="m3 6 1.5 1.5L7 5M3 12l1.5 1.5L7 11M3 18l1.5 1.5L7 17" />
              </svg>
              Manage questions
            </button>
          )}
          <div className="quiz-menu__separator" role="separator" />
          <button
            type="button"
            role="menuitem"
            tabIndex={-1}
            className="quiz-menu__item quiz-menu__item--danger"
            onClick={() => choose(onDelete)}
          >
            <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            Delete
          </button>
        </div>
      )}
    </div>
  )
}

export default QuizMenu
