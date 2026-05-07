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
