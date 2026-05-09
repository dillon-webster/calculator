import { useEffect, useRef, useState } from 'react'
import './SatanModal.css'

export default function SatanModal() {
  const dialogRef = useRef(null)
  const [connectLabel, setConnectLabel] = useState('Connect')
  const [messageLabel, setMessageLabel] = useState('Message')

  useEffect(() => {
    dialogRef.current?.focus()
  }, [])

  function handleKeyDown(e) {
    e.preventDefault()
    if (e.key === 'Tab') dialogRef.current?.focus()
  }

  function handleConnect() {
    if (connectLabel === 'Connect') setConnectLabel('Pending... (may take an eternity)')
  }

  function handleMessage() {
    if (messageLabel === 'Message') setMessageLabel('Satan is typing…')
  }

  return (
    <div className="satan-backdrop" data-testid="satan-backdrop" onKeyDown={handleKeyDown}>
      <div
        ref={dialogRef}
        className="satan-card"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="satan-card-name"
        tabIndex={0}
      >
        <div className="satan-card__banner" />

        <div className="satan-card__avatar-wrap">
          <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" className="satan-card__avatar">
            <rect width="120" height="120" fill="#1a0000" />
            <polygon points="28,38 18,8 42,30" fill="#8b0000" />
            <polygon points="92,38 102,8 78,30" fill="#8b0000" />
            <ellipse cx="60" cy="62" rx="38" ry="42" fill="#c0392b" />
            <path d="M30,50 Q45,42 60,50 Q75,42 90,50" stroke="#8b0000" strokeWidth="3" fill="none" />
            <ellipse cx="45" cy="58" rx="9" ry="7" fill="#1a0000" />
            <ellipse cx="75" cy="58" rx="9" ry="7" fill="#1a0000" />
            <ellipse cx="45" cy="58" rx="4" ry="4" fill="#ff4500" />
            <ellipse cx="75" cy="58" rx="4" ry="4" fill="#ff4500" />
            <ellipse cx="57" cy="72" rx="3" ry="2" fill="#8b0000" />
            <ellipse cx="63" cy="72" rx="3" ry="2" fill="#8b0000" />
            <path d="M40,84 Q60,98 80,84" stroke="#1a0000" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <polygon points="52,86 48,96 56,86" fill="white" />
            <polygon points="68,86 64,86 72,96" fill="white" />
            <path d="M54,100 Q60,112 66,100" stroke="#8b0000" strokeWidth="3" fill="none" strokeLinecap="round" />
          </svg>
        </div>

        <div className="satan-card__body">
          <h2 id="satan-card-name" className="satan-card__name">
            Satan <span className="satan-card__badge">&#x2022; 1st</span>
          </h2>
          <p className="satan-card__headline">CEO @ Hell Inc. | Prince of Darkness | Fallen Angel</p>
          <p className="satan-card__meta">Hell (Eternal) &nbsp;&middot;&nbsp; <span className="satan-card__connections">666 connections</span></p>
          <p className="satan-card__open">Open to: <strong>Soul acquisitions</strong></p>

          <div className="satan-card__actions">
            <button className="satan-card__btn satan-card__btn--primary" onClick={handleConnect}>
              {connectLabel}
            </button>
            <button className="satan-card__btn satan-card__btn--secondary" onClick={handleMessage}>
              {messageLabel}
            </button>
          </div>

          <div className="satan-card__divider" />

          <div className="satan-card__skills">
            <p className="satan-card__skills-title">Skills &amp; Endorsements</p>
            <div className="satan-card__skill">
              <span className="satan-card__skill-name">Temptation</span>
              <span className="satan-card__skill-count">999+</span>
            </div>
            <div className="satan-card__skill">
              <span className="satan-card__skill-name">Corruption</span>
              <span className="satan-card__skill-count">999+</span>
            </div>
            <div className="satan-card__skill">
              <span className="satan-card__skill-name">Long Division</span>
              <span className="satan-card__skill-count">3</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
