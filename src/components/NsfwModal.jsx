import { useEffect, useRef } from 'react'
import './NsfwModal.css'

export default function NsfwModal() {
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
    <div className="nsfw-backdrop" data-testid="nsfw-backdrop" onKeyDown={handleKeyDown}>
      <div
        ref={dialogRef}
        className="nsfw-modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="nsfw-modal-title"
        aria-describedby="nsfw-modal-desc"
        tabIndex={0}
      >
        <div className="nsfw-modal__warning">18+</div>
        <h2 id="nsfw-modal-title" className="nsfw-modal__title">NSFW Content Detected</h2>
        <p id="nsfw-modal-desc" className="nsfw-modal__message">
          This is strictly NSFW. You must be 18 years or older to view this calculator.
        </p>
      </div>
    </div>
  )
}
