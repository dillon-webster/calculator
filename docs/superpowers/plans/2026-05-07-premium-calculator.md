# Premium DLC Calculator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a satirical premium React calculator app where buttons are locked behind paid DLC packages, with simulated auth and purchases, and a dark-gold luxury aesthetic.

**Architecture:** Multi-page React SPA using React Router v6 with three routes (`/`, `/store`, `/calculator`). Auth is a modal overlay triggered from any page. App state (user + ownedPackages) lives in React Context persisted to localStorage. Expression evaluation uses mathjs. Logged-out users get demo mode: only `0` works.

**Tech Stack:** React 18, React Router v6, mathjs, @fontsource/playfair-display, @fontsource/inter, Vite, Vitest, @testing-library/react, @testing-library/jest-dom, @testing-library/user-event, plain CSS with custom properties

---

## File Map

| File | Purpose |
|---|---|
| `vite.config.js` | Vite + Vitest config |
| `index.html` | HTML entry point |
| `src/main.jsx` | React root, font imports, global CSS |
| `src/App.jsx` | BrowserRouter, routes, AppProvider, auth modal gate |
| `src/test-setup.js` | @testing-library/jest-dom global setup |
| `src/styles/global.css` | CSS custom properties, base reset |
| `src/data/packages.js` | Package definitions, button layout, helper exports |
| `src/utils/calculator.js` | Pure expression evaluation functions |
| `src/context/AppContext.jsx` | User + ownedPackages state + localStorage persistence |
| `src/components/Navbar.jsx` + `Navbar.css` | Sticky top nav with logo, links, auth button |
| `src/components/AuthModal.jsx` + `AuthModal.css` | Sign in / sign up modal overlay |
| `src/components/CalculatorButton.jsx` + `CalculatorButton.css` | Single button — locked or unlocked state |
| `src/components/LockedButtonModal.jsx` + `LockedButtonModal.css` | Modal shown when locked button is clicked |
| `src/components/PackageCard.jsx` + `PackageCard.css` | Store package card with purchase button |
| `src/components/DemoBanner.jsx` + `DemoBanner.css` | Persistent demo mode banner |
| `src/pages/LandingPage.jsx` + `LandingPage.css` | Marketing hero page |
| `src/pages/StorePage.jsx` + `StorePage.css` | Package store |
| `src/pages/CalculatorPage.jsx` + `CalculatorPage.css` | The calculator |
| `src/tests/calculator.test.js` | Tests for calculator utils |
| `src/tests/AppContext.test.jsx` | Tests for AppContext auth and purchase logic |
| `src/tests/CalculatorButton.test.jsx` | Tests for locked/unlocked button states |
| `src/tests/PackageCard.test.jsx` | Tests for PackageCard purchase interaction |
| `src/tests/CalculatorPage.test.jsx` | Integration tests for calculator expression flow |

---

### Task 1: Project Setup

**Files:**
- Create: `package.json`, `vite.config.js`, `index.html`, `src/main.jsx`, `src/test-setup.js`

- [ ] **Step 1: Scaffold the Vite React project**

From `/Users/dillon/Code/personal-projects/calculator`, run:

```bash
npm create vite@latest . -- --template react
```

When prompted about non-empty directory, press `y`. Select framework `React`, variant `JavaScript`.

- [ ] **Step 2: Install runtime dependencies**

```bash
npm install react-router-dom mathjs @fontsource/playfair-display @fontsource/inter
```

- [ ] **Step 3: Install dev dependencies**

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

- [ ] **Step 4: Replace vite.config.js with Vitest config**

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test-setup.js',
  },
})
```

- [ ] **Step 5: Add test scripts to package.json**

In `package.json`, add to `"scripts"`:

```json
"test": "vitest",
"test:run": "vitest run"
```

- [ ] **Step 6: Create src/test-setup.js**

```js
import '@testing-library/jest-dom'
```

- [ ] **Step 7: Verify test runner works**

```bash
npm run test:run
```

Expected: `No test files found, exiting with code 0`

- [ ] **Step 8: Remove Vite boilerplate**

```bash
rm -rf src/assets src/App.css src/index.css src/App.jsx
```

- [ ] **Step 9: Commit**

```bash
git init
git add .
git commit -m "feat: scaffold Vite React project with Vitest"
```

---

### Task 2: Package Data & Calculator Utils

**Files:**
- Create: `src/data/packages.js`
- Create: `src/utils/calculator.js`
- Create: `src/tests/calculator.test.js`

- [ ] **Step 1: Write failing tests**

Create `src/tests/calculator.test.js`:

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
  it('returns equalizer package for =', () => {
    expect(getButtonPackage('=').id).toBe('equalizer')
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
  it('unlocks = when equalizer is owned', () => {
    expect(isButtonUnlocked('=', ['equalizer'], true)).toBe(true)
  })
})
```

- [ ] **Step 2: Run to verify they fail**

```bash
npm run test:run
```

Expected: FAIL — `Cannot find module '../utils/calculator'`

- [ ] **Step 3: Create src/data/packages.js**

```js
export const PACKAGES = [
  {
    id: 'basic',
    name: 'Basic Arithmetic',
    price: 0.99,
    priceDisplay: '$0.99',
    tagline: 'The foundation of all computation.',
    buttons: ['0', '1', '2', '3', '4', '+', '-'],
    features: ['Digits 0–4', 'Addition', 'Subtraction'],
    exclusive: false,
  },
  {
    id: 'advanced',
    name: 'Advanced Arithmetic',
    price: 1.99,
    priceDisplay: '$1.99',
    tagline: 'Unlock the upper echelon of digits.',
    buttons: ['5', '6', '7', '8', '9', '.', '(', ')'],
    features: ['Digits 5–9', 'Decimal precision', 'Parenthetical grouping'],
    exclusive: false,
  },
  {
    id: 'equalizer',
    name: 'The Equalizer',
    price: 9.99,
    priceDisplay: '$9.99',
    tagline: 'True resolution. For those who demand results.',
    buttons: ['=', '×', '÷', 'CE', 'C', '±', '%'],
    features: ['The = button', 'Multiplication', 'Division', 'Clear & reset', 'Sign inversion', 'Percentage'],
    exclusive: true,
  },
]

// Buttons available to everyone without login
export const DEMO_BUTTONS = ['0']

// Full calculator button layout — rows of 4 columns
// rowSpan/colSpan control CSS grid spanning
export const BUTTON_LAYOUT = [
  { label: 'CE' }, { label: 'C' }, { label: '±' }, { label: '%' },
  { label: '(' }, { label: ')' }, { label: '÷' }, { label: '×' },
  { label: '7' }, { label: '8' }, { label: '9' }, { label: '-' },
  { label: '4' }, { label: '5' }, { label: '6' }, { label: '+' },
  { label: '1' }, { label: '2' }, { label: '3' }, { label: '=', rowSpan: 2 },
  { label: '0', colSpan: 2 }, { label: '.' },
]
```

