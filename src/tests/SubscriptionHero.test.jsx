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
