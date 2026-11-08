import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import sentry from '@sentry/astro';
import node from '@astrojs/node';
import { EnumChangefreq } from 'sitemap';
import { visualizer } from 'rollup-plugin-visualizer';
import type { PluginOption } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

interface DrawDatesData {
  dates: Record<number, string>;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const drawDatesPath = path.resolve(__dirname, 'src/lib/draw-dates.json');
let drawDates: Record<number, string> = {};
if (fs.existsSync(drawDatesPath)) {
  try {
    const data = JSON.parse(fs.readFileSync(drawDatesPath, 'utf-8')) as DrawDatesData;
    drawDates = data.dates || {};
  } catch {
    drawDates = {};
  }
}

// https://astro.build/config
export default defineConfig({
  output: 'server',
  site: 'https://quini6.com',
  adapter: node({ mode: 'standalone' }),
  devToolbar: { enabled: false },
  integrations: [
    tailwind(),
    react(),
    sentry({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      // Only enable Sentry in production
      enabled: import.meta.env.PROD,
    }),
    sitemap({
      // Custom filter to include all public pages and draw detail pages
      filter: (_page) => {
        // Include all pages by default
        return true;
      },
      // Custom serialize to set proper changefreq and lastmod
      serialize: (item) => {
        // Normalize URL for matching (remove trailing slash)
        const normalizedUrl = item.url.replace(/\/$/, '');

        // Home page
        if (normalizedUrl === 'https://quini6.com') {
          return {
            ...item,
            changefreq: EnumChangefreq.WEEKLY,
            priority: 1.0,
            lastmod: new Date().toISOString(),
          };
        }

        // Search page
        if (normalizedUrl === 'https://quini6.com/buscar') {
          return {
            ...item,
            changefreq: EnumChangefreq.WEEKLY,
            priority: 0.8,
            lastmod: new Date().toISOString(),
          };
        }

        // Draws listing page
        if (normalizedUrl === 'https://quini6.com/sorteos') {
          return {
            ...item,
            changefreq: EnumChangefreq.WEEKLY,
            priority: 0.9,
            lastmod: new Date().toISOString(),
          };
        }

        // Draw detail pages - match /sorteos/[officialNumber]
        const drawDetailMatch = normalizedUrl.match(/^https:\/\/quini6\.com\/sorteos\/(\d+)$/);
        if (drawDetailMatch) {
          const officialNumber = Number(drawDetailMatch[1]);
          const drawDate = drawDates[officialNumber];
          return {
            ...item,
            changefreq: EnumChangefreq.YEARLY,
            priority: 0.6,
            // Use actual draw date from build-time generated data
            lastmod: drawDate ?? new Date().toISOString(),
          };
        }

        // Default for any other pages
        return {
          ...item,
          changefreq: EnumChangefreq.WEEKLY,
          priority: 0.5,
          lastmod: new Date().toISOString(),
        };
      },
    }),
  ],
  vite: {
    envDir: process.cwd(),
    envPrefix: 'VITE_',
    optimizeDeps: {
      exclude: ['msw'],
    },
    build: {
      rollupOptions: {
        external: ['react', 'react-dom', 'react/jsx-runtime', 'react-dom/client'],
      },
    },
    resolve: {
      alias: {
        '@': '/src',
        '@components': '/src/components',
        '@lib': '/src/lib',
        '@styles': '/src/styles',
        '@layouts': '/src/layouts',
        '@pages': '/src/pages',
        '@mock': '/src/mock',
      },
    },
    worker: {
      format: 'es',
    },
    plugins:
      import.meta.env.VITE_BUNDLE_ANALYZE === 'true'
        ? [
            visualizer({
              filename: 'stats.html',
              open: false,
              gzipSize: true,
              brotliSize: true,
              // Emit through rollup to ensure it goes to the output directory
              emitFile: true,
            }) as PluginOption,
            visualizer({
              filename: 'bundle-stats.json',
              template: 'raw-data',
              open: false,
              emitFile: true,
            }) as PluginOption,
          ]
        : [],
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
          cookieDomainRewrite: { localhost: '' },
          configure: (proxy, _options) => {
            proxy.on('proxyRes', (proxyRes, req, res) => {
              // Forward Set-Cookie headers from the target server
              const cookies = proxyRes.headers['set-cookie'];
              if (cookies) {
                // proxyRes.headers is an object where set-cookie might be an array
                const cookieArray = Array.isArray(cookies) ? cookies : [cookies];
                res.setHeader('set-cookie', cookieArray);
              }
            });
          },
        },
      },
    },
  },
});
