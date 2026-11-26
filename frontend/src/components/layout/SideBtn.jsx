import './SideBtn.css'

// Outline icons on a 24px grid, one per page.
const icons = {
  dashboard: (
    <>
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </>
  ),
  quizzes: (
    <>
      <rect x="8" y="2" width="8" height="4" rx="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="m9 14 2 2 4-4" />
    </>
  ),
  questions: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01" />
    </>
  ),
  topics: (
    <>
      <path d="m12 2 10 5-10 5L2 7l10-5Z" />
      <path d="m2 17 10 5 10-5M2 12l10 5 10-5" />
    </>
  ),
  progress: (
    <>
      <path d="M3 3v18h18" />
      <path d="m7 15 4-4 3 3 6-7" />
    </>
  ),
  history: (
    <>
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l3 2" />
    </>
  ),
}

// Demo items: the click is cancelled, so the URL and page stay as they are,
// and stopping it here keeps the mobile drawer open (Header closes the
// drawer when a link inside it is clicked).
function ignoreClick(event) {
  event.preventDefault()
  event.stopPropagation()
}

// One navigation link (see navSections in main.jsx).
// demo: a placeholder for a page that isn't built yet. It carries a small
// "Soon" tag, does nothing when clicked, and is announced as unavailable.
function SideBtn({ icon, label, active, demo }) {
  return (
    <li>
      <a
        href={`#${icon}`}
        className="side-btn"
        aria-current={active ? 'page' : undefined}
        aria-disabled={demo ? true : undefined}
        onClick={demo ? ignoreClick : undefined}
        title={demo ? `${label} (soon)` : label}
      >
        <span className="side-btn__icon">
          <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
            {icons[icon]}
          </svg>
        </span>
        <span className="side-btn__label">{label}</span>
        {demo && <span className="side-btn__soon">Soon</span>}
      </a>
    </li>
  )
}

export default SideBtn
