import './SampleNotice.css'

// Shown while sample quizzes are on, so nobody mistakes them for real data
function SampleNotice({ onTurnOff }) {
  return (
    <div className="sample-notice" role="note">
      <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8h.01M11 12h1v4h1" />
      </svg>
      <p className="sample-notice__text">
        You’re viewing <strong>sample quizzes</strong>. Changes stay in this browser tab and aren’t
        saved to the server.
      </p>
      <button type="button" className="btn btn-secondary sample-notice__button" onClick={onTurnOff}>
        Turn off samples
      </button>
    </div>
  )
}

export default SampleNotice
