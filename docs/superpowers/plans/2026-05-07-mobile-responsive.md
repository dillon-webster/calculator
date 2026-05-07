# Mobile Responsive Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make all pages responsive on mobile (≤ 640px) with a hamburger navbar, stacked landing page layouts, and tightened calculator padding.

**Architecture:** Targeted `@media (max-width: 640px)` blocks added to existing CSS files. One JSX change to `Navbar.jsx` adds `isOpen` state and a hamburger toggle button with a dropdown panel.

**Tech Stack:** React, CSS modules (plain CSS), Vitest + Testing Library

---

## File Map

- Modify: `src/components/Navbar.jsx` — add hamburger state + dropdown panel
- Modify: `src/components/Navbar.css` — mobile styles for hamburger, hidden links, dropdown
- Create: `src/tests/Navbar.test.jsx` — tests for hamburger toggle behavior
- Modify: `src/pages/LandingPage.css` — mobile breakpoints for padding, hero layout, grids
- Modify: `src/pages/CalculatorPage.css` — reduced padding and gap on mobile

---

### Task 1: Navbar hamburger menu

**Files:**
- Create: `src/tests/Navbar.test.jsx`
- Modify: `src/components/Navbar.jsx`
- Modify: `src/components/Navbar.css`

- [ ] **Step 1: Write the failing tests**

Create `src/tests/Navbar.test.jsx`:

```jsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { AppProvider } from '../context/AppContext'
import Navbar from '../components/Navbar'

function renderNavbar(onOpenAuth = vi.fn()) {
  return render(
    <AppProvider>
      <MemoryRouter>
        <Navbar onOpenAuth={onOpenAuth} />
      </MemoryRouter>
    </AppProvider>
  )
}

describe('Navbar', () => {
  it('renders the brand link', () => {
    renderNavbar()
    expect(screen.getByText('CALCVLVS')).toBeInTheDocument()
  })

  it('renders hamburger button', () => {
    renderNavbar()
    expect(screen.getByRole('button', { name: /menu/i })).toBeInTheDocument()
  })

  it('nav links are not visible by default', () => {
    renderNavbar()
    // The nav element has navbar__links--hidden when closed
    const nav = screen.getByRole('navigation')
    expect(nav).toHaveClass('navbar__links--hidden')
  })

  it('opens the menu when hamburger is clicked', async () => {
    renderNavbar()
    await userEvent.click(screen.getByRole('button', { name: /menu/i }))
    const nav = screen.getByRole('navigation')
    expect(nav).not.toHaveClass('navbar__links--hidden')
  })

  it('closes the menu when a nav link is clicked', async () => {
    renderNavbar()
    await userEvent.click(screen.getByRole('button', { name: /menu/i }))
    await userEvent.click(screen.getByRole('link', { name: /calculator/i }))
    const nav = screen.getByRole('navigation')
    expect(nav).toHaveClass('navbar__links--hidden')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm run test:run -- Navbar
```

Expected: tests fail — `navbar__links--hidden` class and hamburger button don't exist yet.

- [ ] **Step 3: Update Navbar.jsx with hamburger state and dropdown**

Replace the contents of `src/components/Navbar.jsx`:

```jsx
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import './Navbar.css'

export default function Navbar({ onOpenAuth }) {
  const { user, logout } = useApp()
  const { pathname } = useLocation()
  const [isOpen, setIsOpen] = useState(false)

  function close() { setIsOpen(false) }

  return (
    <header className="navbar">
      <Link to="/" className="navbar__brand" onClick={close}>CALCVLVS</Link>

      <nav className={`navbar__links${isOpen ? '' : ' navbar__links--hidden'}`}>
        <Link to="/" className={pathname === '/' ? 'active' : ''} onClick={close}>Home</Link>
        <Link to="/store" className={pathname === '/store' ? 'active' : ''} onClick={close}>Store</Link>
        <Link to="/calculator" className={pathname === '/calculator' ? 'active' : ''} onClick={close}>Calculator</Link>
        <div className="navbar__auth navbar__auth--drawer">
          {user ? (
            <>
              <span className="navbar__user">{user.name}</span>
              <button className="navbar__btn navbar__btn--ghost" onClick={() => { logout(); close() }}>Sign Out</button>
            </>
          ) : (
            <button className="navbar__btn" onClick={() => { onOpenAuth(); close() }}>Sign In</button>
          )}
        </div>
      </nav>

      <div className="navbar__auth navbar__auth--bar">
        {user ? (
          <>
            <span className="navbar__user">{user.name}</span>
            <button className="navbar__btn navbar__btn--ghost" onClick={logout}>Sign Out</button>
          </>
        ) : (
          <button className="navbar__btn" onClick={onOpenAuth}>Sign In</button>
        )}
      </div>

      <button
        className="navbar__hamburger"
        onClick={() => setIsOpen(o => !o)}
        aria-label="menu"
        aria-expanded={isOpen}
      >
        <span /><span /><span />
      </button>
    </header>
  )
}
```

