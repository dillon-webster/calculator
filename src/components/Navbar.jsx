import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import './Navbar.css'

export default function Navbar({ onOpenAuth }) {
  const { user, logout } = useApp()
  const { pathname } = useLocation()
  const [isOpen, setIsOpen] = useState(false)

  function close() { setIsOpen(false) }

  return (
    <header className="navbar">
      <Link to="/" className="navbar__brand" onClick={close}>CALCVLVS</Link>

      <nav id="navbar-menu" className={`navbar__links${isOpen ? '' : ' navbar__links--hidden'}`}>
        <Link to="/" className={pathname === '/' ? 'active' : ''} onClick={close}>Home</Link>
        <Link to="/store" className={pathname === '/store' ? 'active' : ''} onClick={close}>Store</Link>
        <Link to="/calculator" className={pathname === '/calculator' ? 'active' : ''} onClick={close}>Calculator</Link>
        <div className="navbar__auth navbar__auth--drawer">
          {user ? (
            <>
              <span className="navbar__user">{user.name}</span>
              <button className="navbar__btn navbar__btn--ghost" onClick={() => { logout(); close() }}>Sign Out</button>
            </>
          ) : (
            <button className="navbar__btn" onClick={() => { onOpenAuth(); close() }}>Sign In</button>
          )}
        </div>
      </nav>

      <div className="navbar__auth navbar__auth--bar">
        {user ? (
          <>
            <span className="navbar__user">{user.name}</span>
            <button className="navbar__btn navbar__btn--ghost" onClick={logout}>Sign Out</button>
          </>
        ) : (
          <button className="navbar__btn" onClick={onOpenAuth}>Sign In</button>
        )}
      </div>

      <button
        className="navbar__hamburger"
        onClick={() => setIsOpen(o => !o)}
        aria-label="menu"
        aria-expanded={isOpen}
        aria-controls="navbar-menu"
      >
        <span /><span /><span />
      </button>
    </header>
  )
}
