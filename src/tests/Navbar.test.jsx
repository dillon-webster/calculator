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
