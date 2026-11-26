import { useId } from 'react'
import './SideSection.css'

// A labeled group of navigation links (e.g. "Teaching")
function SideSection({ label, children }) {
  const labelId = useId()

  return (
    <div className="side-section" role="group" aria-labelledby={labelId}>
      <p id={labelId} className="side-section__label">
        {label}
      </p>
      <ul className="side-section__list">{children}</ul>
    </div>
  )
}

export default SideSection
