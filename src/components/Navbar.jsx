import { Link, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import './Navbar.css'

export default function Navbar({ onOpenAuth }) {
  const { user, logout } = useApp()
  const { pathname } = useLocation()

  return (
    <header className="navbar">
      <Link to="/" className="navbar__brand">CALCVLVS</Link>
      <nav className="navbar__links">
        <Link to="/" className={pathname === '/' ? 'active' : ''}>Home</Link>
        <Link to="/store" className={pathname === '/store' ? 'active' : ''}>Store</Link>
        <Link to="/calculator" className={pathname === '/calculator' ? 'active' : ''}>Calculator</Link>
      </nav>
      <div className="navbar__auth">
        {user ? (
          <>
            <span className="navbar__user">{user.name}</span>
            <button className="navbar__btn navbar__btn--ghost" onClick={logout}>Sign Out</button>
          </>
        ) : (
          <button className="navbar__btn" onClick={onOpenAuth}>Sign In</button>
        )}
      </div>
    </header>
  )
}
