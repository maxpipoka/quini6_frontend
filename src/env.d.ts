/// <reference types="astro/client" />

// Declare Astro component modules for TypeScript
declare module '*.astro' {
  import type { AstroComponentFactory, AstroProps } from 'astro';
  const component: AstroComponentFactory;
  export default component;
  export type Props = AstroProps;
}

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_SITE_URL: string;
  readonly VITE_SENTRY_DSN?: string;
  readonly VITE_PLAUSIBLE_DOMAIN?: string;
  readonly VITE_BUNDLE_ANALYZE?: string;
  readonly VERCEL_DEPLOY_HOOK_SECRET?: string;
  readonly NODE_ENV: 'development' | 'production' | 'test';

  // Standard Vite/Astro env vars
  readonly BASE_URL: string;
  readonly MODE: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly SSR: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Plausible Analytics global
interface Window {
  plausible?: (eventName: string, options?: { props: Record<string, unknown> }) => void;
  __AUTH_USER__?: {
    id: string;
    email: string;
  };
}

// Test utilities (added by test files)
interface Window {
  plausibleCalls?: [string, { props?: Record<string, unknown> } | undefined][];
  __plausibleEventPromise?: string | null;
  __plausibleEventResolve?: ((value: unknown) => void) | null;
  waitForPlausibleEvent?: (eventName: string) => Promise<unknown>;
  __closeMobileMenu?: () => void;
  initMobileMenu?: () => void;
  __headerScriptRan?: boolean;
}
