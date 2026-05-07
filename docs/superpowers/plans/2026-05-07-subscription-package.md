# Subscription Package Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a CALCVLVS Premier subscription tier ($14.99/mo, irrevocable) that unlocks all buttons including `=`, which is removed from The Equalizer package. Existing à-la-carte package prices are doubled.

**Architecture:** `hasSubscription` boolean added to `AppContext` (persisted to localStorage per-user). `isButtonUnlocked` gains a fourth param. The `=` button is removed from all packages and gated exclusively behind the subscription via a `SUBSCRIPTION_DISPLAY` constant used as the modal fallback. A new `SubscriptionHero` component sits above the package cards in the store.

**Tech Stack:** React 18, React Router v6, Vite, Vitest, @testing-library/react, plain CSS

---

## File Map

| File | Change |
|---|---|
| `src/data/packages.js` | Double prices, remove `=` from Equalizer, add `SUBSCRIPTION_DISPLAY` |
| `src/utils/calculator.js` | Add `hasSubscription` param to `isButtonUnlocked` |
| `src/context/AppContext.jsx` | Add `hasSubscription` state + `subscribe()` |
| `src/pages/CalculatorPage.jsx` | Pass `hasSubscription` to `isButtonUnlocked`; use `SUBSCRIPTION_DISPLAY` fallback in `handleLocked` |
| `src/components/LockedButtonModal.jsx` | Add "Or subscribe to unlock everything →" upsell link |
| `src/components/LockedButtonModal.css` | Style the upsell link |
| `src/components/SubscriptionHero.jsx` | New — Premier hero section with 3 button states |
| `src/components/SubscriptionHero.css` | New — styles for SubscriptionHero |
| `src/pages/StorePage.jsx` | Import and render `SubscriptionHero` above package cards |
| `src/components/PackageCard.jsx` | Show "Included in Premier" when `hasSubscription` is true |
| `src/tests/calculator.test.js` | Update `=` tests to reflect subscription-only |
| `src/tests/AppContext.test.jsx` | Add `hasSubscription` + `subscribe` to harness; add tests |
| `src/tests/CalculatorPage.test.jsx` | Add `subscribed` param to `renderCalc`; update `=` test; add subscription eval test |
| `src/tests/PackageCard.test.jsx` | Add "Included in Premier" test |
| `src/tests/SubscriptionHero.test.jsx` | New — tests for all 3 hero states |

---

### Task 1: Update Package Data and Fix Broken Tests

**Files:**
- Modify: `src/data/packages.js`
- Modify: `src/tests/calculator.test.js`
- Modify: `src/tests/CalculatorPage.test.jsx`

- [ ] **Step 1: Update `src/tests/calculator.test.js` — replace the two `=` tests to reflect new behavior**

Replace lines 42–44 and 66–68 (the two tests that assume `=` is in the Equalizer):

```js
import { describe, it, expect } from 'vitest'
import { evaluateExpression, applyPlusMinus } from '../utils/calculator'
import { getButtonPackage, isButtonUnlocked } from '../utils/calculator'

describe('evaluateExpression', () => {
  it('evaluates addition', () => {
    expect(evaluateExpression('1+2')).toBe('3')
  })
  it('evaluates multiplication with × symbol', () => {
    expect(evaluateExpression('3×4')).toBe('12')
  })
  it('evaluates division with ÷ symbol', () => {
    expect(evaluateExpression('8÷2')).toBe('4')
  })
  it('returns Error for invalid expression', () => {
    expect(evaluateExpression('1+')).toBe('Error')
  })
  it('evaluates parentheses', () => {
    expect(evaluateExpression('(1+2)×3')).toBe('9')
  })
})

describe('applyPlusMinus', () => {
  it('prepends minus to a positive expression', () => {
    expect(applyPlusMinus('5')).toBe('-5')
  })
  it('removes minus from a negative expression', () => {
    expect(applyPlusMinus('-5')).toBe('5')
  })
  it('returns empty string unchanged', () => {
    expect(applyPlusMinus('')).toBe('')
  })
})

describe('getButtonPackage', () => {
  it('returns basic package for digit 0', () => {
    expect(getButtonPackage('0').id).toBe('basic')
  })
  it('returns advanced package for digit 7', () => {
    expect(getButtonPackage('7').id).toBe('advanced')
  })
  it('returns null for = (subscription-only)', () => {
    expect(getButtonPackage('=')).toBeNull()
  })
  it('returns equalizer package for ×', () => {
    expect(getButtonPackage('×').id).toBe('equalizer')
  })
  it('returns null for unknown button', () => {
    expect(getButtonPackage('X')).toBeNull()
  })
})

describe('isButtonUnlocked', () => {
  it('unlocks 0 for logged-out demo users', () => {
    expect(isButtonUnlocked('0', [], false)).toBe(true)
  })
  it('locks non-demo buttons for logged-out users', () => {
    expect(isButtonUnlocked('1', [], false)).toBe(false)
  })
  it('locks buttons even if logged in without the right package', () => {
    expect(isButtonUnlocked('=', ['basic'], true)).toBe(false)
  })
  it('unlocks button when its package is owned', () => {
    expect(isButtonUnlocked('1', ['basic'], true)).toBe(true)
  })
  it('= is locked even with equalizer package (subscription-only)', () => {
    expect(isButtonUnlocked('=', ['equalizer'], true)).toBe(false)
  })
})
```

