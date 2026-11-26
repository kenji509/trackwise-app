import { useEffect, useRef } from 'react'
import SideUser from './SideUser.jsx'
import { initials } from '../../authForm.js'
import './Header.css'

// Mobile-only app bar: menu button, logo, signed-in user.
// The menu opens the navigation (children) in a drawer built on a native
// modal <dialog>: focus stays inside, Esc closes it, focus returns to the button.
function Header({ user, onLogout, children }) {
  const drawerRef = useRef(null)

  function openMenu() {
    drawerRef.current.showModal()
  }

  function closeMenu() {
    drawerRef.current.close()
  }

  function logoutFromMenu() {
    closeMenu()
    onLogout()
  }

  // Clicking the dimmed area outside the panel closes the drawer
  function handleDrawerClick(event) {
    if (event.target === drawerRef.current) closeMenu()
  }

  // Following a link inside the drawer closes it
  function handleNavClick(event) {
    if (event.target.closest('a')) closeMenu()
  }

  // If the window grows past mobile width, the app bar disappears: close the drawer too
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 768px)')
    function handleChange(event) {
      if (event.matches && drawerRef.current.open) drawerRef.current.close()
    }
    desktop.addEventListener('change', handleChange)
    return () => desktop.removeEventListener('change', handleChange)
  }, [])

  return (
    <>
      <header className="appbar">
        <button
          type="button"
          className="icon-btn appbar__menu"
          onClick={openMenu}
          aria-haspopup="dialog"
          aria-label="Open menu"
        >
          <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="appbar__brand">
          <svg className="logo" viewBox="0 0 32 32" aria-hidden="true">
            <rect width="32" height="32" rx="9" />
            <path d="M8 20.5l5-5 4 4 7-8" />
          </svg>
          <span>TrackWise</span>
        </div>

        <span className="avatar" role="img" aria-label={`Signed in as ${user.fullName}`}>
          {initials(user.fullName)}
        </span>
      </header>

      <dialog
        ref={drawerRef}
        className="drawer"
        aria-label="Menu"
        onClick={handleDrawerClick}
      >
        <div className="drawer__panel">
          <div className="drawer__header">
            <div className="appbar__brand">
              <svg className="logo" viewBox="0 0 32 32" aria-hidden="true">
                <rect width="32" height="32" rx="9" />
                <path d="M8 20.5l5-5 4 4 7-8" />
              </svg>
              <span>TrackWise</span>
            </div>
            <button type="button" className="icon-btn" onClick={closeMenu} aria-label="Close menu">
              <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="drawer__nav" aria-label="Main" onClick={handleNavClick}>
            {children}
          </nav>

          <SideUser user={user} onLogout={logoutFromMenu} />
        </div>
      </dialog>
    </>
  )
}

export default Header
