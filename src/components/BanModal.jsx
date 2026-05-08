import { useEffect, useRef } from 'react'
import './BanModal.css'

export default function BanModal() {
  const dialogRef = useRef(null)

  useEffect(() => {
    dialogRef.current?.focus()
  }, [])

  return (
    <div className="ban-backdrop" data-testid="ban-backdrop">
      <div
        ref={dialogRef}
        className="ban-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ban-modal-title"
        aria-describedby="ban-modal-desc"
        tabIndex={0}
      >
        <h2 id="ban-modal-title" className="ban-modal__title">Banned</h2>
        <p id="ban-modal-desc" className="ban-modal__message">You've been banned from using calculator.</p>
      </div>
    </div>
  )
}