- [ ] **Step 2: Run tests to confirm the two replaced tests now fail**

```bash
npm run test:run
```

Expected: 2 failures — `'returns null for = (subscription-only)'` and `'= is locked even with equalizer package'`

- [ ] **Step 3: Replace `src/data/packages.js` with doubled prices, `=` removed from Equalizer, and `SUBSCRIPTION_DISPLAY` added**

```js
export const PACKAGES = [
  {
    id: 'basic',
    name: 'Basic Arithmetic',
    price: 1.98,
    priceDisplay: '$1.98',
    tagline: 'The foundation of all computation.',
    buttons: ['0', '1', '2', '3', '4', '+', '-'],
    features: ['Digits 0–4', 'Addition', 'Subtraction'],
    exclusive: false,
  },
  {
    id: 'advanced',
    name: 'Advanced Arithmetic',
    price: 3.98,
    priceDisplay: '$3.98',
    tagline: 'Unlock the upper echelon of digits.',
    buttons: ['5', '6', '7', '8', '9', '.', '(', ')'],
    features: ['Digits 5–9', 'Decimal precision', 'Parenthetical grouping'],
    exclusive: false,
  },
  {
    id: 'equalizer',
    name: 'The Equalizer',
    price: 19.98,
    priceDisplay: '$19.98',
    tagline: 'True resolution. For those who demand results.',
    buttons: ['×', '÷', 'CE', 'C', '±', '%'],
    features: ['Multiplication', 'Division', 'Clear & reset', 'Sign inversion', 'Percentage'],
    exclusive: true,
  },
]

// Used in LockedButtonModal when a button has no package (i.e. = is subscription-only)
export const SUBSCRIPTION_DISPLAY = {
  id: 'premier',
  name: 'CALCVLVS Premier',
  price: 14.99,
  priceDisplay: '$14.99/mo',
  tagline: 'Every button. Every function. Yours in perpetuity.',
  buttons: ['='],
  features: ['Every button', 'Unlimited calculations'],
  exclusive: true,
}

export const DEMO_BUTTONS = ['0']

export const BUTTON_LAYOUT = [
  { label: 'CE' }, { label: 'C' }, { label: '±' }, { label: '%' },
  { label: '(' }, { label: ')' }, { label: '÷' }, { label: '×' },
  { label: '7' }, { label: '8' }, { label: '9' }, { label: '-' },
  { label: '4' }, { label: '5' }, { label: '6' }, { label: '+' },
  { label: '1' }, { label: '2' }, { label: '3' }, { label: '=', rowSpan: 2 },
  { label: '0', colSpan: 2 }, { label: '.' },
]
```

- [ ] **Step 4: Update `src/tests/CalculatorPage.test.jsx` — replace the `=` evaluation test**

Replace the entire file:

```jsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { AppProvider } from '../context/AppContext'
import CalculatorPage from '../pages/CalculatorPage'

beforeEach(() => localStorage.clear())

function renderCalc(ownedPackages = [], loggedIn = false, subscribed = false) {
  if (loggedIn) {
    localStorage.setItem('calc_user', JSON.stringify({ name: 'T', email: 't@x.com' }))
    localStorage.setItem('calc_packages', JSON.stringify(ownedPackages))
    if (subscribed) {
      localStorage.setItem('calc_subscription', JSON.stringify(true))
    }
  }
  return render(
    <AppProvider>
      <MemoryRouter>
        <CalculatorPage onOpenAuth={vi.fn()} />
      </MemoryRouter>
    </AppProvider>
  )
}

describe('CalculatorPage', () => {
  it('shows demo banner when not logged in', () => {
    renderCalc()
    expect(screen.getByText(/demo mode/i)).toBeInTheDocument()
  })

  it('does not show demo banner when logged in', () => {
    renderCalc([], true)
    expect(screen.queryByText(/demo mode/i)).not.toBeInTheDocument()
  })

  it('pressing 0 in demo mode updates the display', async () => {
    renderCalc()
    const zeroBtn = screen.getByRole('button', { name: '0' })
    await userEvent.click(zeroBtn)
    await userEvent.click(zeroBtn)
    expect(screen.getByTestId('calc-display').textContent).toBe('00')
  })

  it('pressing a locked button opens the locked button modal', async () => {
    renderCalc()
    await userEvent.click(screen.getByRole('button', { name: '5' }))
    expect(screen.getByText(/premium feature/i)).toBeInTheDocument()
  })

  it('= is locked even when all packages owned', async () => {
    renderCalc(['basic', 'advanced', 'equalizer'], true)
    await userEvent.click(screen.getByRole('button', { name: '=' }))
    expect(screen.getByText(/premium feature/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 5: Run tests to confirm all pass**

```bash
npm run test:run
```

Expected: all tests pass

- [ ] **Step 6: Commit**

```bash
git add src/data/packages.js src/tests/calculator.test.js src/tests/CalculatorPage.test.jsx
git commit -m "feat: double package prices, remove = from Equalizer, add SUBSCRIPTION_DISPLAY"
```

---

### Task 2: Update `isButtonUnlocked` for Subscription

**Files:**
- Modify: `src/utils/calculator.js`
- Modify: `src/tests/calculator.test.js`

- [ ] **Step 1: Add subscription tests to `src/tests/calculator.test.js`**

Append to the `isButtonUnlocked` describe block:

```js
  it('unlocks all buttons when subscribed', () => {
    expect(isButtonUnlocked('=', [], true, true)).toBe(true)
    expect(isButtonUnlocked('×', [], true, true)).toBe(true)
    expect(isButtonUnlocked('7', [], true, true)).toBe(true)
  })
  it('does not unlock buttons for logged-out user even with subscription flag', () => {
    expect(isButtonUnlocked('=', [], false, true)).toBe(false)
  })
```

- [ ] **Step 2: Run tests to confirm new tests fail**

```bash
npm run test:run
```

Expected: 2 new failures — subscription tests

- [ ] **Step 3: Replace `src/utils/calculator.js`**

```js
import { evaluate } from 'mathjs'
import { PACKAGES, DEMO_BUTTONS } from '../data/packages'

export function evaluateExpression(expression) {
  try {
    const normalized = expression.replace(/×/g, '*').replace(/÷/g, '/')
    const result = evaluate(normalized)
    return String(result)
  } catch {
    return 'Error'
  }
}

export function applyPlusMinus(expression) {
  if (!expression) return expression
  if (expression.startsWith('-')) return expression.slice(1)
  return '-' + expression
}

export function getButtonPackage(button) {
  return PACKAGES.find(pkg => pkg.buttons.includes(button)) ?? null
}

export function isButtonUnlocked(button, ownedPackages, isLoggedIn, hasSubscription = false) {
  if (DEMO_BUTTONS.includes(button)) return true
  if (!isLoggedIn) return false
  if (hasSubscription) return true
  const pkg = getButtonPackage(button)
  if (!pkg) return false
  return ownedPackages.includes(pkg.id)
}
```

- [ ] **Step 4: Run tests to confirm all pass**

```bash
npm run test:run
```

Expected: all tests pass

- [ ] **Step 5: Commit**

```bash
git add src/utils/calculator.js src/tests/calculator.test.js
git commit -m "feat: add hasSubscription param to isButtonUnlocked"
```

---

### Task 3: Add Subscription State to AppContext

**Files:**
- Modify: `src/context/AppContext.jsx`
- Modify: `src/tests/AppContext.test.jsx`

- [ ] **Step 1: Add subscription tests to `src/tests/AppContext.test.jsx`**

Replace the entire file:

```jsx
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AppProvider, useApp } from '../context/AppContext'

beforeEach(() => localStorage.clear())

