# Ban Feature Design

**Date:** 2026-05-08

## Overview

When a user triggers a calculator error (by pressing `=` on an invalid expression), they are automatically banned from using the calculator for the rest of the session. A modal appears with the message "You've been banned from using calculator." and the calculator becomes non-interactive.

## Trigger

- In `CalculatorPage.handlePress`, when `label === '='` and `evaluateExpression(expression)` returns `'Error'`, set `isBanned = true`.
- The error result is written to the display as normal before the modal appears on top.

## State

- A single `isBanned` boolean via `useState(false)` in `CalculatorPage`.
- No persistence (session-only — clears on refresh).
- No changes to `AppContext`.

## New Component: `BanModal`

- Located at `src/components/BanModal.jsx` with accompanying `BanModal.css`.
- Follows the existing `LockedButtonModal` pattern: centered overlay with a backdrop.
- Displays the message: "You've been banned from using calculator."
- No close or dismiss button — the modal cannot be cleared.

## Lockout Behavior

- When `isBanned` is true, `<BanModal>` is rendered in `CalculatorPage`.
- The calculator button grid receives `pointer-events: none` (via a CSS class or inline style) so buttons cannot be interacted with behind the modal.

## Files Changed

- `src/pages/CalculatorPage.jsx` — add `isBanned` state, ban trigger in `handlePress`, render `<BanModal>`, disable grid when banned
- `src/components/BanModal.jsx` — new component
- `src/components/BanModal.css` — new styles
