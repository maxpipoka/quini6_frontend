import { generateSitemapXml } from '../lib/sitemap-generator.js';

// Build-time /sitemap.xml endpoint. @astrojs/sitemap only emits
// sitemap-index.xml + sitemap-0.xml, so this endpoint serves the canonical
// sitemap URL that robots.txt references.
// URLs are built from the same SITE_URL constant used everywhere else.
export const prerender = true;

export function GET(): Response {
  const sitemapXml = generateSitemapXml();

  return new Response(sitemapXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
