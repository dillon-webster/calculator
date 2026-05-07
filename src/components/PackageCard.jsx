import { useApp } from '../context/AppContext'
import './PackageCard.css'

export default function PackageCard({ pkg, onOpenAuth = () => {} }) {
  const { user, ownedPackages, hasSubscription, purchasePackage } = useApp()
  const owned = ownedPackages.includes(pkg.id)

  function handlePurchase() {
    if (!user) { onOpenAuth(); return }
    purchasePackage(pkg.id)
  }

  return (
    <div className={`pkg-card ${pkg.exclusive ? 'pkg-card--exclusive' : ''}`}>
      {pkg.exclusive && <div className="pkg-card__badge">Most Exclusive</div>}
      <div className="pkg-card__header">
        <h3 className="pkg-card__name">{pkg.name}</h3>
        <p className="pkg-card__tagline">{pkg.tagline}</p>
      </div>
      <div className="pkg-card__price">{pkg.priceDisplay}</div>
      <ul className="pkg-card__features">
        {(pkg.features ?? []).map(f => (
          <li key={f} className="pkg-card__feature">
            <span className="pkg-card__check">◆</span>
            {f}
          </li>
        ))}
      </ul>
      <div className="pkg-card__buttons-preview">
        {(pkg.buttons ?? []).map(b => (
          <span key={b} className="pkg-card__btn-chip">{b}</span>
        ))}
      </div>
      {hasSubscription ? (
        <div className="pkg-card__owned">◆ Included in Premier</div>
      ) : owned ? (
        <div className="pkg-card__owned">✓ Owned</div>
      ) : (
        <button className="pkg-card__purchase" onClick={handlePurchase}>
          Purchase — {pkg.priceDisplay}
        </button>
      )}
    </div>
  )
}