- [ ] **Step 4: Create src/utils/calculator.js**

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

export function isButtonUnlocked(button, ownedPackages, isLoggedIn) {
  if (DEMO_BUTTONS.includes(button)) return true
  if (!isLoggedIn) return false
  const pkg = getButtonPackage(button)
  if (!pkg) return false
  return ownedPackages.includes(pkg.id)
}
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
npm run test:run
```

Expected: PASS — 14 tests passing

- [ ] **Step 6: Commit**

```bash
git add src/data/packages.js src/utils/calculator.js src/tests/calculator.test.js
git commit -m "feat: add package definitions and calculator utils"
```

---

### Task 3: AppContext

**Files:**
- Create: `src/context/AppContext.jsx`
- Create: `src/tests/AppContext.test.jsx`

- [ ] **Step 1: Write failing tests**

Create `src/tests/AppContext.test.jsx`:

```jsx
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AppProvider, useApp } from '../context/AppContext'

beforeEach(() => localStorage.clear())

function TestHarness() {
  const { user, ownedPackages, signup, login, logout, purchasePackage } = useApp()
  return (
    <div>
      <span data-testid="user">{user ? user.email : 'none'}</span>
      <span data-testid="packages">{ownedPackages.join(',')}</span>
      <button onClick={() => signup('Alice', 'alice@x.com', 'pw')}>signup</button>
      <button onClick={() => login('alice@x.com', 'pw')}>login</button>
      <button onClick={logout}>logout</button>
      <button onClick={() => purchasePackage('basic')}>buy</button>
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
})
```

- [ ] **Step 2: Run to verify they fail**

```bash
npm run test:run
```

Expected: FAIL — `Cannot find module '../context/AppContext'`

- [ ] **Step 3: Create src/context/AppContext.jsx**

```jsx
import { createContext, useContext, useState } from 'react'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem('calc_user')) ?? null
  )
  const [ownedPackages, setOwnedPackages] = useState(() =>
    JSON.parse(localStorage.getItem('calc_packages')) ?? []
  )

  function signup(name, email, password) {
    const accounts = JSON.parse(localStorage.getItem('calc_accounts')) ?? {}
    if (accounts[email]) return false
    accounts[email] = { name, password }
    localStorage.setItem('calc_accounts', JSON.stringify(accounts))
    const u = { name, email }
    setUser(u)
    localStorage.setItem('calc_user', JSON.stringify(u))
    setOwnedPackages([])
    localStorage.setItem('calc_packages', JSON.stringify([]))
    return true
  }

  function login(email, password) {
    const accounts = JSON.parse(localStorage.getItem('calc_accounts')) ?? {}
    if (!accounts[email] || accounts[email].password !== password) return false
    const u = { name: accounts[email].name, email }
    setUser(u)
    localStorage.setItem('calc_user', JSON.stringify(u))
    const userPkgs = JSON.parse(localStorage.getItem(`calc_packages_${email}`)) ?? []
    setOwnedPackages(userPkgs)
    localStorage.setItem('calc_packages', JSON.stringify(userPkgs))
    return true
  }

  function logout() {
    setUser(null)
    setOwnedPackages([])
    localStorage.removeItem('calc_user')
    localStorage.removeItem('calc_packages')
  }

  function purchasePackage(packageId) {
    const updated = [...ownedPackages, packageId]
    setOwnedPackages(updated)
    localStorage.setItem('calc_packages', JSON.stringify(updated))
    if (user) {
      localStorage.setItem(`calc_packages_${user.email}`, JSON.stringify(updated))
    }
  }

  return (
    <AppContext.Provider value={{ user, ownedPackages, login, signup, logout, purchasePackage }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm run test:run
```

Expected: PASS — all 20 tests passing (calculator utils + AppContext)

- [ ] **Step 5: Commit**

```bash
git add src/context/AppContext.jsx src/tests/AppContext.test.jsx
git commit -m "feat: add AppContext with simulated auth and package ownership"
```

---

### Task 4: Global Styles, Entry Files & Stub Components

**Files:**
- Create: `src/styles/global.css`
- Create: `src/main.jsx`
- Create: `src/App.jsx`
- Update: `index.html`
- Create: stub files for all components/pages

- [ ] **Step 1: Create src/styles/global.css**

```css
@import '@fontsource/playfair-display/400.css';
@import '@fontsource/playfair-display/700.css';
@import '@fontsource/inter/300.css';
@import '@fontsource/inter/400.css';
@import '@fontsource/inter/600.css';

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  --color-bg: #0a0a0a;
  --color-surface: #141414;
  --color-surface-2: #1c1c1c;
  --color-glass: rgba(18, 18, 18, 0.88);
  --color-gold: #c9a84c;
  --color-gold-light: #e8c97a;
  --color-gold-dim: rgba(201, 168, 76, 0.35);
  --color-gold-glow: rgba(201, 168, 76, 0.15);
  --color-silver: #a8a8a8;
  --color-text: #f0ece0;
  --color-text-muted: #6a6a6a;
  --color-border: rgba(201, 168, 76, 0.2);
  --color-border-strong: rgba(201, 168, 76, 0.55);
  --color-error: #c9604c;
  --font-display: 'Playfair Display', Georgia, serif;
  --font-body: 'Inter', system-ui, sans-serif;
  --radius-sm: 2px;
  --radius: 4px;
  --radius-lg: 8px;
  --transition: 0.18s ease;
  --shadow-gold: 0 0 24px rgba(201, 168, 76, 0.12);
}

html, body, #root {
  min-height: 100%;
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-body);
  font-weight: 300;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

a {
  color: var(--color-gold);
  text-decoration: none;
  transition: color var(--transition);
}

a:hover {
  color: var(--color-gold-light);
}

button {
  cursor: pointer;
  font-family: var(--font-body);
}

h1, h2, h3 {
  font-family: var(--font-display);
  font-weight: 400;
}
```

- [ ] **Step 2: Create src/main.jsx**

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import App from './App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
```

- [ ] **Step 3: Create src/App.jsx**