function TestHarness() {
  const { user, ownedPackages, hasSubscription, signup, login, logout, purchasePackage, subscribe } = useApp()
  return (
    <div>
      <span data-testid="user">{user ? user.email : 'none'}</span>
      <span data-testid="packages">{ownedPackages.join(',')}</span>
      <span data-testid="subscription">{hasSubscription ? 'yes' : 'no'}</span>
      <button onClick={() => signup('Alice', 'alice@x.com', 'pw')}>signup</button>
      <button onClick={() => login('alice@x.com', 'pw')}>login</button>
      <button onClick={logout}>logout</button>
      <button onClick={() => purchasePackage('basic')}>buy</button>
      <button onClick={subscribe}>subscribe</button>
    </div>
  )
}

function renderHarness() {
  return render(<AppProvider><TestHarness /></AppProvider>)
}

describe('AppContext', () => {
  it('starts with no user and empty packages', () => {
    renderHarness()
    expect(screen.getByTestId('user').textContent).toBe('none')
    expect(screen.getByTestId('packages').textContent).toBe('')
  })

  it('signup logs the user in immediately', async () => {
    renderHarness()
    await userEvent.click(screen.getByText('signup'))
    expect(screen.getByTestId('user').textContent).toBe('alice@x.com')
  })

  it('login works after signup and logout', async () => {
    renderHarness()
    await userEvent.click(screen.getByText('signup'))
    await userEvent.click(screen.getByText('logout'))
    expect(screen.getByTestId('user').textContent).toBe('none')
    await userEvent.click(screen.getByText('login'))
    expect(screen.getByTestId('user').textContent).toBe('alice@x.com')
  })

  it('logout clears user and packages', async () => {
    renderHarness()
    await userEvent.click(screen.getByText('signup'))
    await userEvent.click(screen.getByText('buy'))
    await userEvent.click(screen.getByText('logout'))
    expect(screen.getByTestId('user').textContent).toBe('none')
    expect(screen.getByTestId('packages').textContent).toBe('')
  })

  it('purchasePackage adds to ownedPackages', async () => {
    renderHarness()
    await userEvent.click(screen.getByText('signup'))
    await userEvent.click(screen.getByText('buy'))
    expect(screen.getByTestId('packages').textContent).toBe('basic')
  })

  it('owned packages persist per user across login/logout', async () => {
    renderHarness()
    await userEvent.click(screen.getByText('signup'))
    await userEvent.click(screen.getByText('buy'))
    await userEvent.click(screen.getByText('logout'))
    await userEvent.click(screen.getByText('login'))
    expect(screen.getByTestId('packages').textContent).toBe('basic')
  })

  it('subscribe sets hasSubscription to true', async () => {
    renderHarness()
    await userEvent.click(screen.getByText('signup'))
    expect(screen.getByTestId('subscription').textContent).toBe('no')
    await userEvent.click(screen.getByText('subscribe'))
    expect(screen.getByTestId('subscription').textContent).toBe('yes')
  })

  it('subscription persists per user across login/logout', async () => {
    renderHarness()
    await userEvent.click(screen.getByText('signup'))
    await userEvent.click(screen.getByText('subscribe'))
    await userEvent.click(screen.getByText('logout'))
    expect(screen.getByTestId('subscription').textContent).toBe('no')
    await userEvent.click(screen.getByText('login'))
    expect(screen.getByTestId('subscription').textContent).toBe('yes')
  })

  it('logout clears subscription', async () => {
    renderHarness()
    await userEvent.click(screen.getByText('signup'))
    await userEvent.click(screen.getByText('subscribe'))
    await userEvent.click(screen.getByText('logout'))
    expect(screen.getByTestId('subscription').textContent).toBe('no')
  })
})
```

- [ ] **Step 2: Run tests to confirm new tests fail**

```bash
npm run test:run
```

Expected: 3 new failures — subscribe, subscription persist, logout clears subscription

- [ ] **Step 3: Replace `src/context/AppContext.jsx`**

```jsx
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react'

const AppContext = createContext(null)

