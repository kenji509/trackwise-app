import './SideBar.css'

// Desktop/tablet navigation: brand, collapse toggle, nav sections, signed-in user.
// Collapsed (or tablet width) it becomes a labeled rail. Hidden on mobile,
// where Header shows the same sections in a drawer.
function SideBar({ collapsed, onToggle, children }) {
  return (
    <aside className="sidebar">
      <div className="sidebar__inner">
        <div className="sidebar__header">
          <div className="sidebar__brand">
            <svg className="logo" viewBox="0 0 32 32" aria-hidden="true">
              <rect width="32" height="32" rx="9" />
              <path d="M8 20.5l5-5 4 4 7-8" />
            </svg>
            <span className="sidebar__brand-name">TrackWise</span>
          </div>

          <button
            type="button"
            className="icon-btn sidebar__toggle"
            onClick={onToggle}
            aria-expanded={!collapsed}
            aria-controls="sidebar-nav"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <path d="M9 4v16" />
              {collapsed ? <path d="m13 10 2 2-2 2" /> : <path d="m15 10-2 2 2 2" />}
            </svg>
          </button>
        </div>

        <nav id="sidebar-nav" className="sidebar__nav" aria-label="Main">
          {children}
        </nav>

        <div className="sidebar__user">
          <span className="avatar" aria-hidden="true">
            <svg className="icon" viewBox="0 0 24 24">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21a8 8 0 0 1 16 0" />
            </svg>
          </span>
          <span className="sidebar__user-text">
            <span className="sr-only">Signed in as </span>
            <span className="sidebar__user-name">Teacher</span>
            <span className="sidebar__user-role" aria-hidden="true">
              Signed in
            </span>
          </span>
        </div>
      </div>
    </aside>
  )
}

export default SideBar