```jsx
import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Navbar from './components/Navbar'
import AuthModal from './components/AuthModal'
import LandingPage from './pages/LandingPage'
import StorePage from './pages/StorePage'
import CalculatorPage from './pages/CalculatorPage'

export default function App() {
  const [authOpen, setAuthOpen] = useState(false)

  return (
    <AppProvider>
      <BrowserRouter>
        <Navbar onOpenAuth={() => setAuthOpen(true)} />
        {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
        <Routes>
          <Route path="/" element={<LandingPage onOpenAuth={() => setAuthOpen(true)} />} />
          <Route path="/store" element={<StorePage onOpenAuth={() => setAuthOpen(true)} />} />
          <Route path="/calculator" element={<CalculatorPage onOpenAuth={() => setAuthOpen(true)} />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
```

- [ ] **Step 4: Update index.html**

Replace the entire file:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CALCVLVS — Mathematics, Elevated</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 5: Create stub components so the app compiles**

`src/components/Navbar.jsx`:
```jsx
export default function Navbar() { return <nav style={{ height: 64, background: '#111', borderBottom: '1px solid #222' }} /> }
```

`src/components/AuthModal.jsx`:
```jsx
export default function AuthModal({ onClose }) { return <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)' }} /> }
```

`src/components/CalculatorButton.jsx`:
```jsx
export default function CalculatorButton({ label }) { return <button>{label}</button> }
```

`src/components/LockedButtonModal.jsx`:
```jsx
export default function LockedButtonModal({ onClose }) { return null }
```

`src/components/PackageCard.jsx`:
```jsx
export default function PackageCard({ pkg }) { return <div>{pkg.name}</div> }
```

`src/components/DemoBanner.jsx`:
```jsx
export default function DemoBanner() { return null }
```

`src/pages/LandingPage.jsx`:
```jsx
export default function LandingPage() { return <main><h1 style={{ color: '#c9a84c', padding: '4rem', fontFamily: 'serif' }}>Landing</h1></main> }
```

`src/pages/StorePage.jsx`:
```jsx
export default function StorePage() { return <main><h1 style={{ color: '#c9a84c', padding: '4rem', fontFamily: 'serif' }}>Store</h1></main> }
```

`src/pages/CalculatorPage.jsx`:
```jsx
export default function CalculatorPage() { return <main><h1 style={{ color: '#c9a84c', padding: '4rem', fontFamily: 'serif' }}>Calculator</h1></main> }
```

- [ ] **Step 6: Verify the dev server starts with no errors**

```bash
npm run dev
```

Open `http://localhost:5173` — expected: dark background, stub navbar, landing text visible

- [ ] **Step 7: Commit**

```bash
git add src/styles/global.css src/main.jsx src/App.jsx index.html \
  src/components/Navbar.jsx src/components/AuthModal.jsx \
  src/components/CalculatorButton.jsx src/components/LockedButtonModal.jsx \
  src/components/PackageCard.jsx src/components/DemoBanner.jsx \
  src/pages/LandingPage.jsx src/pages/StorePage.jsx src/pages/CalculatorPage.jsx
git commit -m "feat: add global styles, routing skeleton, stub components"
```

---

### Task 5: Navbar

**Files:**
- Modify: `src/components/Navbar.jsx`
- Create: `src/components/Navbar.css`

- [ ] **Step 1: Replace src/components/Navbar.jsx**

```jsx
import { Link, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import './Navbar.css'

export default function Navbar({ onOpenAuth }) {
  const { user, logout } = useApp()
  const { pathname } = useLocation()

  return (
    <header className="navbar">
      <Link to="/" className="navbar__brand">CALCVLVS</Link>
      <nav className="navbar__links">
        <Link to="/" className={pathname === '/' ? 'active' : ''}>Home</Link>
        <Link to="/store" className={pathname === '/store' ? 'active' : ''}>Store</Link>
        <Link to="/calculator" className={pathname === '/calculator' ? 'active' : ''}>Calculator</Link>
      </nav>
      <div className="navbar__auth">
        {user ? (
          <>
            <span className="navbar__user">{user.name}</span>
            <button className="navbar__btn navbar__btn--ghost" onClick={logout}>Sign Out</button>
          </>
        ) : (
          <button className="navbar__btn" onClick={onOpenAuth}>Sign In</button>
        )}
      </div>
    </header>
  )
}
```

- [ ] **Step 2: Create src/components/Navbar.css**

```css
.navbar {
  position: sticky;
  top: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  height: 64px;
  padding: 0 2.5rem;
  background: rgba(8, 8, 8, 0.96);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--color-border);
}

.navbar__brand {
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: 0.25em;
  color: var(--color-gold);
  flex-shrink: 0;
}

.navbar__brand:hover {
  color: var(--color-gold-light);
}

.navbar__links {
  display: flex;
  gap: 2.5rem;
  margin: 0 auto;
  font-size: 0.7rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.navbar__links a {
  color: var(--color-silver);
  transition: color var(--transition);
}

.navbar__links a:hover,
.navbar__links a.active {
  color: var(--color-gold);
}

.navbar__auth {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
}

.navbar__user {
  font-size: 0.8rem;
  letter-spacing: 0.05em;
  color: var(--color-silver);
}

.navbar__btn {
  padding: 0.45rem 1.4rem;
  background: var(--color-gold);
  color: #0a0a0a;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  transition: background var(--transition);
}

.navbar__btn:hover {
  background: var(--color-gold-light);
}

.navbar__btn--ghost {
  background: transparent;
  color: var(--color-silver);
  border: 1px solid var(--color-border);
}

.navbar__btn--ghost:hover {
  color: var(--color-gold);
  border-color: var(--color-gold-dim);
}
```

- [ ] **Step 3: Verify in browser**

```bash
npm run dev
```

Expected: sticky dark navbar with gold "CALCVLVS" brand, centered nav links, right-side Sign In button

- [ ] **Step 4: Commit**

```bash
git add src/components/Navbar.jsx src/components/Navbar.css
git commit -m "feat: implement Navbar"
```

---

### Task 6: AuthModal

**Files:**
- Modify: `src/components/AuthModal.jsx`
- Create: `src/components/AuthModal.css`
- Create: `src/tests/AuthModal.test.jsx`

- [ ] **Step 1: Write failing tests**

Create `src/tests/AuthModal.test.jsx`:

```jsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AppProvider } from '../context/AppContext'
import AuthModal from '../components/AuthModal'

beforeEach(() => localStorage.clear())

function renderModal(onClose = vi.fn()) {
  return render(
    <AppProvider>
      <AuthModal onClose={onClose} />
    </AppProvider>
  )
}

describe('AuthModal', () => {
  it('shows Sign In form by default', () => {
    renderModal()
    expect(screen.getByTestId('modal-title').textContent).toBe('Sign In')
  })

  it('switches to Create Account form when Sign Up tab clicked', async () => {
    renderModal()
    await userEvent.click(screen.getByTestId('tab-signup'))
    expect(screen.getByTestId('modal-title').textContent).toBe('Create Account')
  })

  it('closes when backdrop is clicked', async () => {
    const onClose = vi.fn()
    renderModal(onClose)
    await userEvent.click(screen.getByTestId('modal-backdrop'))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('shows error message for invalid login credentials', async () => {
    renderModal()
    await userEvent.type(screen.getByPlaceholderText('Email Address'), 'nobody@x.com')
    await userEvent.type(screen.getByPlaceholderText('Password'), 'wrong')
    await userEvent.click(screen.getByTestId('modal-submit'))
    expect(screen.getByTestId('modal-error')).toBeInTheDocument()
  })

  it('closes after successful signup', async () => {
    const onClose = vi.fn()
    renderModal(onClose)
    await userEvent.click(screen.getByTestId('tab-signup'))
    await userEvent.type(screen.getByPlaceholderText('Full Name'), 'Bob')
    await userEvent.type(screen.getByPlaceholderText('Email Address'), 'bob@x.com')
    await userEvent.type(screen.getByPlaceholderText('Password'), 'pass123')
    await userEvent.click(screen.getByTestId('modal-submit'))
    expect(onClose).toHaveBeenCalledOnce()
  })
})
```

- [ ] **Step 2: Run to verify they fail**

```bash
npm run test:run
```

Expected: FAIL — stubs don't render testid elements

- [ ] **Step 3: Replace src/components/AuthModal.jsx**

```jsx
import { useState } from 'react'
import { useApp } from '../context/AppContext'
import './AuthModal.css'

export default function AuthModal({ onClose }) {
  const [tab, setTab] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login, signup } = useApp()

  function switchTab(next) {
    setTab(next)
    setError('')
    setName('')
    setEmail('')
    setPassword('')
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (tab === 'login') {
      if (!login(email, password)) setError('Invalid email or password.')
      else onClose()
    } else {
      if (!name.trim()) { setError('Name is required.'); return }
      if (!signup(name, email, password)) setError('An account with this email already exists.')
      else onClose()
    }
  }

  return (
    <div className="auth-backdrop" data-testid="modal-backdrop" onClick={onClose}>
      <div className="auth-modal" onClick={e => e.stopPropagation()}>
        <button className="auth-modal__close" onClick={onClose} aria-label="Close">✕</button>

        <div className="auth-modal__tabs">
          <button
            data-testid="tab-login"
            className={`auth-tab ${tab === 'login' ? 'auth-tab--active' : ''}`}
            onClick={() => switchTab('login')}
          >
            Sign In
          </button>
          <button
            data-testid="tab-signup"
            className={`auth-tab ${tab === 'signup' ? 'auth-tab--active' : ''}`}
            onClick={() => switchTab('signup')}
          >
            Sign Up
          </button>
        </div>

        <h2 className="auth-modal__title" data-testid="modal-title">
          {tab === 'login' ? 'Sign In' : 'Create Account'}
        </h2>

        <form className="auth-modal__form" onSubmit={handleSubmit}>
          {tab === 'signup' && (
            <input
              className="auth-input"
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          )}
          <input
            className="auth-input"
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            className="auth-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {error && <p className="auth-error" data-testid="modal-error">{error}</p>}
          <button className="auth-submit" type="submit" data-testid="modal-submit">
            {tab === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Create src/components/AuthModal.css**

```css
.auth-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  z-index: 500;
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-modal {
  position: relative;
  width: 100%;
  max-width: 420px;
  background: var(--color-glass);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius);
  padding: 2.5rem 2.5rem 2rem;
  box-shadow: var(--shadow-gold), 0 24px 64px rgba(0, 0, 0, 0.6);
}

.auth-modal__close {
  position: absolute;
  top: 1rem;
  right: 1.25rem;
  background: none;
  border: none;
  color: var(--color-text-muted);
  font-size: 1rem;
  transition: color var(--transition);
}

.auth-modal__close:hover {
  color: var(--color-silver);
}

.auth-modal__tabs {
  display: flex;
  gap: 0;
  margin-bottom: 1.75rem;
  border-bottom: 1px solid var(--color-border);
}

.auth-tab {
  flex: 1;
  padding: 0.6rem 0;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  color: var(--color-text-muted);
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  transition: color var(--transition), border-color var(--transition);
  margin-bottom: -1px;
}

.auth-tab--active {
  color: var(--color-gold);
  border-bottom-color: var(--color-gold);
}

.auth-modal__title {
  font-size: 1.6rem;
  font-weight: 400;
  color: var(--color-text);
  margin-bottom: 1.5rem;
}

.auth-modal__form {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.auth-input {
  width: 100%;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-text);
  font-size: 0.9rem;
  font-family: var(--font-body);
  transition: border-color var(--transition);
  outline: none;
}

.auth-input:focus {
  border-color: var(--color-gold-dim);
}

.auth-input::placeholder {
  color: var(--color-text-muted);
}

.auth-error {
  font-size: 0.8rem;
  color: var(--color-error);
  letter-spacing: 0.03em;
}

.auth-submit {
  margin-top: 0.5rem;
  padding: 0.85rem;
  background: var(--color-gold);
  color: #0a0a0a;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  transition: background var(--transition);
}

.auth-submit:hover {
  background: var(--color-gold-light);
}
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
npm run test:run
```

Expected: PASS — all prior tests + 5 AuthModal tests passing

- [ ] **Step 6: Commit**

```bash
git add src/components/AuthModal.jsx src/components/AuthModal.css src/tests/AuthModal.test.jsx
git commit -m "feat: implement AuthModal with sign in/up tabs"
```

---

### Task 7: Landing Page

**Files:**
- Modify: `src/pages/LandingPage.jsx`
- Create: `src/pages/LandingPage.css`

- [ ] **Step 1: Replace src/pages/LandingPage.jsx**

```jsx
import { Link } from 'react-router-dom'
import './LandingPage.css'

const TESTIMONIALS = [
  { quote: 'I wept when I finally unlocked the equals button.', name: 'J. Whitmore', title: 'Hedge Fund Manager' },
  { quote: 'The most profound computational experience of my life.', name: 'A. Brennan', title: 'Architect' },
  { quote: 'Worth every penny. Every. Single. Penny.', name: 'C. Laurent', title: 'Art Collector' },
]

