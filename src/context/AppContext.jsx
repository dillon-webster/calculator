/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react'

const AppContext = createContext(null)

function safeGet(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback
  } catch {
    return fallback
  }
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => safeGet('calc_user', null))
  const [ownedPackages, setOwnedPackages] = useState(() => safeGet('calc_packages', []))

  function signup(name, email, password) {
    const accounts = safeGet('calc_accounts', {})
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
    const accounts = safeGet('calc_accounts', {})
    if (!accounts[email] || accounts[email].password !== password) return false
    const u = { name: accounts[email].name, email }
    setUser(u)
    localStorage.setItem('calc_user', JSON.stringify(u))
    const userPkgs = safeGet(`calc_packages_${email}`, [])
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

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
