import './BanModal.css'

export default function BanModal() {
  return (
    <div className="ban-backdrop">
      <div className="ban-modal" role="dialog" aria-modal="true" aria-labelledby="ban-modal-title">
        <h2 id="ban-modal-title" className="ban-modal__title">Banned</h2>
        <p className="ban-modal__message">You've been banned from using calculator.</p>
      </div>
    </div>
  )
}
