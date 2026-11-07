[**Quini6 Frontend v0.0.1**](../../../README.md)

***

[Quini6 Frontend](../../../modules.md) / [lib/focus-trap](../README.md) / trapFocus

# Function: trapFocus()

> **trapFocus**(`options`): () => `void`

Defined in: [lib/focus-trap.ts:54](https://github.com/maxpipoka/quini6_frontend/blob/8c4672644da6592ce81e785866b473183e5202e0/src/lib/focus-trap.ts#L54)

Traps focus within the given container
Cycles Tab/Shift+Tab within the container
Calls onEscape callback on Escape key
Returns a cleanup function to restore focus and remove listeners

## Parameters

### options

[`FocusTrapOptions`](../interfaces/FocusTrapOptions.md)

## Returns

() => `void`
