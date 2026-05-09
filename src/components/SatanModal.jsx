import { useEffect, useRef } from 'react'
import './SatanModal.css'

export default function SatanModal() {
  const dialogRef = useRef(null)

  useEffect(() => {
    dialogRef.current?.focus()
  }, [])

  function handleKeyDown(e) {
    e.preventDefault()
    if (e.key === 'Tab') {
      dialogRef.current?.focus()
    }
  }

  return (
    <div className="satan-backdrop" data-testid="satan-backdrop" onKeyDown={handleKeyDown}>
      <div
        ref={dialogRef}
        className="satan-modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="satan-modal-title"
        aria-describedby="satan-modal-desc"
        tabIndex={0}
      >
        <div className="satan-modal__portrait" aria-hidden="true">
          <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" className="satan-modal__svg">
            {/* horns */}
            <polygon points="28,38 18,8 42,30" fill="#8b0000" />
            <polygon points="92,38 102,8 78,30" fill="#8b0000" />
            {/* head */}
            <ellipse cx="60" cy="62" rx="38" ry="42" fill="#c0392b" />
            {/* brow ridge */}
            <path d="M30,50 Q45,42 60,50 Q75,42 90,50" stroke="#8b0000" strokeWidth="3" fill="none" />
            {/* eyes */}
            <ellipse cx="45" cy="58" rx="9" ry="7" fill="#1a0000" />
            <ellipse cx="75" cy="58" rx="9" ry="7" fill="#1a0000" />
            <ellipse cx="45" cy="58" rx="4" ry="4" fill="#ff4500" />
            <ellipse cx="75" cy="58" rx="4" ry="4" fill="#ff4500" />
            {/* nose */}
            <ellipse cx="57" cy="72" rx="3" ry="2" fill="#8b0000" />
            <ellipse cx="63" cy="72" rx="3" ry="2" fill="#8b0000" />
            {/* grin */}
            <path d="M40,84 Q60,98 80,84" stroke="#1a0000" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            {/* fangs */}
            <polygon points="52,86 48,96 56,86" fill="white" />
            <polygon points="68,86 64,86 72,96" fill="white" />
            {/* goatee */}
            <path d="M54,100 Q60,112 66,100" stroke="#8b0000" strokeWidth="3" fill="none" strokeLinecap="round" />
          </svg>
        </div>
        <h2 id="satan-modal-title" className="satan-modal__title">You Summoned the Dark Lord</h2>
        <p id="satan-modal-desc" className="satan-modal__message">
          1134 upside down spells <strong>hELL</strong>. He is here now.
        </p>
        <p className="satan-modal__hint">Refresh the page to flee.</p>
      </div>
    </div>
  )
}
