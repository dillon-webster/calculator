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

  it('evaluates expression when subscribed', async () => {
    renderCalc([], true, true)
    await userEvent.click(screen.getByRole('button', { name: '3' }))
    await userEvent.click(screen.getByRole('button', { name: '+' }))
    await userEvent.click(screen.getByRole('button', { name: '4' }))
    await userEvent.click(screen.getByRole('button', { name: '=' }))
    expect(screen.getByTestId('calc-display').textContent).toBe('7')
  })

  it('bans user when = produces an error', async () => {
    renderCalc([], true, true)
    await userEvent.click(screen.getByRole('button', { name: '(' }))
    await userEvent.click(screen.getByRole('button', { name: '=' }))
    expect(screen.getByText("You've been banned from using calculator.")).toBeInTheDocument()
  })

  it('locked out after ban — buttons no longer update the display', async () => {
    renderCalc([], true, true)
    await userEvent.click(screen.getByRole('button', { name: '(' }))
    await userEvent.click(screen.getByRole('button', { name: '=' }))
    // display shows 'Error' at this point; pressing 0 should not append '0'
    await userEvent.click(screen.getByRole('button', { name: '0' }))
    expect(screen.getByTestId('calc-display').textContent).toBe('Error')
  })
})
