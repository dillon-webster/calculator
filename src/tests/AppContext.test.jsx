import { describe, it, expect, beforeEach } from 'vitest'
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
