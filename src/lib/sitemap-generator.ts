// Shared sitemap generation logic used by both astro.config.mjs and src/pages/sitemap.xml.ts
import { EnumChangefreq } from 'sitemap';
import { SITE_URL as DEFAULT_SITE_URL } from '../config/site.js';
import { drawDates, getAllDrawNumbers } from './draw-dates.js';

interface SitemapPage {
  url: string;
  changefreq?: EnumChangefreq;
  priority?: number;
  lastmod?: string;
}

/**
 * Get draw dates from build-time generated data.
 * Falls back to calculated date if not found in generated data.
 */
export function getDrawLastmod(officialNumber: number): string {
  const date = drawDates[officialNumber];
  if (date) {
    return date;
  }
  // Fallback: calculate based on latest known draw (3245 = 2024-06-01T20:00:00Z)
  const LATEST_DRAW_OFFICIAL_NUMBER = 3245;
  const LATEST_DRAW_DATE_MS = Date.UTC(2024, 5, 1, 20, 0, 0);
  const DRAW_CADENCE_MS = 7 * 24 * 60 * 60 * 1000;
  const offset = LATEST_DRAW_OFFICIAL_NUMBER - officialNumber;
  return new Date(LATEST_DRAW_DATE_MS - offset * DRAW_CADENCE_MS).toISOString();
}

/**
 * @deprecated Use getDrawLastmod instead. Kept for backward compatibility with tests.
 */
export function drawLastmod(officialNumber: number): string {
  return getDrawLastmod(officialNumber);
}

/**
 * Filter function to exclude admin and test-fixtures routes
 */
export function sitemapFilter(page: string): boolean {
  if (page.includes('/admin') || page.includes('/test-fixtures')) {
    return false;
  }
  return true;
}

/**
 * Serialize function to set proper changefreq, priority, and lastmod
 */
export function sitemapSerialize(item: SitemapPage): SitemapPage {
  const normalizedUrl = item.url.replace(/\/$/, '');
  const baseUrl = DEFAULT_SITE_URL;

  // Home page
  if (normalizedUrl === baseUrl) {
    return {
      ...item,
      changefreq: EnumChangefreq.WEEKLY,
      priority: 1.0,
      lastmod: new Date().toISOString(),
    };
  }

  // Search page
  if (normalizedUrl === `${baseUrl}/buscar`) {
    return {
      ...item,
      changefreq: EnumChangefreq.WEEKLY,
      priority: 0.8,
      lastmod: new Date().toISOString(),
    };
  }

  // Draws listing page
  if (normalizedUrl === `${baseUrl}/sorteos`) {
    return {
      ...item,
      changefreq: EnumChangefreq.WEEKLY,
      priority: 0.9,
      lastmod: new Date().toISOString(),
    };
  }

  // Draw detail pages - match /sorteos/[officialNumber]
  const drawDetailMatch = normalizedUrl.match(
    new RegExp(`^${baseUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/sorteos/(\\d+)$`)
  );
  if (drawDetailMatch) {
    return {
      ...item,
      changefreq: EnumChangefreq.YEARLY,
      priority: 0.6,
      // lastmod reflects the draw date, not the build time
      lastmod: getDrawLastmod(Number(drawDetailMatch[1])),
    };
  }

  // Default for any other pages
  return {
    ...item,
    changefreq: EnumChangefreq.WEEKLY,
    priority: 0.5,
    lastmod: new Date().toISOString(),
  };
}

/**
 * Generate complete sitemap URLs for the sitemap.xml endpoint
 * This replicates what the @astrojs/sitemap integration does
 */
export function generateSitemapUrls(siteUrl: string = DEFAULT_SITE_URL): SitemapPage[] {
  const urls: SitemapPage[] = [];
  const now = new Date().toISOString();

  // Public pages
  const publicPages: { url: string; changefreq: EnumChangefreq; priority: number }[] = [
    { url: '/', changefreq: EnumChangefreq.WEEKLY, priority: 1.0 },
    { url: '/buscar', changefreq: EnumChangefreq.WEEKLY, priority: 0.8 },
    { url: '/sorteos', changefreq: EnumChangefreq.WEEKLY, priority: 0.9 },
  ];

  for (const page of publicPages) {
    urls.push({
      url: `${siteUrl}${page.url}`,
      changefreq: page.changefreq,
      priority: page.priority,
      lastmod: now,
    });
  }

  // Draw detail pages - use build-time generated draw numbers
  for (const drawNumber of getAllDrawNumbers()) {
    urls.push({
      url: `${siteUrl}/sorteos/${drawNumber}`,
      changefreq: EnumChangefreq.YEARLY,
      priority: 0.6,
      lastmod: getDrawLastmod(drawNumber),
    });
  }

  return urls;
}

/**
 * Generate sitemap XML string
 */
export function generateSitemapXml(siteUrl: string = DEFAULT_SITE_URL) {
  const urls = generateSitemapUrls(siteUrl);

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  for (const url of urls) {
    xml += '  <url>\n';
    xml += `    <loc>${url.url}</loc>\n`;
    xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
    xml += `    <priority>${url.priority}</priority>\n`;
    xml += `    <lastmod>${url.lastmod}</lastmod>\n`;
    xml += '  </url>\n';
  }

  xml += '</urlset>';

  return xml;
}

export { DEFAULT_SITE_URL, DEFAULT_SITE_URL as SITE_URL };
