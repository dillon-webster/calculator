import { Link } from 'react-router-dom'
import './LandingPage.css'

const TESTIMONIALS = [
  { quote: 'I wept when I finally unlocked the equals button.', name: 'J. Whitmore', title: 'Hedge Fund Manager' },
  { quote: 'The most profound computational experience of my life.', name: 'A. Brennan', title: 'Architect' },
  { quote: 'Worth every penny. Every. Single. Penny.', name: 'C. Laurent', title: 'Art Collector' },
]

export default function LandingPage({ onOpenAuth }) {
  return (
    <div className="landing">
      <section className="landing__hero">
        <div className="landing__hero-inner">
          <p className="landing__eyebrow">The World's First Premium Calculator</p>
          <h1 className="landing__headline">Mathematics,<br />Elevated.</h1>
          <p className="landing__subhead">
            Every calculation is a statement. Make yours with an instrument worthy of the numbers you command.
          </p>
          <div className="landing__cta-row">
            <Link to="/store" className="landing__cta landing__cta--primary">Browse Packages</Link>
            <Link to="/calculator" className="landing__cta landing__cta--ghost">Try Demo</Link>
          </div>
        </div>
        <div className="landing__hero-ornament" aria-hidden="true">
          <span className="landing__hero-digit">0</span>
        </div>
      </section>

      <section className="landing__features">
        <h2 className="landing__section-title">The CALCVLVS Difference</h2>
        <div className="landing__features-grid">
          <div className="landing__feature">
            <span className="landing__feature-icon">◈</span>
            <h3>Curated Button Packages</h3>
            <p>Each button is hand-selected for inclusion in its respective tier. We accept nothing less.</p>
          </div>
          <div className="landing__feature">
            <span className="landing__feature-icon">◈</span>
            <h3>Exclusive Access</h3>
            <p>The equals button is reserved for our most discerning members. Are you ready?</p>
          </div>
          <div className="landing__feature">
            <span className="landing__feature-icon">◈</span>
            <h3>A Complete Experience</h3>
            <p>Three tiers. One destiny. The full arithmetic suite, unlocked on your terms.</p>
          </div>
        </div>
      </section>

      <section className="landing__testimonials">
        <h2 className="landing__section-title">What Our Members Say</h2>
        <div className="landing__testimonials-grid">
          {TESTIMONIALS.map(t => (
            <blockquote key={t.name} className="landing__testimonial">
              <p className="landing__testimonial-quote">"{t.quote}"</p>
              <footer>
                <span className="landing__testimonial-name">{t.name}</span>
                <span className="landing__testimonial-title">{t.title}</span>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="landing__cta-section">
        <h2 className="landing__cta-title">Begin Your Journey</h2>
        <p className="landing__cta-body">Create your account. Unlock your potential. Do the math.</p>
        <button className="landing__cta landing__cta--primary" onClick={onOpenAuth}>
          Create Account
        </button>
      </section>
    </div>
  )
}
