[**Quini6 Frontend v0.0.1**](../../../README.md)

***

[Quini6 Frontend](../../../modules.md) / [lib/focus-trap](../README.md) / FocusTrapOptions

# Interface: FocusTrapOptions

Defined in: [lib/focus-trap.ts:7](https://github.com/maxpipoka/quini6_frontend/blob/8c4672644da6592ce81e785866b473183e5202e0/src/lib/focus-trap.ts#L7)

Focus Trap Utility
Extracted from Modal.astro for reuse in Header mobile menu and other overlays
Framework-agnostic vanilla TypeScript

## Properties

### container

> **container**: `HTMLElement`

Defined in: [lib/focus-trap.ts:9](https://github.com/maxpipoka/quini6_frontend/blob/8c4672644da6592ce81e785866b473183e5202e0/src/lib/focus-trap.ts#L9)

The container element to trap focus within

***

### onEscape?

> `optional` **onEscape?**: () => `void`

Defined in: [lib/focus-trap.ts:11](https://github.com/maxpipoka/quini6_frontend/blob/8c4672644da6592ce81e785866b473183e5202e0/src/lib/focus-trap.ts#L11)

Called when Escape key is pressed while trap is active

#### Returns

`void`

***

### onClose?

> `optional` **onClose?**: () => `void`

Defined in: [lib/focus-trap.ts:13](https://github.com/maxpipoka/quini6_frontend/blob/8c4672644da6592ce81e785866b473183e5202e0/src/lib/focus-trap.ts#L13)

Called when the trap is deactivated (optional cleanup)

#### Returns

`void`
