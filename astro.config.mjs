// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: 'https://quini6.com',
  integrations: [
    tailwind(),
    react(),
    sitemap({
      // Custom filter to include all public pages and draw detail pages
      filter: (page) => {
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
            changefreq: 'weekly',
            priority: 1.0,
            lastmod: new Date().toISOString(),
          };
        }
        
        // Search page
        if (normalizedUrl === 'https://quini6.com/buscar') {
          return {
            ...item,
            changefreq: 'weekly',
            priority: 0.8,
            lastmod: new Date().toISOString(),
          };
        }
        
        // Draws listing page
        if (normalizedUrl === 'https://quini6.com/sorteos') {
          return {
            ...item,
            changefreq: 'weekly',
            priority: 0.9,
            lastmod: new Date().toISOString(),
          };
        }
        
        // Draw detail pages - match /sorteos/[officialNumber]
        const drawDetailMatch = normalizedUrl.match(/^https:\/\/quini6\.com\/sorteos\/(\d+)$/);
        if (drawDetailMatch) {
          // For draw detail pages, we can't easily get the draw date at build time
          // without fetching from API. We'll use a reasonable default.
          // In production, this would be enhanced with actual draw dates.
          return {
            ...item,
            changefreq: 'yearly',
            priority: 0.6,
            // Note: lastmod would ideally be the draw date
            // For now using build time as fallback
            lastmod: new Date().toISOString(),
          };
        }
        
        // Default for any other pages
        return {
          ...item,
          changefreq: 'weekly',
          priority: 0.5,
          lastmod: new Date(),
        };
      },
    }),
  ],
  vite: {
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
  },
});
