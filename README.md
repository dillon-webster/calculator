# CALCVLVS

**The World's First Premium Calculator**
Try the demo here:
Live: https://calculator-black-nine-81.vercel.app/

---

CALCVLVS is a web application that reimagines the calculator as a luxury product. Calculator buttons are distributed across tiered purchase packages and a monthly subscription, requiring users to progressively unlock functionality — including, eventually, the equals button.

## Features

- **Tiered button packages** — arithmetic capability is sold in three discrete tiers: Basic Arithmetic, Advanced Arithmetic, and The Equalizer
- **CALCVLVS Premier** — a $14.99/mo subscription granting access to the equals button and unlimited calculations
- **Authentication** — account creation and login gate access to purchased functionality
- **Ban system** — users who attempt to circumvent the paywall are banned; a modal traps keyboard focus and informs them of their status
- **Demo mode** — unauthenticated users may interact with the `0` button

## Tech Stack

- **React 19** with React Router v7
- **Vite 8**
- **mathjs** for expression evaluation
- **Vitest** + Testing Library for unit and integration tests
- **Vercel** for deployment

## Packages

| Package             | Price     | Buttons Unlocked              |
| ------------------- | --------- | ----------------------------- |
| Basic Arithmetic    | $1.98     | `0–4`, `+`, `-`               |
| Advanced Arithmetic | $3.98     | `5–9`, `.`, `(`, `)`          |
| The Equalizer       | $19.98    | `×`, `÷`, `CE`, `C`, `±`, `%` |
| CALCVLVS Premier    | $14.99/mo | `=`                           |

## Development

```bash
npm install
npm run dev
```

```bash
npm test          # watch mode
npm run test:run  # single run
```

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
  components/   # Modals, navbar, calculator button, store card
  context/      # AppContext — auth state, owned packages, ban logic
  data/         # Package definitions and button layout
  pages/        # LandingPage, CalculatorPage, StorePage
  utils/
  tests/
```
