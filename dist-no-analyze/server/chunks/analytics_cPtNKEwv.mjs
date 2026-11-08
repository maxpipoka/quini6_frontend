;!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="d5300c29-41d2-4655-901f-4999018396d1",e._sentryDebugIdIdentifier="sentry-dbid-d5300c29-41d2-4655-901f-4999018396d1")}catch(e){}}();import './_sentry-release-injection-file_BwnRfS4D.mjs';

const __vite_import_meta_env__ = {"ASSETS_PREFIX": undefined, "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SITE": "https://quini6.com", "SSR": true, "VITE_API_BASE_URL": "https://api.quini6.com/api", "VITE_BUNDLE_ANALYZE": "false", "VITE_SITE_URL": "https://quini6.com", "VITE_USER_NODE_ENV": "development"};
function trackEvent(name, props) {
  if (typeof window === "undefined") return;
  const plausible = window.plausible;
  if (!plausible) {
    if (Object.assign(__vite_import_meta_env__, {})?.DEV) {
      console.debug("[Analytics] Plausible not available, skipping event:", name, props);
    }
    return;
  }
  try {
    plausible(name, { props: props ?? {} });
  } catch (error) {
    if (Object.assign(__vite_import_meta_env__, {})?.DEV) {
      console.warn("[Analytics] Failed to track event:", name, error);
    }
  }
}

export { trackEvent as t };