- [ ] **Step 4: Update Navbar.css with hamburger and mobile styles**

Append to the end of `src/components/Navbar.css`:

```css
/* Hamburger button — hidden on desktop */
.navbar__hamburger {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 36px;
  height: 36px;
  background: transparent;
  border: none;
  padding: 4px;
  cursor: pointer;
  flex-shrink: 0;
}

.navbar__hamburger span {
  display: block;
  height: 1px;
  background: var(--color-gold);
  border-radius: 1px;
  transition: opacity var(--transition);
}

/* Auth in drawer — hidden on desktop */
.navbar__auth--drawer {
  display: none;
}

@media (max-width: 640px) {
  .navbar {
    padding: 0 1.25rem;
    flex-wrap: wrap;
    height: auto;
    min-height: 56px;
  }

  /* Hide desktop auth and show hamburger */
  .navbar__auth--bar {
    display: none;
  }

  .navbar__hamburger {
    display: flex;
  }

  /* Nav links: full-width dropdown, hidden by default */
  .navbar__links {
    order: 3;
    flex-direction: column;
    width: 100%;
    padding: 1rem 0 1.25rem;
    gap: 0;
    margin: 0;
    border-top: 1px solid var(--color-border);
    font-size: 0.85rem;
  }

  .navbar__links a {
    padding: 0.75rem 0;
    display: block;
  }

  .navbar__links--hidden {
    display: none;
  }

  /* Auth controls inside drawer */
  .navbar__auth--drawer {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding-top: 0.75rem;
    margin-top: 0.5rem;
    border-top: 1px solid var(--color-border);
  }
}
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
npm run test:run -- Navbar
```

Expected: all 5 tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/components/Navbar.jsx src/components/Navbar.css src/tests/Navbar.test.jsx
git commit -m "feat: add hamburger menu for mobile navbar"
```

---

### Task 2: Landing page mobile CSS

**Files:**
- Modify: `src/pages/LandingPage.css`

- [ ] **Step 1: Append mobile breakpoint block to LandingPage.css**

Append to the end of `src/pages/LandingPage.css`:

```css
@media (max-width: 640px) {
  .landing__hero {
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 3rem 1.5rem 3rem;
    min-height: unset;
    gap: 0;
  }

  .landing__hero-ornament {
    display: none;
  }

  .landing__headline {
    font-size: clamp(2.8rem, 12vw, 3.5rem);
  }

  .landing__features {
    padding: 4rem 1.5rem;
  }

  .landing__features-grid {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }

  .landing__testimonials {
    padding: 4rem 1.5rem;
  }

  .landing__testimonials-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .landing__cta-section {
    padding: 4rem 1.5rem;
  }
}
```

- [ ] **Step 2: Run the full test suite to check for regressions**

```bash
npm run test:run
```

Expected: all tests pass (no CSS test regressions).

- [ ] **Step 3: Commit**

```bash
git add src/pages/LandingPage.css
git commit -m "feat: add mobile breakpoints to landing page"
```

---

### Task 3: Calculator page mobile CSS

**Files:**
- Modify: `src/pages/CalculatorPage.css`

- [ ] **Step 1: Append mobile breakpoint block to CalculatorPage.css**

Append to the end of `src/pages/CalculatorPage.css`:

```css
@media (max-width: 640px) {
  .calc-wrapper {
    padding: 1.25rem 1.5rem 2rem;
  }

  .calc-grid {
    gap: 0.5rem;
  }
}
```

- [ ] **Step 2: Run the full test suite**

```bash
npm run test:run
```

Expected: all tests pass.

- [ ] **Step 3: Commit**

```bash
git add src/pages/CalculatorPage.css
git commit -m "feat: tighten calculator padding and gap on mobile"
```
