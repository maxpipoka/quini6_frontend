// Shared sitemap generation logic used by both astro.config.mjs and src/pages/sitemap.xml.ts
import { EnumChangefreq } from 'sitemap';
import { SITE_URL as DEFAULT_SITE_URL } from '../config/site.js';

// Known draw detail URLs (would be fetched from API in production)
const DRAW_DETAIL_URLS = [
  '3216',
  '3217',
  '3218',
  '3219',
  '3220',
  '3221',
  '3222',
  '3223',
  '3224',
  '3225',
  '3226',
  '3227',
  '3228',
  '3229',
  '3230',
  '3231',
  '3232',
  '3233',
  '3234',
  '3235',
  '3236',
  '3237',
  '3238',
  '3239',
  '3240',
  '3241',
  '3242',
  '3243',
  '3244',
  '3245',
];

interface SitemapPage {
  url: string;
  changefreq?: EnumChangefreq;
  priority?: number;
  lastmod?: string;
}

/**
 * Build-time draw schedule used for `lastmod` on detail pages.
 * Mirrors the mock schedule in src/pages/sorteos/[officialNumber].astro
 * (draw 3245 = 2024-06-01T20:00:00Z, weekly cadence, one step per official number).
 * TODO: replace with the real draw date fetched from the API at build time.
 */
const LATEST_DRAW_OFFICIAL_NUMBER = 3245;
const LATEST_DRAW_DATE_MS = Date.UTC(2024, 5, 1, 20, 0, 0);
const DRAW_CADENCE_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * `lastmod` for a draw detail page: the draw date itself, not the build time.
 */
export function drawLastmod(officialNumber: number): string {
  const offset = LATEST_DRAW_OFFICIAL_NUMBER - officialNumber;
  return new Date(LATEST_DRAW_DATE_MS - offset * DRAW_CADENCE_MS).toISOString();
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
      lastmod: drawLastmod(Number(drawDetailMatch[1])),
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

  // Draw detail pages
  for (const drawNumber of DRAW_DETAIL_URLS) {
    urls.push({
      url: `${siteUrl}/sorteos/${drawNumber}`,
      changefreq: EnumChangefreq.YEARLY,
      priority: 0.6,
      lastmod: drawLastmod(Number(drawNumber)),
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
