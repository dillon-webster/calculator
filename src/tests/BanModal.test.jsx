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

  it('focuses the dialog on mount', () => {
    render(<BanModal />)
    expect(document.activeElement).toBe(screen.getByRole('dialog'))
  })
})
