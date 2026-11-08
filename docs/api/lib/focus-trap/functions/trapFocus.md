[**Quini6 Frontend v0.0.1**](../../../README.md)

***

[Quini6 Frontend](../../../modules.md) / [lib/focus-trap](../README.md) / trapFocus

# Function: trapFocus()

> **trapFocus**(`options`): () => `void`

Defined in: [lib/focus-trap.ts:54](https://github.com/maxpipoka/quini6_frontend/blob/9f722dfc2bfe14741847adbac029e48d9370d9af/src/lib/focus-trap.ts#L54)

Traps focus within the given container
Cycles Tab/Shift+Tab within the container
Calls onEscape callback on Escape key
Returns a cleanup function to restore focus and remove listeners

## Parameters

### options

[`FocusTrapOptions`](../interfaces/FocusTrapOptions.md)

## Returns

() => `void`