export default function LandingPage({ onOpenAuth }) {
  return (
    <div className="landing">
      <section className="landing__hero">
        <div className="landing__hero-inner">
          <p className="landing__eyebrow">The World's First Premium Calculator</p>
          <h1 className="landing__headline">Mathematics,<br />Elevated.</h1>
          <p className="landing__subhead">
            Every calculation is a statement. Make yours with an instrument worthy of the numbers you command.
          </p>
          <div className="landing__cta-row">
            <Link to="/store" className="landing__cta landing__cta--primary">Browse Packages</Link>
            <Link to="/calculator" className="landing__cta landing__cta--ghost">Try Demo</Link>
          </div>
        </div>
        <div className="landing__hero-ornament" aria-hidden="true">
          <span className="landing__hero-digit">0</span>
        </div>
      </section>

      <section className="landing__features">
        <h2 className="landing__section-title">The CALCVLVS Difference</h2>
        <div className="landing__features-grid">
          <div className="landing__feature">
            <span className="landing__feature-icon">◈</span>
            <h3>Curated Button Packages</h3>
            <p>Each button is hand-selected for inclusion in its respective tier. We accept nothing less.</p>
          </div>
          <div className="landing__feature">
            <span className="landing__feature-icon">◈</span>
            <h3>Exclusive Access</h3>
            <p>The equals button is reserved for our most discerning members. Are you ready?</p>
          </div>
          <div className="landing__feature">
            <span className="landing__feature-icon">◈</span>
            <h3>A Complete Experience</h3>
            <p>Three tiers. One destiny. The full arithmetic suite, unlocked on your terms.</p>
          </div>
        </div>
      </section>

      <section className="landing__testimonials">
        <h2 className="landing__section-title">What Our Members Say</h2>
        <div className="landing__testimonials-grid">
          {TESTIMONIALS.map(t => (
            <blockquote key={t.name} className="landing__testimonial">
              <p className="landing__testimonial-quote">"{t.quote}"</p>
              <footer>
                <span className="landing__testimonial-name">{t.name}</span>
                <span className="landing__testimonial-title">{t.title}</span>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="landing__cta-section">
        <h2 className="landing__cta-title">Begin Your Journey</h2>
        <p className="landing__cta-body">Create your account. Unlock your potential. Do the math.</p>
        <button className="landing__cta landing__cta--primary" onClick={onOpenAuth}>
          Create Account
        </button>
      </section>
    </div>
  )
}
```

- [ ] **Step 2: Create src/pages/LandingPage.css**

```css
.landing {
  min-height: 100vh;
}

/* Hero */
.landing__hero {
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6rem 8rem 6rem 8rem;
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid var(--color-border);
}

.landing__hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 60% 70% at 70% 50%, rgba(201, 168, 76, 0.05) 0%, transparent 70%);
  pointer-events: none;
}

.landing__hero-inner {
  max-width: 560px;
  z-index: 1;
}

.landing__eyebrow {
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-gold);
  margin-bottom: 1.5rem;
}

.landing__headline {
  font-size: clamp(3.5rem, 6vw, 5.5rem);
  line-height: 1.05;
  font-weight: 400;
  color: var(--color-text);
  margin-bottom: 1.5rem;
}

.landing__subhead {
  font-size: 1.05rem;
  line-height: 1.7;
  color: var(--color-silver);
  max-width: 440px;
  margin-bottom: 2.5rem;
}

.landing__cta-row {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.landing__cta {
  display: inline-block;
  padding: 0.85rem 2rem;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  border-radius: var(--radius-sm);
  transition: all var(--transition);
  border: none;
}

.landing__cta--primary {
  background: var(--color-gold);
  color: #0a0a0a;
}

.landing__cta--primary:hover {
  background: var(--color-gold-light);
  color: #0a0a0a;
}

.landing__cta--ghost {
  background: transparent;
  color: var(--color-silver);
  border: 1px solid var(--color-border);
}

.landing__cta--ghost:hover {
  color: var(--color-gold);
  border-color: var(--color-gold-dim);
}

.landing__hero-ornament {
  z-index: 0;
  pointer-events: none;
  user-select: none;
}

.landing__hero-digit {
  font-family: var(--font-display);
  font-size: clamp(12rem, 22vw, 22rem);
  font-weight: 700;
  color: rgba(201, 168, 76, 0.06);
  line-height: 1;
  display: block;
}

/* Shared section styles */
.landing__section-title {
  text-align: center;
  font-size: 2rem;
  font-weight: 400;
  margin-bottom: 3.5rem;
  color: var(--color-text);
}

/* Features */
.landing__features {
  padding: 7rem 8rem;
  border-bottom: 1px solid var(--color-border);
}

.landing__features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3rem;
}

.landing__feature {
  text-align: center;
}

.landing__feature-icon {
  display: block;
  font-size: 1.5rem;
  color: var(--color-gold);
  margin-bottom: 1.25rem;
}

.landing__feature h3 {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 400;
  color: var(--color-text);
  margin-bottom: 0.75rem;
}

.landing__feature p {
  font-size: 0.9rem;
  line-height: 1.7;
  color: var(--color-silver);
}

/* Testimonials */
.landing__testimonials {
  padding: 7rem 8rem;
  border-bottom: 1px solid var(--color-border);
}

.landing__testimonials-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.landing__testimonial {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 2rem;
}

.landing__testimonial-quote {
  font-family: var(--font-display);
  font-size: 1rem;
  line-height: 1.65;
  color: var(--color-text);
  margin-bottom: 1.25rem;
  font-style: italic;
}

