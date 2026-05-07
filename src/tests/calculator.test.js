import { describe, it, expect } from 'vitest'
import { evaluateExpression, applyPlusMinus } from '../utils/calculator'
import { getButtonPackage, isButtonUnlocked } from '../utils/calculator'

describe('evaluateExpression', () => {
  it('evaluates addition', () => {
    expect(evaluateExpression('1+2')).toBe('3')
  })
  it('evaluates multiplication with × symbol', () => {
    expect(evaluateExpression('3×4')).toBe('12')
  })
  it('evaluates division with ÷ symbol', () => {
    expect(evaluateExpression('8÷2')).toBe('4')
  })
  it('returns Error for invalid expression', () => {
    expect(evaluateExpression('1+')).toBe('Error')
  })
  it('evaluates parentheses', () => {
    expect(evaluateExpression('(1+2)×3')).toBe('9')
  })
})

describe('applyPlusMinus', () => {
  it('prepends minus to a positive expression', () => {
    expect(applyPlusMinus('5')).toBe('-5')
  })
  it('removes minus from a negative expression', () => {
    expect(applyPlusMinus('-5')).toBe('5')
  })
  it('returns empty string unchanged', () => {
    expect(applyPlusMinus('')).toBe('')
  })
})

describe('getButtonPackage', () => {
  it('returns basic package for digit 0', () => {
    expect(getButtonPackage('0').id).toBe('basic')
  })
  it('returns advanced package for digit 7', () => {
    expect(getButtonPackage('7').id).toBe('advanced')
  })
  it('returns null for = (subscription-only)', () => {
    expect(getButtonPackage('=')).toBeNull()
  })
  it('returns equalizer package for ×', () => {
    expect(getButtonPackage('×').id).toBe('equalizer')
  })
  it('returns null for unknown button', () => {
    expect(getButtonPackage('X')).toBeNull()
  })
})

describe('isButtonUnlocked', () => {
  it('unlocks 0 for logged-out demo users', () => {
    expect(isButtonUnlocked('0', [], false)).toBe(true)
  })
  it('locks non-demo buttons for logged-out users', () => {
    expect(isButtonUnlocked('1', [], false)).toBe(false)
  })
  it('locks buttons even if logged in without the right package', () => {
    expect(isButtonUnlocked('=', ['basic'], true)).toBe(false)
  })
  it('unlocks button when its package is owned', () => {
    expect(isButtonUnlocked('1', ['basic'], true)).toBe(true)
  })
  it('= is locked even with equalizer package (subscription-only)', () => {
    expect(isButtonUnlocked('=', ['equalizer'], true)).toBe(false)
  })
})
