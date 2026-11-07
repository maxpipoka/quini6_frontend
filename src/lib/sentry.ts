/**
 * Sentry Initialization & Web Vitals Integration
 * Only enabled in production via @sentry/astro integration
 */

import * as Sentry from '@sentry/astro';

/**
 * Initialize Sentry with browser tracing and replay integrations.
 * Called from admin layout inline script (client-side only).
 */
export function initSentry(): void {
  // Sentry is already initialized via @sentry/astro integration in astro.config.mjs
  // This function ensures additional client-side configuration
  if (typeof window === 'undefined') return;

  // The @sentry/astro integration automatically sets up:
  // - browserTracingIntegration (for transaction tracing)
  // - replayIntegration (for session replay)
  // - error boundary integration
  // We just need to ensure it's properly configured for the browser

  // Set user context if available
  if (window.__AUTH_USER__) {
    Sentry.setUser({
      id: window.__AUTH_USER__.id,
      email: window.__AUTH_USER__.email,
    });
  }

  // Add global tag for environment
  Sentry.setTag('environment', import.meta.env.MODE);
  Sentry.setTag('project', 'quini6-frontend');
}

/**
 * Initialize Web Vitals reporting to Sentry.
 * Reports CLS, FID, FCP, LCP, TTFB to Sentry as measurements.
 * Only runs in production.
 */
export function initWebVitals(): void {
  if (typeof window === 'undefined') return;
  if (!import.meta.env.PROD) return;

  // Dynamically import web-vitals to avoid bundling in non-production
  import('web-vitals')
    .then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
      const sendToSentry = (metric: {
        name: string;
        value: number;
        rating: 'good' | 'needs-improvement' | 'poor';
        delta: number;
        id: string;
      }) => {
        // Send to Sentry as a measurement
        Sentry.setMeasurement(metric.name, metric.value, 'millisecond');

        // Also add as breadcrumb for context
        Sentry.addBreadcrumb({
          category: 'web-vitals',
          message: `${metric.name}: ${metric.value} (${metric.rating})`,
          level: 'info',
          data: {
            value: metric.value,
            rating: metric.rating,
            delta: metric.delta,
            id: metric.id,
          },
        });
      };

      // Register all Web Vitals callbacks
      onCLS(sendToSentry);
      onFID(sendToSentry);
      onFCP(sendToSentry);
      onLCP(sendToSentry);
      onTTFB(sendToSentry);
    })
    .catch((error) => {
      // web-vitals not available or failed to load
      console.warn('[Sentry] Failed to load web-vitals:', error);
    });
}
