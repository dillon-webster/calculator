import './CalculatorButton.css'

export default function CalculatorButton({ label, unlocked, onPress, onLocked, colSpan, rowSpan }) {
  const classes = [
    'calc-btn',
    !unlocked && 'calc-btn--locked',
    colSpan === 2 && 'calc-btn--wide',
    rowSpan === 2 && 'calc-btn--tall',
    label === '=' && 'calc-btn--equals',
  ].filter(Boolean).join(' ')

  function handleClick() {
    if (unlocked) onPress(label)
    else onLocked()
  }

  return (
    <button className={classes} onClick={handleClick} aria-label={label}>
      <span className="calc-btn__label">{label}</span>
      {!unlocked && <span className="calc-btn__lock" aria-hidden="true">🔒</span>}
    </button>
  )
}
