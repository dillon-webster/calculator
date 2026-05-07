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

  it('calls purchasePackage when logged in and purchase clicked', async () => {
    localStorage.setItem('calc_user', JSON.stringify({ name: 'T', email: 't@x.com' }))
    localStorage.setItem('calc_packages', JSON.stringify([]))
    render(
      <AppProvider>
        <PackageCard pkg={basicPkg} onOpenAuth={vi.fn()} />
      </AppProvider>
    )
    await userEvent.click(screen.getByRole('button', { name: /purchase/i }))
    expect(screen.getByText(/owned/i)).toBeInTheDocument()
  })

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
})
