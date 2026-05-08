# Ban Feature Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Automatically ban a user from using the calculator for the current session when pressing `=` produces an `'Error'` result, showing a permanent modal they cannot dismiss.

**Architecture:** Add `isBanned` boolean state to `CalculatorPage`. When `handlePress('=')` gets `'Error'` back from `evaluateExpression`, set it to `true`. Guard `handlePress` so it exits early when banned. Render a `BanModal` component (no close button) and add `pointer-events: none` to the button grid.

**Tech Stack:** React 19, Vitest, @testing-library/react, @testing-library/user-event

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `src/components/BanModal.jsx` | Permanent ban overlay, no dismiss |
| Create | `src/components/BanModal.css` | Backdrop + modal styles |
| Create | `src/tests/BanModal.test.jsx` | Unit tests for BanModal rendering |
| Modify | `src/pages/CalculatorPage.jsx` | Add ban state, trigger, render modal, guard buttons |
| Modify | `src/pages/CalculatorPage.css` | Add `.calc-grid--disabled` style |
| Modify | `src/tests/CalculatorPage.test.jsx` | Add integration tests for ban behavior |

---

### Task 1: BanModal component

**Files:**
- Create: `src/components/BanModal.jsx`
- Create: `src/components/BanModal.css`
- Create: `src/tests/BanModal.test.jsx`

- [ ] **Step 1: Write the failing test**

Create `src/tests/BanModal.test.jsx`:

```jsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import BanModal from '../components/BanModal'

describe('BanModal', () => {
  it('renders the ban message', () => {
    render(<BanModal />)
    expect(screen.getByText("You've been banned from using calculator.")).toBeInTheDocument()
  })

  it('has dialog role', () => {
    render(<BanModal />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('has no close or dismiss button', () => {
    render(<BanModal />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/tests/BanModal.test.jsx
```

Expected: FAIL — `Cannot find module '../components/BanModal'`

- [ ] **Step 3: Create `src/components/BanModal.jsx`**

```jsx
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
```

- [ ] **Step 4: Create `src/components/BanModal.css`**

```css
.ban-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  z-index: 400;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ban-modal {
  width: 100%;
  max-width: 400px;
  background: var(--color-glass);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius);
  padding: 2.5rem 2.25rem 2rem;
  box-shadow: var(--shadow-gold), 0 24px 64px rgba(0, 0, 0, 0.6);
  text-align: center;
}

.ban-modal__title {
  font-size: 1.6rem;
  font-weight: 400;
  margin-bottom: 1rem;
  color: var(--color-gold);
}

.ban-modal__message {
  font-size: 0.875rem;
  color: var(--color-silver);
  line-height: 1.7;
}
```

- [ ] **Step 5: Run test to verify it passes**

```bash
npx vitest run src/tests/BanModal.test.jsx
```

Expected: PASS — 3 tests pass

- [ ] **Step 6: Commit**

```bash
git add src/components/BanModal.jsx src/components/BanModal.css src/tests/BanModal.test.jsx
git commit -m "feat: add BanModal component"
```

---

### Task 2: CalculatorPage ban integration

**Files:**
- Modify: `src/pages/CalculatorPage.jsx`
- Modify: `src/pages/CalculatorPage.css`
- Modify: `src/tests/CalculatorPage.test.jsx`

- [ ] **Step 1: Write the failing tests**

Add these two tests to the existing `describe('CalculatorPage')` block in `src/tests/CalculatorPage.test.jsx`:

```jsx
it('bans user when = produces an error', async () => {
  renderCalc([], true, true)
  await userEvent.click(screen.getByRole('button', { name: '1' }))
  await userEvent.click(screen.getByRole('button', { name: '+' }))
  await userEvent.click(screen.getByRole('button', { name: '=' }))
  expect(screen.getByText("You've been banned from using calculator.")).toBeInTheDocument()
})

it('locked out after ban — buttons no longer update the display', async () => {
  renderCalc([], true, true)
  await userEvent.click(screen.getByRole('button', { name: '1' }))
  await userEvent.click(screen.getByRole('button', { name: '+' }))
  await userEvent.click(screen.getByRole('button', { name: '=' }))
  // display shows 'Error' at this point; pressing 0 should not append '0'
  await userEvent.click(screen.getByRole('button', { name: '0' }))
  expect(screen.getByTestId('calc-display').textContent).toBe('Error')
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run src/tests/CalculatorPage.test.jsx
```

Expected: FAIL — ban message not found, display changes after ban

- [ ] **Step 3: Update `src/pages/CalculatorPage.jsx`**

Replace the full file content with:

```jsx
import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { BUTTON_LAYOUT, SUBSCRIPTION_DISPLAY } from '../data/packages'
import { evaluateExpression, applyPlusMinus, getButtonPackage, isButtonUnlocked } from '../utils/calculator'
import CalculatorButton from '../components/CalculatorButton'
import LockedButtonModal from '../components/LockedButtonModal'
import BanModal from '../components/BanModal'
import DemoBanner from '../components/DemoBanner'
import './CalculatorPage.css'

export default function CalculatorPage({ onOpenAuth = () => {} }) {
  const { user, ownedPackages, hasSubscription } = useApp()
  const [expression, setExpression] = useState('')
  const [lockedPkg, setLockedPkg] = useState(null)
  const [isBanned, setIsBanned] = useState(false)

  const isLoggedIn = !!user

  function handlePress(label) {
    if (isBanned) return
    if (label === '=') {
      const result = evaluateExpression(expression)
      if (result === 'Error') {
        setExpression('Error')
        setIsBanned(true)
      } else {
        setExpression(result)
      }
    } else if (label === 'C') {
      setExpression('')
    } else if (label === 'CE') {
      setExpression(prev => prev.slice(0, -1))
    } else if (label === '±') {
      const result = evaluateExpression(expression)
      setExpression(applyPlusMinus(result !== 'Error' ? result : expression))
    } else if (label === '%') {
      const result = evaluateExpression(expression)
      if (result !== 'Error') setExpression(String(parseFloat(result) / 100))
    } else {
      setExpression(prev => prev + label)
    }
  }

  function handleLocked(label) {
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
    </div>
  )
}
```

- [ ] **Step 4: Add `.calc-grid--disabled` to `src/pages/CalculatorPage.css`**

Append to the end of the file:

```css
.calc-grid--disabled {
  pointer-events: none;
  opacity: 0.5;
}
```

- [ ] **Step 5: Run all tests to verify they pass**

```bash
npx vitest run
```

Expected: PASS — all existing tests plus the 2 new ban tests pass

- [ ] **Step 6: Commit**

```bash
git add src/pages/CalculatorPage.jsx src/pages/CalculatorPage.css src/tests/CalculatorPage.test.jsx
git commit -m "feat: ban user from calculator session on error"
```
