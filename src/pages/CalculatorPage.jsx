import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { BUTTON_LAYOUT } from '../data/packages'
import { evaluateExpression, applyPlusMinus, getButtonPackage, isButtonUnlocked } from '../utils/calculator'
import CalculatorButton from '../components/CalculatorButton'
import LockedButtonModal from '../components/LockedButtonModal'
import DemoBanner from '../components/DemoBanner'
import './CalculatorPage.css'

export default function CalculatorPage({ onOpenAuth = () => {} }) {
  const { user, ownedPackages } = useApp()
  const [expression, setExpression] = useState('')
  const [lockedPkg, setLockedPkg] = useState(null)

  const isLoggedIn = !!user

  function handlePress(label) {
    if (label === '=') {
      setExpression(evaluateExpression(expression))
    } else if (label === 'C') {
      setExpression('')
    } else if (label === 'CE') {
      setExpression(prev => prev.slice(0, -1))
    } else if (label === '±') {
      setExpression(applyPlusMinus(expression))
    } else if (label === '%') {
      const num = parseFloat(expression)
      if (!isNaN(num)) setExpression(String(num / 100))
    } else {
      setExpression(prev => prev + label)
    }
  }

  function handleLocked(label) {
    const pkg = getButtonPackage(label)
    if (pkg) setLockedPkg(pkg)
  }

  return (
    <div className="calc-page">
      {!isLoggedIn && <DemoBanner onOpenAuth={onOpenAuth} />}

      <div className="calc-wrapper">
        <div className="calc-screen-area">
          <div className="calc-screen" data-testid="calc-display">
            {expression || '0'}
          </div>
        </div>

        <div className="calc-grid">
          {BUTTON_LAYOUT.map(btn => (
            <CalculatorButton
              key={btn.label}
              label={btn.label}
              unlocked={isButtonUnlocked(btn.label, ownedPackages, isLoggedIn)}
              onPress={handlePress}
              onLocked={() => handleLocked(btn.label)}
              colSpan={btn.colSpan}
              rowSpan={btn.rowSpan}
            />
          ))}
        </div>
      </div>

      {lockedPkg && (
        <LockedButtonModal
          pkg={lockedPkg}
          onClose={() => setLockedPkg(null)}
          onOpenAuth={onOpenAuth}
          isLoggedIn={isLoggedIn}
        />
      )}
    </div>
  )
}
