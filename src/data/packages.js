export const PACKAGES = [
  {
    id: 'basic',
    name: 'Basic Arithmetic',
    price: 1.98,
    priceDisplay: '$1.98',
    tagline: 'The foundation of all computation.',
    buttons: ['0', '1', '2', '3', '4', '+', '-'],
    features: ['Digits 0–4', 'Addition', 'Subtraction'],
    exclusive: false,
  },
  {
    id: 'advanced',
    name: 'Advanced Arithmetic',
    price: 3.98,
    priceDisplay: '$3.98',
    tagline: 'Unlock the upper echelon of digits.',
    buttons: ['5', '6', '7', '8', '9', '.', '(', ')'],
    features: ['Digits 5–9', 'Decimal precision', 'Parenthetical grouping'],
    exclusive: false,
  },
  {
    id: 'equalizer',
    name: 'The Equalizer',
    price: 19.98,
    priceDisplay: '$19.98',
    tagline: 'True resolution. For those who demand results.',
    buttons: ['×', '÷', 'CE', 'C', '±', '%'],
    features: ['Multiplication', 'Division', 'Clear & reset', 'Sign inversion', 'Percentage'],
    exclusive: true,
  },
]

// Used in LockedButtonModal when a button has no package (i.e. = is subscription-only)
export const SUBSCRIPTION_DISPLAY = {
  id: 'premier',
  name: 'CALCVLVS Premier',
  price: 14.99,
  priceDisplay: '$14.99/mo',
  tagline: 'Every button. Every function. Yours in perpetuity.',
  buttons: ['='],
  features: ['Every button', 'Unlimited calculations'],
  exclusive: true,
}

export const DEMO_BUTTONS = ['0']

export const BUTTON_LAYOUT = [
  { label: 'CE' }, { label: 'C' }, { label: '±' }, { label: '%' },
  { label: '(' }, { label: ')' }, { label: '÷' }, { label: '×' },
  { label: '7' }, { label: '8' }, { label: '9' }, { label: '-' },
  { label: '4' }, { label: '5' }, { label: '6' }, { label: '+' },
  { label: '1' }, { label: '2' }, { label: '3' }, { label: '=', rowSpan: 2 },
  { label: '0', colSpan: 2 }, { label: '.' },
]
