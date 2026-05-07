import { useApp } from '../context/AppContext'
import './SubscriptionHero.css'

export default function SubscriptionHero({ onOpenAuth = () => {} }) {
  const { user, hasSubscription, subscribe } = useApp()

  function handleSubscribe() {
    if (!user) { onOpenAuth(); return }
    subscribe()
  }

  return (
    <div className="sub-hero">
      <p className="sub-hero__eyebrow">The Complete Experience</p>
      <h2 className="sub-hero__title">CALCVLVS Premier</h2>
      <p className="sub-hero__tagline">
        Every button. Every function. Every calculation — unlocked in perpetuity.
      </p>
      <div className="sub-hero__price">
        <span className="sub-hero__amount">$14.99</span>
        <span className="sub-hero__period">/ month</span>
      </div>
      {hasSubscription ? (
        <div className="sub-hero__active">Active — Enjoy Your Commitment</div>
      ) : (
        <>
          <button className="sub-hero__btn" onClick={handleSubscribe}>
            Subscribe Now
          </button>
          <p className="sub-hero__fine-print">
            By subscribing, you irrevocably authorize CALCVLVS Inc. to garnish wages, seize assets,
            and pursue all available legal remedies in perpetuity should payment lapse.
          </p>
        </>
      )}
    </div>
  )
}
