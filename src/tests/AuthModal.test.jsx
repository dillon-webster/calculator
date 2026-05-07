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
