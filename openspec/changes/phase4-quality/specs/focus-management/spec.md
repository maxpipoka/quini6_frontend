# Focus Management Specification

## Purpose

This specification defines keyboard focus behavior for the public UI (WCAG 2.2 AA): visible focus indicators, focus trapping and restoration in overlays (starting with the Header mobile menu), focus relocation on client-side navigation, and logical tab order.

## Requirements

### Requirement: Focus Visibility

The system SHALL render a visible focus indicator on every interactive element, and global resets or component styles MUST NOT suppress focus indication.

#### Scenario: Keyboard focus is visible on all controls

- GIVEN any public page navigated with a keyboard
- WHEN Tab moves focus to a link, button, or input
- THEN a visible focus indicator displays
- AND the indicator contrasts with the surrounding background

#### Scenario: Style rules do not remove focus rings

- GIVEN global CSS resets and component styles
- WHEN a focused element is affected by those rules
- THEN the focus indicator remains visible (no suppressed outline without a visible replacement)

### Requirement: Mobile Menu Focus Trap and Restore

The system SHALL trap keyboard focus inside the Header mobile menu while it is open, close it on Escape, and return focus to the control that opened it.

#### Scenario: Focus is trapped while the menu is open

- GIVEN the mobile menu is open
- WHEN the user presses Tab repeatedly
- THEN focus cycles within the menu and its close control
- AND focus never lands on page content behind the menu

#### Scenario: Escape closes the menu and restores focus

- GIVEN the mobile menu is open with focus on a menu link
- WHEN the user presses Escape
- THEN the menu closes
- AND focus returns to the menu toggle button

#### Scenario: Closing via the toggle control does not lose focus

- GIVEN the mobile menu is open
- WHEN the user activates the toggle/close control
- THEN the menu closes
- AND focus remains on the toggle button rather than falling back to `<body>`

### Requirement: Client-Side Navigation Focus Move

The system SHALL move focus to the main heading after a client-side navigation completes, and MUST NOT move focus on the initial page load.

#### Scenario: Focus moves to the main heading after navigation

- GIVEN the user is on a page and the Astro ClientRouter is active
- WHEN the user follows an internal link to another page
- THEN after the view swap, focus lands on the destination page's main heading (`h1`)
- AND assistive technology announces the new page context

#### Scenario: Initial page load leaves focus untouched

- GIVEN the user opens the site URL directly (first load)
- WHEN the page finishes loading
- THEN no programmatic focus move occurs
- AND default browser focus behavior is preserved

### Requirement: Logical Tab Order

The system SHALL present a tab order that follows visual and reading order, with no positive `tabindex` values and no unintended keyboard traps.

#### Scenario: Tab order matches document order

- GIVEN a public page
- WHEN the user presses Tab from the top of the page
- THEN focus advances in DOM order matching visual order
- AND no element receives focus out of sequence

#### Scenario: No unintended keyboard traps

- GIVEN a page whose overlays (menu, modal) are closed
- WHEN the user tabs through all interactive elements
- THEN focus never gets stuck on a single element
- AND the only focus traps present are intentional ones inside open overlays

---

## ADDED Sections

All requirements above are ADDED for this new capability.

## MODIFIED Sections

None — this is a new capability.

## REMOVED Sections

None — this is a new capability.
