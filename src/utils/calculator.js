import { evaluate } from 'mathjs'
import { PACKAGES, DEMO_BUTTONS } from '../data/packages'

const NSFW_NUMBERS = new Set([
  '8008',      // BOOB
  '58008',     // BOOBS
  '80085',     // BOOBS
  '5318008',   // BOOBIES
  '55378008',  // BOOBLESS
  '7108',      // BOIL
  '304',       // hOE
  '7734',      // hELL
  '35007',     // LOOSE
])

// Returns 'nsfw', 'satan', or null
export function getModalTrigger(expression) {
  const normalized = expression.replace(/^-/, '')
  if (normalized === '1134') return 'satan'
  if (NSFW_NUMBERS.has(normalized)) return 'nsfw'
  return null
}

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
