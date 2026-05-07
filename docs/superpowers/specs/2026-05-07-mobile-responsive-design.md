# Mobile Responsive Design

## Approach

Targeted CSS media queries (`max-width: 640px`) added to existing CSS files, plus minimal JS state in `Navbar.jsx` for the hamburger menu. No new dependencies.

## Navbar

- On mobile, hide `.navbar__links` and `.navbar__auth` from the main bar
- Show a hamburger button (`☰`) on the right side of the bar
- Add `isOpen` boolean state to `Navbar.jsx`
- When open, render a dropdown panel below the navbar containing nav links and auth controls stacked vertically
- Clicking a link or tapping outside closes the panel

## Landing Page

- Side padding reduced from `8rem` to `1.5rem`
- Hero (`landing__hero`): switches to `flex-direction: column`, ornament digit hidden (`display: none`)
- Section padding reduced from `7rem 8rem` to `4rem 1.5rem`
- `.landing__features-grid` and `.landing__testimonials-grid`: collapse from 3-column to 1-column

## Calculator Page

- Top padding reduced from `3rem 1.5rem 4rem` to `1.25rem 1.5rem 2rem`
- Button grid gap tightened from `0.6rem` to `0.5rem`
- Everything else unchanged — max-width and button heights are already appropriate for mobile

## Files Affected

- `src/components/Navbar.jsx` — add `isOpen` state, hamburger button, dropdown panel
- `src/components/Navbar.css` — mobile styles for collapsed/open navbar
- `src/pages/LandingPage.css` — mobile breakpoints for padding, hero, grids
- `src/pages/CalculatorPage.css` — reduced padding and gap on mobile