function safeGet(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback
  } catch {
    return fallback
  }
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => safeGet('calc_user', null))
  const [ownedPackages, setOwnedPackages] = useState(() => safeGet('calc_packages', []))
  const [hasSubscription, setHasSubscription] = useState(() => safeGet('calc_subscription', false))

  function signup(name, email, password) {
    const accounts = safeGet('calc_accounts', {})
    if (accounts[email]) return false
    accounts[email] = { name, password }
    localStorage.setItem('calc_accounts', JSON.stringify(accounts))
    const u = { name, email }
    setUser(u)
    localStorage.setItem('calc_user', JSON.stringify(u))
    setOwnedPackages([])
    localStorage.setItem('calc_packages', JSON.stringify([]))
    setHasSubscription(false)
    localStorage.setItem('calc_subscription', JSON.stringify(false))
    return true
  }

  function login(email, password) {
    const accounts = safeGet('calc_accounts', {})
    if (!accounts[email] || accounts[email].password !== password) return false
    const u = { name: accounts[email].name, email }
    setUser(u)
    localStorage.setItem('calc_user', JSON.stringify(u))
    const userPkgs = safeGet(`calc_packages_${email}`, [])
    setOwnedPackages(userPkgs)
    localStorage.setItem('calc_packages', JSON.stringify(userPkgs))
    const userSub = safeGet(`calc_subscription_${email}`, false)
    setHasSubscription(userSub)
    localStorage.setItem('calc_subscription', JSON.stringify(userSub))
    return true
  }

  function logout() {
    setUser(null)
    setOwnedPackages([])
    setHasSubscription(false)
    localStorage.removeItem('calc_user')
    localStorage.removeItem('calc_packages')
    localStorage.removeItem('calc_subscription')
  }

  function purchasePackage(packageId) {
    const updated = [...ownedPackages, packageId]
    setOwnedPackages(updated)
    localStorage.setItem('calc_packages', JSON.stringify(updated))
    if (user) {
      localStorage.setItem(`calc_packages_${user.email}`, JSON.stringify(updated))
    }
  }

  function subscribe() {
    setHasSubscription(true)
    localStorage.setItem('calc_subscription', JSON.stringify(true))
    if (user) {
      localStorage.setItem(`calc_subscription_${user.email}`, JSON.stringify(true))
    }
  }

  return (
    <AppContext.Provider value={{ user, ownedPackages, hasSubscription, login, signup, logout, purchasePackage, subscribe }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
```

- [ ] **Step 4: Run tests to confirm all pass**

```bash
npm run test:run
```

Expected: all tests pass

- [ ] **Step 5: Commit**

```bash
git add src/context/AppContext.jsx src/tests/AppContext.test.jsx
git commit -m "feat: add hasSubscription state and subscribe() to AppContext"
```

---

### Task 4: Update CalculatorPage

**Files:**
- Modify: `src/pages/CalculatorPage.jsx`
- Modify: `src/tests/CalculatorPage.test.jsx`

- [ ] **Step 1: Add the subscription evaluation test to `src/tests/CalculatorPage.test.jsx`**

Append inside the `describe('CalculatorPage')` block:

```jsx
  it('evaluates expression when subscribed', async () => {
    renderCalc([], true, true)
    await userEvent.click(screen.getByRole('button', { name: '3' }))
    await userEvent.click(screen.getByRole('button', { name: '+' }))
    await userEvent.click(screen.getByRole('button', { name: '4' }))
    await userEvent.click(screen.getByRole('button', { name: '=' }))
    expect(screen.getByTestId('calc-display').textContent).toBe('7')
  })
```

- [ ] **Step 2: Run tests to confirm the new test fails**

```bash
npm run test:run
```

Expected: 1 failure — `'evaluates expression when subscribed'` (= is still locked because CalculatorPage doesn't yet pass `hasSubscription`)

- [ ] **Step 3: Replace `src/pages/CalculatorPage.jsx`**

```jsx
import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { BUTTON_LAYOUT, SUBSCRIPTION_DISPLAY } from '../data/packages'
import { evaluateExpression, applyPlusMinus, getButtonPackage, isButtonUnlocked } from '../utils/calculator'
import CalculatorButton from '../components/CalculatorButton'
import LockedButtonModal from '../components/LockedButtonModal'
import DemoBanner from '../components/DemoBanner'
import './CalculatorPage.css'

export default function CalculatorPage({ onOpenAuth }) {
  const { user, ownedPackages, hasSubscription } = useApp()
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

        <div className="calc-grid">
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
    </div>
  )
}
```

- [ ] **Step 4: Run tests to confirm all pass**

```bash
npm run test:run
```

Expected: all tests pass

- [ ] **Step 5: Commit**

```bash
git add src/pages/CalculatorPage.jsx src/tests/CalculatorPage.test.jsx
git commit -m "feat: pass hasSubscription to isButtonUnlocked, use SUBSCRIPTION_DISPLAY fallback in handleLocked"
```

---

### Task 5: Update LockedButtonModal with Subscribe Upsell

**Files:**
- Modify: `src/components/LockedButtonModal.jsx`
- Modify: `src/components/LockedButtonModal.css`

- [ ] **Step 1: Replace `src/components/LockedButtonModal.jsx`**

```jsx
import { Link } from 'react-router-dom'
import './LockedButtonModal.css'

export default function LockedButtonModal({ pkg, onClose, onOpenAuth, isLoggedIn }) {
  return (
    <div className="locked-backdrop" onClick={onClose}>
      <div className="locked-modal" onClick={e => e.stopPropagation()}>
        <button className="locked-modal__close" onClick={onClose} aria-label="Close">✕</button>
        <p className="locked-modal__eyebrow">Premium Feature</p>
        <h2 className="locked-modal__title">{pkg.name}</h2>
        <p className="locked-modal__tagline">{pkg.tagline}</p>
        <p className="locked-modal__price">{pkg.priceDisplay}</p>
        <p className="locked-modal__body">
          This button is part of the <strong>{pkg.name}</strong> package.
          {isLoggedIn
            ? ' Visit the store to unlock it.'
            : ' Create a free account to purchase packages.'}
        </p>
        <div className="locked-modal__actions">
          {!isLoggedIn && (
            <button className="locked-modal__btn locked-modal__btn--primary" onClick={() => { onClose(); onOpenAuth() }}>
              Create Account
            </button>
          )}
          <Link to="/store" className="locked-modal__btn locked-modal__btn--primary" onClick={onClose}>
            Go to Store
          </Link>
          <button className="locked-modal__btn locked-modal__btn--ghost" onClick={onClose}>
            Dismiss
          </button>
        </div>
        <Link to="/store" className="locked-modal__subscribe-link" onClick={onClose}>
          Or subscribe to unlock everything →
        </Link>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Add subscribe link styles to `src/components/LockedButtonModal.css`**

Append to the end of the file:

```css
.locked-modal__subscribe-link {
  display: block;
  text-align: center;
  margin-top: 1rem;
  font-size: 0.75rem;
  color: var(--color-text-muted);
  letter-spacing: 0.03em;
  transition: color var(--transition);
}

.locked-modal__subscribe-link:hover {
  color: var(--color-gold);
}
```

- [ ] **Step 3: Run tests to confirm nothing broke**

```bash
npm run test:run
```

Expected: all tests pass

- [ ] **Step 4: Commit**

```bash
git add src/components/LockedButtonModal.jsx src/components/LockedButtonModal.css
git commit -m "feat: add subscribe upsell link to LockedButtonModal"
```

---

### Task 6: Create SubscriptionHero Component

**Files:**
- Create: `src/components/SubscriptionHero.jsx`
- Create: `src/components/SubscriptionHero.css`
- Create: `src/tests/SubscriptionHero.test.jsx`

- [ ] **Step 1: Write failing tests — create `src/tests/SubscriptionHero.test.jsx`**

```jsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { AppProvider } from '../context/AppContext'
import SubscriptionHero from '../components/SubscriptionHero'

beforeEach(() => localStorage.clear())

function renderHero(loggedIn = false, subscribed = false, onOpenAuth = vi.fn()) {
  if (loggedIn) {
    localStorage.setItem('calc_user', JSON.stringify({ name: 'T', email: 't@x.com' }))
    if (subscribed) {
      localStorage.setItem('calc_subscription', JSON.stringify(true))
    }
  }
  return render(
    <AppProvider>
      <MemoryRouter>
        <SubscriptionHero onOpenAuth={onOpenAuth} />
      </MemoryRouter>
    </AppProvider>
  )
}

describe('SubscriptionHero', () => {
  it('shows Subscribe Now button when not subscribed', () => {
    renderHero(true)
    expect(screen.getByRole('button', { name: /subscribe now/i })).toBeInTheDocument()
  })

  it('shows active state when already subscribed', () => {
    renderHero(true, true)
    expect(screen.getByText(/active/i)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /subscribe now/i })).not.toBeInTheDocument()
  })

  it('opens auth modal when subscribing without login', async () => {
    const onOpenAuth = vi.fn()
    renderHero(false, false, onOpenAuth)
    await userEvent.click(screen.getByRole('button', { name: /subscribe now/i }))
    expect(onOpenAuth).toHaveBeenCalledOnce()
  })

  it('subscribes and shows active state when logged in and button clicked', async () => {
    renderHero(true)
    await userEvent.click(screen.getByRole('button', { name: /subscribe now/i }))
    expect(screen.getByText(/active/i)).toBeInTheDocument()
  })

  it('shows the price and fine print', () => {
    renderHero()
    expect(screen.getByText(/\$14\.99/)).toBeInTheDocument()
    expect(screen.getByText(/garnish wages/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npm run test:run
```

Expected: 5 new failures — `Cannot find module '../components/SubscriptionHero'`

- [ ] **Step 3: Create `src/components/SubscriptionHero.jsx`**

```jsx
import { useApp } from '../context/AppContext'
import './SubscriptionHero.css'

export default function SubscriptionHero({ onOpenAuth = () => {} }) {
  const { user, hasSubscription, subscribe } = useApp()

  function handleSubscribe() {
    if (!user) { onOpenAuth(); return }
    subscribe()
  }

  return (
    <div className="sub-hero">
      <p className="sub-hero__eyebrow">The Complete Experience</p>
      <h2 className="sub-hero__title">CALCVLVS Premier</h2>
      <p className="sub-hero__tagline">
        Every button. Every function. Every calculation — unlocked in perpetuity.
      </p>
      <div className="sub-hero__price">
        <span className="sub-hero__amount">$14.99</span>
        <span className="sub-hero__period">/ month</span>
      </div>
      {hasSubscription ? (
        <div className="sub-hero__active">Active — Enjoy Your Commitment</div>
      ) : (
        <>
          <button className="sub-hero__btn" onClick={handleSubscribe}>
            Subscribe Now
          </button>
          <p className="sub-hero__fine-print">
            By subscribing, you irrevocably authorize CALCVLVS Inc. to garnish wages, seize assets,
            and pursue all available legal remedies in perpetuity should payment lapse.
          </p>
        </>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Create `src/components/SubscriptionHero.css`**

```css
.sub-hero {
  margin-bottom: 5rem;
  padding: 3.5rem 3rem;
  background: linear-gradient(135deg, rgba(201, 168, 76, 0.08) 0%, rgba(201, 168, 76, 0.03) 100%);
  border: 1px solid var(--color-gold-dim);
  border-radius: var(--radius);
  text-align: center;
}

.sub-hero__eyebrow {
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-gold);
  margin-bottom: 0.75rem;
}

.sub-hero__title {
  font-family: var(--font-display);
  font-size: 2.5rem;
  font-weight: 400;
  color: var(--color-text);
  margin-bottom: 0.75rem;
}

.sub-hero__tagline {
  font-size: 1rem;
  color: var(--color-silver);
  line-height: 1.7;
  max-width: 480px;
  margin: 0 auto 2rem;
}

.sub-hero__price {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.4rem;
  margin-bottom: 2rem;
}

.sub-hero__amount {
  font-family: var(--font-display);
  font-size: 3.5rem;
  color: var(--color-gold);
  line-height: 1;
}

.sub-hero__period {
  font-size: 1rem;
  color: var(--color-silver);
}

.sub-hero__btn {
  padding: 0.9rem 3rem;
  background: var(--color-gold);
  color: #0a0a0a;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  transition: background var(--transition);
  display: inline-block;
  margin-bottom: 1.25rem;
}

.sub-hero__btn:hover {
  background: var(--color-gold-light);
}

.sub-hero__fine-print {
  font-size: 0.62rem;
  color: var(--color-text-muted);
  max-width: 520px;
  margin: 0 auto;
  line-height: 1.6;
  letter-spacing: 0.01em;
}

.sub-hero__active {
  display: inline-block;
  padding: 0.9rem 3rem;
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-gold);
}
```

- [ ] **Step 5: Run tests to confirm all pass**

```bash
npm run test:run
```

Expected: all tests pass

- [ ] **Step 6: Commit**

```bash
git add src/components/SubscriptionHero.jsx src/components/SubscriptionHero.css src/tests/SubscriptionHero.test.jsx
git commit -m "feat: implement SubscriptionHero component"
```

---

### Task 7: Update StorePage

**Files:**
- Modify: `src/pages/StorePage.jsx`

- [ ] **Step 1: Replace `src/pages/StorePage.jsx`**

```jsx
import { PACKAGES } from '../data/packages'
import PackageCard from '../components/PackageCard'
import SubscriptionHero from '../components/SubscriptionHero'
import './StorePage.css'

export default function StorePage({ onOpenAuth = () => {} }) {
  return (
    <div className="store">
      <div className="store__header">
        <p className="store__eyebrow">Premium Packages</p>
        <h1 className="store__title">The Collection</h1>
        <p className="store__subtitle">
          Select the package that befits your ambitions. Each tier unlocks buttons of increasing consequence.
        </p>
      </div>
      <SubscriptionHero onOpenAuth={onOpenAuth} />
      <div className="store__grid">
        {PACKAGES.map(pkg => (
          <PackageCard key={pkg.id} pkg={pkg} onOpenAuth={onOpenAuth} />
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Run tests to confirm nothing broke**

```bash
npm run test:run
```

Expected: all tests pass

- [ ] **Step 3: Commit**

```bash
git add src/pages/StorePage.jsx
git commit -m "feat: add SubscriptionHero to StorePage"
```

---

### Task 8: Update PackageCard for "Included in Premier"

**Files:**
- Modify: `src/components/PackageCard.jsx`
- Modify: `src/tests/PackageCard.test.jsx`

- [ ] **Step 1: Add test to `src/tests/PackageCard.test.jsx`**

Append inside the `describe('PackageCard')` block:

```jsx
  it('shows Included in Premier when subscribed', () => {
    localStorage.setItem('calc_user', JSON.stringify({ name: 'T', email: 't@x.com' }))
    localStorage.setItem('calc_subscription', JSON.stringify(true))
    render(
      <AppProvider>
        <PackageCard pkg={basicPkg} onOpenAuth={vi.fn()} />
      </AppProvider>
    )
    expect(screen.getByText(/included in premier/i)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /purchase/i })).not.toBeInTheDocument()
  })
```

- [ ] **Step 2: Run tests to confirm the new test fails**

```bash
npm run test:run
```

Expected: 1 failure — `'shows Included in Premier when subscribed'`

- [ ] **Step 3: Replace `src/components/PackageCard.jsx`**

```jsx
import { useApp } from '../context/AppContext'
import './PackageCard.css'

export default function PackageCard({ pkg, onOpenAuth = () => {} }) {
  const { user, ownedPackages, hasSubscription, purchasePackage } = useApp()
  const owned = ownedPackages.includes(pkg.id)

  function handlePurchase() {
    if (!user) { onOpenAuth(); return }
    purchasePackage(pkg.id)
  }

  return (
    <div className={`pkg-card ${pkg.exclusive ? 'pkg-card--exclusive' : ''}`}>
      {pkg.exclusive && <div className="pkg-card__badge">Most Exclusive</div>}
      <div className="pkg-card__header">
        <h3 className="pkg-card__name">{pkg.name}</h3>
        <p className="pkg-card__tagline">{pkg.tagline}</p>
      </div>
      <div className="pkg-card__price">{pkg.priceDisplay}</div>
      <ul className="pkg-card__features">
        {(pkg.features ?? []).map(f => (
          <li key={f} className="pkg-card__feature">
            <span className="pkg-card__check">◆</span>
            {f}
          </li>
        ))}
      </ul>
      <div className="pkg-card__buttons-preview">
        {(pkg.buttons ?? []).map(b => (
          <span key={b} className="pkg-card__btn-chip">{b}</span>
        ))}
      </div>
      {hasSubscription ? (
        <div className="pkg-card__owned">◆ Included in Premier</div>
      ) : owned ? (
        <div className="pkg-card__owned">✓ Owned</div>
      ) : (
        <button className="pkg-card__purchase" onClick={handlePurchase}>
          Purchase — {pkg.priceDisplay}
        </button>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Run tests to confirm all pass**

```bash
npm run test:run
```

Expected: all tests pass

- [ ] **Step 5: Commit**

```bash
git add src/components/PackageCard.jsx src/tests/PackageCard.test.jsx
git commit -m "feat: show Included in Premier on PackageCard when subscribed"
```

---

### Task 9: Final Verification

- [ ] **Step 1: Run full test suite**

```bash
npm run test:run
```

Expected: all tests pass, 0 failures

- [ ] **Step 2: Start dev server**

```bash
npm run dev
```

- [ ] **Step 3: Verify the full user flow in browser**

1. `/store` — confirm SubscriptionHero appears above the three package cards with `$14.99`, Subscribe Now button, and fine print mentioning wage garnishment
2. `/store` (logged out) — click Subscribe Now → auth modal opens
3. Sign up → return to store → click Subscribe Now → button disappears, "Active — Enjoy Your Commitment" appears; all three package cards show "◆ Included in Premier"
4. `/calculator` — confirm ALL buttons are unlocked including `=`; enter `3 + 4 =` → display shows `7`
5. Sign out → sign back in → subscription is still active
6. Sign out → `/calculator` → click `=` → LockedButtonModal opens showing "CALCVLVS Premier" with `$14.99/mo`; "Or subscribe to unlock everything →" link is visible
7. `/store` — confirm package prices show $1.98, $3.98, $19.98; The Equalizer no longer lists `=` in its button chips
