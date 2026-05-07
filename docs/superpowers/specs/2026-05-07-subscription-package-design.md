# Subscription Package — Design Spec

**Date:** 2026-05-07  
**Stack:** React, React Router, localStorage

---

## Overview

Add a CALCVLVS Premier subscription tier to the existing DLC calculator app. Subscribing is permanent and irrevocable — there is no cancellation flow. The subscription unlocks all calculator buttons. Existing à-la-carte packages remain available. Package prices are doubled as part of this change.

---

## Price Changes

| Package | Old Price | New Price |
|---|---|---|
| Basic Arithmetic | $0.99 | $1.98 |
| Advanced Arithmetic | $1.99 | $3.98 |
| The Equalizer | $9.99 | $19.98 |

### The Equalizer — Button Change

The `=` button is removed from The Equalizer package. It is now exclusive to the Premier subscription — the only way to evaluate an expression is to subscribe.

Updated Equalizer buttons: `×` `÷` `CE` `C` `±` `%`  
Updated Equalizer features list: `Multiplication`, `Division`, `Clear & reset`, `Sign inversion`, `Percentage`

---

## State Changes

### AppContext

New state: `hasSubscription` — boolean, default `false`.

- Hydrated from `localStorage` key `calc_subscription` on app load
- Persisted per-user under `calc_subscription_${email}` (same pattern as packages)
- New `subscribe()` function sets it `true` and persists it — no unsubscribe
- Exposed via `useApp()` alongside existing state

### Calculator Unlock Logic

`isButtonUnlocked(button, ownedPackages, isLoggedIn, hasSubscription)` gains a fourth parameter:

- If `isLoggedIn && hasSubscription`, return `true` for all buttons immediately
- Existing package-based logic is unchanged as the fallback

---

## Store Page

A new Premier hero section is inserted above the three package cards.

**Contents:**
- Gold eyebrow: `"The Complete Experience"`
- Headline: `"CALCVLVS Premier"` (large serif)
- Tagline: luxury copy selling unlimited access
- Price: `$14.99 / month` displayed prominently
- CTA button — three states:
  - Not logged in → opens auth modal
  - Logged in, not subscribed → calls `subscribe()`, grants immediate access
  - Subscribed → shows `"Active — Enjoy Your Commitment"` (disabled, gold style)
- Fine print below the button (small, dim text):
  > "By subscribing, you irrevocably authorize CALCVLVS Inc. to garnish wages, seize assets, and pursue all available legal remedies in perpetuity should payment lapse."

**À-la-carte cards when subscribed:**  
The Purchase button on each package card is replaced with `"Included in Premier"` (same visual style as `"Owned"`).

---

## Locked Button Modal

A secondary upsell line is added below the existing store CTA:

> `"Or subscribe to unlock everything →"` — links to `/store`

No other changes to the modal.

---

## Components Unchanged

`DemoBanner`, `AuthModal`, `Navbar`, `LandingPage`, `CalculatorPage` (template), `CalculatorButton` — no changes.

---

## Out of Scope

- Real payment processing
- Subscription cancellation
- Trial periods
- The `=` button being available outside of a Premier subscription
- Subscription cancellation
- Trial periods
