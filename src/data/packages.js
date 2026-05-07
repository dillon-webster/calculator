export const PACKAGES = [
  {
    id: 'basic',
    name: 'Basic Arithmetic',
    price: 0.99,
    priceDisplay: '$0.99',
    tagline: 'The foundation of all computation.',
    buttons: ['0', '1', '2', '3', '4', '+', '-'],
    features: ['Digits 0–4', 'Addition', 'Subtraction'],
    exclusive: false,
  },
  {
    id: 'advanced',
    name: 'Advanced Arithmetic',
    price: 1.99,
    priceDisplay: '$1.99',
    tagline: 'Unlock the upper echelon of digits.',
    buttons: ['5', '6', '7', '8', '9', '.', '(', ')'],
    features: ['Digits 5–9', 'Decimal precision', 'Parenthetical grouping'],
    exclusive: false,
  },
  {
    id: 'equalizer',
    name: 'The Equalizer',
    price: 9.99,
    priceDisplay: '$9.99',
    tagline: 'True resolution. For those who demand results.',
    buttons: ['=', '×', '÷', 'CE', 'C', '±', '%'],
    features: ['The = button', 'Multiplication', 'Division', 'Clear & reset', 'Sign inversion', 'Percentage'],
    exclusive: true,
  },
]

// Buttons available to everyone without login
export const DEMO_BUTTONS = ['0']

// Full calculator button layout — rows of 4 columns
// rowSpan/colSpan control CSS grid spanning
export const BUTTON_LAYOUT = [
  { label: 'CE' }, { label: 'C' }, { label: '±' }, { label: '%' },
  { label: '(' }, { label: ')' }, { label: '÷' }, { label: '×' },
  { label: '7' }, { label: '8' }, { label: '9' }, { label: '-' },
  { label: '4' }, { label: '5' }, { label: '6' }, { label: '+' },
  { label: '1' }, { label: '2' }, { label: '3' }, { label: '=', rowSpan: 2 },
  { label: '0', colSpan: 2 }, { label: '.' },
]
