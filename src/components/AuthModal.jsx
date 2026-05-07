import { useState } from 'react'
import { useApp } from '../context/AppContext'
import './AuthModal.css'

export default function AuthModal({ onClose }) {
  const [tab, setTab] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login, signup } = useApp()

  function switchTab(next) {
    setTab(next)
    setError('')
    setName('')
    setEmail('')
    setPassword('')
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (tab === 'login') {
      if (!login(email, password)) setError('Invalid email or password.')
      else onClose()
    } else {
      if (!name.trim()) { setError('Name is required.'); return }
      if (!signup(name, email, password)) setError('An account with this email already exists.')
      else onClose()
    }
  }

  return (
    <div className="auth-backdrop" data-testid="modal-backdrop" onClick={onClose}>
      <div className="auth-modal" onClick={e => e.stopPropagation()}>
        <button className="auth-modal__close" onClick={onClose} aria-label="Close">✕</button>

        <div className="auth-modal__tabs">
          <button
            data-testid="tab-login"
            className={`auth-tab ${tab === 'login' ? 'auth-tab--active' : ''}`}
            onClick={() => switchTab('login')}
          >
            Sign In
          </button>
          <button
            data-testid="tab-signup"
            className={`auth-tab ${tab === 'signup' ? 'auth-tab--active' : ''}`}
            onClick={() => switchTab('signup')}
          >
            Sign Up
          </button>
        </div>

        <h2 className="auth-modal__title" data-testid="modal-title">
          {tab === 'login' ? 'Sign In' : 'Create Account'}
        </h2>

        <form className="auth-modal__form" onSubmit={handleSubmit}>
          {tab === 'signup' && (
            <input
              className="auth-input"
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          )}
          <input
            className="auth-input"
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            className="auth-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {error && <p className="auth-error" data-testid="modal-error">{error}</p>}
          <button className="auth-submit" type="submit" data-testid="modal-submit">
            {tab === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  )
}
