# Premium DLC Calculator — Design Spec

**Date:** 2026-05-07  
**Stack:** React, React Router, localStorage

---

## Overview

A satirical web app that presents a calculator as a luxury product with DLC-style button packages. Users must create an account and purchase packages to unlock groups of buttons. The experience is played completely straight — no winking at the camera, just genuine premium aesthetics applied to a ridiculous premise.

---

## Architecture

React SPA with React Router. Four routes:

| Route         | Page       | Description                                                    |
| ------------- | ---------- | -------------------------------------------------------------- |
| `/`           | Landing    | Marketing hero page selling the calculator as a luxury product |
| `/store`      | Store      | Package browsing and purchasing (requires login)               |
| `/calculator` | Calculator | The calculator with locked/unlocked buttons                    |
| (modal)       | Auth       | Sign up / log in modal overlay, accessible from any page       |

**State management:** React Context (`AppContext`) holds:

- `user` — `{ name, email }` or `null`
- `ownedPackages` — array of package IDs (`"basic"`, `"advanced"`, `"equalizer"`)

Both are persisted to and hydrated from `localStorage` on app load.

---

## Pages

### Landing Page (`/`)

- Full-viewport hero with dramatic dark gradient
- Product name and luxury tagline (e.g., _"Mathematics, Elevated."_)
- The calculator shown as a hero object
- Premium copy sections: feature highlights, testimonials
- CTA buttons: "Enter the Store" → `/store`, "Launch Calculator" → `/calculator`
- Nav: logo left, "Sign In" / user name right

### Store Page (`/store`)

- Three package cards displayed in a row
- Tier 3 card is slightly larger/elevated with a gold "MOST EXCLUSIVE" badge
- Each card shows: package name, price, list of buttons it unlocks, "Purchase" button
- If not logged in: "Purchase" button opens the auth modal
- If logged in and not owned: "Purchase" immediately adds package to `ownedPackages`
- If already owned: button shows "Owned" (disabled, gold checkmark)

### Calculator Page (`/calculator`)

- Display screen at the top showing the current expression
- Full button grid rendered at all times
- **Unlocked buttons:** functional, dark metal tile with gold border, hover/press effect
- **Locked buttons:** same tile but dimmed/desaturated, gold padlock icon overlay
- Clicking a locked button opens a modal: _"This feature is part of [Package Name]. Unlock it for $X.XX"_ with a "Go to Store" link
- No login required to view the calculator (but locked buttons can't be purchased without an account)

### Auth Modal

- Triggered by "Sign In" nav link, "Purchase" on store while logged out, or locked-button modal CTA
- Two tabs: Sign Up / Log In
- Sign Up: name, email, password fields → creates simulated account in localStorage
- Log In: email, password → validates against stored account
- No real auth — purely simulated

---

## Demo Mode

Users who are not logged in get a demo experience on the calculator page:

- The `0` button is the only functional button — no package required
- All other buttons are locked with the same dimmed/padlock treatment as purchased-but-locked buttons
- Clicking any locked button opens a modal: _"Create a free account to unlock packages"_ with a "Sign Up" CTA
- A persistent banner at the top of the calculator page reads something like _"You are in Demo Mode. Sign up to access premium packages."_

---

## Package Definitions

| ID          | Name                | Price | Buttons                         |
| ----------- | ------------------- | ----- | ------------------------------- |
| `basic`     | Basic Arithmetic    | $0.99 | `0` `1` `2` `3` `4` `+` `-`     |
| `advanced`  | Advanced Arithmetic | $1.99 | `5` `6` `7` `8` `9` `.` `(` `)` |
| `equalizer` | The Equalizer       | $9.99 | `=` `×` `÷` `CE` `C` `±` `%`    |

---

## Calculator Logic

- Expression is built as a string and displayed on screen
- `=` evaluates the expression using the `mathjs` library (`math.evaluate()`) for safe expression parsing
- `CE` clears the last entry, `C` clears the entire expression
- `±` toggles sign on the last number
- `%` converts the last number to a percentage
- Without `CE`/`C` (requires The Equalizer), users cannot clear the display — intentional

---

## Visual Style

- **Background:** `#0a0a0a` near-black
- **Gold accent:** `#c9a84c`
- **Secondary text:** platinum/silver (`#b0b0b0`)
- **Typography:** Playfair Display (serif) for headlines, Inter (sans-serif) for UI
- **Calculator buttons:** large dark metal tiles, gold border, smooth hover/press transitions
- **Cards/modals:** dark glass-morphism — semi-transparent dark panels, subtle gold border, backdrop blur
- **Store Tier 3 card:** slightly elevated/larger, gold "MOST EXCLUSIVE" badge
- **Locked buttons:** desaturated, reduced opacity, gold padlock icon overlay

---

## Key Behaviors & Edge Cases

- `localStorage` is the source of truth — refreshing the page preserves login and owned packages
- Logged-out users (demo mode) can only press `0`; all other buttons prompt sign-up
- Users without `basic` package cannot enter digits 0–4 or use `+` / `-`
- Users without `equalizer` cannot evaluate expressions or clear the display
- The app never prevents a user from _seeing_ the full calculator — only from _using_ locked buttons
- Locked button modal always offers a path to the store or auth

---

## Out of Scope

- Real payment processing
- Real authentication / backend
- History / memory functions
- Mobile-specific layouts (responsive is fine but not a design priority)
