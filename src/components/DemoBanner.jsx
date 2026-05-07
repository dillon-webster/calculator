import { Link } from 'react-router-dom'
import './DemoBanner.css'

export default function DemoBanner({ onOpenAuth = () => {} }) {
  return (
    <div className="demo-banner">
      <span className="demo-banner__text">
        You are in <strong>Demo Mode</strong> — only the <code>0</code> key is available.
      </span>
      <div className="demo-banner__actions">
        <button className="demo-banner__btn" onClick={onOpenAuth}>Create Account</button>
        <Link to="/store" className="demo-banner__link">Browse Packages</Link>
      </div>
    </div>
  )
}
