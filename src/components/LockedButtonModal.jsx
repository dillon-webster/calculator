import { Link } from 'react-router-dom'
import './LockedButtonModal.css'

export default function LockedButtonModal({ pkg, onClose, onOpenAuth, isLoggedIn }) {
  return (
    <div className="locked-backdrop" onClick={onClose}>
      <div className="locked-modal" role="dialog" aria-modal="true" aria-labelledby="locked-modal-title" onClick={e => e.stopPropagation()}>
        <button className="locked-modal__close" onClick={onClose} aria-label="Close">✕</button>
        <p className="locked-modal__eyebrow">Premium Feature</p>
        <h2 id="locked-modal-title" className="locked-modal__title">{pkg.name}</h2>
        <p className="locked-modal__tagline">{pkg.tagline}</p>
        <p className="locked-modal__price">{pkg.priceDisplay}</p>
        <p className="locked-modal__body">
          {pkg.id === 'premier'
            ? <>This button is available exclusively with a <strong>CALCVLVS Premier</strong> subscription. {isLoggedIn ? 'Visit the store to subscribe.' : 'Create a free account to subscribe.'}</>
            : <>This button is part of the <strong>{pkg.name}</strong> package. {isLoggedIn ? 'Visit the store to unlock it.' : 'Create a free account to purchase packages.'}</>
          }
        </p>
        <div className="locked-modal__actions">
          {!isLoggedIn && (
            <button className="locked-modal__btn locked-modal__btn--primary" onClick={() => { onClose(); onOpenAuth() }}>
              Create Account
            </button>
          )}
          <Link to="/store" className="locked-modal__btn locked-modal__btn--primary" onClick={onClose}>
            Go to Store
          </Link>
          <button className="locked-modal__btn locked-modal__btn--ghost" onClick={onClose}>
            Dismiss
          </button>
        </div>
        <Link to="/store" className="locked-modal__subscribe-link" onClick={onClose}>
          Or subscribe to unlock everything →
        </Link>
      </div>
    </div>
  )
}
