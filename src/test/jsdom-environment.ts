// Custom jsdom environment that sets up AbortController/AbortSignal before JSDOM initializes
// This extends vitest's built-in jsdom environment and adds the beforeParse hook

import { builtinEnvironments, populateGlobal } from 'vitest/environments';
import { JSDOM, ResourceLoader, VirtualConsole, CookieJar } from 'jsdom';

// Store Node's native AbortController/AbortSignal
const NativeAbortController = globalThis.AbortController;
const NativeAbortSignal = globalThis.AbortSignal;

// Get the built-in jsdom environment
const builtinJSDOM = builtinEnvironments.jsdom;

// Helper to create JSDOM with beforeParse hook
function createJSDOM(
  html: string,
  options: {
    pretendToBeVisual?: boolean;
    resources?: ResourceLoader | undefined;
    runScripts?: 'dangerously' | 'outside-only' | 'never';
    url?: string;
    virtualConsole?: VirtualConsole | undefined;
    cookieJar?: CookieJar | undefined;
    includeNodeLocations?: boolean;
    contentType?: string;
    userAgent?: string;
    [key: string]: unknown;
  }
): JSDOM {
  const dom = new JSDOM(html, {
    ...options,
    beforeParse(window) {
      window.AbortController = NativeAbortController;
      window.AbortSignal = NativeAbortSignal;
      window.globalThis = window;
    },
  });
  return dom;
}

// Helper to set up window error handling
function setupWindowErrors(win: Window & typeof globalThis): () => void {
  let userErrorListenerCount = 0;
  function throwUnhandlerError(e: ErrorEvent): void {
    if (userErrorListenerCount === 0 && e.error != null) {
      process.emit('uncaughtException', e.error);
    }
  }
  const addEventListener = win.addEventListener.bind(win);
  const removeEventListener = win.removeEventListener.bind(win);
  win.addEventListener('error', throwUnhandlerError);
  win.addEventListener = function (...args: unknown[]): void {
    if (args[0] === 'error') userErrorListenerCount++;
    return addEventListener.apply(this, args);
  };
  win.removeEventListener = function (...args: unknown[]): void {
    if (args[0] === 'error' && userErrorListenerCount) userErrorListenerCount--;
    return removeEventListener.apply(this, args);
  };
  return function clearWindowErrors(): void {
    win.removeEventListener('error', throwUnhandlerError);
  };
}

// Create custom environment that overrides setupVM and setup
export default {
  ...builtinJSDOM,
  async setupVM(options: { jsdom?: Record<string, unknown> } = {}) {
    const { jsdom = {} } = options;

    const {
      html = '<!DOCTYPE html>',
      userAgent,
      url = 'http://localhost:3000',
      contentType = 'text/html',
      pretendToBeVisual = true,
      includeNodeLocations = false,
      runScripts = 'dangerously',
      resources,
      console: consoleOpt = false,
      cookieJar = false,
      ...restOptions
    } = jsdom;

    const dom = createJSDOM(html, {
      pretendToBeVisual,
      resources: resources ?? (userAgent ? new ResourceLoader({ userAgent }) : undefined),
      runScripts,
      url,
      virtualConsole:
        consoleOpt && globalThis.console
          ? new VirtualConsole().sendTo(globalThis.console)
          : undefined,
      cookieJar: cookieJar ? new CookieJar() : undefined,
      includeNodeLocations,
      contentType,
      userAgent,
      ...restOptions,
    });

    // Copy over globals that JSDOM might not have
    const globalNames = [
      'structuredClone',
      'fetch',
      'Request',
      'Response',
      'BroadcastChannel',
      'MessageChannel',
      'MessagePort',
      'TextEncoder',
      'TextDecoder',
    ];
    for (const name of globalNames) {
      const value = globalThis[name];
      if (typeof value !== 'undefined' && typeof dom.window[name] === 'undefined') {
        dom.window[name] = value;
      }
    }

    dom.window.Buffer = Buffer;
    (dom.window as Window & { jsdom?: JSDOM }).jsdom = dom;

    const clearWindowErrors = setupWindowErrors(dom.window);

    return {
      getVmContext(): ReturnType<JSDOM['getInternalVMContext']> {
        return dom.getInternalVMContext();
      },
      teardown(): void {
        clearWindowErrors();
        dom.window.close();
      },
    };
  },
  async setup(global: Record<string, unknown>, options: { jsdom?: Record<string, unknown> } = {}) {
    const { jsdom = {} } = options;

    const {
      html = '<!DOCTYPE html>',
      userAgent,
      url = 'http://localhost:3000',
      contentType = 'text/html',
      pretendToBeVisual = true,
      includeNodeLocations = false,
      runScripts = 'dangerously',
      resources,
      console: consoleOpt = false,
      cookieJar = false,
      ...restOptions
    } = jsdom;

    const dom = createJSDOM(html, {
      pretendToBeVisual,
      resources: resources ?? (userAgent ? new ResourceLoader({ userAgent }) : undefined),
      runScripts,
      url,
      virtualConsole:
        consoleOpt && global.console
          ? new VirtualConsole().sendTo(global.console as Console)
          : undefined,
      cookieJar: cookieJar ? new CookieJar() : undefined,
      includeNodeLocations,
      contentType,
      userAgent,
      ...restOptions,
    });

    // Copy over globals that JSDOM might not have
    const globalNames = [
      'structuredClone',
      'fetch',
      'Request',
      'Response',
      'BroadcastChannel',
      'MessageChannel',
      'MessagePort',
      'TextEncoder',
      'TextDecoder',
    ];
    for (const name of globalNames) {
      const value = globalThis[name];
      if (typeof value !== 'undefined' && typeof dom.window[name] === 'undefined') {
        dom.window[name] = value;
      }
    }

    // Populate global with dom.window (this is what vitest's jsdom environment does)
    const { keys, originals } = populateGlobal(global, dom.window, { bindFunctions: true });

    const clearWindowErrors = setupWindowErrors(global as Window & typeof globalThis);

    global.jsdom = dom;

    return {
      teardown(global2: Record<string, unknown>): void {
        clearWindowErrors();
        dom.window.close();
        delete global2.jsdom;
        keys.forEach((key: string) => delete global2[key]);
        originals.forEach((v: unknown, k: string) => {
          global2[k] = v;
        });
      },
    };
  },
};
