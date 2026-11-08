import type { APIContext } from 'astro';
import { SITE_URL as CONFIG_SITE_URL } from '../config/site';

// Build-time robots.txt: the sitemap URL is injected from the same SITE_URL
// constant that drives canonical, Open Graph, JSON-LD, and the sitemap itself.
export const prerender = true;

export function GET({ site }: APIContext): Response {
  const siteUrl = (site?.href ?? CONFIG_SITE_URL).replace(/\/$/, '');

  const robotsTxt = `# Quini 6 Frontend - Robots.txt
User-agent: *
Allow: /

# Sitemap location
Sitemap: ${siteUrl}/sitemap.xml

# Disallow admin paths (except login and health for SEO crawl)
Disallow: /admin/
Allow: /admin/login
Allow: /admin/health
Disallow: /api/
Disallow: /_astro/
Disallow: /_image/

# Crawl-delay for polite crawling
Crawl-delay: 10`;

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
