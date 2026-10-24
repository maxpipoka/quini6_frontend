/**
 * Typed Environment Variables
 * Validates required env vars at build time
 */

// Validation function
function validateEnv() {
  const env = import.meta.env;

  if (!env.VITE_API_BASE_URL) {
    throw new Error('VITE_API_BASE_URL is required. Check your .env file.');
  }

  if (!env.VITE_SITE_URL) {
    throw new Error('VITE_SITE_URL is required. Check your .env file.');
  }

  return {
    VITE_API_BASE_URL: env.VITE_API_BASE_URL,
    VITE_SITE_URL: env.VITE_SITE_URL,
    VERCEL_DEPLOY_HOOK_SECRET: env.VERCEL_DEPLOY_HOOK_SECRET,
    NODE_ENV: env.NODE_ENV,
  };
}

// Export validated env
export const env = validateEnv();

// Helper functions
export const isDevelopment = () => env.NODE_ENV === 'development';
export const isProduction = () => env.NODE_ENV === 'production';
export const isTest = () => env.NODE_ENV === 'test';
