import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { BUTTON_LAYOUT, SUBSCRIPTION_DISPLAY } from '../data/packages'
import { evaluateExpression, applyPlusMinus, getButtonPackage, isButtonUnlocked, getModalTrigger } from '../utils/calculator'
import CalculatorButton from '../components/CalculatorButton'
import LockedButtonModal from '../components/LockedButtonModal'
import BanModal from '../components/BanModal'
import NsfwModal from '../components/NsfwModal'
import SatanModal from '../components/SatanModal'
import DemoBanner from '../components/DemoBanner'
import './CalculatorPage.css'

export default function CalculatorPage({ onOpenAuth = () => {} }) {
  const { user, ownedPackages, hasSubscription } = useApp()
  const [expression, setExpression] = useState('')
  const [lockedPkg, setLockedPkg] = useState(null)
  const [isBanned, setIsBanned] = useState(false)
  const [specialModal, setSpecialModal] = useState(null) // 'nsfw' | 'satan' | null

  const isLoggedIn = !!user

  function checkAndSetExpression(next) {
    const trigger = getModalTrigger(next)
    if (trigger) setSpecialModal(trigger)
    setExpression(next)
  }

  function handlePress(label) {
    if (isBanned || specialModal) return
    if (label === '=') {
      const result = evaluateExpression(expression)
      if (result === 'Error') {
        setExpression('Error')
        setIsBanned(true)
      } else {
        checkAndSetExpression(result)
      }
    } else if (label === 'C') {
      setExpression('')
    } else if (label === 'CE') {
      setExpression(prev => prev.slice(0, -1))
    } else if (label === '±') {
      const result = evaluateExpression(expression)
      checkAndSetExpression(applyPlusMinus(result !== 'Error' ? result : expression))
    } else if (label === '%') {
      const result = evaluateExpression(expression)
      if (result !== 'Error') checkAndSetExpression(String(parseFloat(result) / 100))
    } else {
      const next = expression + label
      checkAndSetExpression(next)
    }
  }

  function handleLocked(label) {
    if (isBanned) return
    const pkg = getButtonPackage(label) ?? SUBSCRIPTION_DISPLAY
    setLockedPkg(pkg)
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

        <div className={`calc-grid${isBanned ? ' calc-grid--disabled' : ''}`}>
          {BUTTON_LAYOUT.map(btn => (
            <CalculatorButton
              key={btn.label}
              label={btn.label}
              unlocked={isButtonUnlocked(btn.label, ownedPackages, isLoggedIn, hasSubscription)}
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

      {isBanned && <BanModal />}
      {specialModal === 'nsfw' && <NsfwModal />}
      {specialModal === 'satan' && <SatanModal />}
    </div>
  )
}
