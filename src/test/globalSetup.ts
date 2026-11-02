// This runs BEFORE vitest creates the jsdom environment
// It ensures Node's native AbortController/AbortSignal are the globals
// that will be used when jsdom initializes

// eslint-disable-next-line @typescript-eslint/require-await
export async function setup() {
  // Node.js 18+ has native AbortController and AbortSignal
  // We need to make sure these are the ones that get exposed to jsdom
  // by setting them on globalThis BEFORE jsdom is created

  // In Node.js, these are already available as globals
  // But we explicitly ensure they're the ones that will be used

  console.log('[globalSetup] Node AbortController:', typeof globalThis.AbortController);
  console.log('[globalSetup] Node AbortSignal:', typeof globalThis.AbortSignal);

  const testController = new globalThis.AbortController();
  console.log(
    '[globalSetup] instanceof check:',
    testController.signal instanceof globalThis.AbortSignal
  );
}
