// Custom jsdom environment that sets up AbortController/AbortSignal before JSDOM initializes
// This extends vitest's built-in jsdom environment and adds the beforeParse hook

import { builtinEnvironments, populateGlobal } from 'vitest/environments';
import { JSDOM, VirtualConsole, CookieJar, type ConstructorOptions, type DOMWindow } from 'jsdom';

// Store Node's native AbortController/AbortSignal
const NativeAbortController = globalThis.AbortController;
const NativeAbortSignal = globalThis.AbortSignal;

// Get the built-in jsdom environment
const builtinJSDOM = builtinEnvironments.jsdom;

// Helper to create JSDOM with beforeParse hook
function createJSDOM(html: string, options: ConstructorOptions): JSDOM {
  const dom = new JSDOM(html, {
    ...options,
    beforeParse(window: DOMWindow) {
      window.AbortController = NativeAbortController;
      window.AbortSignal = NativeAbortSignal;
      window.globalThis = window;
    },
  });
  return dom;
}

// Helper to set up window error handling
function setupWindowErrors(win: DOMWindow): () => void {
  let userErrorListenerCount = 0;
  function throwUnhandlerError(e: ErrorEvent): void {
    if (userErrorListenerCount === 0 && e.error != null) {
      process.emit('uncaughtException', e.error);
    }
  }
  const addEventListener = win.addEventListener.bind(win);
  const removeEventListener = win.removeEventListener.bind(win);
  win.addEventListener('error', throwUnhandlerError);
  win.addEventListener = function (
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void {
    if (type === 'error') userErrorListenerCount++;
    return addEventListener(type, listener, options);
  };
  win.removeEventListener = function (
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions
  ): void {
    if (type === 'error' && userErrorListenerCount) userErrorListenerCount--;
    return removeEventListener(type, listener, options);
  };
  return function clearWindowErrors(): void {
    win.removeEventListener('error', throwUnhandlerError);
  };
}

// Create custom environment that overrides setupVM and setup
export default {
  ...builtinJSDOM,
  // eslint-disable-next-line @typescript-eslint/require-await
  async setupVM(options: { jsdom?: Record<string, unknown> } = {}) {
    const { jsdom = {} } = options;

    const {
      html = '<!DOCTYPE html>',
      userAgent: userAgentStr,
      url = 'http://localhost:3000',
      contentType = 'text/html',
      pretendToBeVisual = true,
      includeNodeLocations = false,
      runScripts = 'dangerously',
      resources: resourcesRaw,
      console: consoleOpt = false,
      cookieJar = false,
    } = jsdom as ConstructorOptions & Record<string, unknown>;
    const userAgent = userAgentStr as string | undefined;
    const resources = resourcesRaw;
    const htmlStr = html as string;

    const dom = createJSDOM(htmlStr, {
      pretendToBeVisual,
      resources: resources ?? (userAgent ? { userAgent: userAgent } : undefined),
      runScripts: runScripts as 'dangerously' | 'outside-only' | undefined,
      url,
      virtualConsole:
        consoleOpt && globalThis.console
          ? new VirtualConsole().forwardTo(globalThis.console)
          : undefined,
      cookieJar: cookieJar ? new CookieJar() : undefined,
      includeNodeLocations,
      contentType,
      userAgent,
    } as ConstructorOptions);

    // Copy over globals that JSDOM might not have
    const globalNames: (keyof typeof globalThis)[] = [
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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const value = globalThis[name];
      if (
        typeof value !== 'undefined' &&
        typeof dom.window[name as keyof DOMWindow] === 'undefined'
      ) {
        (dom.window as Record<string, unknown>)[name] = value;
      }
    }

    (dom.window as Record<string, unknown>).Buffer = Buffer;
    (dom.window as Record<string, unknown>).jsdom = dom;

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
  // eslint-disable-next-line @typescript-eslint/require-await
  async setup(global: Record<string, unknown>, options: { jsdom?: Record<string, unknown> } = {}) {
    const { jsdom = {} } = options;

    const {
      html = '<!DOCTYPE html>',
      userAgent: userAgentStr,
      url = 'http://localhost:3000',
      contentType = 'text/html',
      pretendToBeVisual = true,
      includeNodeLocations = false,
      runScripts = 'dangerously',
      resources: resourcesRaw,
      console: consoleOpt = false,
      cookieJar = false,
    } = jsdom as ConstructorOptions & Record<string, unknown>;
    const userAgent = userAgentStr as string | undefined;
    const resources = resourcesRaw;
    const htmlStr = html as string;

    const dom = createJSDOM(htmlStr, {
      pretendToBeVisual,
      resources: resources ?? (userAgent ? { userAgent: userAgent } : undefined),
      runScripts: runScripts as 'dangerously' | 'outside-only' | undefined,
      url,
      virtualConsole:
        consoleOpt && global.console
          ? new VirtualConsole().forwardTo(global.console as Console)
          : undefined,
      cookieJar: cookieJar ? new CookieJar() : undefined,
      includeNodeLocations,
      contentType,
      userAgent,
    } as ConstructorOptions);

    // Copy over globals that JSDOM might not have
    const globalNames: (keyof typeof globalThis)[] = [
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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const value = globalThis[name];
      if (
        typeof value !== 'undefined' &&
        typeof dom.window[name as keyof DOMWindow] === 'undefined'
      ) {
        (dom.window as Record<string, unknown>)[name] = value;
      }
    }

    // Populate global with dom.window (this is what vitest's jsdom environment does)
    const { keys, originals } = populateGlobal(global, dom.window, { bindFunctions: true });

    const clearWindowErrors = setupWindowErrors(global as unknown as DOMWindow);

    global.jsdom = dom;

    return {
      teardown(global2: Record<string, unknown>): void {
        clearWindowErrors();
        dom.window.close();
        delete global2.jsdom;
        keys.forEach((key: string) => delete global2[key]);
        originals.forEach((v: unknown, k: string | symbol) => {
          if (typeof k === 'string') {
            global2[k] = v;
          }
        });
      },
    };
  },
};
