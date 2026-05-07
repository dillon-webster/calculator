import { evaluate } from 'mathjs'
import { PACKAGES, DEMO_BUTTONS } from '../data/packages'

export function evaluateExpression(expression) {
  try {
    const normalized = expression.replace(/×/g, '*').replace(/÷/g, '/')
    const result = evaluate(normalized)
    return String(result)
  } catch {
    return 'Error'
  }
}

export function applyPlusMinus(expression) {
  if (!expression) return expression
  if (expression.startsWith('-')) return expression.slice(1)
  return '-' + expression
}

export function getButtonPackage(button) {
  return PACKAGES.find(pkg => pkg.buttons.includes(button)) ?? null
}

export function isButtonUnlocked(button, ownedPackages, isLoggedIn, hasSubscription = false) {
  if (DEMO_BUTTONS.includes(button)) return true
  if (!isLoggedIn) return false
  if (hasSubscription) return true
  const pkg = getButtonPackage(button)
  if (!pkg) return false
  return ownedPackages.includes(pkg.id)
}
