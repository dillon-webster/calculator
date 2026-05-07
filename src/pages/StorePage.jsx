import { PACKAGES } from '../data/packages'
import PackageCard from '../components/PackageCard'
import SubscriptionHero from '../components/SubscriptionHero'
import './StorePage.css'

export default function StorePage({ onOpenAuth = () => {} }) {
  return (
    <div className="store">
      <div className="store__header">
        <p className="store__eyebrow">Premium Packages</p>
        <h1 className="store__title">The Collection</h1>
        <p className="store__subtitle">
          Select the package that befits your ambitions. Each tier unlocks buttons of increasing consequence.
        </p>
      </div>
      <SubscriptionHero onOpenAuth={onOpenAuth} />
      <div className="store__grid">
        {PACKAGES.map(pkg => (
          <PackageCard key={pkg.id} pkg={pkg} onOpenAuth={onOpenAuth} />
        ))}
      </div>
    </div>
  )
}
