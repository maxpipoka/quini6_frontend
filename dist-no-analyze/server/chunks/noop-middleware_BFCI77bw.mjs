;!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="6e15101c-d5dd-4d6b-badf-a2e54941b311",e._sentryDebugIdIdentifier="sentry-dbid-6e15101c-d5dd-4d6b-badf-a2e54941b311")}catch(e){}}();import { J as NOOP_MIDDLEWARE_HEADER } from './astro/server_BCpdA0Tk.mjs';

const NOOP_MIDDLEWARE_FN = async (_ctx, next) => {
  const response = await next();
  response.headers.set(NOOP_MIDDLEWARE_HEADER, "true");
  return response;
};

export { NOOP_MIDDLEWARE_FN as N };
