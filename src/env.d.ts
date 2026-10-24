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
