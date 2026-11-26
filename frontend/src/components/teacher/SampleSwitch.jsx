import './SampleSwitch.css'

// On/off switch for the sample quizzes (off by default)
function SampleSwitch({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className="switch"
      onClick={() => onChange(!checked)}
    >
      <span className="switch__track" aria-hidden="true">
        <span className="switch__thumb" />
      </span>
      Show sample quizzes
    </button>
  )
}

export default SampleSwitch
