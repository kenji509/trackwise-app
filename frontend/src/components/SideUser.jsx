import { initials, roleLabel } from '../authForm.js'
import './SideUser.css'

function SideUser({ user, onLogout }) {
  return (
    <div className="side-user">
      <div className="side-user__info">
        <span className="avatar side-user__avatar" aria-hidden="true">
          {initials(user.fullName)}
        </span>
        <span className="side-user__text">
          <span className="sr-only">Signed in as </span>
          <span className="side-user__name">{user.fullName}</span>
          <span className="side-user__role">{roleLabel(user.role)}</span>
        </span>
      </div>

      <button
        type="button"
        className="btn btn-secondary side-user__logout"
        onClick={onLogout}
        title="Log out"
      >
        <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <path d="m16 17 5-5-5-5" />
          <path d="M21 12H9" />
        </svg>
        <span className="side-user__logout-label">Log out</span>
      </button>
    </div>
  )
}

export default SideUser