.landing__testimonial footer {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.landing__testimonial-name {
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: var(--color-gold);
  text-transform: uppercase;
}

.landing__testimonial-title {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

/* CTA section */
.landing__cta-section {
  padding: 7rem 8rem;
  text-align: center;
}

.landing__cta-title {
  font-size: 2.5rem;
  font-weight: 400;
  margin-bottom: 1rem;
}

.landing__cta-body {
  font-size: 1rem;
  color: var(--color-silver);
  margin-bottom: 2.5rem;
}
```

- [ ] **Step 3: Verify in browser**

```bash
npm run dev
```

Expected: Full landing page with hero text, features grid, testimonials, and bottom CTA. All gold accents on dark background.

- [ ] **Step 4: Commit**

```bash
git add src/pages/LandingPage.jsx src/pages/LandingPage.css
git commit -m "feat: implement Landing Page"
```

---

### Task 8: PackageCard & StorePage

**Files:**
- Modify: `src/components/PackageCard.jsx`
- Create: `src/components/PackageCard.css`
- Create: `src/tests/PackageCard.test.jsx`
- Modify: `src/pages/StorePage.jsx`
- Create: `src/pages/StorePage.css`

- [ ] **Step 1: Write failing PackageCard tests**

Create `src/tests/PackageCard.test.jsx`:

```jsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AppProvider } from '../context/AppContext'
import PackageCard from '../components/PackageCard'
import { PACKAGES } from '../data/packages'

beforeEach(() => localStorage.clear())

const basicPkg = PACKAGES[0]
const equalizerPkg = PACKAGES[2]

function renderCard(pkg, owned = false, onOpenAuth = vi.fn()) {
  if (owned) {
    localStorage.setItem('calc_packages', JSON.stringify([pkg.id]))
    localStorage.setItem('calc_user', JSON.stringify({ name: 'T', email: 't@x.com' }))
  }
  return render(
    <AppProvider>
      <PackageCard pkg={pkg} onOpenAuth={onOpenAuth} />
    </AppProvider>
  )
}

describe('PackageCard', () => {
  it('renders package name and price', () => {
    renderCard(basicPkg)
    expect(screen.getByText(basicPkg.name)).toBeInTheDocument()
    expect(screen.getByText(basicPkg.priceDisplay)).toBeInTheDocument()
  })

  it('shows Purchase button when not owned', () => {
    renderCard(basicPkg)
    expect(screen.getByRole('button', { name: /purchase/i })).toBeInTheDocument()
  })

  it('shows Owned when already purchased', () => {
    renderCard(basicPkg, true)
    expect(screen.getByText(/owned/i)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /purchase/i })).not.toBeInTheDocument()
  })

  it('opens auth modal when purchasing without login', async () => {
    const onOpenAuth = vi.fn()
    renderCard(basicPkg, false, onOpenAuth)
    await userEvent.click(screen.getByRole('button', { name: /purchase/i }))
    expect(onOpenAuth).toHaveBeenCalledOnce()
  })

  it('marks exclusive package with badge', () => {
    renderCard(equalizerPkg)
    expect(screen.getByText(/most exclusive/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run to verify they fail**

```bash
npm run test:run
```

Expected: FAIL — stub PackageCard doesn't render the expected content

- [ ] **Step 3: Replace src/components/PackageCard.jsx**

```jsx
import { useApp } from '../context/AppContext'
import './PackageCard.css'

export default function PackageCard({ pkg, onOpenAuth }) {
  const { user, ownedPackages, purchasePackage } = useApp()
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
        {pkg.features.map(f => (
          <li key={f} className="pkg-card__feature">
            <span className="pkg-card__check">◆</span>
            {f}
          </li>
        ))}
      </ul>
      <div className="pkg-card__buttons-preview">
        {pkg.buttons.map(b => (
          <span key={b} className="pkg-card__btn-chip">{b}</span>
        ))}
      </div>
      {owned ? (
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

- [ ] **Step 4: Create src/components/PackageCard.css**

```css
.pkg-card {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 2.25rem;
  background: var(--color-glass);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  backdrop-filter: blur(8px);
  position: relative;
  transition: border-color var(--transition), box-shadow var(--transition);
}

.pkg-card:hover {
  border-color: var(--color-gold-dim);
  box-shadow: var(--shadow-gold);
}

.pkg-card--exclusive {
  border-color: var(--color-gold-dim);
  transform: scale(1.03);
  box-shadow: var(--shadow-gold);
}

.pkg-card__badge {
  position: absolute;
  top: -13px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--color-gold);
  color: #0a0a0a;
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  padding: 0.3rem 1.1rem;
  border-radius: 2px;
  white-space: nowrap;
}

.pkg-card__name {
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-weight: 400;
  color: var(--color-text);
  margin-bottom: 0.4rem;
}

.pkg-card__tagline {
  font-size: 0.85rem;
  line-height: 1.6;
  color: var(--color-silver);
}

.pkg-card__price {
  font-family: var(--font-display);
  font-size: 2.2rem;
  color: var(--color-gold);
  line-height: 1;
}

.pkg-card__features {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.pkg-card__feature {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.85rem;
  color: var(--color-silver);
}

.pkg-card__check {
  color: var(--color-gold);
  font-size: 0.5rem;
  flex-shrink: 0;
}

.pkg-card__buttons-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.pkg-card__btn-chip {
  padding: 0.2rem 0.6rem;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  color: var(--color-silver);
  font-family: monospace;
}

.pkg-card__purchase {
  width: 100%;
  padding: 0.85rem;
  background: var(--color-gold);
  color: #0a0a0a;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  transition: background var(--transition);
  margin-top: auto;
}

.pkg-card__purchase:hover {
  background: var(--color-gold-light);
}

.pkg-card__owned {
  text-align: center;
  padding: 0.85rem;
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-gold);
  margin-top: auto;
}
```

- [ ] **Step 5: Replace src/pages/StorePage.jsx**

```jsx
import { PACKAGES } from '../data/packages'
import PackageCard from '../components/PackageCard'
import './StorePage.css'

export default function StorePage({ onOpenAuth }) {
  return (
    <div className="store">
      <div className="store__header">
        <p className="store__eyebrow">Premium Packages</p>
        <h1 className="store__title">The Collection</h1>
        <p className="store__subtitle">
          Select the package that befits your ambitions. Each tier unlocks buttons of increasing consequence.
        </p>
      </div>
      <div className="store__grid">
        {PACKAGES.map(pkg => (
          <PackageCard key={pkg.id} pkg={pkg} onOpenAuth={onOpenAuth} />
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Create src/pages/StorePage.css**

```css
.store {
  min-height: calc(100vh - 64px);
  padding: 6rem 8rem;
}

.store__header {
  text-align: center;
  margin-bottom: 5rem;
}

.store__eyebrow {
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-gold);
  margin-bottom: 1rem;
}

.store__title {
  font-size: 3rem;
  font-weight: 400;
  margin-bottom: 1rem;
}

.store__subtitle {
  font-size: 1rem;
  color: var(--color-silver);
  max-width: 480px;
  margin: 0 auto;
  line-height: 1.7;
}

.store__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  align-items: start;
  padding-top: 1.5rem;
}
```

- [ ] **Step 7: Run tests to verify they pass**

```bash
npm run test:run
```

Expected: PASS — all prior tests + 5 PackageCard tests passing

- [ ] **Step 8: Commit**

```bash
git add src/components/PackageCard.jsx src/components/PackageCard.css \
  src/tests/PackageCard.test.jsx src/pages/StorePage.jsx src/pages/StorePage.css
git commit -m "feat: implement PackageCard and StorePage"
```

---

### Task 9: CalculatorButton

**Files:**
- Modify: `src/components/CalculatorButton.jsx`
- Create: `src/components/CalculatorButton.css`
- Create: `src/tests/CalculatorButton.test.jsx`

- [ ] **Step 1: Write failing tests**

Create `src/tests/CalculatorButton.test.jsx`:

```jsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CalculatorButton from '../components/CalculatorButton'

function renderBtn(props) {
  return render(<CalculatorButton {...props} />)
}

describe('CalculatorButton', () => {
  it('renders the button label', () => {
    renderBtn({ label: '5', unlocked: true, onPress: vi.fn(), onLocked: vi.fn() })
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('calls onPress when unlocked and clicked', async () => {
    const onPress = vi.fn()
    renderBtn({ label: '5', unlocked: true, onPress, onLocked: vi.fn() })
    await userEvent.click(screen.getByRole('button'))
    expect(onPress).toHaveBeenCalledWith('5')
  })

  it('calls onLocked instead of onPress when locked', async () => {
    const onPress = vi.fn()
    const onLocked = vi.fn()
    renderBtn({ label: '=', unlocked: false, onPress, onLocked })
    await userEvent.click(screen.getByRole('button'))
    expect(onLocked).toHaveBeenCalledOnce()
    expect(onPress).not.toHaveBeenCalled()
  })

  it('applies locked class when locked', () => {
    renderBtn({ label: '=', unlocked: false, onPress: vi.fn(), onLocked: vi.fn() })
    expect(screen.getByRole('button')).toHaveClass('calc-btn--locked')
  })

  it('applies wide class when colSpan is 2', () => {
    renderBtn({ label: '0', unlocked: true, onPress: vi.fn(), onLocked: vi.fn(), colSpan: 2 })
    expect(screen.getByRole('button')).toHaveClass('calc-btn--wide')
  })
})
```

- [ ] **Step 2: Run to verify they fail**

```bash
npm run test:run
```

Expected: FAIL — stub CalculatorButton doesn't support the needed props/classes

- [ ] **Step 3: Replace src/components/CalculatorButton.jsx**

```jsx
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
```

- [ ] **Step 4: Create src/components/CalculatorButton.css**

```css
.calc-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 72px;
  background: linear-gradient(160deg, #1e1e1e 0%, #141414 100%);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-text);
  font-size: 1.15rem;
  font-family: var(--font-body);
  font-weight: 300;
  transition: background var(--transition), border-color var(--transition), box-shadow var(--transition), transform 0.08s ease;
  cursor: pointer;
  user-select: none;
}

.calc-btn:hover:not(.calc-btn--locked) {
  border-color: var(--color-gold-dim);
  box-shadow: 0 0 16px rgba(201, 168, 76, 0.08);
}

.calc-btn:active:not(.calc-btn--locked) {
  transform: scale(0.96);
  background: linear-gradient(160deg, #252525 0%, #1a1a1a 100%);
}

.calc-btn--locked {
  opacity: 0.38;
  cursor: pointer;
}

.calc-btn--locked:hover {
  border-color: var(--color-border);
  opacity: 0.5;
}

.calc-btn--equals {
  background: linear-gradient(160deg, #2a2010 0%, #1e1808 100%);
  border-color: var(--color-gold-dim);
  color: var(--color-gold);
}

.calc-btn--equals:hover:not(.calc-btn--locked) {
  background: linear-gradient(160deg, #352814 0%, #261d0a 100%);
  border-color: var(--color-gold);
  box-shadow: 0 0 24px rgba(201, 168, 76, 0.18);
}

.calc-btn--wide {
  grid-column: span 2;
}

.calc-btn--tall {
  grid-row: span 2;
}

.calc-btn__label {
  position: relative;
  z-index: 1;
  letter-spacing: 0.02em;
}

.calc-btn__lock {
  position: absolute;
  top: 4px;
  right: 6px;
  font-size: 0.55rem;
  opacity: 0.7;
}
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
npm run test:run
```

Expected: PASS — all prior tests + 5 CalculatorButton tests passing

- [ ] **Step 6: Commit**

```bash
git add src/components/CalculatorButton.jsx src/components/CalculatorButton.css src/tests/CalculatorButton.test.jsx
git commit -m "feat: implement CalculatorButton with locked/unlocked states"
```

---

### Task 10: DemoBanner & LockedButtonModal

**Files:**
- Modify: `src/components/DemoBanner.jsx`
- Create: `src/components/DemoBanner.css`
- Modify: `src/components/LockedButtonModal.jsx`
- Create: `src/components/LockedButtonModal.css`

- [ ] **Step 1: Replace src/components/DemoBanner.jsx**

```jsx
import { Link } from 'react-router-dom'
import './DemoBanner.css'

export default function DemoBanner({ onOpenAuth }) {
  return (
    <div className="demo-banner">
      <span className="demo-banner__text">
        You are in <strong>Demo Mode</strong> — only the <code>0</code> key is available.
      </span>
      <div className="demo-banner__actions">
        <button className="demo-banner__btn" onClick={onOpenAuth}>Create Account</button>
        <Link to="/store" className="demo-banner__link">Browse Packages</Link>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create src/components/DemoBanner.css**

```css
.demo-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem 2rem;
  background: rgba(201, 168, 76, 0.07);
  border-bottom: 1px solid var(--color-border);
  font-size: 0.8rem;
  flex-wrap: wrap;
}

.demo-banner__text {
  color: var(--color-silver);
  letter-spacing: 0.02em;
}

.demo-banner__text strong {
  color: var(--color-gold);
  font-weight: 600;
}

.demo-banner__text code {
  font-family: monospace;
  color: var(--color-gold);
  background: rgba(201, 168, 76, 0.1);
  padding: 0.1em 0.35em;
  border-radius: 2px;
}

.demo-banner__actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.demo-banner__btn {
  padding: 0.35rem 1rem;
  background: var(--color-gold);
  color: #0a0a0a;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  transition: background var(--transition);
}

.demo-banner__btn:hover {
  background: var(--color-gold-light);
}

.demo-banner__link {
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  color: var(--color-silver);
}

.demo-banner__link:hover {
  color: var(--color-gold);
}
```

- [ ] **Step 3: Replace src/components/LockedButtonModal.jsx**

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
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Create src/components/LockedButtonModal.css**

```css
.locked-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  z-index: 400;
  display: flex;
  align-items: center;
  justify-content: center;
}

.locked-modal {
  position: relative;
  width: 100%;
  max-width: 400px;
  background: var(--color-glass);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius);
  padding: 2.5rem 2.25rem 2rem;
  box-shadow: var(--shadow-gold), 0 24px 64px rgba(0, 0, 0, 0.6);
  text-align: center;
}

.locked-modal__close {
  position: absolute;
  top: 1rem;
  right: 1.25rem;
  background: none;
  border: none;
  color: var(--color-text-muted);
  font-size: 0.9rem;
  transition: color var(--transition);
}

.locked-modal__close:hover {
  color: var(--color-silver);
}

.locked-modal__eyebrow {
  font-size: 0.65rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-gold);
  margin-bottom: 0.75rem;
}

.locked-modal__title {
  font-size: 1.6rem;
  font-weight: 400;
  margin-bottom: 0.5rem;
}

.locked-modal__tagline {
  font-size: 0.875rem;
  color: var(--color-silver);
  margin-bottom: 0.75rem;
  font-style: italic;
}

.locked-modal__price {
  font-family: var(--font-display);
  font-size: 2rem;
  color: var(--color-gold);
  margin-bottom: 1.25rem;
  line-height: 1;
}

.locked-modal__body {
  font-size: 0.85rem;
  line-height: 1.7;
  color: var(--color-silver);
  margin-bottom: 1.75rem;
}

.locked-modal__body strong {
  color: var(--color-text);
}

.locked-modal__actions {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.locked-modal__btn {
  display: block;
  width: 100%;
  padding: 0.8rem;
  border-radius: var(--radius-sm);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  text-align: center;
  transition: background var(--transition), color var(--transition), border-color var(--transition);
  border: none;
}

.locked-modal__btn--primary {
  background: var(--color-gold);
  color: #0a0a0a;
}

.locked-modal__btn--primary:hover {
  background: var(--color-gold-light);
  color: #0a0a0a;
}

.locked-modal__btn--ghost {
  background: transparent;
  color: var(--color-text-muted);
  border: 1px solid var(--color-border);
}

.locked-modal__btn--ghost:hover {
  color: var(--color-silver);
}
```

- [ ] **Step 5: Commit**

```bash
git add src/components/DemoBanner.jsx src/components/DemoBanner.css \
  src/components/LockedButtonModal.jsx src/components/LockedButtonModal.css
git commit -m "feat: implement DemoBanner and LockedButtonModal"
```

---

### Task 11: CalculatorPage

**Files:**
- Modify: `src/pages/CalculatorPage.jsx`
- Create: `src/pages/CalculatorPage.css`
- Create: `src/tests/CalculatorPage.test.jsx`

- [ ] **Step 1: Write failing integration tests**

Create `src/tests/CalculatorPage.test.jsx`:

```jsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { AppProvider } from '../context/AppContext'
import CalculatorPage from '../pages/CalculatorPage'

beforeEach(() => localStorage.clear())

function renderCalc(ownedPackages = [], loggedIn = false) {
  if (loggedIn) {
    localStorage.setItem('calc_user', JSON.stringify({ name: 'T', email: 't@x.com' }))
    localStorage.setItem('calc_packages', JSON.stringify(ownedPackages))
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
    expect(screen.getByTestId('calc-display').textContent).toBe('0')
  })

  it('pressing a locked button opens the locked button modal', async () => {
    renderCalc()
    const fiveBtn = screen.getByRole('button', { name: '5' })
    await userEvent.click(fiveBtn)
    expect(screen.getByText(/premium feature/i)).toBeInTheDocument()
  })

  it('evaluates expression when = is unlocked', async () => {
    renderCalc(['basic', 'advanced', 'equalizer'], true)
    await userEvent.click(screen.getByRole('button', { name: '3' }))
    await userEvent.click(screen.getByRole('button', { name: '+' }))
    await userEvent.click(screen.getByRole('button', { name: '4' }))
    await userEvent.click(screen.getByRole('button', { name: '=' }))
    expect(screen.getByTestId('calc-display').textContent).toBe('7')
  })
})
```

- [ ] **Step 2: Run to verify they fail**

```bash
npm run test:run
```

Expected: FAIL — stub CalculatorPage doesn't match

- [ ] **Step 3: Replace src/pages/CalculatorPage.jsx**

```jsx
import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { BUTTON_LAYOUT } from '../data/packages'
import { evaluateExpression, applyPlusMinus, getButtonPackage, isButtonUnlocked } from '../utils/calculator'
import CalculatorButton from '../components/CalculatorButton'
import LockedButtonModal from '../components/LockedButtonModal'
import DemoBanner from '../components/DemoBanner'
import './CalculatorPage.css'

export default function CalculatorPage({ onOpenAuth }) {
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
```

- [ ] **Step 4: Create src/pages/CalculatorPage.css**

```css
.calc-page {
  min-height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.calc-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 480px;
  padding: 3rem 1.5rem 4rem;
  gap: 1.5rem;
}

.calc-screen-area {
  width: 100%;
}

.calc-screen {
  width: 100%;
  min-height: 96px;
  padding: 1.25rem 1.5rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  font-family: var(--font-display);
  font-size: 2.4rem;
  font-weight: 400;
  color: var(--color-gold-light);
  text-align: right;
  letter-spacing: 0.03em;
  word-break: break-all;
  box-shadow: inset 0 2px 12px rgba(0, 0, 0, 0.4);
}

.calc-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.6rem;
}
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
npm run test:run
```

Expected: PASS — all tests passing (30+ total)

- [ ] **Step 6: Commit**

```bash
git add src/pages/CalculatorPage.jsx src/pages/CalculatorPage.css src/tests/CalculatorPage.test.jsx
git commit -m "feat: implement CalculatorPage with expression evaluation and locked buttons"
```

---

### Task 12: Final Verification

**Files:** No changes — verification only

- [ ] **Step 1: Run full test suite**

```bash
npm run test:run
```

Expected: All tests PASS with 0 failures

- [ ] **Step 2: Start dev server and verify all three pages render correctly**

```bash
npm run dev
```

Check each route in the browser:
- `/` — Landing page: hero with "Mathematics, Elevated.", features grid, testimonials, CTA section
- `/store` — Store page: three package cards, Tier 3 card is slightly larger with "Most Exclusive" badge
- `/calculator` — Calculator: demo banner (when logged out), full button grid with `0` unlocked, all others locked with padlock icons

- [ ] **Step 3: Test the full user flow in browser**

1. Go to `/calculator` — verify demo banner shows and only `0` works; clicking `5` opens LockedButtonModal
2. Click "Create Account" in demo banner — verify AuthModal opens
3. Sign up with any name/email/password — verify modal closes, navbar shows name
4. Go to `/store` — click "Purchase" on Basic Arithmetic ($0.99) — verify button changes to "Owned ✓"
5. Go to `/calculator` — verify `0 1 2 3 4 + -` are now unlocked and functional
6. Purchase The Equalizer — go to calculator — verify `=` works and evaluates expressions
7. Sign out, sign back in — verify owned packages are still there

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete premium DLC calculator app"
```
