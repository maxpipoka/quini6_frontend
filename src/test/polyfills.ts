// This file runs AFTER jsdom is created (setupFiles order)
// We need to override jsdom's AbortController/AbortSignal with Node's native ones
// so that fetch requests from jsdom context pass undici's instanceof checks

// Store reference to Node's native AbortController/AbortSignal BEFORE jsdom overrides them
const NativeAbortController = globalThis.AbortController;
const NativeAbortSignal = globalThis.AbortSignal;

// Verify they exist
if (typeof NativeAbortController === 'undefined' || typeof NativeAbortSignal === 'undefined') {
  throw new Error('Native AbortController/AbortSignal not available');
}

// Override globals with Node's native implementations
// This ensures that when jsdom code creates AbortController/AbortSignal,
// they use Node's versions which pass undici's instanceof checks
globalThis.AbortController = NativeAbortController;
globalThis.AbortSignal = NativeAbortSignal;

// Also override on window if it exists (jsdom creates window)
if (typeof window !== 'undefined') {
  window.AbortController = NativeAbortController;
  window.AbortSignal = NativeAbortSignal;
}

// Verify the override works
const testController = new globalThis.AbortController();
if (!(testController.signal instanceof globalThis.AbortSignal)) {
  throw new Error('AbortSignal instanceof check failed after override');
}

console.log('[polyfills] Overrode AbortController/AbortSignal with Node natives');
console.log(
  '[polyfills] instanceof check:',
  testController.signal instanceof globalThis.AbortSignal
);
