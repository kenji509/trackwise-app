import { useState } from 'react'
import { choiceLetter } from '../quizAttempt.js'
import './ChoiceList.css'

function ChoiceList({ choices, selectedId, onSelect, labelledBy }) {
  const selectedIndex = choices.findIndex((choice) => choice.choiceId === selectedId)
  const [focusIndex, setFocusIndex] = useState(selectedIndex >= 0 ? selectedIndex : 0)

  function handleKeyDown(event) {
    const buttons = [...event.currentTarget.querySelectorAll('[role="radio"]')]
    const index = buttons.indexOf(event.target)
    if (index === -1) return

    const moves = {
      ArrowDown: index + 1,
      ArrowRight: index + 1,
      ArrowUp: index - 1,
      ArrowLeft: index - 1,
      Home: 0,
      End: buttons.length - 1,
    }
    if (!Object.hasOwn(moves, event.key)) return

    event.preventDefault()
    buttons[(moves[event.key] + buttons.length) % buttons.length].focus()
  }

  return (
    <div
      className="choice-list"
      role="radiogroup"
      aria-labelledby={labelledBy}
      onKeyDown={handleKeyDown}
    >
      {choices.map((choice, index) => {
        const checked = choice.choiceId === selectedId
        const letter = choiceLetter(index)
        return (
          <button
            key={choice.choiceId}
            type="button"
            role="radio"
            aria-checked={checked}
            aria-label={`${letter}. ${choice.choiceText}`}
            tabIndex={index === focusIndex ? 0 : -1}
            className="choice"
            onFocus={() => setFocusIndex(index)}
            onClick={() => {
              setFocusIndex(index)
              onSelect(choice.choiceId)
            }}
          >
            <span className="choice__letter">{letter}</span>
            <span className="choice__text">{choice.choiceText}</span>
            <svg className="icon choice__check" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="m8 12 3 3 5-6" />
            </svg>
          </button>
        )
      })}
    </div>
  )
}

export default ChoiceList
