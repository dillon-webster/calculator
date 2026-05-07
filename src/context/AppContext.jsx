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
